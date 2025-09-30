// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import { Logo } from '../../../assets/image'
// import { GrantivLogo } from '../../../components/icons/Icons'
// import { AnimatePresence, motion } from 'framer-motion'

// const AuthLayout = () => {
//     return (
//         <>
//             <div className="flex flex-col md:flex-row max-w-screen mx-auto  h-screen">
//                 {/* Left Section */}

//                 <AnimatePresence mode="wait">

//                     <motion.div className="flex-1 flex items-center justify-center h-full overflow-y-auto w-auto !font-custom"
//                         // key={animationKey}
//                         initial={{ opacity: 0, y: 15 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -15 }}
//                         transition={{ duration: 0.25 }}
//                         style={{ fontFamily: "Poppins, sans-serif" }}>

//                         <Outlet />
//                     </motion.div>
//                 </AnimatePresence>

//                 {/* Right Section */}

//                 <div className="hidden md:flex flex-1 bg-bgColor  text-center   items-center justify-center h-auto w-auto">
//                     {/* <img src={Logo} alt="Login Image" className=" object-fit h-[auto] w-[60%]" /> */}
//                     <GrantivLogo className="h-[auto] w-[90%] mx-auto" />
//                 </div>
//             </div>

//         </>

//     )
// }

// export default AuthLayout;


import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // 👈 Import useLocation
import { Logo } from '../../../assets/image';
import { GrantivLogo } from '../../../components/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';

const AuthLayout = () => {
    // 1. Get the current location object
    const location = useLocation();

    return (
        <>
            <div className="flex flex-col md:flex-row max-w-screen mx-auto h-screen">

                <AnimatePresence mode="wait">
                    <motion.div
                        className="flex-1 flex items-center justify-center h-full overflow-y-auto w-auto !font-custom"
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>

                <div className="hidden md:flex flex-1 bg-bgColor text-center items-center justify-center h-auto w-auto">
                    <GrantivLogo className="h-[auto] w-[90%] mx-auto" />
                </div>
            </div>
        </>
    );
}

export default AuthLayout;