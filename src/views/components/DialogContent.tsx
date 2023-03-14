import Box from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import TextInputControlled from "components/inputs/TextInputControlled"

interface DialogContentProps {
  headerMessage: string
  inputProps?: any
}

const DialogContent = ({ headerMessage, inputProps }: DialogContentProps) => {
  return (
    <Box>
      <Typography variant={"subtitle1"} sx={{ mb: 3 }}>
        {headerMessage}
      </Typography>
      <TextInputControlled {...inputProps} />
    </Box>
  )
}

export default DialogContent
