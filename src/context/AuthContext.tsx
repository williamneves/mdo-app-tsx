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
import SelectedStore from "@src/interfaces/SelectedStore";
import User from "@src/interfaces/User";


// ** Defaults
const defaultProvider: AuthValuesType = {
  loading: true,
  user: null,
  setUser: () => null,
  selectedUser: null,
  setSelectedUser: () => null,
  selectedStore: null,
  setSelectedStore: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
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
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(defaultProvider.selectedUser);
  const [selectedStore, setSelectedStore] = useState<SelectedStore | null>(null);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized);

  // ** Hooks
  const router = useRouter();

  const getLocalStorageUser = async (authUID: string): Promise<AuthUser> => {
    return new Promise(async (resolve, reject) => {
      const localUser = await ls.get("b3_userData");
      if (
        !localUser
        || moment(localUser.expirationDate).isBefore(moment())
        || localUser.user.authUID !== authUID
      ) {
        reject(false);
      }
      resolve(localUser.user)
    })
  }

  const setLocalStorageUser = (user: AuthUser): void => {
    const expirationDate = moment().add(12, "hours").toDate();
    // Create User Object
    const storeUser = {
      user: user,
      expirationDate: expirationDate
    };
    // Store User in Local Storage
    ls.set("b3_userData", storeUser);
  }

  // Set Selected Store at Local Storage
  const setLocalStorageSelectedStore = (store: SelectedStore): void => {
    // Check if it has a selected store in local storage
    const localSelectedStore = ls.get("b3_selectedStore");
    // If has a selected store in local storage
    if (localSelectedStore) {
      // Set local storage selected store
      setSelectedStore(localSelectedStore);
    } else {
      // If not, set the new one
      ls.set("b3_selectedStore", store);
      setSelectedStore(store);
    }
  }

  /*
    Check if user is logged in
    if yes, set user, redirect to home
    if no, redirect to login page
  */
  useEffect(() => {
    // Init auth
    setIsInitialized(true)
    setLoading(true)

    // Check if user is logged in
    auth.isAuthenticated()
      // If user is logged in
      .then((userUID) => {
        // Check if it has valid userData in LocalStorage
        // And if it is not expired
        // Return user from LocalStorage
        getLocalStorageUser(userUID as string)
          .then((user) => {
            setUser(user) // Set user
            // setSelectedStore(user.stores[0]) // Set selected store
            setLocalStorageSelectedStore(user.stores[0]) // Set selected store
            setLoading(false) // Stop loading
          })
          // If user is not in LocalStorage
          .catch(() => {
            // Fetch user from DB
            auth.fetchUser(userUID as string)
              .then((user) => {
                setLocalStorageUser(user) // Set user in LocalStorage
                setUser(user) // Set user
                // setSelectedStore(user.stores[0]) // Set selected store
                setLocalStorageSelectedStore(user.stores[0]) // Set selected store
                setLoading(false) // Stop loading
              })
          })
      })
      .catch(() => {
        console.log('AuthProvider isAuthenticated error')
        setLoading(false)
      })

  }, []);

  // ** Methods

  // ** Login
  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const loginToast = toast.loading("Entrando...");

    try {
      // ** Sign the user
      const user = await auth.signInByEmail(params.email, params.password);
      // console.log('userUID', userUID)

      // ** Set the user
      setUser(user);

      // ** Store User in Local Storage
      // Create Expiration Date with 12 hours expiration in milliseconds
      setLocalStorageUser(user)
      setSelectedStore(user.stores[0]) // Set selected store


      const returnUrl = router.query.returnUrl;
      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
      toast.success("Login efetuado com sucesso!", { id: loginToast });

      // ** Redirect to Home Page
      await router.replace(redirectURL as string);

    } catch (err) {
      console.error("err", err);
      toast.error("Erro no login!", { id: loginToast });
      // @ts-ignore
      errorCallback({ message: "error" });
    }

  };

  // ** Logout
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

  const handleChangeUser = async ({ newInfo }: auth.ChangeUserParams) => {
    try {
      const newUser = await auth.changeUserInfo({ newInfo });
      setUser(newUser);
    } catch (e) {
      throw e;
    }
  }

  const values = {
    user,
    setUser,
    selectedUser,
    setSelectedUser,
    loading,
    setLoading,
    selectedStore,
    setSelectedStore,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUser: handleChangeUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
