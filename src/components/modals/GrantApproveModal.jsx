import React, { useState } from 'react'
import { Modal, Button, message } from 'antd'
import PropTypes from 'prop-types'

const GrantApproveModal = ({ open, onAccept, onReject, onCancel, grantTitle }) => {
  const [loading, setLoading] = useState({ accept: false, reject: false })

  const handleAccept = async () => {
    setLoading((s) => ({ ...s, accept: true }))
    try {
      if (onAccept) await onAccept()
      message.success('Grant accepted')
    } catch (err) {
      message.error('Failed to accept grant')
    } finally {
      setLoading((s) => ({ ...s, accept: false }))
    }
  }

  const handleReject = async () => {
    setLoading((s) => ({ ...s, reject: true }))
    try {
      if (onReject) await onReject()
      message.success('Grant rejected')
    } catch (err) {
      message.error('Failed to reject grant')
    } finally {
      setLoading((s) => ({ ...s, reject: false }))
    }
  }

  return (
    <Modal
      className="custom"
      open={open}
      onCancel={onCancel}
      footer={[
        <div className="flex gap-3 justify-center m-4" key="footer-buttons">
          <Button
            key="reject"
            danger
            onClick={handleReject}
            loading={loading.reject}
            className="bg-red-500  text-red w-full sm:w-auto"
          >
            Rejected
          </Button>
          <Button
            key="accept"
            type="primary"
            onClick={handleAccept}
            loading={loading.accept}
            className="!bg-primary text-white w-full sm:w-auto"
          >
            Accepted
          </Button>
        </div>,
      ]}
    >
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold">Confirm Action</h3>
        <p className="text-sm dark:text-white text-night/60 mt-2">Are you sure you want to change the outcome for <strong>{grantTitle}</strong>?</p>
      </div>
    </Modal>
  )
}

GrantApproveModal.propTypes = {
  open: PropTypes.bool,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onCancel: PropTypes.func,
  grantTitle: PropTypes.string,
}

GrantApproveModal.defaultProps = {
  open: false,
  grantTitle: '',
}

export default GrantApproveModal
