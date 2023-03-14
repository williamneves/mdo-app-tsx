import AuthUser from "src/interfaces/authUser"

export default interface User extends Partial<AuthUser> {
  role:
    | "admin"
    | "manager"
    | "coordinator"
    | "vendor"
    | "streetVendor"
    | "client"
}
