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
import StreetDailyReport from "src/interfaces/StreetDailyReport";

const ApproveDailyReport = () => {

  const streetReportsFakeData = [
    {
      _id: "1",
      auditStatus: "pending",
      street: {
        _id: 1,
        name: "Carlos Silva"
      },
      date: moment().format("YYYY-MM-DD"),
      clientsApproached: 10,
      clientsRegistered: 5,
      activityReport: "",
      sales: 4,
      scheduledAppointments: 2
    },
    {
      _id: "2",
      auditStatus: "pending",
      street: {
        _id: 1,
        name: "Carlos Silva"
      },
      date: moment().format("YYYY-MM-DD"),
      clientsApproached: 20,
      clientsRegistered: 8,
      activityReport: "",
      sales: 6,
      scheduledAppointments: 2
    },
    {
      _id: "3",
      auditStatus: "pending",
      street: {
        _id: 2,
        name: "Pedro Gomes"
      },
      date: "2022-09-15",
      clientsApproached: 30,
      clientsRegistered: 10,
      activityReport: "",
      sales: 8,
      scheduledAppointments: 2
    }
  ];

  // ** States
  const [rangeDateStart, setRangeDateStart] = useState<Date>(new Date());
  const [rangeDateEnd, setRangeDateEnd] = useState<Date>(new Date());
  const [reports, setReports] = useState(streetReportsFakeData.filter(report => report.auditStatus === "pending"));

  // Get the first day of the month
  useEffect(() => {
    console.log(moment().startOf("month"));
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    setRangeDateStart(firstDay);
  }, []);

  const handleUpdateDates = () => {
    setStartDate(rangeDateStart);
    setEndDate(rangeDateEnd);
  };

  const changeAuditStatus = (report: StreetDailyReport, action: "approve" | "reprove") => {
    const newFilteredReports = reports.map(item => {
      if (item._id === report._id) {
        item.auditStatus = action === "approve" ? "approved" : "reproved";
      }
      return item;
    });
    setReports(newFilteredReports);
    if (action === "approve") toast.success("Relatório aprovado com sucesso!");
    else toast.success("Relatório reprovado com sucesso!");
    console.log(report);
  };

  interface RowData {
    row: StreetDailyReport;
  }

  // ** Columns
  const columns = [
    {
      headerName: "ID",
      field: "_id",
      minWidth: 90,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row._id}</Typography>
      )
    },
    {
      minWidth: 100,
      headerAlign: "center",
      headerName: "Data",
      type: "date",
      field: "date",
      valueGetter: ({ row }: RowData) => moment(row.date).format("DD/MM/YY"),
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {moment(row.date).format("DD/MM/YY")}
        </Typography>
      )
    },
    {
      minWidth: 150,
      headerName: "Street",
      field: "street",
      valueGetter: ({ row }: RowData) => row.street.name,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.street.name}</Typography>
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
        <Typography variant={"body2"}>{row.clientsRegistered}</Typography>
      )
    },
    {
      minWidth: 140,
      headerName: "Vendas",
      field: "sales",
      align: "center",
      valueGetter: ({ row }: RowData) => row.sales,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.sales}</Typography>
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
            onClick={() => changeAuditStatus(row, "approve")}
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
            onClick={() => {changeAuditStatus(row, "reprove")}}
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
                onClick={() => {}}
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
            columns={columns}
            rows={reports.filter((report) => report.auditStatus === "pending")}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
          />
        </Card>
      </Grid>
      {/*TODO: SimpleDialog*/}
    </Grid>
  );
};

export default ApproveDailyReport;
