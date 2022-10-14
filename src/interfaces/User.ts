import AuthUser from 'src/interfaces/authUser';

export default interface User extends Omit<AuthUser,
  'inactive' | 'authUID' | 'provider' | 'stores' | 'role' | 'address' | 'bankAccount'> {
  role: "admin" | "manager" | "coordinator" | "vendor" | "streetVendor" | "client"
}