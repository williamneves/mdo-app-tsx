import * as salesQ from "src/queries/sales";

// ** React Imports
import React, { Fragment, useState, useEffect } from "react";

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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// ** MUI Icons
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownAltTwoToneIcon from "@mui/icons-material/ThumbDownAltTwoTone";
import UpdateIcon from "@mui/icons-material/Update";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

// ** Third Party Imports
import moment from "moment";
import toast from "react-hot-toast";
import QuickDialog from "components/QuickDialog";
import DialogContent from "components/DialogContent";

// ** Utils
import { formattedCurrencyWithSymbol } from "src/@utils/formatCurrency";
import { DateRangeOptions, CustomPeriod, createDateRange, GetDateRange } from "src/@utils/createDateRange";

// ** Hooks Imports
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";

// ** Types
import Sale from "src/interfaces/Sale";

const ApproveSales = () => {

  // ** StoreSelected
  const { selectedStore } = useAuth();

  // ** States
  const [rangeDateStart, setRangeDateStart] = useState<Date>(new Date());
  const [rangeDateEnd, setRangeDateEnd] = useState<Date>(new Date());
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState({});
  const [filteredData, setFilteredData] = useState<Sale[] | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOptions | "">("thisMonth");
  const [rangeDate, setRangeDate] = useState<GetDateRange>(createDateRange("thisMonth"));

  useEffect(() => {
    if (dateRange !== "") {
      setRangeDate(createDateRange(dateRange));
    }
  }, [dateRange]);

  // ** React Query Hooks
    const { data: pendingSales, isLoading: isLoadingSales, refetch } = salesQ
      .useAllSalesByReferenceAndDateRangeQuery(selectedStore ? selectedStore._id : "", rangeDate.range);
  const queryClient = useQueryClient();
  const changeSaleStatus = salesQ.useChangeSaleAuditStatusQuery(queryClient)

  const handleUpdateDates = () => {
    setRangeDateStart(rangeDateStart);
    setRangeDateEnd(rangeDateEnd);
    setFilteredData(filterSalesByDate("customPeriod", {
      startDate: rangeDateStart,
      endDate: rangeDateEnd
    }));
  };

  const {
    control,
    formState: { errors },
    reset,
    getValues
  } = useForm({
    defaultValues: {
      feedback: ""
    }
  });

  const changeAuditStatus = async (saleID: string, status: "approved" | "rejected") => {
    const toastId = toast.loading("Aguarde...");
    const statusName = status === "approved" ? "Aprovada" : "Rejeitada";
    try {
      await changeSaleStatus.mutateAsync({ saleID, status, auditFeedBack: getValues("feedback") });
      toast.success(`Venda ${statusName} com sucesso!`, { id: toastId });
      setOpenDialog(false);
      reset();
      refetch();
    } catch (e) {
      toast.error(`Erro ao ${statusName} venda!`, { id: toastId });
    }
  };

  const handleApproveRejectSale = (sale: Sale, action: "Aprovar" | "Recusar") => {

    setDialogData({
      id: sale._id,
      sale: sale,
      headerTitle: `${action} venda`,
      content: <DialogContent
        headerMessage={`Realmente deseja ${action} a venda do dia ${moment(sale.date).format("DD/MM/YYYY")} feita por ${sale.user?.name} no valor de ${formattedCurrencyWithSymbol(sale.saleAmount)}?`}
        inputProps={{
          control: control,
          errors: errors,
          name: "feedback",
          label: "Feedback (Opcional)",
          multiline: true,
          rows: 3
        }}
      />,
      actions: [{
        mode: "button",
        props: {
          label: "confirmar",
          color: "primary",
          variant: "contained",
          onClick: () => changeAuditStatus(sale._id, action === "Aprovar" ? "approved" : "rejected")
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

  const filterSalesByDate = (period: DateRangeOptions, customPeriod?: CustomPeriod) => {
    const { startDate, endDate } = createDateRange(period, customPeriod).range;
    return (pendingSales as Sale[]).filter(sale => {
      // @ts-ignore
      return sale.date >= startDate && sale.date <= endDate;
    });
  };

  const getRowData = (): Sale[] => {
    if (filteredData?.length) {
      return filteredData;
    }
    if (pendingSales?.length) return pendingSales.filter(
      sale => sale.auditStatus === "pending"
    ) as Sale[];
    return [];
  };

  interface RowData {
    row: Sale;
  }

  // ** Columns
  const columns = [
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
      field: "saleNumber",
      headerName: "N Venda",
      type: "number",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      // @ts-ignore
      renderCell: ({ row }) => (
        <Box width={"100%"}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2">
              {row.saleNumber}
            </Typography>
          </Box>
          {row.PDVNumber &&
            <Fragment>
              <Divider sx={{ paddingY: 0, marginY: 0, width: "100%" }} />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2">
                  PDV: {row.PDVNumber}
                </Typography>
              </Box>
            </Fragment>
          }
        </Box>
      )
    },
    {
      minWidth: 120,
      headerName: "Valor",
      headerAlign: "center",
      field: "saleAmount",
      type: "number",
      valueGetter: ({ row }: RowData) => row.saleAmount,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {formattedCurrencyWithSymbol(row.saleAmount)}
        </Typography>
      )
    },
    {
      minWidth: 150,
      headerName: "Cliente",
      field: "client",
      valueGetter: ({ row }: RowData) => row.client.name,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.client.name}</Typography>
      )
    },
    {
      minWidth: 140,
      headerName: "Vendedor",
      field: "user",
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.user?.name}</Typography>
      ),
      valueGetter: ({ row }: RowData) => row.user?.name
    },
    {
      minWidth: 170,
      headerName: "Forma de Pagamento",
      field: "paymentMethod",
      valueGetter: ({ row }: RowData) => row.paymentMethod.title,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.paymentMethod.title}</Typography>
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
      minWidth: 150,
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
            onClick={() => handleApproveRejectSale(row, "Aprovar")}
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
            onClick={() => handleApproveRejectSale(row, "Recusar")}
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
          <Grid item container sx={{ paddingTop: 4, paddingX: 3 }} spacing={6}>
            <Grid item xs={12} md={6}>
              <CardHeader
                sx={{ textAlign: { xs: "center", md: "left" } }}
                title={
                  <Typography variant={"h6"} color={"text.primary"}>
                    <PriceCheckIcon />
                    Aprovar Vendas
                  </Typography>
                }
              />
            </Grid>
            <Grid
              item xs={12} md={6} spacing={6} sx={{
              paddingTop: 5,
              paddingX: 5,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              justifyContent: "flex-end",
              alignItems: "center"
            }}>
              <FormControl sx={{ minWidth: 280 }}>
                <InputLabel>Selecionar intervalo de tempo</InputLabel>
                <Select
                  value={dateRange}
                  size={"small"}
                  label={"Selecionar intervalo de tempo"}
                  onChange={(e) => {
                    setDateRange(e.target.value as DateRangeOptions);
                    setFilteredData(filterSalesByDate(e.target.value as DateRangeOptions));
                  }}
                >
                  <MenuItem value={"today"}>Hoje</MenuItem>
                  <MenuItem value={"yesterday"}>Ontem</MenuItem>
                  <MenuItem value={"thisWeek"}>Esta semana</MenuItem>
                  <MenuItem value={"lastWeek"}>Última semana</MenuItem>
                  <MenuItem value={"thisMonth"}>Este mês</MenuItem>
                  <MenuItem value={"lastMonth"}>Último mês</MenuItem>
                  <MenuItem value={"last3Months"}>Últimos três meses</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setDateRange("");
                  setFilteredData(null);
                }}
                startIcon={<RotateLeftIcon />}
              >
                Resetar filtro
              </Button>
            </Grid>
            {/*<Grid*/}
            {/*  item*/}
            {/*  display={"flex"}*/}
            {/*  sx={{*/}
            {/*    flexDirection: { xs: "column", md: "row" },*/}
            {/*    justifyContent: "flex-end",*/}
            {/*    alignItems: "center"*/}
            {/*  }}*/}
            {/*  gap={3}*/}
            {/*  xs={12}*/}
            {/*  md={6}*/}
            {/*>*/}
            {/*  <LocalizationProvider dateAdapter={AdapterDateFns}>*/}
            {/*    <MUIDatepicker*/}
            {/*      label="Data Inicial"*/}
            {/*      value={rangeDateStart}*/}
            {/*      onChange={(newValue) => {*/}
            {/*        setRangeDateStart(newValue as Date);*/}
            {/*      }}*/}
            {/*      renderInput={(params) => (*/}
            {/*        <TextField size={"small"} {...params} />*/}
            {/*      )}*/}
            {/*    />*/}
            {/*  </LocalizationProvider>*/}
            {/*  <LocalizationProvider dateAdapter={AdapterDateFns}>*/}
            {/*    <MUIDatepicker*/}
            {/*      label="Data Final"*/}
            {/*      value={rangeDateEnd}*/}
            {/*      onChange={(newValue) => {*/}
            {/*        setRangeDateEnd(newValue as Date);*/}
            {/*      }}*/}
            {/*      renderInput={(params) => (*/}
            {/*        <TextField size={"small"} {...params} />*/}
            {/*      )}*/}
            {/*    />*/}
            {/*  </LocalizationProvider>*/}
            {/*  <Button*/}
            {/*    variant="outlined"*/}
            {/*    color="primary"*/}
            {/*    sx={{ minWidth: "130px" }}*/}
            {/*    onClick={handleUpdateDates}*/}
            {/*    startIcon={<UpdateIcon />}*/}
            {/*  >*/}
            {/*    Atualizar*/}
            {/*  </Button>*/}
            {/*</Grid>*/}
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
            loading={isLoadingSales}
            // @ts-ignore
            columns={columns}
            rows={getRowData()}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
          />
        </Card>
      </Grid>
      <QuickDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        contentText={"Deseja realmente aprovar essa venda?"}
        fullWidth={true}
        maxWidth={"sm"}
        // @ts-ignore
        data={dialogData}
      />
    </Grid>
  );
};

ApproveSales.acl = {
  action: 'read',
  subject: 'manager-page'
}

export default ApproveSales;