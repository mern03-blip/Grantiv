import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getOrgStage = (establishedDate) => {
    if (!establishedDate) return 'Not specified';
    try {
        const yearEstablished = new Date(establishedDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (currentYear - yearEstablished <= 3) {
            return 'Startup / Early Stage (established in the last 3 years)';
        }
        return 'Established (established more than 3 years ago)';
    } catch {
        return 'Not specified';
    }
};

export const matchGrants = async (query, grants, businessProfile) => {
    try {
        const profileContext = businessProfile
            ? `\n\nUSER'S BUSINESS PROFILE (use this for context):\n- Organization Name: ${businessProfile.organizationName}\n- Organization Type: ${businessProfile.organizationType}\n- Stage: ${getOrgStage(businessProfile.establishedDate)}\n- Location: ${businessProfile.city}, ${businessProfile.state}\n- Industry: ${businessProfile.industry}\n- Description: ${businessProfile.description}\n- ABN: ${businessProfile.abn || 'Not provided'}\n- Target Audience: ${businessProfile.targetAudience || 'Not provided'}\n- Focus Areas: ${businessProfile.projectFocusAreas || 'Not provided'}\n- Previous Funding: ${businessProfile.fundingHistory || 'None specified'}\n- Current Project Goals: ${businessProfile.currentProjectGoals || 'Not specified'}`
            : '';

        const prompt = `
            You are an expert grant matching algorithm. Based on the following user's direct query AND their detailed business profile, find the most relevant Australian grants and provide a match percentage.

            CRITICAL INSTRUCTIONS:
            1.  **Prioritize the user's direct query:** The user's description of their project is the most important factor.
            2.  **Use the full profile for nuance:** The business profile provides crucial context. Pay close attention to:
                *   **Stage:** A 'Startup' might be better suited for seed funding, while an 'Established' organization can apply for larger, growth-focused grants.
                *   **Funding History:** If they have a history of successful grants, they may be eligible for more competitive funding. If they have no history, prioritize foundational or entry-level grants.
                *   **Project Goals:** Align the grant's objectives directly with the user's stated project goals.
                *   **Location & Industry:** These are hard constraints. A grant for "regional Victoria" should not be matched with a business in "Sydney, NSW".
            3.  **Synthesize all information:** The final match percentage should be a holistic assessment of how well the grant aligns with *both* the user's query and their entire profile.

            User's direct query: "${query}"
            ${profileContext}

            Here is a list of available grants in JSON format:
            ${JSON.stringify(grants.map(g => ({ id: g.id, title: g.title, description: g.description, category: g.category, eligibility: g.eligibility })))}

            Return a JSON array of the top 3 most relevant grants. For each grant, include its 'grantId' and a 'matchPercentage' (an integer from 0 to 100) that represents how strongly it matches.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            grantId: { type: Type.STRING },
                            matchPercentage: { type: Type.INTEGER }
                        },
                        required: ["grantId", "matchPercentage"]
                    }
                },
            },
        });

        const responseText = response.text.trim();
        const result = JSON.parse(responseText);

        if (Array.isArray(result)) {
            return result;
        }

        return [];
    } catch (error) {
        console.error("Error matching grants with Gemini:", error);
        return [];
    }
};

export const getDashboardSuggestions = async (grants) => {
    const CACHE_KEY = 'grantiv_dashboard_suggestions';
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, suggestions } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                console.log("Returning cached dashboard suggestions.");
                return suggestions;
            }
        }
    } catch (error) {
        console.error("Error reading from cache:", error);
    }

    try {
        const prompt = `
            Based on the following list of Australian grants, identify the top 3 most suitable for a general small business or not-for-profit.
            Prioritize grants for innovation, community impact, or general business growth.

            Grant List:
            ${JSON.stringify(grants.map(g => ({ id: g.id, title: g.title, description: g.description, category: g.category })))}

            Return a JSON object with a single key 'recommendations'. This key should hold an array of three objects. Each object must contain 'grantId' (the grant's ID as a string) and 'matchPercentage' (an integer between 85 and 98, representing a strong recommendation).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    grantId: { type: Type.STRING },
                                    matchPercentage: { type: Type.INTEGER }
                                },
                                required: ["grantId", "matchPercentage"]
                            }
                        }
                    },
                    required: ["recommendations"]
                },
            },
        });

        const result = JSON.parse(response.text.trim());
        const recommendations = result?.recommendations || [];

        if (recommendations.length > 0) {
            try {
                const cachePayload = {
                    timestamp: Date.now(),
                    suggestions: recommendations,
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
            } catch (error) {
                console.error("Error writing to cache:", error);
            }
        }

        return recommendations;
    } catch (error) {
        console.error("Error getting dashboard suggestions:", error);
        // Fallback with random high percentages
        return grants.slice(0, 3).map(g => ({ grantId: g.id, matchPercentage: Math.floor(Math.random() * (98 - 85 + 1)) + 85 }));
    }
};

