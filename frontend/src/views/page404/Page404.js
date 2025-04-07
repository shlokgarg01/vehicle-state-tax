import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'
import { AppFooter, AppHeader, AppSidebar } from '../../components'

const Page404 = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={6}>
                <div className="clearfix">
                  <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
                  <p className="text-body-secondary float-start">
                    The page you are looking for was not found.
                  </p>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default Page404
