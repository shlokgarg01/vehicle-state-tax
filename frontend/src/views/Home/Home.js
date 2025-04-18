import React, { useState, useEffect } from 'react'
import DataTable from '../../components/Form/DataTable'
import FormCard from '../../components/Form/FormCard'
import FilterSearchBar from '../../components/Form/FilterSearchBar'
import fieldConfigs from '../../components/Form/FieldConfig'

export default function Home() {
  // data from backend
  const allEmployees = Array.from({ length: 47 }).map((_, i) => ({
    _id: `${i + 1}`,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@example.com`,
    role: ['Admin', 'Editor', 'Viewer'][i % 3],
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  }))

  const [filteredData, setFilteredData] = useState(allEmployees)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ]

  // const fieldConfigs = [
  //   { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
  //   { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
  //   { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' },
  //   {
  //     name: 'contactNumber',
  //     label: 'Contact Number',
  //     type: 'number',
  //     placeholder: 'Enter Contact Number',
  //   },
  //   { name: 'state', label: 'Select State', type: 'select', options: STATES },
  //   {
  //     name: 'district',
  //     label: 'District',
  //     type: 'text',
  //     placeholder: 'Enter District',
  //     condition: { name: 'state', value: 'guj' },
  //   },
  // ]

  const [employee, setEmployee] = useState({
    username: '',
    email: '',
    password: '',
    contactNumber: '',
    state: '',
    district: '',
  })

  const [editErrors, setEditErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  const handleCreateEmployee = (e) => {
    e.preventDefault()
    setCreateLoading(true)
    console.log('Submitted Data:', employee)
    setTimeout(() => {
      setCreateLoading(false)
      alert('Employee created successfully!')
      setEmployee({
        username: '',
        email: '',
        password: '',
        contactNumber: '',
        state: '',
        district: '',
      })
    }, 1000)
  }

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev)
  }

  const [searchValues, setSearchValues] = useState({
    username: '',
    email: '',
  })

  const filterFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      showLabel: true,
      placeholder: 'Enter username',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      showLabel: true,
      placeholder: 'Enter email',
    },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const filtered = allEmployees.filter((emp) => {
      return (
        (!searchValues.username ||
          emp.name.toLowerCase().includes(searchValues.username.toLowerCase())) &&
        (!searchValues.email ||
          emp.email.toLowerCase().includes(searchValues.email.toLowerCase())) &&
        (!searchValues.role || emp.role === searchValues.role)
      )
    })
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page after search
  }

  const handleReset = () => {
    setSearchValues({
      username: '',
      email: '',
      role: '',
    })
    setFilteredData(allEmployees)
    setCurrentPage(1)
  }
  // FILTER FORM END

  return (
    <>
      <FormCard
        title="Create Employee"
        onSubmit={handleCreateEmployee}
        onCancel={() =>
          setEmployee({
            username: '',
            email: '',
            password: '',
            contactNumber: '',
            state: '',
            district: '',
          })
        }
        isSubmitting={createLoading}
        submitLabel="Create"
        cancelLabel="Cancel"
        columns={1}
        formData={employee}
        setFormData={setEmployee}
        errors={editErrors}
        showPassword={showPassword}
        handlePasswordToggle={handlePasswordToggle}
        fieldConfigs={fieldConfigs.employeeForm}
      />

      <FilterSearchBar
        fields={filterFields}
        searchValues={searchValues}
        setSearchValues={setSearchValues}
        onSearch={handleSearch}
        onReset={handleReset}
        noDataMessage={filteredData.length === 0 ? 'No data found' : ''}
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        loading={createLoading}
        onPageChange={setCurrentPage}
        onEdit={(item) => console.log('Edit item:', item)}
        onDelete={(item) => console.log('Delete item:', item)}
        enableActions
        errorMessage="No users found."
      />
    </>
  )
}
