import {
  FieldErrors
} from "react-hook-form";
import { Autocomplete,  TextField } from "@mui/material";

// ** Import Sorters
import { matchSorter } from "match-sorter";
// @ts-ignore
import parse from "autosuggest-highlight/parse";
// @ts-ignore
import match from "autosuggest-highlight/match";

import { InputController } from "./InputController";

interface AutocompleteInputControlledProps {
  name: string;
  control: any;
  errors: FieldErrors;
  options: Array<any>;
  filterKeys: Array<string>;
  optionLabel?: string;
}

export const AutocompleteInputControlled = (props: AutocompleteInputControlledProps | any) => {

  const filterOptions = (options: Array<any>, inputValue: string, filterKeys: Array<string>) =>
    matchSorter(options, inputValue, { keys: filterKeys });

  const {
    name,
    control,
    errors,
    options,
    filterKeys,
    optionLabel,
    ...rest
  } = props;

  return (
    //@ts-ignore
    <InputController
      name={name}
      control={control}
      errors={errors}
      render={({ field: { value, onChange }, fieldState: { invalid } }) => {
        return (
          <Autocomplete
            {...rest}
            value={value}
            onChange={(event, value) => {
              onChange(value);
              return value;
            }}
            options={options}
            isOptionEqualToValue={(option: any, value: any) => option[optionLabel] === value[optionLabel]}
            filterOptions={filterKeys ? (options, { inputValue }) => filterOptions(options, inputValue, filterKeys) : props.filterOptions}
            groupBy={(option: any) => option[optionLabel][0]?.toUpperCase()}
            getOptionLabel={!!optionLabel ? (option: string) => option[optionLabel] : props.getOptionLabel}
            renderOption={(props, option: any, { inputValue }) => {

              const matchs = match(option[optionLabel], inputValue);
              const parses = parse(option[optionLabel], matchs);

              return (
                <li {...props} key={option._id}>
                  {
                    parses.map((part: any, index: number) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))
                  }
                </li>
              );
            }}
            renderInput={(params) =>
              <TextField
                {...params}
                label={props.label}
                placeholder={props.placeholder || props.label}
                error={invalid}
              />}
          />
        );
      }}
    />
  );
};

export default AutocompleteInputControlled;