import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FormCard from '../../components/Form/FormCard'
import FilterSearchBar from '../../components/Form/FilterSearchBar'
import DataTable from '../../components/Form/DataTable'

import fieldConfigs from '../../components/Form/FieldConfig'
import { createEmployee, getAllEmployees, deleteSingleEmployee } from '../../actions/employeeAction'
import { EMPLOYEE_CONSTANTS } from '../../constants/employeeConstants'
import { showToast } from '../../utils/toast'

const EmployeeList = () => {
  const dispatch = useDispatch()

  // Fetch employee list
  const {
    loading: getLoading,
    employees = [],
    error: getError,
  } = useSelector((state) => state.getEmployee)

  // Create employee state
  const {
    loading: createLoading,
    employee: createdEmployee,
    error: createError,
    success: createSuccess,
  } = useSelector((state) => state.createEmployee)

  // Delete employee state
  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.deleteEmployee || {})

  const [employee, setEmployee] = useState({
    username: '',
    email: '',
    password: '',
    contactNumber: '',
    name: '',
  })

  const [searchValues, setSearchValues] = useState({
    username: '',
    email: '',
    contactNumber: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Load employees
  useEffect(() => {
    dispatch(
      getAllEmployees({
        page: currentPage,
        perPage: itemsPerPage,
        search: searchValues.username || searchValues.email || searchValues.contactNumber || '',
      }),
    )
  }, [dispatch, currentPage, searchValues])

  // Show success toast
  useEffect(() => {
    if (createSuccess) {
      showToast('Employee created successfully', 'success')
      setEmployee({
        username: '',
        email: '',
        password: '',
        contactNumber: '',
        name: '',
      })
      dispatch({ type: EMPLOYEE_CONSTANTS.RESET_NEW_EMPLOYEE })
      dispatch(
        getAllEmployees({
          page: currentPage,
          perPage: itemsPerPage,
          search: searchValues.username || searchValues.email || searchValues.contactNumber || '',
        }),
      )
    }
  }, [createSuccess, dispatch])

  useEffect(() => {
    if (isDeleted) {
      showToast('Employee deleted successfully', 'success')
      dispatch(
        getAllEmployees({
          page: currentPage,
          perPage: itemsPerPage,
          search: searchValues.username || searchValues.email || searchValues.contactNumber || '',
        }),
      )
      dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_RESET })
    }
  }, [isDeleted, dispatch])

  // Filter logic
  console.log(employees)
  const filteredData = employees?.managers || []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage])

  const handleCreateEmployee = (e) => {
    e.preventDefault()
    dispatch(createEmployee(employee))
  }

  const handleDelete = (emp) => {
    if (window.confirm(`Are you sure you want to delete ${emp.username}?`)) {
      dispatch(deleteSingleEmployee(emp._id))
    }
  }

  const handleResetForm = () => {
    setEmployee({
      username: '',
      email: '',
      password: '',
      contactNumber: '',
      name: '',
    })
    dispatch({ type: EMPLOYEE_CONSTANTS.RESET_NEW_EMPLOYEE })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleResetFilter = () => {
    setSearchValues({
      username: '',
      email: '',
      contactNumber: '',
    })
    setCurrentPage(1)
  }

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'name', label: 'Name' },
  ]

  return (
    <>
      <FormCard
        title="Create Employee"
        onSubmit={handleCreateEmployee}
        onCancel={handleResetForm}
        fieldConfigs={fieldConfigs.employeeForm}
        errors={createError}
        formData={employee}
        setFormData={setEmployee}
        isSubmitting={createLoading}
      />

      <FilterSearchBar
        fields={fieldConfigs.employeeForm.filter((f) =>
          ['username', 'email', 'contactNumber'].includes(f.name),
        )}
        searchValues={searchValues}
        setSearchValues={setSearchValues}
        onSearch={handleSearch}
        onReset={handleResetFilter}
        loading={getLoading}
        noDataMessage={filteredData.length === 0 ? 'No employees found' : ''}
        error={getError}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        totalPages={employees?.totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={employees.totalCount}
        loading={getLoading || deleteLoading}
        onPageChange={(newPage) => setCurrentPage(newPage)}
        onEdit={(item) => console.log('Edit clicked:', item)}
        onDelete={handleDelete}
        enableActions
        errorMessage="No employees found."
      />
    </>
  )
}

export default EmployeeList
