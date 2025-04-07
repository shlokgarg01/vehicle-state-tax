import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="mt-4 px-4">
      <div>
        <span className="ms-1">{new Date().getFullYear()} &copy; Vehicle State Tax</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
