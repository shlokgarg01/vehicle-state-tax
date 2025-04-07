import Colors from '../utils/colors'
import Enums from '../utils/enums'

export const getRoleBasedColor = (role) => {
  if (role === Enums.ROLES.SUPER_ADMIN) return Colors.RED
  else if (role === Enums.ROLES.ADMIN) return Colors.GREEN
  else if (role === Enums.ROLES.USER) return Colors.BLUE
  else return Colors.BLUE
}
