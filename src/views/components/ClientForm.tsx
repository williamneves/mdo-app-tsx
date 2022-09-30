// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// ** MUI Icons Imports
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ** Hooks
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";
import * as useClient from "src/queries/clients";
import { useQueryClient } from "@tanstack/react-query";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import toast from "react-hot-toast";
import { validateCPF, validatePhone } from "validations-br";
import cep from "cep-promise";

// ** Next Imports
import { useRouter } from "next/router";

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled";
import SelectInputController from "components/inputs/SelectInputController";
import DateInputControlled from "components/inputs/DateInputControlled";
import PatternInputControlled from "components/inputs/PatternInputControlled";
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled";

// ** Types
import Client from "src/interfaces/Client";

interface Props {
  client?: Client;
}

const clientForm = ({ client }: Props) => {

  const { user } = useAuth();
  const router = useRouter();

  // React Query
  const queryClient = useQueryClient();
  const createClient = useClient.useCreateClientQuery(queryClient);
  const updateClient = useClient.useUpdateClientQuery(queryClient);
  const { isLoading } = createClient;

  interface DefaultValues extends Omit<Client, "clientNumber" | "birthday" | "gender" | "_createdAt" | "_updatedAt"> {
    clientNumber?: number | null,
    birthday?: Date | null | "",
    gender?: "male" | "female" | "other" | "",
  }

  const defaultValue: DefaultValues = {
    _id: "",
    inactive: false,
    clientNumber: null,
    name: "",
    phone: "",
    email: "",
    birthday: null,
    gender: "",
    cpf: "",
    hearAboutUs: "",
    address: {
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      zipCode: ""
    },
    store: {
      name: ""
    },
    createdBy: {
      name: ""
    }
  };

  const schema = yup.object().shape({
    inactive: yup.boolean(),
    clientNumber: yup.number().nullable(),
    name: yup.string().required("Esse campo é obrigatório *"),
    phone: yup.string()
      .nullable()
      .test("phone", "Número Inválido", (value) => {
        if (value === "") return true;
        return validatePhone(value as string);
      }),
    email: yup.string().email("Email inválido"),
    birthday: yup.date().nullable(),
    gender: yup.string(),
    cpf: yup.string().test("cpf", "CPF Inválido", (value) => {
      if (value === "") return true;
      return validateCPF(value as string);
    }),
    hearAboutUs: yup.string(),
    address: yup.object().shape({
      street: yup.string(),
      number: yup.string(),
      complement: yup.string(),
      city: yup.string(),
      state: yup.string(),
      zipCode: yup.string()
    }),
    store: yup.object().shape({
      name: yup.string().required()
    }),
    createdBy: yup.object().shape({
      name: yup.string(),
      _id: yup.string()
    })
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm({
    defaultValues: client ? client : defaultValue,
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  // States
  const [clientsNumber, setClientsNumber] = useState(0);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Effects
  useEffect(() => {
    if (user && !client) setValue("createdBy", user);
  }, [user, clientsNumber]);

  const setAddressByCep = () => {
    setIsLoadingAddress(true);
    cep(getValues("address.zipCode"))
      .then((response) => {
        setTimeout(() => {
          setValue("address.street", response?.street || "");
          setValue("address.city", response?.city || "");
          setValue("address.state", response?.state || "");
          toast.success("CEP encontrado! Endereço carregado automaticamente", {
            duration: 4000,
            position: "top-center"
          });
          setIsLoadingAddress(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        toast.error("CEP não encontrado! preencha os campos de endereço manualmente", {
          duration: 4000,
          position: "top-center"
        });
        setIsLoadingAddress(false);
      });
  };

  const getAddressLabel = (fieldName: string) => isLoadingAddress ? "Buscando endereço..." : fieldName;

  const onSubmit = async (data: any) => {

    const toastId = toast.loading(client ? "Editando cliente..." : "Salvando cliente...");

    try {
      if (client) await updateClient.mutateAsync(data);
      else await createClient.mutateAsync(data);
      toast.success(`Cliente ${client ?
          `#${client?.clientNumber} editado` : "criado"} com sucesso!`,
        { id: toastId, position: "top-center" });
      if (client) router.push("/clientes/lista-de-clientes");
      reset();
      setClientsNumber(clientsNumber + 1);
    } catch (error) {
      console.log("error", error);
      toast.error("Não foi possível salvar, tente novamente ou fale com o suporte", {
        id: toastId,
        position: "top-center"
      });
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5" display={"flex"} alignItems={"center"} marginBottom={3} gap={2} px={5}>
          {
            client ?
              <Fragment>
                <ManageAccountsIcon sx={{ color: "primary.main", fontSize: 30 }} /> Editar Cliente
              </Fragment>
              :
              <Fragment>
                <PersonAddIcon sx={{ color: "primary.main", fontSize: 30 }} /> Cadastro de Cliente
              </Fragment>
          }
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Divider textAlign={"left"}>
                    <Typography variant={"h6"}>Informações Pessoais</Typography>
                  </Divider>
                </Grid>
                {
                  client &&
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name={"inactive"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <FormGroup row>
                            <FormControlLabel
                              label="O cliente está ativo?"
                              control={
                                <Switch
                                  disabled={isLoading}
                                  checked={!value}
                                  onChange={() => onChange(!value)}
                                />
                              }
                            />
                          </FormGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                }
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"name"}
                    label={"Nome"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                    required={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PatternInputControlled
                    name={"phone"}
                    control={control}
                    label={"Telefone"}
                    patternType={"phone"}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"email"}
                    label={"Email"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateInputControlled
                    name={"birthday"}
                    control={control}
                    label={"Data de Nascimento"}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectInputController
                    name={"gender"}
                    label={"Gênero"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                    selectItems={
                      {
                        items: [
                          { key: "male", value: "male", label: "Homem" },
                          { key: "male", value: "female", label: "Mulher" },
                          { key: "male", value: "other", label: "Outros" }
                        ]
                      }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PatternInputControlled
                    name={"cpf"}
                    control={control}
                    label={"CPF"}
                    patternType={"cpf"}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"hearAboutUs"}
                    label={"Como nos conheceu?"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Divider variant={"middle"} />
                <Grid item xs={12}>
                  <Divider textAlign={"left"}>
                    <Typography variant={"h6"}>Endereço</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PatternInputControlled
                    name={"address.zipCode"}
                    control={control}
                    label={"CEP"}
                    patternType={"cep"}
                    errors={errors}
                    disabled={isLoading}
                    onBlur={() => {
                      if ((getValues("address.zipCode") as string).length === 8) setAddressByCep();
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"address.street"}
                    label={getAddressLabel("Rua")}
                    control={control}
                    errors={errors}
                    disabled={isLoading || isLoadingAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"address.number"}
                    label={"Número"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"address.complement"}
                    label={"Complemento"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"address.city"}
                    label={getAddressLabel("Cidade")}
                    control={control}
                    errors={errors}
                    disabled={isLoading || isLoadingAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"address.state"}
                    label={getAddressLabel("Estado")}
                    control={control}
                    errors={errors}
                    disabled={isLoading || isLoadingAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AutocompleteInputControlled
                    name={"store"}
                    control={control}
                    label={"Loja"}
                    optionLabel={"name"}
                    errors={errors}
                    options={user?.stores}
                    loading={!Boolean(user?.stores)}
                    disabled={user?.stores.length === 1 || user?.role !== "admin" || isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider variant={"middle"} />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex" }}>
                  {
                    client &&
                    <Button
                      variant={"outlined"}
                      onClick={() => history.back()}
                    >
                      <ArrowBackIcon sx={{ mr: 2 }} />
                      Voltar
                    </Button>
                  }
                  <LoadingButton
                    loading={isLoading}
                    type={"submit"}
                    variant={"contained"}
                    sx={{ marginLeft: "auto" }}
                  >
                    <SaveAltIcon sx={{ marginRight: 1 }} />
                    Salvar
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default clientForm;