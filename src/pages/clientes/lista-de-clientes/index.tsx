// ** React Imports
import { useState, useEffect, Fragment } from "react";

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

// ** Hooks Imports
import * as useClient from "src/queries/clients";
import { useQueryClient } from "@tanstack/react-query";

// ** Types
import Client from "src/interfaces/Client";

interface RowsData {
  row: Client;
}

const ClientList = () => {

  // ** React Query
  const queryClient = useQueryClient();
  const deleteClient = useClient.useDeleteClientQuery(queryClient);
  const { data: clientList, isLoading } = useClient.useGetClientsQuery();

  // ** States
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({});

  const deleteClientData = (clientID: string) => {
    const toastId = toast.loading("Deletando cliente...");
    deleteClient.mutateAsync(clientID)
      .then(() => {
        toast.success("Cliente deletado com sucesso!", { id: toastId });
        setOpenDialog(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Erro ao deletar client`, { id: toastId });
      });
  };

  const handleViewClient = (clientId: string) => {
    const client = clientList.find((client) => client._id === clientId);
    const data = {
      id: client?._id,
      client: client,
      title: `Deseja realmente excluir o cliente ${client?.name}?`,
      message: `Confirme a exclusão do cliente de código #${client?.clientNumber}`,
      confirm: "Excluir",
      confirmColor: "error",
      cancel: "Cancelar",
      cancelColor: "primary",
      confirmAction: () => {
        // Delete Client
        deleteClientData(clientId);
        console.log("delete");
        console.log(clientId);
      }
    };
    setDialogData(data);
    setOpenDialog(true);
  };

  // ** Columns
  const columns = [
    {
      field: "code",
      headerName: "Código",
      width: 100,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="subtitle2">
          {row.clientNumber}
        </Typography>
      )
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2" color="textPrimary">
          {row.name}
        </Typography>
      )
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2" color="textPrimary">
          {row.email}
        </Typography>
      )
    },
    {
      field: "phone",
      headerName: "Telefone",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2" color="textPrimary">
          {row.phone}
        </Typography>
      )
    },
    {
      field: "createdBy",
      headerName: "Criado por",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2" color="textPrimary">
          {row.createdBy?.name}
        </Typography>
      )
    },
    {
      field: "createdAt",
      headerName: "Criado em",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2" color="textPrimary">
          {`${row?._createdAt}`}
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
            onClick={() => {
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color={"error"}
            onClick={() => handleViewClient(row._id)}
          >
            <DeleteForeverTwoToneIcon />
          </IconButton>
        </Box>
      )
    }
  ];
  // @ts-ignore
  return (
    <Fragment>
      <Grid container spacing={6}>
        <Card sx={{ width: "100%" }}>
          <CardHeader title={
            <Typography variant={"h6"} sx={{ display: "flex", alignItems: "center" }}>
              <GroupsIcon sx={{ mr: 2, fontSize: 40 }} />
              Lista de Clientes
            </Typography>
          } />
          <DataGrid
            getRowId={(row) => row._id}
            autoHeight={true}
            loading={isLoading}
            rows={clientList || []}
            columns={columns}
          />
        </Card>
      </Grid>
      <SimpleDialog
        open={openDialog}
        setOpen={setOpenDialog}
        data={dialogData}
      />
    </Fragment>
  );
};

ClientList.acl = {
  action: "read",
  subject: "street-page"
};

export default ClientList;