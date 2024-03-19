import { Role } from '@/models/user'

export function checkRoles(
  itemRoles: string | any[],
  userRoles: any[] | Role[]
) {
  for (let i = 0; i < itemRoles?.length; i++) {
    const userRole = itemRoles[i]
    const found = userRoles?.some((role) => role.nmRole === userRole)
    if (found) {
      return true
    }
  }
  return false
}
