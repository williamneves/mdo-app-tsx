// * React Imports
import React from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { GridToolbarFilterButton } from "@mui/x-data-grid";

// ** Icons Imports
import Close from "mdi-material-ui/Close";
import Magnify from "mdi-material-ui/Magnify";

interface QuickSearchToolbarProps {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  clearSearch: () => void
}

const QuickSearchToolbar = ({ value, onChange, clearSearch }: QuickSearchToolbarProps) => {
  return (
    <Box
      sx={{
        p: 2,
        pb: 0,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <GridToolbarFilterButton />
      </Box>
      <TextField
        variant={"standard"}
        value={value}
        onChange={onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <Magnify fontSize="small" />,
          endAdornment: (
            <IconButton size="small" title="Clear" aria-label="Clear" onClick={clearSearch}>
              <Close fontSize="small" />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto"
          },
          m: theme => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider"
          }
        }}
      />
    </Box>
  );
};

export default QuickSearchToolbar;
