import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CBadge,
  CButton,
  CForm,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCopy } from '@coreui/icons'
import axiosInstance from '../../utils/config'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Loader from '../../components/Loader/Loader'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'
import { showToast } from '../../utils/toast'
import Constants from '../../utils/constants'
import { getDateTimeFromDateString } from '../../helpers/Date'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'

const API = '/api/v1/referral/admin'
const ITEMS_PER_PAGE = Constants.ITEMS_PER_PAGE

const STATUS_FILTERS = [
  { label: 'All', value: '', countKey: 'totalReferrals' },
  { label: 'Pending', value: 'pending', countKey: 'pending' },
  { label: 'Successful', value: 'successful', countKey: 'successful' },
  { label: 'Reverted', value: 'reverted', countKey: 'reverted' },
]

const statusBadgeColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'successful':
      return 'success'
    case 'reverted':
      return 'danger'
    default:
      return 'secondary'
  }
}

const copyText = (text) => {
  if (!text) return
  if (navigator.clipboard) {
    navigator.clipboard.writeText(String(text))
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = String(text)
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
  showToast('Copied', 'success', 500)
}

const CopyBtn = ({ value }) =>
  value ? (
    <CIcon
      icon={cilCopy}
      size="sm"
      className="text-muted ms-1"
      style={{ cursor: 'pointer' }}
      onClick={() => copyText(value)}
      title="Copy"
    />
  ) : null

const labelForUser = (user, snapshotName) => {
  const name = String(snapshotName || user?.displayName || '').trim()
  if (name) return name
  if (!user) return '—'
  const phone = String(user.contactNumber ?? '')
  if (phone.length >= 4) return `${phone.slice(0, 2)}****${phone.slice(-2)}`
  return phone || '—'
}

const UserCell = ({ user, snapshotName }) => {
  const label = labelForUser(user, snapshotName)
  const phone = user?.contactNumber ? String(user.contactNumber) : ''
  const code = user?.referralCode ? String(user.referralCode) : ''

  return (
    <div>
      <div className="fw-medium">{label}</div>
      {phone && label !== phone && (
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          {phone}
          <CopyBtn value={phone} />
        </div>
      )}
      {code && (
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          Code: {code}
          <CopyBtn value={code} />
        </div>
      )}
    </div>
  )
}

export default function ReferralList() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total]
  )

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (appliedSearch.trim()) params.set('search', appliedSearch.trim())
      const qs = params.toString()
      const url = qs ? `${API}/stats?${qs}` : `${API}/stats`
      const { data } = await axiosInstance.get(url)
      if (data?.success) setStats(data.data)
    } catch (e) {
      showToast(e?.response?.data?.message || 'Failed to load referral stats', 'error')
    }
  }, [appliedSearch])

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
      })
      if (appliedSearch.trim()) params.set('search', appliedSearch.trim())
      if (statusFilter) params.set('status', statusFilter)
      const { data } = await axiosInstance.get(`${API}/list?${params}`)
      if (data?.success) {
        setReferrals(data.data.referrals || [])
        setTotal(data.data.total ?? 0)
      }
    } catch (e) {
      showToast(e?.response?.data?.message || 'Failed to load referrals', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, appliedSearch, statusFilter])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const handleSearch = (e) => {
    e.preventDefault()
    setAppliedSearch(searchInput.trim())
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setAppliedSearch('')
    setPage(1)
  }

  const hasSearch = Boolean(appliedSearch)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="border-0 shadow-sm">
          <CCardBody className="p-3 p-md-4">
            <div className="mb-3">
              <h5 className="mb-2">Referrals</h5>
              <div className="d-flex flex-wrap align-items-center gap-3 small">
                <span className="text-muted">
                  {total} record{total === 1 ? '' : 's'}
                  {statusFilter ? ` (${removeUnderScoreAndCapitalize(statusFilter)})` : ''}
                  {hasSearch ? ' matching search' : ''}
                </span>
                {stats && (
                  <span className="text-muted">
                    {hasSearch
                      ? `Total: ${stats.totalReferrals ?? 0}`
                      : `Total in system: ${stats.totalReferrals ?? 0}`}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded border bg-light p-3 mb-3">
              <div className="d-flex flex-column flex-md-row flex-md-wrap align-items-md-center justify-content-md-between gap-2 mb-3 pb-3 border-bottom">
                <span className="small text-muted fw-semibold mb-0">Status</span>
                <div className="btn-group btn-group-sm flex-wrap">
                  {STATUS_FILTERS.map(({ label, value, countKey }) => {
                    const isActive = statusFilter === value
                    const count = stats?.[countKey]
                    return (
                      <CButton
                        key={value || 'all'}
                        color={isActive ? 'dark' : 'light'}
                        className={isActive ? '' : 'text-muted border'}
                        onClick={() => {
                          setStatusFilter(value)
                          setPage(1)
                        }}
                      >
                        {label}
                        {count !== undefined && ` (${count})`}
                      </CButton>
                    )
                  })}
                </div>
              </div>

              <CForm onSubmit={handleSearch}>
                <label htmlFor="referralSearch" className="form-label small text-muted mb-1">
                  Search
                </label>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="flex-grow-1" style={{ minWidth: 200, maxWidth: 360 }}>
                    <TextInput
                      id="referralSearch"
                      placeholder="Phone, name, or referral code"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      disableBottomMargin
                    />
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Button title="Search" type="submit" color="dark" />
                    <Button
                      title="Clear"
                      type="button"
                      color="danger"
                      onClick={handleClearSearch}
                    />
                  </div>
                </div>
              </CForm>
            </div>

            {loading ? (
              <Loader />
            ) : referrals.length ? (
              <>
                <CTable hover responsive align="middle" className="mb-0 small">
                  <CTableHead className="text-muted">
                    <CTableRow>
                      <CTableHeaderCell style={{ width: 56 }}>S.No</CTableHeaderCell>
                      <CTableHeaderCell>Updated</CTableHeaderCell>
                      <CTableHeaderCell>Referrer</CTableHeaderCell>
                      <CTableHeaderCell>Referee</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {referrals.map((row, index) => (
                      <CTableRow key={row._id}>
                        <CTableDataCell className="text-muted">
                          {(page - 1) * ITEMS_PER_PAGE + index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-nowrap">
                          {getDateTimeFromDateString(row.updatedAt)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <UserCell
                            user={row.referrerUserId}
                            snapshotName={row.referrerDisplayName}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <UserCell
                            user={row.refereeUserId}
                            snapshotName={row.refereeDisplayName}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={statusBadgeColor(row.status)} className="fw-normal">
                            {removeUnderScoreAndCapitalize(row.status)}
                          </CBadge>
                          {row.status === 'successful' && row.qualifyingOrderClosedAt && (
                            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                              Closed {getDateTimeFromDateString(row.qualifyingOrderClosedAt)}
                            </div>
                          )}
                          {row.status === 'reverted' && row.revertedAt && (
                            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                              Reverted {getDateTimeFromDateString(row.revertedAt)}
                            </div>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-3">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <NoData message="No referrals found" />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
