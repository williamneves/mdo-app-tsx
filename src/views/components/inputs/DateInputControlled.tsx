import { InputController } from "./InputController";
import { FieldErrors } from "react-hook-form";

import { TextField } from "@mui/material";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { MobileDatePicker, MobileDatePickerProps } from "@mui/lab/";
import ptBR from "date-fns/locale/pt-BR";
import { Locale } from "date-fns";

const LangObj: { [key: string]: Locale } = { ptBR };

interface DatePickerProps extends Pick<MobileDatePickerProps, "disabled"> {
  name: string;
  control: any;
  label: string;
  errors: FieldErrors;
}

const DatePickerInputControlled = (props: DatePickerProps) => {

  const {
    name,
    control,
    errors,
    label,
    ...rest
  } = props;

  return (
    // @ts-ignore
    <InputController
      name={name}
      control={control}
      errors={errors}
      render={({ field: { value, onChange }, fieldState: { invalid } }) => (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          locale={LangObj['ptBR']}
        >
          <MobileDatePicker
            {...rest}
            label={label}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={invalid}
              />
            )}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default DatePickerInputControlled;