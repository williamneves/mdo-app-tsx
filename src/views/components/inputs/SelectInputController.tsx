import { ReactElement } from "react";
import {
  FieldErrors
} from "react-hook-form";
import {
  TextField,
  OutlinedTextFieldProps,
  MenuItem,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import { InputController } from "./InputController";

interface menuItems {
  key: string | number;
  value: string;
  label: string | ReactElement;
  disabled?: boolean;
  selected?: boolean;
}

interface SelectItems {
  placeholder?: {
    disabled: boolean;
    label: string;
  }
  items: Array<menuItems>;
}

interface SelectInputProps extends OutlinedTextFieldProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  errors: FieldErrors;
  readOnly?: boolean;
  // Just pass a ReactNode to simple string to startAdornment and endAdornment
  startAdornment?: JSX.Element | string;
  endAdornment?: JSX.Element | string;
  // Select items
  selectItems: SelectItems;
  // Add any other props you want to pass to the input
}

export const SelectInputController = (props: SelectInputProps) => {

  const {
    name,
    control,
    errors,
    startAdornment,
    endAdornment,
    variant,
    readOnly,
    selectItems
  } = props;

  // @ts-ignore
  return (
    <InputController
      name={name}
      control={control}
      errors={errors}
      render={({ field: { value, onChange }, fieldState: { invalid } }) => {

        // Remove selectItems from props
        const { selectItems, ...rest } = props;

        console.log(value)

        return (
          <TextField
            {...rest}
            select
            variant={variant}
            value={value}
            onChange={onChange}
            error={invalid}
            aria-describedby={`${name}-text-input-form`}
            InputProps={{
              readOnly: readOnly || props.InputProps?.readOnly,
              startAdornment: (
                startAdornment ?
                  <InputAdornment position="start">
                    {startAdornment}
                  </InputAdornment>
                  : props.InputProps?.startAdornment
              ),
              endAdornment: (
                startAdornment ?
                  <InputAdornment position="end">
                    {endAdornment}
                  </InputAdornment>
                  : props.InputProps?.endAdornment
              )
            }}
          >
            {
              !selectItems &&
              <MenuItem key={"NoItemsKey"} disabled value="">
                <em>No items</em>
              </MenuItem>
            }
            {
              selectItems &&
              selectItems.placeholder &&
              <MenuItem key={"PlaceholderKey"} disabled={selectItems.placeholder.disabled} value=" ">
                <em>{selectItems.placeholder.label}</em>
              </MenuItem>
            }
            {
              selectItems &&
              selectItems.items.map((item: menuItems) => (
                <MenuItem key={item.key} value={item.value} disabled={item.disabled} selected={item.selected}>
                  {item.label}
                </MenuItem>
              ))
            }
          </TextField>
        );
      }}
    />
  );
};

SelectInputController.defaultProps = {
  variant: "outlined"
};

export default SelectInputController;