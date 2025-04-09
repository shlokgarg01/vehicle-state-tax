// src/components/Form/UserForm.jsx
import React from 'react'
import TextInput from './TextInput'

const UserForm = ({ userData, setUserData, errors }) => {
  return (
    <div className="d-flex flex-column gap-2">
      <TextInput
        label="Username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        placeholder="Enter username"
        id="username"
        errors={errors}
      />
      <TextInput
        label="Email"
        type="email"
        value={userData.email}
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
    </div>
  )
}

export default UserForm
