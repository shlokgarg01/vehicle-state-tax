import Colors from '../utils/colors'
<<<<<<< HEAD
<<<<<<< HEAD
import Enums from '../utils/enums'

export const getRoleBasedColor = (role) => {
  if (role === Enums.ROLES.SUPER_ADMIN) return Colors.RED
  else if (role === Enums.ROLES.ADMIN) return Colors.GREEN
  else if (role === Enums.ROLES.USER) return Colors.BLUE
=======
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
import Constants from '../utils/constants'

export const getRoleBasedColor = (role) => {
  if (role === Constants.ROLES.ADMIN) return Colors.GREEN
<<<<<<< HEAD
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
  else return Colors.BLUE
}
