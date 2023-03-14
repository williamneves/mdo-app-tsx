// ** React Imports
import { Fragment, useState, useEffect } from "react"
import SelectInputController from "components/inputs/SelectInputController"
import TextInputControlled from "components/inputs/TextInputControlled"
import PatternInputControlled from "components/inputs/PatternInputControlled"

// ** MUI Imports
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import LoadingButton from "@mui/lab/LoadingButton"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import DialogContentText from "@mui/material/DialogContentText"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"

// ** MUI Imports Icons
import GroupAddTwoToneIcon from "@mui/icons-material/GroupAddTwoTone"
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone"
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone"

// ** Third Party Imports
import * as yup from "yup"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { validateCPF, validatePhone } from "validations-br"

// ** Import Hooks
import { useAuth } from "src/hooks/useAuth"
import { verifyDuplicatedName } from "src/@utils/verifyDuplicatedName"

// Import Interfaces
import { useQueryClient } from "@tanstack/react-query"
import Client from "src/interfaces/Client"

// ** Import Api
import * as clientsQ from "src/queries/clients"
import * as clientsHooks from "src/queries/clients/hooks/useClient"

// Interface
interface NewClientModalProps {
  isOpen: boolean
  onClose: () => void
  clientList: Array<Client>
  setNewClient?: any
}

const NewClientModal = ({
  isOpen,
  onClose: handleClose,
  clientList,
  setNewClient
}: NewClientModalProps) => {
  // ** State
  const [verifyIfNameAreDuplicated, setSaveDuplicatedName] =
    useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  // ** Api
  const queryClient = useQueryClient()
  const createNewClient = clientsQ.useCreateClientQuery(queryClient)

  // ** Context
  const { selectedStore, user: userDB } = useAuth()

  // ** Hook Form
  /// *** Form Schema
  const newClientSchema = yup.object().shape({
    name: yup
      .string()
      .nullable()
      .required("O nome é obrigatório")
      .test("duplicatedName", "Nome já cadastrado", value => {
        if (value === "") return true
        if (value && verifyIfNameAreDuplicated) {
          const { status } = verifyDuplicatedName(value, clientList)

          if (status)
            toast(
              "Esse nome é uma provável duplicação...! Para continuar, desmarque a opção de validação...",
              {
                icon: "🚨",
                duration: 5000,
                position: "top-center"
              }
            )

          return !status
        }
        return true
      }),
    phone: yup
      .string()
      .nullable()
      //@ts-ignore
      .test("phone", "Número Inválido", (value: string): boolean => {
        if (value === "") return true
        return validatePhone(value)
      }),
    email: yup.string().nullable().email("Insira um e-mail válido"),
    gender: yup.string().nullable(),
    cpf: yup
      .string()
      .nullable()
      //@ts-ignore
      .test("cpf", "Insira um CPF válido", (value: string): boolean => {
        if (value === "") return true
        return validateCPF(value)
      })
      .test("duplicatedCPF", "CPF já cadastrado", async (value: any) => {
        if (value === "") return true
        if (value.length === 11) {
          const isUnique = await clientsHooks.cpfIsUnique(value)

          if (!isUnique)
            toast("Esse CPF já está registrado no sistema!", {
              icon: "🚨",
              duration: 5000,
              position: "top-center"
            })

          return isUnique
        }
        return true
      })
  })

  /// *** Form Defaults
  const newClientDefaultValues: Partial<Client> = {
    name: "",
    phone: "",
    email: "",
    gender: "",
    cpf: "",
    store: selectedStore,
    createdBy: userDB
  }

  // *** Form Hook
  const {
    reset,
    control,
    handleSubmit,
    getFieldState,
    formState,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues: newClientDefaultValues,
    resolver: yupResolver(newClientSchema),
    mode: "onChange"
  })

  const nameFieldState = getFieldState("name", formState)

  // ** Functions
  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true)
      const dataNew = await createNewClient.mutateAsync(data)
      setNewClient("client", dataNew)
      handleClose()
      reset()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (verifyIfNameAreDuplicated) trigger("name") // trigger validation;
  }, [verifyIfNameAreDuplicated])

  useEffect(() => {
    if (errors?.name?.type === "duplicatedName") {
      console.log("duplicatedName")
    }
  }, [errors, nameFieldState])

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={() => {}}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle
          id='form-dialog-title'
          sx={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            color: "primary.main"
          }}
        >
          <GroupAddTwoToneIcon />
          Criar novo Cliente
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant={"subtitle2"} sx={{ mb: 5 }}>
            Use esse formulário para adicionar rapidamente um cliente para a
            venda. Serão precisas poucas informações, após isso, aperte em{" "}
            <b>CRIAR</b> e volte para a venda.
          </DialogContentText>
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            id={"New-Client-Form"}
          >
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TextInputControlled
                  name={"name"}
                  label={"Nome"}
                  control={control}
                  errors={errors}
                  required={true}
                />
                <Grid item container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingY: 0,
                      justifyContent: "flex-end",
                      display: "flex"
                    }}
                  >
                    <FormControlLabel
                      label='Verificar Duplicidade do Nome'
                      labelPlacement='start'
                      control={
                        <Checkbox
                          size='small'
                          checked={verifyIfNameAreDuplicated}
                          onChange={e =>
                            setSaveDuplicatedName(e.target.checked)
                          }
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInputControlled
                  name={"email"}
                  label={"Email"}
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PatternInputControlled
                  name={"phone"}
                  control={control}
                  label={"Celular"}
                  patternType={"phone"}
                  errors={errors}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectInputController
                  name={"gender"}
                  label={"Sexo"}
                  control={control}
                  errors={errors}
                  selectItems={{
                    items: [
                      { key: "male", value: "male", label: "Masculino" },
                      { key: "female", value: "female", label: "Feminino" },
                      { key: "other", value: "other", label: "Outros" }
                    ]
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <PatternInputControlled
                  name={"cpf"}
                  control={control}
                  label={"CPF"}
                  patternType={"cpf"}
                  errors={errors}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions className='dialog-actions-normal'>
          <Button
            endIcon={<CloseTwoToneIcon />}
            color={"secondary"}
            variant={"outlined"}
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant={"contained"}
            type='submit'
            form={"New-Client-Form"}
            loading={loading}
            loadingPosition='end'
            endIcon={<PersonAddAltTwoToneIcon />}
          >
            {loading ? "Criando..." : "Criar"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default NewClientModal
