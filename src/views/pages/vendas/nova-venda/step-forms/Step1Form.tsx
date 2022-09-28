import React, { useState, useEffect } from "react";

// ** Third Party Imports
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

const moment = require("moment");
import "moment-timezone";

// ** Import Context and Queries
import { useAuth } from "src/hooks/useAuth";
import { Grid, Typography, Button } from "@mui/material";
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";
import * as clientsQ from "src/queries/clients";
import * as salesQ from "src/queries/sales";
import * as salesHooks from "src/queries/sales/hooks";
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";


interface Step1FormProps {
  setHasErrors: (value: boolean) => void;
  handleNext: () => void;
  handleBack: () => void;
  onSubmit: (value: any) => void;
  setSaleObject: (value: any) => void;
  steps: Array<{ title: string, subtitle: string }>;
  resetAll: boolean;
}

import { getAllObjectKeys, filterListByKeyValue } from "src/@core/utils/filters";
import NewClientModal from "./NewClientModal";

const Step1Form = (props: Step1FormProps) => {

  // ** Props and States
  const { setHasErrors, handleNext, handleBack, onSubmit, setSaleObject, steps, resetAll } = props;
  const { user: userDB, selectedStore } = useAuth();
  const {
    data: allClients,
  } = clientsQ.useGetClientsByReferenceIdQuery({ referenceId: selectedStore!._id }, {
    active: !!userDB,
    placeholderData: []
  });
  const { data: saleNumber, isLoading: loadingSaleNumber } = salesQ.useGetSaleNumberQuery();

  const [newClientDialogOpen, setNewClientDialogOpen] = useState<boolean>(false);

  // ** Hook Form Dependencies
  // ** Defaults Values - Step 1
  const step1DefaultValue = {
    saleNumber: "Gerando...",
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
    saleNumber: yup.number().required("Obrigatório").typeError("Obrigatório").nullable(),
    PDVNumber: yup.string()
      .required("Obrigatório")
      .min(4, "Número do PDV inválido")
      .test("Validate PDVNumber", "Número já cadastrado", async (value): Promise<boolean> => {
        if (value && value.length > 3) return salesHooks.validatePDVNumber(parseInt(value));
        return true;
      }),
    date: yup.date().nullable().required("Obrigatória"),
    client: yup
      .object()
      .shape({
        name: yup.string()
          .required("Obrigatório")
          .nullable()
      })
      .required("Cliente é obrigatório")
      .nullable(),
    vendor: yup
      .object()
      .shape({
        name: yup.string().nullable().required("Obrigatório")
      })
      .required("Obrigatório")
      .nullable(),
    store: yup
      .object()
      .shape({
        name: yup.string().required("*")
      })
      .required("Obrigatório")
      .nullable()
  });


  // Form Hook
  const {
    reset: resetStep1,
    control: controlStep1,
    handleSubmit: handleSubmitStep1,
    setValue: setValueStep1,
    setError: setErrorStep1,
    getValues: getValuesStep1,
    clearErrors: clearErrorsStep1,
    watch: watchStep1,
    formState: {
      errors: errorsStep1,
      isValid: isValidStep1,
      isDirty: isDirtyStep1,
      submitCount: submitCountStep1
    }
  } = useForm({
    defaultValues: step1DefaultValue,
    resolver: yupResolver(step1Schema),
    mode: "onSubmit"
  });

  // Effects

  // ** Set Sale Number
  useEffect(() => {
    if (!loadingSaleNumber) {
      // @ts-ignore
      setValueStep1("saleNumber", saleNumber);
    }
  }, [loadingSaleNumber]);

  // ** Set the Client if there is only one
  useEffect(() => {
    // Set only one client
    if (allClients!.length === 1) {
      setValueStep1("client", allClients![0]);
    }
  }, [allClients!.length === 1]);

  // ** Set Vendor if user is vendor
  useEffect(() => {
    // Set selected vendor
    if (userDB?.role === "vendor") {
      setValueStep1("vendor", userDB);
    }
  }, [userDB?.role]);

  // ** Set Store
  useEffect(() => {
    setValueStep1("store", selectedStore!);
  }, [selectedStore!._id]);

  // ** Set Validation Step
  useEffect(() => {
    if (isDirtyStep1 && submitCountStep1 > 0 && !isValidStep1) {
      setHasErrors(!isValidStep1);
    }
  }, [isValidStep1, submitCountStep1, isDirtyStep1]);


  return (
    <>
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
            <TextInputControlled
              name={"saleNumber"}
              label={"Número da venda (Gerado automaticamente)"}
              errors={errorsStep1}
              control={controlStep1}
              disabled={true}
            />
          </Grid>

          {/* PDVNumber */}
          <Grid item xs={12} sm={6}>
            <TextInputControlled
              name={"PDVNumber"}
              label={"Numero no P.D.V."}
              errors={errorsStep1}
              control={controlStep1}
            />
          </Grid>

          {/* date */}
          <Grid item xs={12} sm={6}>
            <DateInputControlled
              name={"date"}
              control={controlStep1}
              label={"Data da Venda"}
              errors={errorsStep1}
            />
          </Grid>

          {/* client */}
          <Grid item xs={12} sm={6}>
            <AutocompleteInputControlled
              name={"client"}
              control={controlStep1}
              label={"Cliente"}
              optionLabel={"name"}
              errors={errorsStep1}
              options={allClients}
              disabled={allClients?.length === 1}
              filterKeys={allClients?.length !== 0 && getAllObjectKeys(allClients)}
              noOptionsText={
                <Button
                  variant="outlined"
                  endIcon={<PersonAddAltTwoToneIcon />}
                  onClick={(): void => setNewClientDialogOpen(true)}
                >
                  Criar Novo Cliente
                </Button>
              }
            />
          </Grid>


          {/* vendor */}
          <Grid item xs={12} sm={6}>
            <AutocompleteInputControlled
              name={"vendor"}
              control={controlStep1}
              label={"Vendedor"}
              optionLabel={"name"}
              errors={errorsStep1}
              options={filterListByKeyValue(selectedStore?.employees, "role", "vendor")}
              loading={!Boolean(selectedStore)}
              disabled={userDB?.role === "vendor"}
              filterKeys={getAllObjectKeys(selectedStore?.employees)}
            />

          </Grid>

          {/* store */}
          <Grid item xs={12} sm={6}>
            <AutocompleteInputControlled
              name={"store"}
              control={controlStep1}
              label={"Loja"}
              optionLabel={"name"}
              errors={errorsStep1}
              options={userDB?.stores}
              loading={!Boolean(userDB?.stores)}
              filterKeys={getAllObjectKeys(userDB?.stores)}
              disabled={userDB?.stores.length === 1 || userDB?.role !== "admin"}
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
              startIcon={<ChevronLeftIcon />}
              disabled
            >
              Voltar
            </Button>
            <Button size="large" endIcon={<ChevronRightIcon />} type="submit" variant="contained" form={"formStep1"}>
              Próximo
            </Button>
          </Grid>
        </Grid>
      </form>
      <NewClientModal
        isOpen={newClientDialogOpen}
        onClose={() => setNewClientDialogOpen(false)}
        clientList={allClients && allClients.length > 0 ? allClients : []}
        setNewClient={setValueStep1}
      />
    </>
  );
};

export default Step1Form;