export const getDashboardSummary = async (
    suggestions,
    myGrants,
    tasks,
) => {
    try {
        const potentialFunding = suggestions
            .filter(grant => grant.matchPercentage >= 85)
            .reduce((total, grant) => total + grant.amount, 0);

        const prompt = `
            You are "Grantiv AI", an encouraging and insightful AI assistant for grant seekers.
            Based on the following data, generate a concise and motivating "AI Summary" for the user's dashboard.
            The summary should be friendly, scannable, and provide a clear, positive outlook on their funding situation.

            DATA:
            - Total Potential Funding from top-matched grants: $${potentialFunding.toLocaleString()}
            - Number of high-match (>85%) grant recommendations: ${suggestions.length}
            - Number of in-progress grant applications: ${myGrants.length}
            - Details of in-progress grants: ${JSON.stringify(myGrants.map(g => ({ title: g.title, status: g.status, deadline: g.deadline })))}
            - Number of outstanding (incomplete) tasks: ${tasks.filter(t => !t.completed).length}

            OUTPUT STRUCTURE:
            Your response must be a single string. Use markdown double asterisks for bolding (e.g., **Outlook**).
            Use newlines to create paragraphs.
            
            **Overall Outlook:**
            (A positive, summary statement about their funding potential. Mention the total potential funding amount.)

            **Key Opportunities:**
            (Briefly mention the number of high-match grants available.)

            **Current Progress:**
            (A quick update on their in-progress applications. If there's a deadline approaching soon, highlight it.)

            **Next Steps:**
            (Mention the number of outstanding tasks to focus on and encourage action.)
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating dashboard summary from Gemini:", error);
        return "I'm sorry, I was unable to generate a summary at this time. Please check your connection and try again.";
    }
};

const fileToGenerativePart = async (file) => {
    const base64EncodedData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};


export const getAssistantResponse = async (grant, history, newUserMessage, attachments, businessProfile) => {
    try {
        const profileContext = businessProfile
            ? `\n\nCONTEXT ON THE USER'S ORGANIZATION:\nThis is the profile of the organization you are assisting. Use this information to make your advice highly specific and relevant.\n- Organization Name: ${businessProfile.organizationName}\n- Organization Type: ${businessProfile.organizationType}\n- Location: ${businessProfile.city}, ${businessProfile.state}\n- Industry: ${businessProfile.industry}\n- ABN: ${businessProfile.abn || 'Not provided'}\n- Established: ${businessProfile.establishedDate || 'Not provided'}\n- Target Audience: ${businessProfile.targetAudience || 'Not provided'}\n- Key Focus Areas: ${businessProfile.projectFocusAreas || 'Not provided'}\n- Description: ${businessProfile.description}`
            : '';

        const grantContext = grant
            ? `Your primary goal is to help the user build a standout application for the "${grant.title}" grant.`
            : `Your primary goal is to help the user with general grant-writing questions, finding grants, or improving their application materials.`
            ;

        const historyContext = history.length > 0
            ? `\n\nPREVIOUS CONVERSATION HISTORY (for context):\n${history.map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')}`
            : '';

        const baseInstruction = `You are 'Grantiv AI', an innovative and friendly AI co-pilot for grant writing. Your personality is enthusiastic, creative, and collaborative. You're an expert in Australian grants. Use "we" and "us" to foster a team spirit. Keep your tone encouraging and your suggestions actionable and insightful. If the user provides files (images or PDFs), analyze their content and use it as context to provide relevant feedback or ideas. Use the conversation history to maintain context.`;

        const systemInstruction = `${baseInstruction}\n\n${grantContext}${profileContext}${historyContext}`;

        const textPart = { text: newUserMessage };

        const fileParts = await Promise.all(
            attachments
                .filter(file => file.type.startsWith("image/") || file.type === 'application/pdf')
                .map(fileToGenerativePart)
        );

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, ...fileParts] },
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error getting assistant response from Gemini:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
};

