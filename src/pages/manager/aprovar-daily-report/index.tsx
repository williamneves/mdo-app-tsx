// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Grid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MUIDatepicker from "@mui/lab/DatePicker";
import Divider from "@mui/material/Divider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";

// ** MUI Icons
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownAltTwoToneIcon from "@mui/icons-material/ThumbDownAltTwoTone";
import UpdateIcon from "@mui/icons-material/Update";

// ** Third Party Imports
import moment from "moment";
import toast from "react-hot-toast";
import QuickDialog from "components/QuickDialog";

// ** Hooks Imports
import * as useDailyReport from "src/queries/streetDailyReport";
import { useQueryClient } from "@tanstack/react-query";

// ** Types
import StreetDailyReport from "src/interfaces/StreetDailyReport";

const ApproveDailyReport = () => {

  // ** States
  const [rangeDateStart, setRangeDateStart] = useState<Date>(new Date());
  const [rangeDateEnd, setRangeDateEnd] = useState<Date>(new Date());
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState({});

  // ** React Query Hooks
  const {
    data: reportsData,
    isLoading: reportsIsLoading
  } = useDailyReport.useGetAllDailyReportsQuery();
  const queryClient = useQueryClient();
  const changeReportStatus = useDailyReport.useChangeAuditStatusQuery(queryClient);

  // Get only reports that are pending
  const pendingReports = reportsData?.filter((report: StreetDailyReport) => report.auditStatus === "pending");

  // Get the first day of the month
  useEffect(() => {
    console.log(moment().startOf("month"));
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    setRangeDateStart(firstDay);
  }, []);

  const handleUpdateDates = () => {
    setRangeDateStart(rangeDateStart);
    setRangeDateEnd(rangeDateEnd);
  };

  const changeAuditStatus = async (reportID: string, action: "approved" | "rejected") => {
    const toastId = toast.loading("Aguarde...");
    try {
      await changeReportStatus.mutateAsync({ reportID, status: action });
      toast.success("Status do relatório atualizado com sucesso!", { id: toastId });
      setOpenDialog(false);
    } catch (e) {
      toast.error("Erro ao atualizar status do relatório!", { id: toastId });
    }
  };

  const approveAllReports = async () => {
    const toastId = toast.loading("Aguarde...");
    try {
      await Promise.all(pendingReports.map(async (report: StreetDailyReport) => {
        await changeReportStatus.mutateAsync({ reportID: report._id, status: "approved" });
      }));
      toast.success("Relatórios aprovados com sucesso!", { id: toastId });
      setOpenDialog(false);
    } catch (e) {
      toast.error("Erro ao aprovar todos os relatórios!", { id: toastId });
    }
  };

  const handleApproveAllReports = () => {
    setDialogData({
      headerTitle: "Aprovar todos os relatórios",
      content: "Realmente deseja aprovar todos os relatórios?",
      actions: [{
        mode: "button",
        props: {
          label: "confirmar",
          color: "primary",
          variant: "contained",
          onClick: () => approveAllReports()
        }
      }, {
        mode: "button",
        props: {
          label: "cancelar",
          color: "error",
          variant: "outlined",
          onClick: () => setOpenDialog(false)
        }
      }]
    });

    setOpenDialog(true);
  };

  const handleApproveRejectReport = (report: StreetDailyReport, action: "Aprovar" | "Recusar") => {

    setDialogData({
      id: report._id,
      report: report,
      headerTitle: `${action} relatório`,
      content: `Realmente deseja ${action} o relatório do dia ${moment(report.reportDate).format("DD/MM/YYYY")} feito por ${report.reporter.name}?`,
      actions: [{
        mode: "button",
        props: {
          label: "confirmar",
          color: "primary",
          variant: "contained",
          onClick: () => changeAuditStatus(report._id, action === "Aprovar" ? "approved" : "rejected")
        }
      }, {
        mode: "button",
        props: {
          label: "cancelar",
          color: "error",
          variant: "outlined",
          onClick: () => setOpenDialog(false)
        }
      }]
    });

    setOpenDialog(true);
  };

  interface RowData {
    row: StreetDailyReport;
  }

  // ** Columns
  const columns = [
    {
      minWidth: 100,
      headerAlign: "center",
      headerName: "Data",
      type: "date",
      field: "date",
      valueGetter: ({ row }: RowData) => moment(row.reportDate).format("DD/MM/YY"),
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {moment(row.reportDate).format("DD/MM/YY")}
        </Typography>
      )
    },
    {
      minWidth: 150,
      headerName: "Reporter",
      flex: 0.125,
      align: "center",
      field: "reporter",
      valueGetter: ({ row }: RowData) => row.reporter.name,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.reporter.name}</Typography>
      )
    },
    {
      minWidth: 120,
      flex: 0.125,
      headerName: "Clientes Abordados",
      field: "clientsApproached",
      type: "number",
      align: "center",
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {row.clientsApproached}
        </Typography>
      )
    },
    {
      minWidth: 140,
      headerName: "Clientes Cadastrados",
      flex: 0.125,
      field: "clientsRegistered",
      align: "center",
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.clientsRegistered.length}</Typography>
      )
    },
    {
      minWidth: 140,
      headerName: "Consultas Agendadas",
      field: "sales",
      align: "center",
      valueGetter: ({ row }: RowData) => row.scheduledAppointments,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.scheduledAppointments}</Typography>
      )
    },
    {
      flex: 0.125,
      headerName: "Aprovar | Rejeitar",
      field: "auditStatus",
      align: "center",
      sortable: false,
      headerAlign: "center",
      disableColumnMenu: true,
      minWidth: 120,
      renderCell: ({ row }: RowData) => (
        <Box display="flex" justifyContent="center" gap={3} alignItems="center">
          <Fab
            sx={{
              color: "white",
              backgroundColor: "success.dark",
              "&:hover": { backgroundColor: "success.main" },
              width: "35px",
              height: "35px"
            }}
            onClick={() => handleApproveRejectReport(row, "Aprovar")}
          >
            <ThumbUpAltTwoToneIcon fontSize={"small"} />
          </Fab>
          <Fab
            size={"small"}
            sx={{
              color: "white",
              backgroundColor: "error.dark",
              "&:hover": { backgroundColor: "error.main" },
              width: "33px",
              height: "35px"
            }}
            onClick={() => {
              handleApproveRejectReport(row, "Recusar");
            }}
          >
            <ThumbDownAltTwoToneIcon fontSize={"small"} />
          </Fab>
        </Box>
      )
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Grid container sx={{ paddingTop: 4, paddingX: 3 }} spacing={6}>
            <Grid item xs={12}>
              <Button
                variant={"outlined"}
                onClick={() => handleApproveAllReports()}
              >
                Aprovar tudo
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardHeader
                sx={{ textAlign: { xs: "center", md: "left" } }}
                title="Aprovar Reports Diários"
              />
            </Grid>
            <Grid
              item
              display={"flex"}
              sx={{
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "flex-end",
                alignItems: "center"
              }}
              gap={3}
              xs={12}
              md={6}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MUIDatepicker
                  label="Data Inicial"
                  value={rangeDateStart}
                  onChange={(newValue) => {
                    setRangeDateStart(newValue as Date);
                  }}
                  renderInput={(params) => (
                    <TextField size={"small"} {...params} />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MUIDatepicker
                  label="Data Final"
                  value={rangeDateEnd}
                  onChange={(newValue) => {
                    setRangeDateEnd(newValue as Date);
                  }}
                  renderInput={(params) => (
                    <TextField size={"small"} {...params} />
                  )}
                />
              </LocalizationProvider>
              <Button
                variant="outlined"
                color="primary"
                sx={{ minWidth: "130px" }}
                onClick={handleUpdateDates}
                startIcon={<UpdateIcon />}
              >
                Atualizar
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <DataGrid
            sx={{
              ".MuiDataGrid-columnHeaders": {
                borderRadius: "0px"
              }
            }}
            autoHeight
            getRowId={(row) => row._id}
            loading={reportsIsLoading}
            // @ts-ignore
            columns={columns}
            rows={pendingReports || []}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
          />
        </Card>
      </Grid>
      <QuickDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        contentText={"Deseja realmente aprovar este report?"}
        fullWidth={true}
        maxWidth={"sm"}
        // @ts-ignore
        data={dialogData}
      />
    </Grid>
  );
};

export default ApproveDailyReport;
