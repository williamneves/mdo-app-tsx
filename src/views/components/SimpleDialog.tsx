import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FallbackSpinner from "@core/components/spinner";

export interface DataDialog {
  // id: string | number;
  title: string;
  message: string | React.ReactNode;
  confirm: string;
  cancel: string | null;
  confirmColor: "primary" | "error" | "success" | "info" | "warning" | undefined;
  cancelColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;
  confirmAction: () => void;
  any?: any;
}

interface SimpleDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: DataDialog;
}

export default function SimpleDialog({ open, setOpen, data }: SimpleDialogProps) {

  const handleClose = () => {
    console.log('closing dialog');
    data.confirmAction();
    setOpen(false);
  };

  if (!data) {
    return <FallbackSpinner />;
  }

  else
    return (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {data.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText component={'div'} id="alert-dialog-description">
              {data.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {data.cancel &&
              <Button onClick={() => setOpen(false)} color={data.cancelColor} autoFocus>
                {data.cancel}
              </Button>
            }
            <Button variant={"outlined"} onClick={handleClose} color={data.confirmColor}>
              {data.confirm}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}
