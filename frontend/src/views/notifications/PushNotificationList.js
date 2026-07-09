/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CForm,
  CRow,
  CBadge,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import TextInput from '../../components/Form/TextInput'
import TextArea from '../../components/Form/TextArea'
import Button from '../../components/Form/Button'
import Loader from '../../components/Loader/Loader'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'
import { showToast } from '../../utils/toast'
import { getDateTimeFromDateString } from '../../helpers/Date'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'
import {
  getPushNotifications,
  resetSendPushNotification,
  sendPushNotification,
} from '../../actions/pushNotificationAction'
import { getConstantByKey } from '../../actions/constantsAction'
import Constants from '../../utils/constants'

const { APP_MIN_VERSION } = Constants.CONSTANT_KEYS

const formatFailureReasons = (failureReasons = []) => {
  if (!failureReasons.length) return null

  return failureReasons.map(({ code, message, count }) => {
    const label = code || message || 'Unknown error'
    const detail = code && message && code !== message ? `: ${message}` : ''
    return `${label}${detail}${count > 1 ? ` (${count})` : ''}`
  })
}

const statusBadgeColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'info'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'danger'
    default:
      return 'secondary'
  }
}

export default function PushNotificationList() {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const { notifications, totalPages, perPage, loading, error } = useSelector(
    (state) => state.pushNotifications
  )
  const {
    loading: sendLoading,
    success: sendSuccess,
    error: sendError,
  } = useSelector((state) => state.sendPushNotification || {})
  const minAppVersion = useSelector((state) => state.constants?.values?.[APP_MIN_VERSION] || '0')

  const fetchNotifications = useCallback(() => {
    dispatch(
      getPushNotifications({
        page,
        perPage: Constants.ITEMS_PER_PAGE,
      })
    )
  }, [dispatch, page])

  useEffect(() => {
    dispatch(getConstantByKey(APP_MIN_VERSION))
  }, [dispatch])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (sendSuccess) {
      showToast('Push notification queued')
      setTitle('')
      setBody('')
      setPage(1)
      dispatch(resetSendPushNotification())
      fetchNotifications()
    }
    if (sendError) {
      showToast(sendError, 'error')
      dispatch(resetSendPushNotification())
    }
  }, [sendSuccess, sendError])

  useEffect(() => {
    if (error) showToast(error, 'error')
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      showToast('Title and message are required', 'error')
      return
    }
    dispatch(sendPushNotification({ title: title.trim(), body: body.trim() }))
  }

  const itemsPerPage = perPage || Constants.ITEMS_PER_PAGE

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="border-0 shadow-sm mb-3">
          <CCardBody className="p-3 p-md-4">
            <h5 className="mb-1">Send Push Notification</h5>

            <CForm onSubmit={handleSubmit}>
              <CRow className="g-3">
                <CCol md={8}>
                  <TextInput
                    id="pushTitle"
                    placeholder="Notification title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </CCol>
                <CCol md={8}>
                  <TextArea
                    id="pushBody"
                    placeholder="Notification message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                  />
                </CCol>
                <CCol className='mb-2' md={8}>
                  <Button
                    type="submit"
                    title={sendLoading ? 'Sending...' : 'Send to All Users'}
                    color="dark"
                    btnSmall
                    disabled={sendLoading}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>

        <CCard className="border-0 shadow-sm">
          <CCardBody className="p-3 p-md-4">
            <h5 className="mb-3">Push Notifications History</h5>

            {loading ? (
              <Loader />
            ) : notifications?.length ? (
              <>
                <CTable hover responsive align="middle" className="mb-0 small">
                  <CTableHead className="text-muted">
                    <CTableRow>
                      <CTableHeaderCell style={{ width: 56 }}>S.No</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Message</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Delivery</CTableHeaderCell>
                      <CTableHeaderCell>Sent By</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {notifications.map((notification, index) => {
                      const failureReasons = formatFailureReasons(notification.failureReasons)

                      return (
                      <CTableRow key={notification._id}>
                        <CTableDataCell className="text-muted">
                          {(page - 1) * itemsPerPage + index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-nowrap">
                          {getDateTimeFromDateString(notification.createdAt)}
                        </CTableDataCell>
                        <CTableDataCell className="fw-semibold">
                          {notification.title}
                        </CTableDataCell>
                        <CTableDataCell style={{ minWidth: 220 }}>
                          {notification.body}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={statusBadgeColor(notification.status)} className="fw-normal">
                            {removeUnderScoreAndCapitalize(notification.status)}
                          </CBadge>
                          {notification.errorMessage ? (
                            <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                              {notification.errorMessage}
                            </div>
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{notification.tokensQueued || 0} devices</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {notification.successCount || 0} ok · {notification.failureCount || 0} failed
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {notification.sentBy?.username || '—'}
                        </CTableDataCell>
                      </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-3">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                )}
              </>
            ) : (
              <NoData message="No notifications sent yet" />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
