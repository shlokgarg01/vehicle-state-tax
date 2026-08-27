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
  PAYMENT_GATEWAY,
  REFERRAL_LEADERBOARD_ENABLED,
  REFERRAL_LEADERBOARD_START_DATE,
  REFERRAL_POSTER_URL,
  REFERRAL_DETAILS_TEXT,
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
  const initialPayVstLive = useMemo(() => {
    const gateway = String(values?.[PAYMENT_GATEWAY] || '').toLowerCase()
    if (gateway === Constants.PAYMENT_GATEWAY.PAYVST) return true
    return false
  }, [values?.[PAYMENT_GATEWAY]])

  const initialLeaderboardEnabled = useMemo(
    () => toBool(values?.[REFERRAL_LEADERBOARD_ENABLED] ?? 'true'),
    [values?.[REFERRAL_LEADERBOARD_ENABLED]]
  )
  const initialLeaderboardStart = values?.[REFERRAL_LEADERBOARD_START_DATE] || ''
  const initialReferralPosterUrl = values?.[REFERRAL_POSTER_URL] || ''
  const initialReferralDetailsText = values?.[REFERRAL_DETAILS_TEXT] || ''

  const [welcomeToggle, setWelcomeToggle] = useState(false)
  const [taxToggle, setTaxToggle] = useState(false)
  const [payVstLiveToggle, setPayVstLiveToggle] = useState(false)
  const [refundPassword, setRefundPassword] = useState('')
  const [refundDeductionPercent, setRefundDeductionPercent] = useState('0')
  const [notice, setNotice] = useState('')
  const [appMinVersion, setAppMinVersion] = useState('0')
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true)
  const [leaderboardStartDate, setLeaderboardStartDate] = useState('')
  const [referralPosterUrl, setReferralPosterUrl] = useState('')
  const [referralDetailsText, setReferralDetailsText] = useState('')

  useEffect(() => {
    dispatch(getConstantByKey(SEND_WELCOME_WHATSAPP))
    dispatch(getConstantByKey(SEND_TAX_WHATSAPP))
    dispatch(getConstantByKey(REFUND_PASSWORD))
    dispatch(getConstantByKey(REFUND_DEDUCTION_PERCENT))
    dispatch(getConstantByKey(NOTICE))
    dispatch(getConstantByKey(APP_MIN_VERSION))
    dispatch(getConstantByKey(PAYMENT_GATEWAY))
    dispatch(getConstantByKey(REFERRAL_LEADERBOARD_ENABLED))
    dispatch(getConstantByKey(REFERRAL_LEADERBOARD_START_DATE))
    dispatch(getConstantByKey(REFERRAL_POSTER_URL))
    dispatch(getConstantByKey(REFERRAL_DETAILS_TEXT))
  }, [dispatch])

  useEffect(() => {
    setReferralPosterUrl(initialReferralPosterUrl)
  }, [initialReferralPosterUrl])

  useEffect(() => {
    setReferralDetailsText(initialReferralDetailsText)
  }, [initialReferralDetailsText])

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
    setPayVstLiveToggle(initialPayVstLive)
  }, [initialPayVstLive])

  useEffect(() => {
    setLeaderboardEnabled(initialLeaderboardEnabled)
  }, [initialLeaderboardEnabled])

  useEffect(() => {
    setLeaderboardStartDate(initialLeaderboardStart)
  }, [initialLeaderboardStart])

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
    if (updated?.[PAYMENT_GATEWAY]) {
      showToast('Payment gateway updated')
      dispatch(resetConstantUpdate(PAYMENT_GATEWAY))
    }
    if (updated?.[REFERRAL_LEADERBOARD_ENABLED]) {
      showToast('Referral leaderboard visibility updated')
      dispatch(resetConstantUpdate(REFERRAL_LEADERBOARD_ENABLED))
    }
    if (updated?.[REFERRAL_LEADERBOARD_START_DATE]) {
      showToast('Referral leaderboard start date updated')
      dispatch(resetConstantUpdate(REFERRAL_LEADERBOARD_START_DATE))
    }
    if (updated?.[REFERRAL_POSTER_URL]) {
      showToast('Referral poster updated')
      dispatch(resetConstantUpdate(REFERRAL_POSTER_URL))
    }
    if (updated?.[REFERRAL_DETAILS_TEXT]) {
      showToast('Referral details updated')
      dispatch(resetConstantUpdate(REFERRAL_DETAILS_TEXT))
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
    if (errors?.[PAYMENT_GATEWAY]) {
      showToast(errors[PAYMENT_GATEWAY], 'error')
      dispatch(resetConstantUpdate(PAYMENT_GATEWAY))
    }
    if (errors?.[REFERRAL_LEADERBOARD_ENABLED]) {
      showToast(errors[REFERRAL_LEADERBOARD_ENABLED], 'error')
      dispatch(resetConstantUpdate(REFERRAL_LEADERBOARD_ENABLED))
    }
    if (errors?.[REFERRAL_LEADERBOARD_START_DATE]) {
      showToast(errors[REFERRAL_LEADERBOARD_START_DATE], 'error')
      dispatch(resetConstantUpdate(REFERRAL_LEADERBOARD_START_DATE))
    }
    if (errors?.[REFERRAL_POSTER_URL]) {
      showToast(errors[REFERRAL_POSTER_URL], 'error')
      dispatch(resetConstantUpdate(REFERRAL_POSTER_URL))
    }
    if (errors?.[REFERRAL_DETAILS_TEXT]) {
      showToast(errors[REFERRAL_DETAILS_TEXT], 'error')
      dispatch(resetConstantUpdate(REFERRAL_DETAILS_TEXT))
    }
  }, [errors, dispatch])

  const isSubmitting =
    updating?.[SEND_WELCOME_WHATSAPP] ||
    updating?.[SEND_TAX_WHATSAPP] ||
    updating?.[REFUND_PASSWORD] ||
    updating?.[REFUND_DEDUCTION_PERCENT] ||
    updating?.[NOTICE] ||
    updating?.[APP_MIN_VERSION] ||
    updating?.[PAYMENT_GATEWAY] ||
    updating?.[REFERRAL_LEADERBOARD_ENABLED] ||
    updating?.[REFERRAL_LEADERBOARD_START_DATE] ||
    updating?.[REFERRAL_POSTER_URL] ||
    updating?.[REFERRAL_DETAILS_TEXT]

  const handlePosterFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error')
      return
    }

    // Limit to ~10MB before base64 stringification
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        setReferralPosterUrl(String(reader.result))
      }
    }
    reader.onerror = () => {
      showToast('Failed to read image file', 'error')
    }
    reader.readAsDataURL(file)
  }

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
      changes.push({ key: REFUND_PASSWORD, value: refundPassword.trim() })
    }
    if (refundDeductionPercent !== initialRefundDeductionPercent) {
      const percent = parseFloat(refundDeductionPercent)
      if (isNaN(percent) || percent < 0 || percent > 100) {
        showToast('Deduction percent must be between 0 and 100', 'error')
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
    if (payVstLiveToggle !== initialPayVstLive) {
      changes.push({
        key: PAYMENT_GATEWAY,
        value: payVstLiveToggle
          ? Constants.PAYMENT_GATEWAY.PAYVST
          : Constants.PAYMENT_GATEWAY.PAY0,
      })
    }
    if (leaderboardEnabled !== initialLeaderboardEnabled) {
      changes.push({
        key: REFERRAL_LEADERBOARD_ENABLED,
        value: leaderboardEnabled,
      })
    }
    if (leaderboardStartDate !== initialLeaderboardStart) {
      changes.push({
        key: REFERRAL_LEADERBOARD_START_DATE,
        value: leaderboardStartDate,
      })
    }
    if (referralPosterUrl !== initialReferralPosterUrl) {
      changes.push({
        key: REFERRAL_POSTER_URL,
        value: referralPosterUrl.trim(),
      })
    }
    if (referralDetailsText !== initialReferralDetailsText) {
      changes.push({
        key: REFERRAL_DETAILS_TEXT,
        value: referralDetailsText.trim(),
      })
    }

    if (changes.length === 0) {
      showToast('No changes to save', 'info')
      return
    }

    changes.forEach(({ key, value }) => {
      dispatch(updateConstantByKey(key, String(value)))
    })
  }

  return (
    <div className="container-fluid p-4">
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">Admin Settings</h4>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4">
              <CCol md={8} className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1">PayVST Payment Gateway</h6>
                  <p className="text-muted small mb-0">
                    When enabled, payment links use PayVST. When disabled, Pay0 is used.
                  </p>
                </div>
                <CFormSwitch
                  checked={payVstLiveToggle}
                  onChange={(e) => setPayVstLiveToggle(e.target.checked)}
                />
              </CCol>
            </CRow>

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
                <h6 className="mb-1">Referral leaderboard</h6>
                <p className="text-muted small mb-2">
                  Counts successful referrals (closed orders) from the start date through now.
                </p>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Show leaderboard in app</span>
                  <CFormSwitch
                    checked={leaderboardEnabled}
                    onChange={(e) => setLeaderboardEnabled(e.target.checked)}
                  />
                </div>
                <div style={{ maxWidth: 280 }} className="mb-3">
                  <TextInput
                    id="referralLeaderboardStart"
                    type="date"
                    placeholder="Start date"
                    value={leaderboardStartDate}
                    onChange={(e) => setLeaderboardStartDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    Referral Poster Image (Base64 Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={handlePosterFileChange}
                  />
                  {referralPosterUrl && (
                    <div
                      className="mt-2 position-relative d-inline-block"
                      style={{ maxWidth: '100%' }}
                    >
                      <img
                        src={referralPosterUrl}
                        alt="Referral Poster Preview"
                        style={{
                          maxHeight: 140,
                          maxWidth: '100%',
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #cbd5e1',
                          display: 'block',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center"
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          lineHeight: 1,
                          fontSize: 14,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        }}
                        onClick={() => setReferralPosterUrl('')}
                        title="Remove Poster"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Referral Details & Rules</label>
                  <TextArea
                    id="referralDetailsText"
                    placeholder="Enter referral details, rewards info or instructions for the app bottom sheet..."
                    value={referralDetailsText}
                    onChange={(e) => setReferralDetailsText(e.target.value)}
                    rows={4}
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

