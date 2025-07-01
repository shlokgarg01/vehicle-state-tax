import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow } from '@coreui/react'
import { getWhatsAppMessage, updateWhatsAppMessage } from '../../actions/constantsAction'
import { showToast } from '../../utils/toast'
import Button from '../../components/Form/Button'
import Loader from '../../components/Loader/Loader'

const WhatsAppMessage = () => {
  const dispatch = useDispatch()
  const { message, loading, error, isUpdated } = useSelector((state) => state.whatsAppMessage)
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    dispatch(getWhatsAppMessage())
  }, [dispatch])

  useEffect(() => {
    if (message) {
      setMessageText(message)
    }
  }, [message])

  useEffect(() => {
    if (error && !isUpdated) {
      showToast(error, 'error')
    }

    if (isUpdated) {
      showToast('Message updated successfully')
    }
  }, [error, isUpdated])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!messageText.trim()) {
      showToast('Message cannot be empty', 'error')
      return
    }

    dispatch(updateWhatsAppMessage(messageText))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="container-fluid p-4">
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">WhatsApp Message Settings</h4>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={12}>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label fw-semibold">
                    WhatsApp Message Template
                  </label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="10"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter your WhatsApp message template here..."
                    style={{ fontFamily: 'monospace', fontSize: '14px' }}
                  />
                  <div className="form-text">
                    <strong>Tips:</strong>
                    <ul className="mt-2">
                      <li>Use line breaks for better formatting</li>
                      <li>You can use emojis: 😊 🚗 📱</li>
                      <li>Keep the message concise and professional</li>
                    </ul>
                  </div>
                </div>
              </CCol>
            </CRow>

            <CRow className='mb-3'>
              <CCol md={12}>
                <div className="d-flex gap-2">
                  <Button
                    btnSmall
                    type="submit"
                    title={loading ? 'Updating...' : 'Update Message'}
                    color="success"
                    disabled={loading}
                  />
                  <Button
                    btnSmall
                    type="button"
                    title="Reset"
                    color="secondary"
                    onClick={() => setMessageText(message || '')}
                    disabled={loading}
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default WhatsAppMessage 