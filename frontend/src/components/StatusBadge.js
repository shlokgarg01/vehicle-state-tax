import React from 'react'
import Constants from '../utils/constants'

export default function StatusBadge({ status }) {
  return (
    <div
      className={`${status === Constants.STATUS.ACTIVE ? 'bg-success' : 'bg-danger'} text-light text-center rounded-pill d-block`}
      style={{ padding: 1.5 }}
    >
      {status}
    </div>
  )
}
