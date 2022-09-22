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

const Home = () => {

  const DefaultValues = {
    TextInput: "",
    NumericMaskInput: 0,
    selectInput: "",
  }

  interface FormValues {
    TextInput: string;
    NumericMaskInput: number;
    selectInput: string;
  }

  const schema = yup.object().shape({
    TextInput: yup.string().required('Text is required'),
    NumericMaskInput: yup.number().required('Number is required'),
    selectInput: yup.string().required('Select is required'),
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
                      disabled={true}
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
                    <SelectInputController
                      name={"selectInput"}
                      control={control}
                      label={"Select Input"}
                      errors={errors}
                      selectItems={{
                        placeholder: {
                          disabled: true,
                          label: "Selecione uma opção"
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
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
