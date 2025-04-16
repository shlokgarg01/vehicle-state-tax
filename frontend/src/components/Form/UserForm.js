import React, { useState } from 'react'
import TextInput from './TextInput'
import Constants from '../../utils/constants'

const UserForm = ({ userData, setUserData, errors }) => {
  const [showPassword, setShowPassword] = useState(false)
  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="d-flex flex-column gap-2">
      {/* Image preview */}
      {userData.preview || userData.imageUrl ? (
        <img
          src={userData.preview || userData.imageUrl || userData.image || userData?.image?.name}
          alt="profile"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : null}
      {/* Upload Image */}
      <label className="form-label fw-semibold">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        className="form-control"
        onChange={(e) => setUserData({ ...userData, image: e.target.files[0] })}
      />
      {errors?.image && <p className="text-danger m-0">{errors?.image}</p>}
      <TextInput
        label="Username"
        disabled
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        placeholder="Enter username"
        id="username"
        errors={errors}
      />
      <TextInput
        label="Name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        placeholder="Enter name"
        id="name"
        errors={errors}
      />
      <TextInput
        label="Email"
        type="email"
        value={userData.email ?? ''}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        placeholder="Enter email"
        id="email"
        errors={errors}
      />
      <TextInput
        label="Contact Number"
        value={userData.contactNumber}
        onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
        placeholder="Enter contact number"
        id="contactNumber"
        errors={errors}
      />
      {userData.role !== Constants.ROLES.ADMIN && (
        <TextInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={userData.password || ''}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          placeholder="Enter new password (optional)"
          id="password"
          showPasswordToggle={true}
          togglePasswordVisibility={handlePasswordToggle}
          errors={errors}
        />
      )}{' '}
      <select
        className="form-select"
        value={userData.status}
        onChange={(e) => setUserData({ ...userData, status: e.target.value })}
      >
        <option value="">Select Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {errors?.status && <p className="text-danger m-0">{errors?.status}</p>}
    </div>
  )
}

export default UserForm
