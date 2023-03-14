import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

// ** MUI Icons
import Close from "@mui/icons-material/Close"
import DoneOutlineTwoToneIcon from "@mui/icons-material/DoneOutlineTwoTone"
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone"
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone"
import ReportTwoToneIcon from "@mui/icons-material/ReportTwoTone"

// Switch Icons by type

export interface AlertActionProps {
  open: boolean
  setOpen: (value: boolean) => void
  alertType: "success" | "error" | "info" | "warning"
  title: string | React.ReactNode
  content: string | React.ReactNode
  closeText: string
  closeColor?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
  closeVariant?: "outlined" | "contained" | "text"
  closeIcon?: React.ReactNode
  closeAction?: () => void
  agreeText?: string
  agreeColor?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
  agreeVariant?: "outlined" | "contained" | "text"
  agreeIcon?: React.ReactNode
  agreeAction?: () => void
}

const getIcon = (type: AlertActionProps["alertType"]) => {
  switch (type) {
    case "success":
      return <DoneOutlineTwoToneIcon sx={{color: "success.main"}} />
    case "error":
      return <ReportTwoToneIcon sx={{color: "error.main"}} />
    case "info":
      return <InfoTwoToneIcon sx={{color: "info.main"}} />
    case "warning":
      return <WarningTwoToneIcon sx={{color: "warning.main"}} />
    default:
      return <InfoTwoToneIcon sx={{color: "info.main"}} />
  }
}

export default function AlertAction(props: AlertActionProps) {
  // ** Props
  const {open, setOpen, title} = props

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3
          }}
        >
          {getIcon(props.alertType)}
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.closeAction || handleClose}
            color={props.closeColor}
            variant={props.closeVariant}
            endIcon={props.closeIcon || <Close />}
          >
            {props.closeText}
          </Button>
          <Button
            onClick={props.agreeAction || handleClose}
            color={props.agreeColor}
            variant={props.agreeVariant}
            endIcon={props.agreeIcon}
            autoFocus
          >
            {props.agreeText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
