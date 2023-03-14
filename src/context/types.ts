export type ErrCallbackType = (err: {[key: string]: string}) => void

import SelectedStore from "@src/interfaces/SelectedStore"
import AuthUser from "src/interfaces/authUser"
import User from "@src/interfaces/User"
import {ChangeUserParams} from "src/@auth/authHooks"

export type LoginParams = {
  email: string
  password: string
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: AuthUser | null
  setUser: (value: AuthUser | null) => void
  selectedUser: Partial<User> | null
  setSelectedUser: (value: Partial<User> | null) => void
  selectedStore: SelectedStore | null
  setSelectedStore: (value: SelectedStore | null) => void
  setIsInitialized: (value: boolean) => void
  updateUser: (newUser: ChangeUserParams) => Promise<void>
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
