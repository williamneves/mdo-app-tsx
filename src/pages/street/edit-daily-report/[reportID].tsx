// ** MUI imports
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

// ** React Imports
import {Fragment} from "react";

// ** Next Imports
import {useRouter} from "next/router";

// ** Third Party Components
import StreetDailyReportForm from "components/StreetDailyReportForm";

// ** React Query
import * as api from "src/queries/streetDailyReport";

const EditDailyReport = () => {

    const router = useRouter();
    const {reportID} = router.query;

    const {data: streetReport, isLoading} = api.useGetDailyReportByIDQuery(reportID as string);

    return (
        <Fragment>
            {
                isLoading ? (
                    <Grid container sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <CircularProgress/>
                    </Grid>
                ) : (
                    <StreetDailyReportForm
                        dailyReport={streetReport[0]}
                    />
                )
            }
        </Fragment>
    );
};

EditDailyReport.acl = {
    action: "read",
    subject: "general-page"
};

export default EditDailyReport;