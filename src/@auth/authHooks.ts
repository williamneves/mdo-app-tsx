import {
  authInstance,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "src/configs/firebase"

import AuthUser from "src/interfaces/authUser"
import ls from "src/configs/localStorage";

interface Error {
  message: string,
  query: string,
  error: any,
}


import fetchUserDB from "src/@auth/fetchUserDB"

export const fetchUser = fetchUserDB

// Sign In With Email and Password
export const signInByEmail = async (email: string, password: string) :Promise<AuthUser> => {
  // Try to sign in
  try {
    // Fetch user from Firebase
    const { user: authUser } = await signInWithEmailAndPassword(authInstance, email, password)

    // Fetch and return user from Sanity
    return fetchUserDB(authUser.uid)
  }

  catch (error) {
    // Trow error
    throw (error)
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
export const isAuthenticated = async () :Promise<userUID | false> => {
  // Return user.uid if authenticated, otherwise return false
  return new Promise((resolve, reject) => {
    onAuthStateChanged(authInstance, user => {
      if (user) {
        resolve(user.uid)
      } else {
        resolve(false)
      }
    })
  })
}