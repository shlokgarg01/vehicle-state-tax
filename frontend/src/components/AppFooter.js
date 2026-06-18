import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="mt-4 px-4 d-flex justify-content-between align-items-center">
      <div>
        <span className="ms-1">{new Date().getFullYear()} &copy; Vehicle State Tax</span>
      </div>
      <div>
        <span className="text-muted">
          Created by{' '}
          <a
            href="https://webxlabs.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            WebX Labs
          </a>
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
