// ** MUI imports
import Grid from "@mui/material/Grid"
import CircularProgress from "@mui/material/CircularProgress"

// ** React Imports
import { Fragment } from "react"

// ** Next Imports
import { useRouter } from "next/router"

// ** Third Party Components
import ClientForm from "components/ClientForm"

// ** Queries
import * as useClient from "src/queries/clients"

const EditClient = () => {
  const router = useRouter()
  const { clientID } = router.query

  const { data: client, isLoading } = useClient.useGetClientByIdQuery(
    clientID as string
  )

  return (
    <Fragment>
      {isLoading ? (
        <Grid
          container
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <ClientForm client={client[0]} />
      )}
    </Fragment>
  )
}

EditClient.acl = {
  action: "write",
  subject: "street-page"
}

export default EditClient
