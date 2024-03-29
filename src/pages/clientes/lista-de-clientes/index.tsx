// ** React Imports
import React, {useState, Fragment} from "react"

// ** MUI Imports
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import CardHeader from "@mui/material/CardHeader"
import {DataGrid} from "@mui/x-data-grid"
import Grid from "@mui/material/Grid"

// ** MUI Icons
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone"
import GroupsIcon from "@mui/icons-material/Groups"

// ** Third Party Imports
import SimpleDialog from "components/SimpleDialog"
import toast from "react-hot-toast"
import QuickSearchToolbar from "components/data-grid/QuickSearcToolBar"
// @ts-ignore
import parse from "autosuggest-highlight/parse"
// @ts-ignore
import match from "autosuggest-highlight/match"

import moment from "moment"

// ** Hooks Imports
import * as useClient from "src/queries/clients"
import {useQueryClient} from "@tanstack/react-query"
import {matchSearchFilter, getAllObjectKeys} from "src/@utils/filters"
import {useAuth} from "src/hooks/useAuth"

// ** Next Imports
import {useRouter} from "next/router"

// ** Types
import Client from "src/interfaces/Client"

interface RowsData {
  row: Client
}

const renderCellWithMatchLetters = (row: any, searchValue: string) => {
  const matchesChar = match(row, searchValue, {insideWords: true})
  const parsesChar = parse(row, matchesChar)

  return (
    <Typography variant="body2" color="textPrimary">
      {parsesChar.map((part: any, index: number) => (
        <span key={index} style={{fontWeight: part.highlight ? 700 : 400}}>
          {part.text}
        </span>
      ))}
    </Typography>
  )
}

const ClientList = () => {
  // ** Next Router
  const router = useRouter()

  // ** Hooks
  const {user, selectedStore} = useAuth()

  // ** React Query
  const queryClient = useQueryClient()
  const deleteClient = useClient.useDeleteClientQuery(queryClient)
  const {data: clientList, isLoading} =
    useClient.useGetClientsByReferenceIdQuery({
      referenceId: selectedStore?._id!
    })

  // ** States
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogData, setDialogData] = useState({})
  const [searchValue, setSearchValue] = useState("")
  const [onlyStreetClients, setOnlyStreetClients] = useState<boolean>(false)

  const getStreetClients = (): Client[] => {
    if (user?.role === "streetVendor") {
      return clientList?.filter(
        client => client?.createdBy?._id === user?._id
      ) as Client[]
    }
    return clientList as Client[]
  }

  const deleteClientData = (clientID: string) => {
    const toastId = toast.loading("Deletando cliente...")
    deleteClient
      .mutateAsync(clientID)
      .then(() => {
        toast.success("Cliente deletado com sucesso!", {id: toastId})
        setOpenDialog(false)
      })
      .catch(err => {
        console.log(err)
        toast.error(`Erro ao deletar client`, {id: toastId})
      })
  }

  const openEditClientForm = (clientID: string) => {
    router.push(`/clientes/editar-cliente/${clientID}`)
  }

  const handleViewClient = (clientId: string) => {
    const client = clientList?.find(client => client._id === clientId)
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
        deleteClientData(clientId)
        console.log("delete")
      }
    }
    setDialogData(data)
    setOpenDialog(true)
  }

  // ** Columns
  const columns = [
    {
      field: "code",
      headerName: "Código",
      width: 100,
      renderCell: ({row}: RowsData) => (
        <Typography variant="subtitle2">{row.clientNumber}</Typography>
      )
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({row}: RowsData) =>
        renderCellWithMatchLetters(row.name, searchValue)
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({row}: RowsData) =>
        renderCellWithMatchLetters(row.email || "", searchValue)
    },
    {
      field: "phone",
      headerName: "Telefone",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({row}: RowsData) =>
        renderCellWithMatchLetters(row.phone || "", searchValue)
    },
    {
      field: "createdBy",
      headerName: "Criado por",
      flex: 0.15,
      minWidth: 140,
      valueSetter: ({value}: any) => value.name,
      renderCell: ({row}: RowsData) =>
        renderCellWithMatchLetters(row.createdBy?.name || "", searchValue)
    },
    {
      field: "_createdAt",
      headerName: "Criado em",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({row}: RowsData) => (
        <Typography variant="body2" color="textPrimary">
          {`${moment(row?._createdAt).format("DD/MM/YYYY")}`}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.15,
      minWidth: 140,
      renderCell: ({row}: RowsData) => (
        <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
          <IconButton
            color={"primary"}
            onClick={() => openEditClientForm(row._id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color={"error"}
            // @ts-ignore
            disabled={row.hasRef}
            onClick={() => handleViewClient(row._id)}
          >
            <DeleteForeverTwoToneIcon />
          </IconButton>
        </Box>
      )
    }
  ]
  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{width: "100%"}}>
            <CardHeader
              title={
                <Typography
                  variant={"h6"}
                  sx={{display: "flex", alignItems: "center"}}
                >
                  <GroupsIcon sx={{mr: 2, fontSize: 40}} />
                  Lista de Clientes
                </Typography>
              }
            />
            <DataGrid
              getRowId={row => row._id}
              autoHeight={true}
              loading={isLoading}
              rows={
                onlyStreetClients
                  ? getStreetClients()
                  : (clientList &&
                      clientList.length > 0 &&
                      matchSearchFilter(clientList!, searchValue, [
                        ...getAllObjectKeys(clientList),
                        "createdBy.name"
                      ])) ||
                    []
              }
              columns={columns}
              components={{
                Toolbar: QuickSearchToolbar
              }}
              componentsProps={{
                toolbar: {
                  value: searchValue,
                  clearSearch: () => setSearchValue(""),
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchValue(event.target.value),
                  checkBoxProps:
                    user?.role === "streetVendor"
                      ? {
                          label: "Meus clientes",
                          onChange: (
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => setOnlyStreetClients(event.target.checked),
                          checked: onlyStreetClients
                        }
                      : null
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
  )
}

ClientList.acl = {
  action: "read",
  subject: "general-page"
}

export default ClientList
