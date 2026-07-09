import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormSwitch, CRow } from '@coreui/react'
import TextInput from '../../components/Form/TextInput'
import TextArea from '../../components/Form/TextArea'
import Button from '../../components/Form/Button'
import { showToast } from '../../utils/toast'
import {
  getConstantByKey,
  updateConstantByKey,
  resetConstantUpdate,
} from '../../actions/constantsAction'
import Constants from '../../utils/constants'

const {
  SEND_WELCOME_WHATSAPP,
  SEND_TAX_WHATSAPP,
  REFUND_PASSWORD,
  REFUND_DEDUCTION_PERCENT,
  NOTICE,
  APP_MIN_VERSION,
} = Constants.CONSTANT_KEYS

const BOOL_TRUE = ['true', '1', 'yes', 'y', 'on']

const toBool = (val) => {
  if (typeof val === 'boolean') return val
  if (val === null || val === undefined) return false
  return BOOL_TRUE.includes(String(val).trim().toLowerCase())
}

const AdminSettings = () => {
  const dispatch = useDispatch()
  const { values, updating, updated, errors } = useSelector((state) => state.constants || {})

  const initialWelcome = useMemo(() => toBool(values?.[SEND_WELCOME_WHATSAPP]), [values?.[SEND_WELCOME_WHATSAPP]])
  const initialTax = useMemo(() => toBool(values?.[SEND_TAX_WHATSAPP]), [values?.[SEND_TAX_WHATSAPP]])
  const initialRefundPassword = values?.[REFUND_PASSWORD] || ''
  const initialRefundDeductionPercent = values?.[REFUND_DEDUCTION_PERCENT] ?? '0'
  const initialNotice = values?.[NOTICE] || ''
  const initialAppMinVersion = values?.[APP_MIN_VERSION] || '0'

  const [welcomeToggle, setWelcomeToggle] = useState(false)
  const [taxToggle, setTaxToggle] = useState(false)
  const [refundPassword, setRefundPassword] = useState('')
  const [refundDeductionPercent, setRefundDeductionPercent] = useState('0')
  const [notice, setNotice] = useState('')
  const [appMinVersion, setAppMinVersion] = useState('0')

  useEffect(() => {
    dispatch(getConstantByKey(SEND_WELCOME_WHATSAPP))
    dispatch(getConstantByKey(SEND_TAX_WHATSAPP))
    dispatch(getConstantByKey(REFUND_PASSWORD))
    dispatch(getConstantByKey(REFUND_DEDUCTION_PERCENT))
    dispatch(getConstantByKey(NOTICE))
    dispatch(getConstantByKey(APP_MIN_VERSION))
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
    setRefundDeductionPercent(initialRefundDeductionPercent)
  }, [initialRefundDeductionPercent])

  useEffect(() => {
    setNotice(initialNotice)
  }, [initialNotice])

  useEffect(() => {
    setAppMinVersion(initialAppMinVersion)
  }, [initialAppMinVersion])

  useEffect(() => {
    if (updated?.[SEND_WELCOME_WHATSAPP]) {
      showToast('Welcome WhatsApp updated')
      dispatch(resetConstantUpdate(SEND_WELCOME_WHATSAPP))
    }
    if (updated?.[SEND_TAX_WHATSAPP]) {
      showToast('Tax WhatsApp updated')
      dispatch(resetConstantUpdate(SEND_TAX_WHATSAPP))
    }
    if (updated?.[REFUND_PASSWORD]) {
      showToast('Refund password updated')
      dispatch(resetConstantUpdate(REFUND_PASSWORD))
    }
    if (updated?.[REFUND_DEDUCTION_PERCENT]) {
      showToast('Withdrawal deduction percent updated')
      dispatch(resetConstantUpdate(REFUND_DEDUCTION_PERCENT))
    }
    if (updated?.[NOTICE]) {
      showToast('App notice updated')
      dispatch(resetConstantUpdate(NOTICE))
    }
    if (updated?.[APP_MIN_VERSION]) {
      showToast('Minimum app version updated')
      dispatch(resetConstantUpdate(APP_MIN_VERSION))
    }
  }, [updated, dispatch])

  useEffect(() => {
    if (errors?.[SEND_WELCOME_WHATSAPP]) {
      showToast(errors[SEND_WELCOME_WHATSAPP], 'error')
      dispatch(resetConstantUpdate(SEND_WELCOME_WHATSAPP))
    }
    if (errors?.[SEND_TAX_WHATSAPP]) {
      showToast(errors[SEND_TAX_WHATSAPP], 'error')
      dispatch(resetConstantUpdate(SEND_TAX_WHATSAPP))
    }
    if (errors?.[REFUND_PASSWORD]) {
      showToast(errors[REFUND_PASSWORD], 'error')
      dispatch(resetConstantUpdate(REFUND_PASSWORD))
    }
    if (errors?.[REFUND_DEDUCTION_PERCENT]) {
      showToast(errors[REFUND_DEDUCTION_PERCENT], 'error')
      dispatch(resetConstantUpdate(REFUND_DEDUCTION_PERCENT))
    }
    if (errors?.[NOTICE]) {
      showToast(errors[NOTICE], 'error')
      dispatch(resetConstantUpdate(NOTICE))
    }
    if (errors?.[APP_MIN_VERSION]) {
      showToast(errors[APP_MIN_VERSION], 'error')
      dispatch(resetConstantUpdate(APP_MIN_VERSION))
    }
  }, [errors, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    const changes = []

    if (welcomeToggle !== initialWelcome) {
      changes.push({ key: SEND_WELCOME_WHATSAPP, value: welcomeToggle })
    }
    if (taxToggle !== initialTax) {
      changes.push({ key: SEND_TAX_WHATSAPP, value: taxToggle })
    }
    if (refundPassword !== initialRefundPassword) {
      if (!refundPassword.trim()) {
        showToast('Refund password cannot be empty', 'error')
        return
      }
      changes.push({ key: REFUND_PASSWORD, value: refundPassword.trim() })
    }
    if (refundDeductionPercent !== initialRefundDeductionPercent) {
      const percent = Number(refundDeductionPercent)
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
        showToast('Withdrawal deduction percent must be between 0 and 100', 'error')
        return
      }
      changes.push({ key: REFUND_DEDUCTION_PERCENT, value: String(percent) })
    }
    if (notice !== initialNotice) {
      changes.push({ key: NOTICE, value: notice.trim() })
    }
    if (appMinVersion !== initialAppMinVersion) {
      if (!appMinVersion.trim()) {
        showToast('Minimum app version cannot be empty', 'error')
        return
      }
      changes.push({ key: APP_MIN_VERSION, value: appMinVersion.trim() })
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
    updating?.[SEND_WELCOME_WHATSAPP] ||
    updating?.[SEND_TAX_WHATSAPP] ||
    updating?.[REFUND_PASSWORD] ||
    updating?.[REFUND_DEDUCTION_PERCENT] ||
    updating?.[NOTICE] ||
    updating?.[APP_MIN_VERSION]

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
                </div>
                <CFormSwitch
                  checked={taxToggle}
                  onChange={(e) => setTaxToggle(e.target.checked)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={8}>
                <h6 className="mb-1">Minimum App Version</h6>
                <p className="text-muted small mb-2">
                  Push notifications are sent only to users on this version or above.
                </p>
                <div style={{ maxWidth: 220 }}>
                  <TextInput
                    id="appMinVersion"
                    placeholder="e.g. 1.2.0"
                    value={appMinVersion}
                    onChange={(e) => setAppMinVersion(e.target.value)}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={8}>
                <h6 className="mb-1">App Notice</h6>
                <p className="text-muted small mb-2">
                  Shown to users in the mobile app. Leave empty to hide.
                </p>
                <TextArea
                  id="appNotice"
                  placeholder="Enter notice text for the app"
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  rows={4}
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol
                md={8}
                className="d-flex align-items-center justify-content-between gap-3 flex-wrap"
              >
                <div>
                  <h6 className="mb-1">Refund Password</h6>
                </div>
                <div style={{ minWidth: 220, maxWidth: 280, flex: '0 0 220px' }}>
                  <TextInput
                    type="password"
                    placeholder="Enter refund password"
                    value={refundPassword}
                    onChange={(e) => setRefundPassword(e.target.value)}
                    id="refundPassword"
                  />
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol
                md={8}
                className="d-flex align-items-center justify-content-between gap-3 flex-wrap"
              >
                <div>
                  <h6 className="mb-1">Withdrawal Deduction Percent</h6>
                </div>
                <div style={{ minWidth: 220, maxWidth: 280, flex: '0 0 220px' }}>
                  <TextInput
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0"
                    value={refundDeductionPercent}
                    onChange={(e) => setRefundDeductionPercent(e.target.value)}
                    id="refundDeductionPercent"
                  />
                </div>
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