export const getGrantQuickReview = async (grant) => {
    const CACHE_KEY = `grantiv_review_${grant.id}`;
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, review } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                console.log(`Returning cached review for grant ${grant.id}.`);
                return review;
            }
        }
    } catch (error) {
        console.error("Error reading review from cache:", error);
    }

    try {
        const systemInstruction = `You are an expert grant consultant. Provide a concise, helpful review of the following grant opportunity for an Australian small business or not-for-profit. Your review should be structured with clear headings.`
            ;

        const prompt = `
            Please provide a "Quick AI Review" for the following grant:
            - Title: ${grant.title}
            - Funder: ${grant.funder}
            - Description: ${grant.description}
            - Eligibility: ${grant.eligibility}

            Your review should include these sections, each on a new line followed by its content:
            
            GRANT SUMMARY:
            (A brief, one-sentence summary of what this grant is for.)

            KEY FOCUS AREAS:
            (2-3 bullet points, each starting with ' - ', on what the funder seems to care about most.)

            POTENTIAL CHALLENGES:
            (1-2 bullet points, each starting with ' - ', on aspects of the application that might be tricky or require significant effort.)

            TOP TIP FOR SUCCESS:
            (One scannable, actionable tip to make an application stand out.)

            Use line breaks to separate sections and bullet points. Do not use markdown.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const reviewText = response.text;

        if (reviewText) {
            try {
                const cachePayload = {
                    timestamp: Date.now(),
                    review: reviewText,
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
            } catch (cacheError) {
                console.error("Error writing review to cache:", cacheError);
            }
        }

        return reviewText;
    } catch (error) {
        console.error("Error getting quick review from Gemini:", error);
        return "I'm sorry, I was unable to generate a review at this time. Please check your connection and try again.";
    }
};

export const generateApplicationChecklist = async (grant, businessProfile) => {
    const CACHE_KEY = `grantiv_checklist_${grant.id}`;
    const CACHE_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, checklist } = JSON.parse(cachedData);
            // This simple cache doesn't check if businessProfile has changed.
            // For this app, it's an acceptable tradeoff to reduce API calls.
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                console.log(`Returning cached checklist for grant ${grant.id}.`);
                return checklist;
            }
        }
    } catch (error) {
        console.error("Error reading checklist from cache:", error);
    }

    try {
        const profileContext = `
            The applicant is a '${businessProfile.organizationType}' named '${businessProfile.organizationName}'.
            Industry: ${businessProfile.industry}.
            Description: ${businessProfile.description}.
        `;

        const grantContext = `
            They are applying for the '${grant.title}' grant.
            Funder: ${grant.funder}.
            Description: ${grant.description}.
            Eligibility: ${grant.eligibility}.
        `;

        const prompt = `
            Based on the following applicant profile and grant details, generate a realistic and actionable checklist of tasks required to complete the grant application.
            The checklist should be tailored to the applicant's organization type. For example, do not include "provide proof of non-profit status" if they are a 'Small Business'. Conversely, if they are a 'Not-for-Profit', that task is essential.
            The tasks should be clear, concise, and logically ordered.

            Applicant Profile:
            ${profileContext}

            Grant Details:
            ${grantContext}

            Return a JSON array of task objects. Each object should have three properties: 'id' (a unique string like 'task_1'), 'text' (the task description as a string), and 'completed' (a boolean, always set to false initially).
            Generate between 5 and 8 relevant tasks.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            completed: { type: Type.BOOLEAN }
                        },
                        required: ["id", "text", "completed"]
                    }
                },
            },
        });

        const result = JSON.parse(response.text.trim());
        if (Array.isArray(result)) {
            const tasks = result.filter(item => item.id && typeof item.text === 'string' && typeof item.completed === 'boolean');
            if (tasks.length > 0) {
                try {
                    const cachePayload = {
                        timestamp: Date.now(),
                        checklist: tasks,
                    };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
                } catch (cacheError) {
                    console.error("Error writing checklist to cache:", cacheError);
                }
            }
            return tasks;
        }

        return []; // Return empty array if parsing fails
    } catch (error) {
        console.error("Error generating checklist with Gemini:", error);
        return []; // Return empty array on error
    }
};

export const generateSuggestedPrompts = async (grant) => {
    const CACHE_KEY = `grantiv_prompts_${grant.id}`;
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, prompts } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                console.log(`Returning cached prompts for grant ${grant.id}.`);
                return prompts;
            }
        }
    } catch (error) {
        console.error("Error reading prompts from cache:", error);
    }

    try {
        const prompt = `
            You are an expert grant writing assistant. Based on the details of the following Australian grant, generate exactly 4 concise, actionable, and insightful prompt starters for a user who is about to begin their application. These prompts should help them think critically about their application and kickstart the writing process.

            Grant Title: ${grant.title}
            Grant Funder: ${grant.funder}
            Grant Description: ${grant.description}
            Grant Eligibility: ${grant.eligibility}

            Return a JSON array of exactly 4 unique strings.
            Example format: ["How can we clearly align our project with the funder's goals?", "What are the key metrics to demonstrate our project's impact?", "Draft a compelling one-sentence summary of our project.", "Identify potential risks and our mitigation strategies."]
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                },
            },
        });

        const result = JSON.parse(response.text.trim());
        if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
            if (result.length > 0) {
                try {
                    const cachePayload = {
                        timestamp: Date.now(),
                        prompts: result,
                    };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
                } catch (cacheError) {
                    console.error("Error writing prompts to cache:", cacheError);
                }
            }
            return result;
        }

        return [];
    } catch (error) {
        console.error("Error generating suggested prompts with Gemini:", error);
        return []; // Return empty array on error
    }
};