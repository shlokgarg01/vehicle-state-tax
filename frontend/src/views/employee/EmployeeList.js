import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllEmployees,
  createEmployee,
  updateSingleEmployee,
  deleteSingleEmployee,
} from '../../actions/employeeAction'
import { EMPLOYEE_CONSTANTS } from '../../constants/employeeConstants'
import FormCard from '../../components/Form/FormCard'
import DataTable from '../../components/Form/DataTable'
import { showToast } from '../../utils/toast'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Loader from '../../components/Loader/Loader'

const EmployeeList = () => {
  const dispatch = useDispatch()

  const {
    employee,
    loading: createLoading,
    error: createError,
  } = useSelector((state) => state.createEmployee)

  const {
    employees,
    loading: getLoading,
    error: getError,
  } = useSelector((state) => state.getEmployee)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
  })

  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 })

  const fieldConfigs = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'number',
      required: true,
      validate: (val) => (val?.toString().length < 10 ? 'Must be at least 10 digits' : null),
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      minLength: 6,
    },
  ]
  const tableColumns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'contactNumber', label: 'Contact Number' },
  ]

  const handleCreateEmployeeSubmit = (e) => {
    e.preventDefault()
    dispatch(createEmployee(formData))
  }

  const handleCancel = () => {
    setFormData({
      username: '',
      email: '',
      contactNumber: '',
      password: '',
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(getAllEmployees({ search, ...pagination }))
  }

  useEffect(() => {
    dispatch(getAllEmployees({ ...pagination }))
  }, [dispatch, pagination.page, pagination.perPage])

  useEffect(() => {
    if (employee) {
      showToast('Employee created successfully!', 'success')
      setFormData({
        username: '',
        email: '',
        contactNumber: '',
        password: '',
      })
      dispatch({ type: EMPLOYEE_CONSTANTS.RESET_NEW_EMPLOYEE })
      dispatch(getAllEmployees({ ...pagination })) // refresh list
    }
  }, [employee, dispatch])
  console.log('Employees:', employees) //here data show  but in table data not show
  console.log(employees?.managers)

  return (
    <>
      <FormCard
        title="Create Employee"
        columns={tableColumns}
        onSubmit={handleCreateEmployeeSubmit}
        onCancel={handleCancel}
        loading={createLoading}
        errors={createError}
        formData={formData}
        setFormData={setFormData}
        initialFormData={{
          username: '',
          email: '',
          contactNumber: '',
          password: '',
        }}
        fieldConfigs={fieldConfigs}
        submitLabel="Submit"
        cancelLabel="Cancel"
        isSubmitting={createLoading}
      />

      <form onSubmit={handleSearch} className="flex gap-2 items-center mb-4">
        <TextInput
          name="search"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, contact"
        />
        <Button type="submit" label="Search" />
      </form>

      {getLoading ? (
        <Loader />
      ) : (
        <DataTable
          columns={tableColumns}
          data={employees?.managers || []}
          error={getError}
          currentPage={employees?.currentPage || 1}
          totalPages={employees?.totalPages || 1}
          totalItems={employees?.totalManagers || 0}
          itemsPerPage={pagination.perPage}
          onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
        />
      )}
    </>
  )
}

export default EmployeeList
