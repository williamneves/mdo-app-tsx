import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DataDialog {
  id: string | number;
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  confirmColor: "error" | "success" | "info" | "warning" | undefined;
  cancelColor: "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;
  confirmAction: () => void;
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

  return (
    <div>
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
          <Button onClick={() => setOpen(false)} color={data.cancelColor} autoFocus>
            {data.cancel}
          </Button>
          <Button variant={"outlined"} onClick={handleClose} color={data.confirmColor}>
            {data.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
