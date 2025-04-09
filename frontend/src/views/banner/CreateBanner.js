// src/pages/Banner/CreateBanner.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBanner } from '../../actions/bannerAction'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CSpinner,
  CAlert,
  CTableDataCell,
} from '@coreui/react'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import SelectInput from '../../components/Form/SelectInput'

export default function CreateBanner() {
  const dispatch = useDispatch()
  const [banner, setBanner] = useState({ title: '', status: 'active', image: null })
  // const [errors, setErrors] = useState({})
  const { loading, success, banner: data, error } = useSelector((state) => state.createBanner)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e)
    const formData = new FormData()
    formData.append('title', banner.title)
    formData.append('status', banner.status)
    formData.append('banner', banner.image)

    dispatch(createBanner(formData))
    console.log(data)
    console.log('data at frontend send', formData)
    setBanner({ title: '', status: 'active', image: null })
  }
  useEffect(() => {
    if (success) {
      setBanner({ title: '', status: 'active', image: null })
    }
    return () => {
      dispatch({ type: 'CREATE_BANNER_RESET' }) // if you’ve defined this action
    }
  }, [success])

  return (
    <CCard>
      <CCardHeader>Create New Banner</CCardHeader>
      <CCardBody>
        {success && <CAlert color="success">Banner created successfully!</CAlert>}
        {error && <CAlert color="danger">{error.message || 'Something went wrong'}</CAlert>}
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol sm={6}>
              <TextInput
                label="Title"
                value={banner.title}
                onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                placeholder="Enter banner title"
                id="title"
                errors={error}
              />
            </CCol>
            <CCol sm={6}>
              <SelectInput
                label="Status"
                value={banner.status}
                onChange={(e) => setBanner({ ...banner, status: e.target.value })}
                options={['active', 'inactive']}
                id="status"
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={6}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBanner({ ...banner, image: e.target.files[0] })}
                errors={error}
              />
              {/* {error.banner && <p className="text-danger">{error.banner}</p>} */}
            </CCol>
          </CRow>
          {banner.image && (
            <CRow className="mt-4">
              <CCol sm={6}>
                <CCard className="p-2 d-flex align-items-center justify-content-center">
                  <img
                    src={URL.createObjectURL(banner.image)}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      objectFit: 'contain',
                    }}
                    onClick={() => window.open(URL.createObjectURL(banner.image), '_blank')}
                  />
                  <p className="mt-2 text-center text-muted">Image Preview</p>
                </CCard>
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol sm={4}>
              <Button
                type="submit"
                color="primary"
                disabled={loading}
                fullWidth
                title={loading ? <CSpinner size="sm" /> : 'Create Banner'}
              />
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}
