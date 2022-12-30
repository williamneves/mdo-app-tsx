// ** React Imports
import {useEffect, useState} from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuList from "@mui/material/MenuList";

// ** MUI Icons
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

// ** Third Party Imports
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import moment from "moment";
import {toast} from "react-hot-toast";

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";

// ** Hooks
import {useForm} from "react-hook-form";
import {useAuth} from "src/hooks/useAuth";
import {useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/router";
import * as useDailyReport from "src/queries/streetDailyReport/";

// ** Types
import Client from "src/interfaces/Client";
import StreetDailyReport from "interfaces/StreetDailyReport";

interface Props {
    dailyReport?: StreetDailyReport
}

const StreetDailyReportForm = ({dailyReport}: Props) => {

    // Hooks
    const {user, selectedStore} = useAuth();
    const router = useRouter();

    // States
    const [reloadUserInfo, setReloadUserInfo] = useState<boolean>(false);

    // React Query
    const queryClient = useQueryClient();
    const createDailyReport = useDailyReport.useCreateStreetDailyReportQuery(queryClient);
    const updateDailyReport = useDailyReport.useUpdateDailyReportQuery(queryClient);
    const getClientsByReporter = useDailyReport.useGetClientsByReporterQuery(queryClient);
    const {isLoading} = createDailyReport;

    const formDefaultValue = {
        reportDate: moment(),
        clientsApproached: "",
        clientsRegistered: [],
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
        clientsRegistered: yup.array().of(yup.object().shape({
            _id: yup.string().required()
        })),
        activitiesReport: yup.string(),
        scheduledAppointments: yup.number().required("Este campo é obrigatório"),
        reporter: yup.object().shape({
            _id: yup.string().required(),
            name: yup.string()
        }),
        store: yup.object().shape({
            _id: yup.string().required(),
            name: yup.string()
        })
    });

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        getValues,
        reset,
        formState: {errors}
    } = useForm({
        // @ts-ignore
        defaultValues: dailyReport ? dailyReport : formDefaultValue,
        resolver: yupResolver(schema),
        mode: "onBlur"
    });

    // Effects
    useEffect(() => {
        if (user) setValue("reporter", user);
        if (selectedStore) { // @ts-ignore
            setValue("store", selectedStore);
        }
    }, [user, selectedStore, reloadUserInfo]);

    useEffect(() => {
        if (user) {
            getClientsByReporter.mutateAsync({
                reporterID: user?._id,
                reportDate: moment(getValues("reportDate")).format("YYYY-MM-DD")
            })
                .then((res) => {
                    // @ts-ignore
                    setValue("clientsRegistered", res);
                });
        }
        // @ts-ignore
    }, [watch("reportDate")]);

    useEffect(() => {
        if (dailyReport) {
            // @ts-ignore
            setValue("reportDate", moment(dailyReport.reportDate))
        }
    }, [])

    const updateReportAndReturnToReportsList = async (report: StreetDailyReport) => {
        const toastId = toast.loading("Salvando edição do Report Diário...");

        try {
            await updateDailyReport.mutateAsync(report);
            await router.push("/street/reports-resume");
            toast.success("Relatório diário editado com sucesso!", {id: toastId});
        } catch (e) {
            toast.error("Erro ao editar relatório diário!", {id: toastId});
        }
    }

    const createDailyReportAndNotify = async (report: StreetDailyReport) => {
        const toastId = toast.loading("Salvando Report Diário...");

        try {
            await createDailyReport.mutateAsync(report);
            toast.success("Relatório diário salvo com sucesso!", {id: toastId});
            // @ts-ignore
            reset(formDefaultValue);
            setReloadUserInfo(!reloadUserInfo);
        } catch (error) {
            toast.error("Erro ao salvar relatório diário!", {id: toastId});
        }
    }

    const onSubmit = async (data: StreetDailyReport) => {
        data.clientsRegistered = data.clientsRegistered.map((client: any) => (
            {
                _ref: client._id,
                _type: "reference",
                _key: client._id
            }
        ));

        if (dailyReport) await updateReportAndReturnToReportsList(data);
        else await createDailyReportAndNotify(data);
    };

    const FormHeader = () => {
        if (dailyReport) {
            return (
                <Typography variant={"h5"} display={"flex"} gap={2} px={5} marginBottom={3} alignItems={"center"}>
                    <DriveFileRenameOutlineIcon sx={{fontSize: 30}}/>
                    Editar Relatório Diário
                </Typography>
            )
        }
        return (
            <Typography variant={"h5"} display={"flex"} gap={2} px={5} marginBottom={3} alignItems={"center"}>
                <TextSnippetIcon sx={{fontSize: 30}}/>
                Relatório Diário de Street
            </Typography>
        )
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <FormHeader/>
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
                                        <Typography variant={"subtitle1"}>(Não necessitam de nenhuma ação)</Typography>
                                    </Divider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant={"h6"}>
                                        Clientes cadastrados: {getValues("clientsRegistered").length}
                                    </Typography>
                                    <MenuList
                                        sx={{
                                            width: "100%",
                                            position: "relative",
                                            overflow: "auto",
                                            maxHeight: 300,
                                            border: 1,
                                            borderRadius: 1,
                                            borderColor: "secondary.main",
                                            "& ul": {padding: 0}
                                        }}
                                        subheader={<li/>}
                                    >
                                        {/*@ts-ignore*/}
                                        {getValues("clientsRegistered").map((client: Client) => (
                                            <li key={`section-${client}`}>
                                                <ul>
                                                    <ListItem key={client._id}>
                                                        <ListItemText
                                                            sx={{
                                                                padding: 2,
                                                                borderBottom: 1,
                                                                borderColor: "secondary.main"
                                                            }}
                                                            primary={`${client.name} - ${client.phone ? client.phone : "Sem Telefone"}`}
                                                            secondary={`Código: ${client.clientNumber}`}/>
                                                    </ListItem>
                                                </ul>
                                            </li>
                                        ))}
                                    </MenuList>
                                    <Alert severity={"warning"} sx={{mt: 3}}>
                                        <AlertTitle>Aviso</AlertTitle>
                                        Este campo se refere aos clientes cadastrados na data do relatório
                                    </Alert>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider variant={"middle"}/>
                                </Grid>
                                <Grid item xs={12} sx={{display: "flex"}}>
                                    <LoadingButton
                                        type={"submit"}
                                        variant={"contained"}
                                        loading={isLoading}
                                        sx={{marginLeft: "auto"}}
                                    >
                                        <SaveAltIcon sx={{mr: 1}}/>
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

StreetDailyReportForm.acl = {
    action: "read",
    subject: "street-page"
};

export default StreetDailyReportForm;