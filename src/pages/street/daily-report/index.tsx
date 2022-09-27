// ** React Imports
import { useEffect } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";

// ** MUI Icons
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";

// ** Hooks
import { useForm } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";

const StreetDailyReport = () => {

  const { user } = useAuth();

  const defaultValue = {
    date: Date.now(),
    clientsApproached: "",
    scheduledAppointments: "",
    activityReport: "",
    clientsRegistered: 0,
    sales: 0,
    street: {
      name: ""
    }
  };

  const schema = yup.object().shape({
    date: yup.date().required("Este campo é obrigatório"),
    clientsApproached: yup.number().required("Este campo é obrigatório"),
    clientsRegistered: yup.number().required("Este campo é obrigatório"),
    activityReport: yup.string(),
    sales: yup.array().of(yup.object().shape({
      _id: yup.string().required(),
      saleNumber: yup.number()
    })),
    scheduledAppointments: yup.number().required("Este campo é obrigatório"),
    user: yup.object().shape({
      _id: yup.string().required(),
      name: yup.string().required()
    }),
    store: yup.object().shape({
      _id: yup.string().required(),
      name: yup.string().required()
    })
  });

  // Effects
  useEffect(() => {
    if (user) setValue("street", user);
  }, [user]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant={"h5"} display={"flex"} gap={2} px={5} marginBottom={3} alignItems={"center"}>
          <TextSnippetIcon sx={{ fontSize: 30 }} />
          Relatório Diário de Street
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={() => {
            }}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <DateInputControlled
                    name={"date"}
                    control={control}
                    label={"Data do Relatório"}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"clientsApproached"}
                    control={control}
                    label={"Clientes Abordados"}
                    errors={errors}
                    type={"number"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"scheduledAppointments"}
                    control={control}
                    label={"Consultas Agendadas"}
                    errors={errors}
                    type={"number"}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInputControlled
                    name={"activityReport"}
                    control={control}
                    label={"Relatório de Atividades"}
                    errors={errors}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider textAlign={"left"}>
                    <Typography variant={"subtitle1"}>Campos automáticos</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"sales"}
                    control={control}
                    label={"Vendas"}
                    errors={errors}
                    type={"number"}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"clientsRegistered"}
                    control={control}
                    label={"Clientes Cadastrados"}
                    errors={errors}
                    type={"number"}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider variant={"middle"} />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex" }}>
                  <LoadingButton
                    type={"submit"}
                    variant={"contained"}
                    sx={{ marginLeft: "auto" }}
                  >
                    <SaveAltIcon sx={{ mr: 1 }} />
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

StreetDailyReport.acl = {
  action: "read",
  subject: "StreetDailyReport"
};

export default StreetDailyReport;