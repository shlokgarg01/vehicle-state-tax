// src/components/Form/BannerForm.jsx
import React from 'react'
import TextInput from './TextInput'
import SelectInput from './SelectInput'

const BannerForm = ({ bannerData, setBannerData, errors, isEdit = false }) => {
  return (
    <div className="d-flex flex-column gap-3">
      <TextInput
        label="Title"
        id="title"
        placeholder="Enter title"
        value={bannerData.title}
        onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
        errors={errors}
      />

      <SelectInput
        label="Status"
        id="status"
        value={bannerData.status}
        onChange={(e) => setBannerData({ ...bannerData, status: e.target.value })}
        options={[
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
        errors={errors}
      />

      {!isEdit && (
        <TextInput
          label="Upload Image"
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setBannerData({ ...bannerData, image: e.target.files[0] })}
          errors={errors}
        />
      )}
    </div>
  )
}

export default BannerForm
