import Constants from '../../utils/constants'
const fieldConfigs = {
  employeeForm: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter Name',
      required: true,
      showLabel: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter Email',
      showLabel: true,
      required: true,
      validation: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        error: 'Invalid email format',
      },
    },
    {
      name: 'username',
      label: 'Username',
      showLabel: true,
      type: 'text',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 15,
        error: 'Username must be between 3 and 15 characters',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      showLabel: true,
      required: true,
      validation: { minLength: 6, error: 'Password must be at least 6 characters' },
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      showLabel: true,
      type: 'number',
      validation: { pattern: /^[0-9]{10}$/, error: 'Enter a valid 10-digit contact number' },
    },
  ],
  userForm: [
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'number',
      validation: { pattern: /^[0-9]{10}$/, error: 'Enter a valid 10-digit contact number' },
    },
  ],
  state: [
    {
      name: 'state',
      label: 'State',
      type: 'select',
      required: true,
      getOptions: (_, extraData = {}) =>
        (extraData.states || [])
          .filter((s) => s.mode === extraData.mode && s.status === Constants.STATUS.ACTIVE)
          .map((s) => ({ value: s._id, label: s.name })),
    },
  ],
}

export default fieldConfigs
