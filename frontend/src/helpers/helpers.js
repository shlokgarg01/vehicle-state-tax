import Colors from '../utils/colors'
import Constants from '../utils/constants'

export const getRoleBasedColor = (role) => {
  if (role === Constants.ROLES.ADMIN) return Colors.GREEN
  else return Colors.BLUE
}
