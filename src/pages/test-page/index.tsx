// ** MUI Imports
import React, {useEffect} from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/lab/LoadingButton";

// ** Component Imports
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import TextInputControlled from "src/views/components/inputs/TextInputControlled";
import CurrencyMaskInputControlled from "src/views/components/inputs/CurrencyMaskInputControlled";
import SelectInputController from "src/views/components/inputs/SelectInputController";
import AutocompleteInputControlled from "src/views/components/inputs/AutocompleteInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";
import PatternInputControlled from "components/inputs/PatternInputControlled";


// ** Import Validate CPF
import { cpf } from 'cpf-cnpj-validator';


const Home = () => {

  const DefaultValues = {
    TextInput: "",
    NumericMaskInput: 0,
    selectInput: " ",
    AutoComplete: [{ _id: "", name: "", age: 0, phone: "" }],
    DateInput: null,
    cpfInput: "",
    phoneInput: "",
  }

  interface FormValues {
    TextInput: string;
    NumericMaskInput: number;
    selectInput: string;
    AutoComplete: any;
    DateInput: Date | null;
    cpfInput: string;
    phoneInput: string;
  }

  const schema = yup.object().shape({
    TextInput: yup.string().required('Text is required'),
    NumericMaskInput: yup.number().min(1, 'Number is required').required('Number is required'),
    selectInput: yup.string().trim().required('Select is required'),
    AutoComplete: yup.array().of(yup.object().shape({
      name: yup.string().required('Autocomplete is required'),
    })).required('AutoComplete is required').nullable(),
    DateInput: yup.date().required('Date is required').nullable(),
    cpfInput: yup.string().required('CPF is required').test('cpf', 'CPF is invalid', (value) => {
      return cpf.isValid(value as string);
    }),
    phoneInput: yup.string().required('Phone is required'),
  });

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>(
    {
      defaultValues: DefaultValues,
      resolver: yupResolver(schema)
    }
  );

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  useEffect(() => {
    console.log(getValues());
  }, []);


  const autoCompleteOptions = [
    { _id: "1", name: "John", age: 20, phone: "9549949940" },
    { _id: "2", name: "Marta", age: 21, phone: "3210022212" },
    { _id: "3", name: "Adam", age: 22, phone: "7861230022" },
    { _id: "4", name: "Sara", age: 23, phone: "9549949944" },
    { _id: "5", name: "John", age: 24, phone: "9549949945" },
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Testing all custom components from Project"></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input de Text</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                  <Grid item xs={4}>
                    <TextInputControlled
                      name={"TextInput"}
                      control={control}
                      label={"TextInput"}
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button type={"submit"} variant={"contained"}>Submit</Button>
                  </Grid>

                {/*</Grid>*/}
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input de Dinheiro</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                  <Grid item xs={4}>
                    <CurrencyMaskInputControlled
                      name={"NumericMaskInput"}
                      control={control}
                      label={"NumericMaskInput"}
                      errors={errors}
                      startAdornment={'R$'}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button type={"submit"} variant={"contained"}>Submit</Button>
                  </Grid>

                {/*</Grid>*/}
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input de Dinheiro</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                <Grid item xs={4}>
                  <PatternInputControlled
                    name={"cpfInput"}
                    control={control}
                    label={"CPF Input"}
                    patternType={"cpf"}
                    errors={errors}
                    startAdornment={'CPF'}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button type={"submit"} variant={"contained"}>Submit</Button>
                </Grid>

                {/*</Grid>*/}
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input de Dinheiro</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                  <Grid item xs={4}>
                    <SelectInputController
                      name={"selectInput"}
                      control={control}
                      label={"Select Input"}
                      errors={errors}
                      selectItems={{
                        placeholder: {
                          disabled: true,
                          label: "Selecione uma opção",
                        },
                        items: [{
                            key: 1,
                            label: "Item 1",
                            value: "Item 1"
                          }]
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button type={"submit"} variant={"contained"}>Submit</Button>
                  </Grid>

                {/*</Grid>*/}
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input de Dinheiro</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                  <Grid item xs={4}>
                    <AutocompleteInputControlled
                      multiple={true}
                      limitTags={3}
                      disableCloseOnSelect
                      name={"AutoComplete"}
                      control={control}
                      label={"Select Input"}
                      placeholder={"Selecione uma opção"}
                      errors={errors}
                      options={autoCompleteOptions}
                      optionLabel={"name"}
                      filterKeys={['name', 'age', 'phone']}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button type={"submit"} variant={"contained"}>Submit</Button>
                  </Grid>

                {/*</Grid>*/}
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input de Dinheiro</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                  <Grid item xs={4}>
                    <DateInputControlled
                      name={"DateInput"}
                      control={control}
                      label={"Date Input"}
                      errors={errors}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button type={"submit"} variant={"contained"}>Submit</Button>
                  </Grid>

                {/*</Grid>*/}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
