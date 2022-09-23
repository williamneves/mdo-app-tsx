// ** React Imports
import React, { Fragment, useEffect, useState } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// ** MUI Icons Imports
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

// ** Hooks
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";
import * as useClient from "src/queries/clients";
import { useQueryClient } from "@tanstack/react-query";
import * as useClientHook from "src/queries/clients/hooks/useClient";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import toast from "react-hot-toast";

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled";
import SelectInputController, { SelectItems } from "components/inputs/SelectInputController";

// ** Types
import Client from "src/interfaces/Client";
import PatternInputControlled from "components/inputs/PatternInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";

interface Props {
  client?: Client;
}

const clientForm = ({ client }: Props) => {

  const { user, selectedStore } = useAuth();

  // React Query
  const queryClient = useQueryClient();
  const createClient = useClient.useCreateClientQuery(queryClient);
  const updateClient = useClient.useUpdateClientQuery(queryClient);
  const { isLoading } = createClient;

  interface DefaultValues extends Omit<Client, 'clientNumber'| 'birthday'| 'gender' | '_createdAt' | '_updatedAt' > {
    clientNumber?: number | null,
    birthday?: Date | null,
    gender?: 'male' | 'female' | 'other' | "",
  }

  const defaultValue:DefaultValues = {
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
    phone: yup.string(),
    email: yup.string().email("Email inválido"),
    birthday: yup.date().nullable(),
    gender: yup.string(),
    cpf: yup.string(),
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
      name: yup.string().required("Esse campo é obrigatório *")
    }),
    createdBy: yup.object().shape({
      name: yup.string(),
      _id: yup.string()
    })
  });

  const [clientsNumber, setClientsNumber] = useState(0);

  // Effects
  useEffect(() => {
    if (user && !client) setValue("createdBy", user);
  }, [user, clientsNumber]);

  useEffect(() => {
    if (getValues("clientNumber") === null) {
      useClientHook.increaseClientCode()
        .then((data) => {
          setValue("clientNumber", data.clientNumber);
        });
    }
  }, [clientsNumber]);

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

  const onSubmit = async (data: any) => {

    const toastId = toast.loading(client ? "Editando cliente..." : "Salvando cliente...");

    try {
      if (client) await updateClient.mutateAsync(data);
      else await createClient.mutateAsync(data);
      toast.success(`Cliente ${client ?
          `#${client?.clientNumber} editado` : "criado"} com sucesso!`,
        { id: toastId, position: "top-center" });
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

  const storesInSelect2 = () => {
    if (client) return user!.stores.map((store) => ({ key: store._id, value: store, label: store.name }))

    if (user?.role === "admin") return user!.stores.map((store) => ({key: store._id, value: store, label: store.name }))

    return [{ key: selectedStore!._id, value: selectedStore, label: selectedStore?.name, selected: true }];
  }

  const storesInSelect = client
    ? user!.stores.map((store) => ({ key: store._id, value: store, label: store.name }))
    : user?.role === "admin"
      ? user!.stores.map((store) => ({key: store._id, value: store, label: store.name }))
      : [{ key: selectedStore?._id, value: selectedStore, label: selectedStore?.name, selected: true }];

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
                  client ?
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
                    : null
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
                  <TextInputControlled
                    name={"address.street"}
                    label={"Rua"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
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
                    label={"Cidade"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"address.state"}
                    label={"Estado"}
                    control={control}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PatternInputControlled
                    name={"address.zipCode"}
                    control={control}
                    label={"CEP"}
                    patternType={"cep"}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectInputController
                    name={"store"}
                    label={"Loja"}
                    control={control}
                    errors={errors}
                    disabled={user?.role !== "admin" || isLoading}
                    selectItems={
                      {
                        items: storesInSelect2()
                      }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider variant={"middle"} />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex" }}>
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