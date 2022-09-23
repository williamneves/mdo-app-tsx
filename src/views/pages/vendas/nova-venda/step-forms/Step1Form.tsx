import React, { SetStateAction, useState, useEffect } from "react";

// ** Third Party Imports
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

const moment = require("moment");
import "moment-timezone";

// ** Import Context and Queries
import { useAuth } from "src/hooks/useAuth";
import { Grid, Typography, Button } from "@mui/material";
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";
import SelectInputController from "components/inputs/SelectInputController";
import * as clientsQ from "src/queries/clients";
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled";

import FallbackSpinner from "src/@core/components/spinner";


interface Step1FormProps {
  setHasErrors: (value: boolean) => void;
  handleNext: () => void;
  handleBack: () => void;
  onSubmit: (value: any) => void;
  setSaleObject: (value: any) => void;
  steps: Array<{ title: string, subtitle:string }>;
  resetAll: boolean;
}

const Step1Form = (props: Step1FormProps) => {

  // ** Props and States
  const { setHasErrors, handleNext, handleBack, onSubmit, setSaleObject, steps, resetAll } = props;
  const { user: userDB, selectedStore } = useAuth();
  const {data: allClients, isLoading: loadingClients} = clientsQ.useGetClientsByReferenceIdQuery({ referenceId: userDB!._id }, {active: !!userDB, placeholderData: []});

  // ** Hook Form Dependencies
  // ** Defaults Values - Step 1
  const step1DefaultValue = {
    saleNumber: "",
    PDVNumber: "",
    // New date in timezone Brazil/East using ISO
    date: moment().tz("America/Sao_Paulo"),
    client: {
      name: ""
    },
    vendor: {
      name: ""
    },
    store: {
      name: ""
    }
  };

  // ** Schema Validation - Step 1
  const step1Schema = yup.object().shape({
    saleNumber: yup.number().required("Obrigatório").nullable(),
    PDVNumber: yup.string().required("Obrigatório"),
    date: yup.date().nullable().required("Obrigatória"),
    client: yup
      .object()
      .shape({
        name: yup.string().nullable().required("Obrigatório")
      })
      .nullable()
      .required("Cliente é obrigatório"),
    vendor: yup
      .object()
      .shape({
        name: yup.string().nullable().required("Obrigatório")
      })
      .nullable()
      .required("Obrigatório"),
    store: yup
      .object()
      .shape({
        name: yup.string().required("*")
      })
      .nullable()
      .required("Obrigatório")
  });


  // Form Hook
  const {
    reset: resetStep1,
    control: controlStep1,
    handleSubmit: handleSubmitStep1,
    setValue: setValueStep1,
    getValues: getValuesStep1,
    clearErrors: clearErrorsStep1,
    watch: watchStep1,
    formState: {
      errors: errorsStep1,
      isValid: isValidStep1,
      submitCount: submitCountStep1
    }
  } = useForm({
    defaultValues: step1DefaultValue,
    resolver: yupResolver(step1Schema),
    mode: "onSubmit"
  });

  // if (loadingClients) return <FallbackSpinner />;

  return (
    <form key={0} id={"formStep1"} onSubmit={handleSubmitStep1(onSubmit)}>
      <Grid container spacing={5}>
        {/* Step Title */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {steps[0].title}
          </Typography>
          <Typography variant="caption" component="p">
            {steps[0].subtitle}
          </Typography>
        </Grid>

        {/* Step 1 Fields */}

        {/* saleNumber */}
        <Grid item xs={12} sm={6}>
          <TextInputControlled name={"saleNumber"} label={'Número da venda (Gerado automaticamente)'} errors={errorsStep1} control={controlStep1} />
        </Grid>

        {/* PDVNumber */}
        <Grid item xs={12} sm={6}>
          <TextInputControlled name={"PDVNumber"} label={'Numero no P.D.V.'} errors={errorsStep1} control={controlStep1} />
        </Grid>

        {/* date */}
        <Grid item xs={12} sm={6}>
          <DateInputControlled name={'date'} control={controlStep1} label={'Data da Venda'} errors={errorsStep1} />
        </Grid>

        {/* client */}
        <Grid item xs={12} sm={6}>
          <AutocompleteInputControlled
            name={'client'}
            control={controlStep1}
            label={'Cliente'}
            optionLabel={"name"}
            errors={errorsStep1}
            options={allClients}
            filterKeys={['name', 'phone', 'clientNumber']}
          />
        </Grid>

        {/* vendor */}
        <Grid item xs={12} sm={6}>
          <AutocompleteInputControlled
            name={'vendor'}
            control={controlStep1}
            label={'Vendedor'}
            optionLabel={"name"}
            errors={errorsStep1}
            options={selectedStore?.employees}
            loading={!!selectedStore}
          />

        </Grid>

        {/* store */}
        <Grid item xs={12} sm={6}>
          <SelectInputController
            name={"store"}
            label={"Loja"}
            control={controlStep1}
            errors={errorsStep1}
            selectItems={{
              items: userDB!.stores.map((store) => {
                return {
                  value: store,
                  label: store.name,
                  key: store._id,
                  selected: store._id === selectedStore?._id
                }
              }),
            }}
          />
        </Grid>

        {/*  Next Step Section */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem"
          }}
        >
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            disabled
          >
            Voltar
          </Button>
          <Button size="large" type="submit" variant="contained">
            Próximo
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Step1Form;