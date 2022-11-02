// ** React Imports
import React, { Fragment, forwardRef } from "react";
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { useTheme, useMediaQuery } from "@mui/material";

// ** MUI Icons
import Close from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

// ** Transition
const Transition = forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction={"up"} ref={ref} {...props} />;
});

interface QuickDialogAction {
  mode: "button" | "link" | "loadingButton";
  props: {
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    sx?: React.CSSProperties;
    label: string;
    href?: string;
    onClick?: () => void;
    endIcon?: React.ReactNode;
    startIcon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    loadingPosition?: "start" | "center" | "end";
  }
}

interface QuickDialogProps {
  open: boolean;
  handleClose: () => void;
  blockClose?: boolean;
  fullScreenBreakPoint?: "xs" | "sm" | "md" | "lg" | "xl";
  customCloseComponent?: React.ReactNode;
  fullWidth?: boolean;
  fullScreen?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  helpPopover?: {
    body: string;
    title: string;
    content: string;
  }
  data: {
    headerTitle: string;
    headerIcon?: React.ReactNode;
    title: string;
    content: string | React.ReactNode;
    actions: QuickDialogAction[];
  }
}

const QuickDialog = (props: QuickDialogProps) => {
  // ** Props
  const {
    open,
    handleClose,
    blockClose,
    fullScreenBreakPoint,
    fullWidth,
    maxWidth,
    customCloseComponent,
    // helpPopover,
    data
  } = props;

  // ** Hooks
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down(fullScreenBreakPoint || "sm"));

  // Switch Actions
  const mappingActions = (action: QuickDialogAction, index: number) => {
    // Deconstruct Action
    const { mode } = action;
    const { label } = action.props;

    // Creating a unique key for each action
    const key = mode + label + (index + 1);

    // Switch Mode for Action
    switch (mode) {
      case "button":
        return (
          <Button {...action.props} key={key}>
            {label}
          </Button>
        );

      case "link":
        return (
          <Link href={action.props.href as string} key={key}>
            {label}
          </Link>
        );

      case "loadingButton":
        return (
          <LoadingButton {...action} key={key}>
            {label}
          </LoadingButton>
        );

      default:
        return (
          <Button {...action} key={key}>
            {label}
          </Button>
        );
    }
  };

  return (
    <Fragment>
      <Dialog
        // @ts-ignore
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        fullWidth={fullWidth || false}
        maxWidth={maxWidth || "md"}
        open={open}
        onClose={blockClose ? () => {} : handleClose}
        aria-labelledby="QuickDialog-title">
        <DialogTitle
          id="QuickDialog-title"
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
          gap={3}
          marginLeft={4}
          sx={{ p: 4 }}
        >
          {/* Icon */}
          {data.headerIcon ? data.headerIcon : <VisibilityIcon color={"primary"} />}
          {/* Title */}
          <Typography variant="h6" component="span">
            {data.headerTitle || "Quick View"}
          </Typography>

          {/* Close Button or Custom Close Component */}
          {customCloseComponent ? customCloseComponent
            :
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ top: 10, right: 10, position: "absolute", color: theme => theme.palette.grey[500] }}
            >
              <Close />
            </IconButton>
          }
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {data.content}
        </DialogContent>
        <DialogActions sx={{ paddingX: "1.2rem!important", paddingY: "0.8rem!important" }}>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
          >
            {
              data.actions?.length
                ?
                data.actions?.map((action, index) => {
                  return mappingActions(action, index);
                })
                :
                <Button variant={"outlined"} color={"secondary"} onClick={handleClose}
                        endIcon={<Close />}>Close</Button>
            }
          </Box>
        </DialogActions>
      </Dialog>
      {/*<Popover*/}
      {/*  anchorEl={popoverElementInstructions}*/}
      {/*  open={false}*/}
      {/*  onClose={() => setActiveElement(null)}*/}
      {/*  title={helpPopover?.title || "Instructions"}*/}
      {/*  body={helpPopover?.body || "The instructions body is missing"}*/}
      {/*/>*/}
    </Fragment>
  );
};

export default QuickDialog;
