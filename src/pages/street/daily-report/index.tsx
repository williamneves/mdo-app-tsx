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
import moment from "moment";
import { toast } from "react-hot-toast";

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";

// ** Hooks
import { useForm } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import * as useDailyReport from "src/queries/streetDailyReport/";

const StreetDailyReport = () => {

  const { user, selectedStore } = useAuth();

  // React Query
  const queryClient = useQueryClient();
  const createDailyReport = useDailyReport.useCreateStreetDailyReportQuery(queryClient);
  const getClientsByReporter = useDailyReport.useGetClientsByReporterQuery(queryClient);
  const { isLoading } = createDailyReport;

  const defaultValue = {
    reportDate: moment().format("YYYY-MM-DD"),
    clientsApproached: "",
    scheduledAppointments: "",
    activitiesReport: "",
    reporter: {
      name: ""
    },
    store: {
      name: ""
    }
  };

  const schema = yup.object().shape({
    reportDate: yup.date().required("Este campo é obrigatório"),
    clientsApproached: yup.number().required("Este campo é obrigatório"),
    clientsRegistered: yup.number(),//.required("Este campo é obrigatório"),
    activitiesReport: yup.string(),
    scheduledAppointments: yup.number().required("Este campo é obrigatório"),
    reporter: yup.object().shape({
      _id: yup.string(),//.required(),
      name: yup.string()//.required()
    }),
    store: yup.object().shape({
      _id: yup.string(),//.required(),
      name: yup.string()//.required()
    })
  });

  // Effects
  useEffect(() => {
    if (user) setValue("reporter", user);
    if (selectedStore) setValue("store", selectedStore);
  }, [user, selectedStore]);

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

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Salvando relatório diário...");
    try {
      const reportDate = moment(data.reportDate).format("YYYY-MM-DD");
      const clients = await getClientsByReporter.mutateAsync({ reporterID: data.reporter._id, reportDate });
      data.clientsRegistered = clients.map((client: any) => (
        {
          _ref: client._id,
          _type: "reference",
          _key: client._id
        }
      ));
      await createDailyReport.mutateAsync(data);
      toast.success("Relatório diário salvo com sucesso!", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar relatório diário!", { id: toastId });
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant={"h5"} display={"flex"} gap={2} px={5} marginBottom={3} alignItems={"center"}>
          <TextSnippetIcon sx={{ fontSize: 30 }} />
          Relatório Diário de Street
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <DateInputControlled
                    name={"reportDate"}
                    control={control}
                    label={"Data do Relatório"}
                    errors={errors}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInputControlled
                    name={"clientsApproached"}
                    control={control}
                    label={"Clientes Abordados"}
                    errors={errors}
                    type={"number"}
                    disabled={isLoading}
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
                    disabled={isLoading}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInputControlled
                    name={"activitiesReport"}
                    control={control}
                    label={"Relatório de Atividades"}
                    errors={errors}
                    disabled={isLoading}
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
                    loading={isLoading}
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