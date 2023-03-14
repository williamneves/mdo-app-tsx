// ** React Imports
import {Fragment, useEffect} from "react"

// ** MUI Imports
import {TextField, MenuItem} from "@mui/material"

// ** Api Imports
import {useAuth} from "src/hooks/useAuth"

// ** Types and Interfaces
import User from "src/interfaces/User"

// ** Rendered Element
interface SelectVendorProps {
  selectedUser?: Partial<User>
}

const SelectVendor = ({
  selectedUser: preSelectedUser
}: SelectVendorProps): JSX.Element => {
  // ** Hooks
  const {user, selectedUser, setSelectedUser, selectedStore} = useAuth()

  const usersStoreList: User[] =
    selectedStore && selectedStore.employees ? selectedStore.employees : []

  const disabled = (role: string) => {
    if (role === "admin") {
      return false
    }

    if (role === "manager") {
      return false
    }

    return true
  }

  return (
    <Fragment>
      <TextField
        sx={{minWidth: 220}}
        select
        size="small"
        label="Selecionar Vendedor"
        value={selectedUser ? selectedUser : ""}
        onChange={e => {
          // @ts-ignore
          setSelectedUser(e.target.value)
        }}
        disabled={disabled(user!.role)}
      >
        {usersStoreList.map((user: User) => {
          if (user.role === "vendor")
            return (
              // @ts-ignore
              <MenuItem key={user._id} value={user}>
                {user.name}
              </MenuItem>
            )
        })}
      </TextField>
    </Fragment>
  )
}

export default SelectVendor
