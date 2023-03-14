import {useState, Fragment} from "react"

// ** MUI Imports
import Button from "@mui/material/Button"
import {styled} from "@mui/material/styles"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MuiMenu from "@mui/material/Menu"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import MuiMenuItem from "@mui/material/MenuItem"

// ** Icons Imports
import StoreMallDirectoryTwoToneIcon from "@mui/icons-material/StoreMallDirectoryTwoTone"
import ArrowDropDownTwoToneIcon from "@mui/icons-material/ArrowDropDownTwoTone"
import PlaceTwoToneIcon from "@mui/icons-material/PlaceTwoTone"

import ls from "src/configs/localStorage"

// Styled Menu component
const Menu = styled(MuiMenu)(({theme}) => ({
  "& .MuiMenu-paper": {
    border: `1px solid ${theme.palette.divider}`
  }
}))

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({theme}) => ({
  "&:focus": {
    backgroundColor: theme.palette.primary.main,
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white
    }
  }
}))

import {useAuth} from "src/hooks/useAuth"

const StoreSelect = () => {
  const {user, selectedStore, setSelectedStore} = useAuth()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = store => {
    // Set the selected store
    setSelectedStore(store)
    // save the store to local storage
    // localStorage.setItem('selectedStore', JSON.stringify(store))
    ls.set("b3_selectedStore", store)

    handleClose()
  }

  return (
    <Fragment>
      <Button
        variant="text"
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls="customized-menu"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <StoreMallDirectoryTwoToneIcon />
          <Typography variant="body2" color={"primary.main"} ml={"0.4rem"}>
            {selectedStore ? selectedStore.name : "Select Store"}
          </Typography>
          {user.stores.length > 1 && (
            <ArrowDropDownTwoToneIcon sx={{marginX: 0}} />
          )}
        </Box>
      </Button>
      {user.stores.length > 1 && (
        <Menu
          keepMounted
          selected={null}
          elevation={0}
          anchorEl={anchorEl}
          id="customized-menu"
          onClose={handleClose}
          open={Boolean(anchorEl)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          {user.stores.map((store, index) => {
            return (
              <MenuItem
                key={store._id}
                onClick={() => {
                  handleSelect(store)
                }}
                selected={selectedStore?._id === user.stores[index]._id}
              >
                <ListItemIcon>
                  <PlaceTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary={store.name} />
              </MenuItem>
            )
          })}
        </Menu>
      )}
    </Fragment>
  )
}

export default StoreSelect
