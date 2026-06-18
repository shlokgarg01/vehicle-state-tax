import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormSwitch, CRow } from '@coreui/react'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import { showToast } from '../../utils/toast'
import {
  getConstantByKey,
  updateConstantByKey,
  resetConstantUpdate,
} from '../../actions/constantsAction'

const BOOL_TRUE = ['true', '1', 'yes', 'y', 'on']

const toBool = (val) => {
  if (typeof val === 'boolean') return val
  if (val === null || val === undefined) return false
  return BOOL_TRUE.includes(String(val).trim().toLowerCase())
}

const AdminSettings = () => {
  const dispatch = useDispatch()
  const { values, updating, updated, errors } = useSelector((state) => state.constants || {})

  const welcomeKey = 'SEND_WELCOME_WHATSAPP'
  const taxKey = 'SEND_TAX_WHATSAPP'
  const refundPasswordKey = 'REFUND_PASSWORD'
  const initialWelcome = useMemo(() => toBool(values?.[welcomeKey]), [values?.[welcomeKey]])
  const initialTax = useMemo(() => toBool(values?.[taxKey]), [values?.[taxKey]])
  const initialRefundPassword = values?.[refundPasswordKey] || ''

  const [welcomeToggle, setWelcomeToggle] = useState(false)
  const [taxToggle, setTaxToggle] = useState(false)
  const [refundPassword, setRefundPassword] = useState('')

  useEffect(() => {
    dispatch(getConstantByKey(welcomeKey))
    dispatch(getConstantByKey(taxKey))
    dispatch(getConstantByKey(refundPasswordKey))
  }, [dispatch])

  useEffect(() => {
    setWelcomeToggle(initialWelcome)
  }, [initialWelcome])

  useEffect(() => {
    setTaxToggle(initialTax)
  }, [initialTax])

  useEffect(() => {
    setRefundPassword(initialRefundPassword)
  }, [initialRefundPassword])

  useEffect(() => {
    if (updated?.[welcomeKey]) {
      showToast('Welcome WhatsApp updated')
      dispatch(resetConstantUpdate(welcomeKey))
    }
    if (updated?.[taxKey]) {
      showToast('Tax WhatsApp updated')
      dispatch(resetConstantUpdate(taxKey))
    }
    if (updated?.[refundPasswordKey]) {
      showToast('Refund password updated')
      dispatch(resetConstantUpdate(refundPasswordKey))
    }
  }, [updated, dispatch])

  useEffect(() => {
    if (errors?.[welcomeKey]) {
      showToast(errors[welcomeKey], 'error')
      dispatch(resetConstantUpdate(welcomeKey))
    }
    if (errors?.[taxKey]) {
      showToast(errors[taxKey], 'error')
      dispatch(resetConstantUpdate(taxKey))
    }
    if (errors?.[refundPasswordKey]) {
      showToast(errors[refundPasswordKey], 'error')
      dispatch(resetConstantUpdate(refundPasswordKey))
    }
  }, [errors, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    const changes = []

    if (welcomeToggle !== initialWelcome) {
      changes.push({ key: welcomeKey, value: welcomeToggle })
    }
    if (taxToggle !== initialTax) {
      changes.push({ key: taxKey, value: taxToggle })
    }
    if (refundPassword !== initialRefundPassword) {
      if (!refundPassword.trim()) {
        showToast('Refund password cannot be empty', 'error')
        return
      }
      changes.push({ key: refundPasswordKey, value: refundPassword.trim() })
    }

    if (!changes.length) {
      showToast('No changes to update')
      return
    }

    changes.forEach(({ key, value }) =>
      dispatch(updateConstantByKey(key, String(value)))
    )
  }

  const isSubmitting =
    updating?.[welcomeKey] || updating?.[taxKey] || updating?.[refundPasswordKey]

  return (
    <div className="container-fluid p-4">
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">Admin Settings</h4>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1">Send Welcome WhatsApp</h6>
                  <small className="text-muted">Toggle to send welcome message on signup</small>
                </div>
                <CFormSwitch
                  checked={welcomeToggle}
                  onChange={(e) => setWelcomeToggle(e.target.checked)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6} className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1">Send Tax WhatsApp</h6>
                  <small className="text-muted">Toggle to send tax PDF via WhatsApp</small>
                </div>
                <CFormSwitch
                  checked={taxToggle}
                  onChange={(e) => setTaxToggle(e.target.checked)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6}>
                <TextInput
                  label="Refund Password"
                  type="password"
                  placeholder="Enter refund password"
                  value={refundPassword}
                  onChange={(e) => setRefundPassword(e.target.value)}
                  id="refundPassword"
                />
                <small className="text-muted">
                  Required to refund cancelled orders to wallet
                </small>
              </CCol>
            </CRow>

            <Button
              btnSmall
              marginBottom
              type="submit"
              title={isSubmitting ? 'Saving...' : 'Save Changes'}
              color="success"
              disabled={isSubmitting}
            />
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AdminSettings

