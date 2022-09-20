// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";
import ls from "src/configs/localStorage";
import moment from "moment";
import "moment-timezone";

// ** Config
import authConfig from "src/configs/auth";

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType } from "./types";
import AuthUser from "src/interfaces/authUser";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
};

// ** AuthHooks Imports
import * as auth from "src/@auth/authHooks";

// ** Others
import toast from "react-hot-toast";

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<AuthUser | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized);

  // ** Hooks
  const router = useRouter();

  // useEffect(() => {
  //   console.log('AuthProvider useEffect')
  //   const initAuth = async (): Promise<void> => {
  //     setIsInitialized(true)
  //     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  //     if (storedToken) {
  //       setLoading(true)
  //       await axios
  //         .get(authConfig.meEndpoint, {
  //           headers: {
  //             Authorization: storedToken
  //           }
  //         })
  //         .then(async response => {
  //           setLoading(false)
  //           setUser({ ...response.data.userData })
  //         })
  //         .catch(() => {
  //           localStorage.removeItem('userData')
  //           localStorage.removeItem('refreshToken')
  //           localStorage.removeItem('accessToken')
  //           setUser(null)
  //           setLoading(false)
  //         })
  //     } else {
  //       setLoading(false)
  //     }
  //   }
  //   initAuth()
  // }, [])

  /*
    Check if user is logged in
    if yes, set user, redirect to home
    if no, redirect to login page
  */
  useEffect(() => {

    // Init auth
    setIsInitialized(true)
    setLoading(true)
    // // Check if has valid userData in LocalStorage
    // const userData = ls.get("b3_userData");
    //
    // // If no userData, redirect to login page
    // if (!userData) {
    //   setLoading(false);
    //   return;
    // }
    //
    // // If userData is expired, redirect to login page
    // if (moment().isAfter(moment(userData.expirationDate))) {
    //   toast.error("Você ficou ausente por muito tempo, faça seu login novamente.", {duration: 5000});
    //   setLoading(false);
    //   return;
    // }
    //
    // console.log("is authenticated");
    // setLoading(false);
    //
    //
    auth.isAuthenticated()
      .then((response) => {
        console.log('AuthProvider isAuthenticated response', response)
        // @ts-ignore
        auth.fetchUser(response)
          .then((response) => {
            if (response) {
              console.log('AuthProvider fetchUser response', response)
              setUser(response)
              setLoading(false)
            }
            else {
              ls.remove("b3_userData");
              setUser(null)
              setLoading(false)
              router.replace('/login')
            }
          })
      })
      .catch(() => {
        console.log('AuthProvider isAuthenticated error')
        setLoading(false)
      })

  }, []);

  // const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
  //   axios
  //     .post(authConfig.loginEndpoint, params)
  //     .then(async res => {
  //       window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
  //     })
  //     .then(() => {
  //       axios
  //         .get(authConfig.meEndpoint, {
  //           headers: {
  //             Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
  //           }
  //         })
  //         .then(async response => {
  //           const returnUrl = router.query.returnUrl
  //
  //           setUser({ ...response.data.userData })
  //           await window.localStorage.setItem('userData', JSON.stringify(response.data.userData))
  //
  //           const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
  //
  //           router.replace(redirectURL as string)
  //         })
  //     })
  //     .catch(err => {
  //       if (errorCallback) errorCallback(err)
  //     })
  // }

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const loginToast = toast.loading("Logging in...");

    try {
      // ** Sign the user
      const userAuth = await auth.signInByEmail(params.email, params.password);
      // console.log('userUID', userUID)

      // ** Set the user
      setUser(userAuth);

      // ** Store User in Local Storage
      // Create Expiration Date with 1 day expiration in milliseconds
      const expirationDate = moment().add(24, "hours").toDate();

      // Create User Object
      const storeUser = {
        user: userAuth,
        expirationDate: expirationDate
      };
      // Store User in Local Storage
      await ls.set("b3_userData", storeUser);

      const returnUrl = router.query.returnUrl;
      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
      toast.success("Logged in successfully!", { id: loginToast });

      // ** Redirect to Home Page
      await router.replace(redirectURL as string);

    } catch (err) {
      console.error("err", err);
      toast.error("Login failed!", { id: loginToast });
      // @ts-ignore
      errorCallback({ message: "error" });
    }

  };

  const handleLogout = async () => {
    await auth.signOutUser();
    setUser(null);
    setIsInitialized(false);

    // ** Remove User from Local Storage
    await ls.remove("b3_userData");

    // ** Redirect to Login Page
    router.push("/login");
  };

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({ email: params.email, password: params.password });
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null));
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
