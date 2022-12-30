// ** React Imports
import React, { useState, Fragment } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";

// ** MUI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import GroupsIcon from "@mui/icons-material/Groups";

// ** Third Party Imports
import SimpleDialog from "components/SimpleDialog";
import toast from "react-hot-toast";
import QuickSearchToolbar from "components/data-grid/QuickSearcToolBar";
// @ts-ignore
import parse from "autosuggest-highlight/parse";
// @ts-ignore
import match from "autosuggest-highlight/match";

import moment from "moment";

// ** Hooks Imports
import * as useClient from "src/queries/clients";
import * as api from "src/queries/streetDailyReport";
import { useQueryClient } from "@tanstack/react-query";
import { matchSearchFilter, getAllObjectKeys } from "src/@utils/filters";
import { useAuth } from "src/hooks/useAuth";

// ** Next Imports
import { useRouter } from "next/router";

// ** Types
import StreetDailyReport from "src/interfaces/StreetDailyReport";

interface RowsData {
    row: StreetDailyReport;
}

const renderCellWithMatchLetters = (row: any, searchValue: string) => {
    const matchesChar = match(row, searchValue, { insideWords: true });
    const parsesChar = parse(row, matchesChar);

    return (<Typography variant="body2" color="textPrimary">
        {
            parsesChar.map((part: any, index: number) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
            ))
        }
    </Typography>);
};

const StreetReportsList = () => {

    // ** Next Router
    const router = useRouter();

    // ** Hooks
    const { user, selectedStore } = useAuth();

    // ** React Query
    const queryClient = useQueryClient();
    const { data: reports, isLoading } = api.useGetReportByStreet(user?._id || "");

    // ** States
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogData, setDialogData] = useState({});
    const [searchValue, setSearchValue] = useState("");

    const deleteReportData = (clientID: string) => {
        const toastId = toast.loading("Deletando cliente...");
        // deleteClient.mutateAsync(clientID)
        //     .then(() => {
        //         toast.success("Cliente deletado com sucesso!", { id: toastId });
        //         setOpenDialog(false);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         toast.error(`Erro ao deletar client`, { id: toastId });
        //     });
    };

    const openEditReportForm = (reportID: string) => {
        router.push(``);
    };

    const handleViewReport = (reportID: string) => {
        const report = reports?.find((report: StreetDailyReport) => report._id === reportID);
        const data = {
            id: report?._id,
            title: `Deseja realmente excluir o relatório do dia ${moment(report.reportDate).format("DD-MM-YYYY")}?`,
            message: ``,
            confirm: "Excluir",
            confirmColor: "error",
            cancel: "Cancelar",
            cancelColor: "primary",
            confirmAction: () => {
                deleteReportData(reportID);
            }
        };
        setDialogData(data);
        setOpenDialog(true);
    };

    const translateAuditStatus = (auditStatus: "pending" | "approved" | "rejected") => {
        if (auditStatus === "pending") return "Pendente";
        if (auditStatus === "approved") return "Aprovado";
        return "Reprovado";
    }

    // ** Columns
    const columns = [
        {
            field: "reportDate",
            headerName: "Data",
            width: 100,
            renderCell: ({ row }: RowsData) => (
                <Typography variant="subtitle2">
                    {moment(row.reportDate).format("DD-MM-YYYY")}
                </Typography>
            )
        },
        {
            field: "auditStatus",
            headerName: "Status",
            flex: 0.15,
            minWidth: 140,
            renderCell: ({ row }: RowsData) => (
                <Typography variant="subtitle2">
                    {translateAuditStatus(row.auditStatus)}
                </Typography>
            )
        },
        {
            field: "clientsApproached",
            headerName: "Clientes Abordados",
            flex: 0.15,
            minWidth: 140,
            renderCell: ({ row }: RowsData) => (
                <Typography variant="subtitle2">
                    {row.clientsApproached}
                </Typography>
            )
        },
        {
            field: "clientsRegistered",
            headerName: "Clientes Cadastrados",
            flex: 0.15,
            minWidth: 140,
            renderCell: ({ row }: RowsData) => (
                <Typography variant="subtitle2">
                    {row.clientsRegistered.length}
                </Typography>
            )
        },
        {
            field: "scheduledAppointments",
            headerName: "Consultas Marcadas",
            flex: 0.15,
            minWidth: 140,
            renderCell: ({ row }: RowsData) => (
                <Typography variant="subtitle2">
                    {row.scheduledAppointments}
                </Typography>
            )
        },
        {
            field: "reporter",
            headerName: "Criado por",
            flex: 0.15,
            minWidth: 140,
            renderCell: ({ row }: RowsData) => (
                <Typography variant="body2" color="textPrimary">
                    {row.reporter.name}
                </Typography>
            )
        },
        {
            field: "actions",
            headerName: "Ações",
            flex: 0.15,
            minWidth: 140,
            renderCell: ({ row }: RowsData) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <IconButton
                        color={"primary"}
                        disabled={row.auditStatus === "approved"}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color={"error"}
                        // @ts-ignore
                        disabled={row.auditStatus === "approved"}
                        onClick={() => handleViewReport(row._id)}
                    >
                        <DeleteForeverTwoToneIcon />
                    </IconButton>
                </Box>
            )
        }
    ];
    return (
        <Fragment>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card sx={{ width: "100%", marginBottom: "100px" }}>
                        <CardHeader title={
                            <Typography variant={"h6"} sx={{ display: "flex", alignItems: "center" }}>
                                <GroupsIcon sx={{ mr: 2, fontSize: 40 }} />
                                Lista de Relatórios Diários
                            </Typography>
                        } />
                        <DataGrid
                            sx={{
                                // Remove border Radius
                                "& .MuiDataGrid-columnHeaders": {
                                    borderRadius: 0
                                }
                            }}
                            getRowId={(row) => row._id}
                            autoHeight={true}
                            loading={isLoading}
                            rows={reports || []}
                            columns={columns}
                            components={{
                                Toolbar: QuickSearchToolbar
                            }}
                            componentsProps={{
                                toolbar: {
                                    value: searchValue,
                                    clearSearch: () => setSearchValue(""),
                                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)
                                }
                            }}
                        />
                    </Card>
                </Grid>
            </Grid>
            <SimpleDialog
                open={openDialog}
                setOpen={setOpenDialog}
                // @ts-ignore
                data={dialogData}
            />
        </Fragment>
    );
};

StreetReportsList.acl = {
    action: "read",
    subject: "general-page"
};

export default StreetReportsList;