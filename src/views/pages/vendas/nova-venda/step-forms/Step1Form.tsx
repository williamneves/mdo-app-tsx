// ** React Imports
import React, {useState, useEffect, Fragment} from "react"

// ** Third Party Imports
import * as yup from "yup"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import toast from "react-hot-toast"

import moment from "moment"
import "moment-timezone"

// ** MUI Imports
import {Grid, Typography, Button} from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import RestartAltIcon from "@mui/icons-material/RestartAlt"

// ** Import Components
import TextInputControlled from "components/inputs/TextInputControlled"
import DateInputControlled from "components/inputs/DateInputControlled"
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled"
import NewClientModal from "./NewClientModal"

// ** Import Context and Queries
import {useAuth} from "src/hooks/useAuth"
import * as clientsQ from "src/queries/clients"
import * as salesQ from "src/queries/sales"
import * as salesHooks from "src/queries/sales/hooks"

// ** Import Hooks
import {getAllObjectKeys, filterListByKeyValue} from "src/@utils/filters"

// ** Rendered Element
// Interface for Step2FormProps
interface Step1FormProps {
  setHasErrors: (value: boolean) => void
  handleNext: () => void
  handleBack: () => void
  onSubmit: (value: any) => void
  setSaleObject: (value: any) => void
  steps: Array<{title: string; subtitle: string}>
  step1Data: any
  setStep1Data: (value: any) => void
  mode?: "create" | "edit"
}

