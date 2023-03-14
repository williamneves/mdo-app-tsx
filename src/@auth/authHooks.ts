import {
  authInstance,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword
} from "src/configs/firebase"

import AuthUser from "src/interfaces/authUser"
import ls from "src/configs/localStorage"
import { dbClient } from "src/configs/sanityConfig"
import fetchUserDB from "src/@auth/fetchUserDB"

export const fetchUser = fetchUserDB

// Sign In With Email and Password
export const signInByEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  // Try to sign in
  try {
    // Fetch user from Firebase
    const { user: authUser } = await signInWithEmailAndPassword(
      authInstance,
      email,
      password
    )

    console.log("authUser", authUser)
    // Fetch and return user from Sanity
    return fetchUserDB(authUser.uid)
  } catch (error) {
    console.log("error")
    // Trow error
    throw error
  }
}

// Sign Out
export const signOutUser = () => {
  // Remove user from local storage
  ls.remove("b3_userData")
  return signOut(authInstance)
}

type userUID = string | null

// Check if user is authenticated
export const isAuthenticated = async (): Promise<userUID> => {
  // Return user.uid if authenticated, otherwise return false
  return new Promise((resolve, reject) => {
    onAuthStateChanged(authInstance, user => {
      if (user) {
        resolve(user.uid)
      } else {
        reject(false)
      }
    })
  })
}

// Change user password
export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const { currentUser } = authInstance

  try {
    await signInWithEmailAndPassword(
      authInstance,
      currentUser!.email!,
      oldPassword
    )
    await signOutUser()
  } catch (e) {
    throw "Login inválido"
  }

  try {
    await updatePassword(currentUser!, newPassword)
    return await signInWithEmailAndPassword(
      authInstance,
      currentUser!.email!,
      newPassword
    )
  } catch (error) {
    throw error
  }
}

// Change user info
export interface ChangeUserParams {
  newInfo: Partial<AuthUser>
}

export const changeUserInfo = async ({ newInfo }: ChangeUserParams) => {
  const { currentUser } = authInstance
  const dbUser = await fetchUser(currentUser!.uid)

  try {
    await dbClient.patch(dbUser._id).set(newInfo).commit()
    return fetchUser(currentUser!.uid)
  } catch (e) {
    throw e
  }
}
