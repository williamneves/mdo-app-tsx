// ** MUI Imports
import React from "react";
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
import { TextInputControlled } from "components/inputs/TextInputControlled";

const Home = () => {

  interface FormValues {
    name: string;
  }

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>(
    {
      resolver: yupResolver(schema)
    }
  );

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Testing all custom components from Project"></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant={"h4"}>Input Controlled.</Typography>
            <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                  <Grid item xs={4}>
                    <TextInputControlled
                      name={"name"}
                      control={control}
                      label={"Name"}
                      placeholder={"Name"}
                      errors={errors}
                      startAdornment={"$"}
                      endAdornment={"$"}
                      // otherProps={{ variant: "outlined", size: "small" }}
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