// Rendered Element
const Step1Form = (props: Step1FormProps) => {
  // ** Props and States
  const {setHasErrors, onSubmit, steps, step1Data, mode} = props
  const {user: userDB, selectedStore} = useAuth()
  const {data: allClients} = clientsQ.useGetClientsByReferenceIdQuery(
    {referenceId: selectedStore!._id},
    {
      active: !!userDB,
      placeholderData: []
    }
  )
  const {
    data: saleNumber,
    isLoading: loadingSaleNumber,
    refetch: refetchSaleNumber
  } = salesQ.useGetSaleNumberQuery()

  const [newClientDialogOpen, setNewClientDialogOpen] = useState<boolean>(false)

  // ** Hook Form Dependencies
  // ** Defaults Values - Step 1
  const step1DefaultValue = {
    saleNumber: "Gerando...",
    PDVNumber: "",
    // New date in timezone Brazil/East using ISO
    date: moment().tz("America/Belem"),
    client: {
      name: ""
    },
    vendor: {
      name: ""
    },
    store: {
      name: ""
    }
  }

  // ** Schema Validation - Step 1
  const step1Schema = yup.object().shape({
    saleNumber: yup
      .number()
      .required("Obrigatório")
      .typeError("Obrigatório")
      .nullable(),
    PDVNumber: yup
      .string()
      .required("Obrigatório")
      .min(4, "Número do PDV inválido")
      .test(
        "Validate PDVNumber",
        "Número já cadastrado",
        async (value): Promise<boolean> => {
          if (mode === "edit" && value === step1Data.PDVNumber) return true
          if (value && value.length > 3)
            return salesHooks.validatePDVNumber(value)
          return true
        }
      ),
    date: yup.date().nullable().required("Obrigatória"),
    client: yup
      .object()
      .shape({
        name: yup.string().required("Obrigatório").nullable()
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
  })

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
    defaultValues: step1Data || step1DefaultValue,
    resolver: yupResolver(step1Schema),
    mode: "onSubmit"
  })

  // Effects
  // ** Reset Form
  useEffect(() => {
    if (step1Data === null) {
      resetStep1()
      clearErrorsStep1()
      if (getValuesStep1("saleNumber") === "Gerando...") {
        refetchSaleNumber().then(res => {
          setValueStep1("saleNumber", res.data)
        })
      }
    }
  }, [step1Data])

  // ** Set Sale Number
  useEffect(() => {
    if (mode === "edit") {
      setValueStep1("saleNumber", step1Data.saleNumber)
      return
    }

    if (!loadingSaleNumber && mode === "create") {
      // @ts-ignore
      setValueStep1("saleNumber", saleNumber)
    }
  }, [loadingSaleNumber, saleNumber, mode])

  // Watch PDVNumber and transform to uppercase
  useEffect(() => {
    if (watchStep1("PDVNumber")) {
      setValueStep1("PDVNumber", watchStep1("PDVNumber").toUpperCase())
    }
  }, [watchStep1("PDVNumber")])

  // ** Set the Client if there is only one
  useEffect(() => {
    // Set only one client
    if (allClients!.length === 1) {
      setValueStep1("client", allClients![0])
    }
  }, [allClients!.length === 1])

  // ** Set Vendor if user is vendor
  useEffect(() => {
    // Set selected vendor
    if (userDB?.role === "vendor") {
      setValueStep1("vendor", userDB)
    }
  }, [userDB?.role])

  // ** Set Store
  useEffect(() => {
    setValueStep1("store", selectedStore!)
  }, [selectedStore!._id])

  // ** Set Validation Step
  useEffect(() => {
    if (!isValidStep1 && submitCountStep1 > 0) {
      toast.error("Verifique os campos obrigatórios")
      setHasErrors(!isValidStep1)
    }
  }, [isValidStep1, submitCountStep1, isDirtyStep1])

  //
  // useEffect(() => {
  //   console.log(isValidStep1);
  //   console.log(errorsStep1);
  // }, [errorsStep1, isValidStep1]);

  return (
    <Fragment>
      <form key={0} id={"formStep1"} onSubmit={handleSubmitStep1(onSubmit)}>
        <Grid container spacing={5}>
          {/* Step Title */}
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{fontWeight: 600, color: "text.primary"}}
            >
              {steps[0].title}
            </Typography>
            <Typography variant="caption" component="p">
              {steps[0].subtitle}
            </Typography>
          </Grid>

          {/* Edit Mode Alert */}
          {mode === "edit" && (
            <Grid item xs={12}>
              <Alert severity="info">
                <AlertTitle>Modo de edição</AlertTitle>
                <Typography variant="body2">
                  <strong>Atenção:</strong> Alterações feitas aqui afetarão a
                  venda original.
                </Typography>
                <Typography variant="body2">
                  Somente alguns campos podem ser editados.
                </Typography>
              </Alert>
            </Grid>
          )}

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
              // disabled={allClients?.length === 1}
              filterKeys={
                allClients?.length !== 0 && getAllObjectKeys(allClients)
              }
              noOptionsText={
                <Fragment>
                  <Typography
                    variant="body2"
                    sx={{fontWeight: 600, paddingBottom: 3}}
                  >
                    Nenhum cliente encontrado
                  </Typography>
                  <Button
                    variant="text"
                    endIcon={<PersonAddAltTwoToneIcon />}
                    onClick={(): void => setNewClientDialogOpen(true)}
                  >
                    Criar Novo Cliente
                  </Button>
                </Fragment>
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
              options={filterListByKeyValue(
                selectedStore?.employees,
                "role",
                "vendor"
              )}
              loading={!selectedStore}
              disabled={userDB?.role === "vendor" || mode === "edit"}
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
              loading={!userDB?.stores}
              filterKeys={getAllObjectKeys(userDB?.stores)}
              disabled={
                userDB?.stores.length === 1 ||
                userDB?.role !== "admin" ||
                mode === "edit"
              }
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
            {mode === "edit" && (
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                endIcon={<RestartAltIcon />}
                onClick={() => resetStep1()}
              >
                Desfazer
              </Button>
            )}
            <Button
              size="large"
              endIcon={<ChevronRightIcon />}
              type="submit"
              variant="contained"
              form={"formStep1"}
            >
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
    </Fragment>
  )
}

export default Step1Form
