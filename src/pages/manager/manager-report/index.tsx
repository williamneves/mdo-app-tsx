// ** React Imports
import React, {useEffect, useState} from "react";

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
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ContactPageIcon from '@mui/icons-material/ContactPage';

// ** Third Party Imports
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import moment from "moment";

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";
import CurrencyMaskInputControlled from "components/inputs/CurrencyMaskInputControlled";

// ** Hooks
import {useForm} from "react-hook-form";
import {useAuth} from "src/hooks/useAuth";
import * as query from "src/queries/sales"

// * Types
import Sale from "src/interfaces/Sale";

const ManagerReport = () => {

    const {selectedStore} = useAuth();
    const {data: approvedSalesInCurrentDay, isLoading} = query.useGetApprovedSalesInCurrentDay(selectedStore?._id!);

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
        date: yup.date().required("Este campo é obrigatório"),
        valueInCash: yup.number().required("Este campo é obrigatório"),
        scheduledAppointments: yup.number().required("Este campo é obrigatório"),
        consultationsMade: yup.number().required("Este campo é obrigatório"),
        dayDescription: yup.string().required("Este campo é obrigatório"),
        nextDayPlanning: yup.string().required("Este campo é obrigatório"),
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
        defaultValues: formDefaultValue,
        resolver: yupResolver(schema),
        mode: "onBlur"
    });

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant={"h5"} display={"flex"} gap={2} px={5} marginBottom={3} alignItems={"center"}>
                    <ContactPageIcon sx={{fontSize: 30}}/>
                    Relatório Diário do Gerente
                </Typography>
                <Card>
                    <CardContent>
                        <form>
                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={6}>
                                    <DateInputControlled
                                        name={"date"}
                                        control={control}
                                        label={"Data do Relatório"}
                                        errors={errors}
                                        disabled={isLoading}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CurrencyMaskInputControlled
                                        name={"valueInCash"}
                                        label={"Valor de fechamento do caixa"}
                                        control={control}
                                        errors={errors}
                                        startAdornment={"R$"}
                                        // Select all text on focus
                                        onFocus={(e) => e.target.select()}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextInputControlled
                                        name={"scheduledAppointments"}
                                        control={control}
                                        label={"Consultas Marcadas"}
                                        errors={errors}
                                        disabled={isLoading}
                                        type={"number"}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextInputControlled
                                        name={"consultationsMade"}
                                        control={control}
                                        label={"Consultas Realizadas"}
                                        errors={errors}
                                        disabled={isLoading}
                                        type={"number"}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextInputControlled
                                        name={"dayDescription"}
                                        control={control}
                                        label={"Descrição do dia"}
                                        errors={errors}
                                        type={"number"}
                                        disabled={isLoading}
                                        required
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextInputControlled
                                        name={"nextDayPlanning"}
                                        control={control}
                                        label={"Planejamento para o dia seguinte"}
                                        errors={errors}
                                        disabled={isLoading}
                                        required
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
                                        Vendas aprovadas: {approvedSalesInCurrentDay?.length}
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
                                        {approvedSalesInCurrentDay?.map((sale: Sale) => (
                                            <li key={`section-${sale}`}>
                                                <ul>
                                                    <ListItem key={sale._id}>
                                                        <ListItemText
                                                            sx={{
                                                                padding: 2,
                                                                borderBottom: 1,
                                                                borderColor: "secondary.main"
                                                            }}
                                                            primary={`Vendedor: ${sale?.vendor?.name}`}
                                                            secondary={`Código: ${sale.PDVNumber}`}/>
                                                    </ListItem>
                                                </ul>
                                            </li>
                                        ))}
                                    </MenuList>
                                    <Alert severity={"warning"} sx={{mt: 3}}>
                                        <AlertTitle>Aviso</AlertTitle>
                                        Este campo se refere às vendas aprovadas na data deste relatório
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
    )

}

export default ManagerReport;