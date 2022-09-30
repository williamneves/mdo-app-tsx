// ** React Imports
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Step from "@mui/material/Step";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import MenuItem from "@mui/material/MenuItem";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";

// ** Custom Components Imports
import StepperCustomDot from "./StepperCustomDot";

// ** Styled Components
import StepperWrapper from "src/@core/styles/mui/stepper";

const steps = [
  {
    // ** Step 1
    title: "Dados Iniciais",
    subtitle: "Data, Cliente, Vendedor...."
  },
  {
    // ** Step 2
    title: "Dados da Venda",
    subtitle: "Produtos, Valor..."
  },
  {
    // ** Step 3
    title: "Outras Informações",
    subtitle: "Mais detalhes..."
  },
  {
    // ** Step 4
    title: "Revisão e Confirmação",
    subtitle: "Confira as informações."
  }
];

// ** Import Interfaces
import Sale from "src/interfaces/Sale";
import Step1Form from "./step-forms/Step1Form";

const NovaVendaWizard = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hasErrorsStep1, setHasErrorsStep1] = useState<boolean>(false);
  const [hasErrorsStep2, setHasErrorsStep2] = useState<boolean>(false);
  const [hasErrorsStep3, setHasErrorsStep3] = useState<boolean>(false);
  const [resetAll, setResetAll] = useState<boolean>(false);
  const [saleObject, setSaleObject] = useState<Sale | null>(null);

  // ** Handlers
  // Handle Submit
  const onSubmit = (data: any) => {
    console.log(data);
  };
  // Handle Reset
  const handleReset = () => {
    console.log("reset");
  };

  // Handle Step progress
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // ** Render
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Step1Form
            steps={steps}
            resetAll={resetAll}
            setHasErrors={setHasErrorsStep1}
            handleNext={handleNext}
            handleBack={handleBack}
            onSubmit={onSubmit}
            setSaleObject={setSaleObject} />
        );
      case 1:
        return (
          "Dados da Venda"
        );
      case 2:
        return (
          "Outras Informações"
        );
      case 3:
        return (
          "Revisão e Confirmação"
        );
      default:
        return null;
    }
  };

  // ** Render Steps
  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button size="large" variant="contained" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      );
    } else {
      return getStepContent(activeStep);
    }
  };

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps: {
                error?: boolean
              } = {};
              if (index === activeStep) {
                labelProps.error = false;
                if (
                  hasErrorsStep1 &&
                  activeStep === 0
                ) {
                  labelProps.error = true;
                } else if (
                  hasErrorsStep2 &&
                  activeStep === 1
                ) {
                  labelProps.error = true;
                } else if (
                  hasErrorsStep3 &&
                  activeStep === 2
                ) {
                  labelProps.error = true;
                } else {
                  labelProps.error = false;
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className="step-label">
                      <Typography className="step-number">0{index + 1}</Typography>
                      <div>
                        <Typography className="step-title">{step.title}</Typography>
                        <Typography className="step-subtitle">{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: 0 }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default NovaVendaWizard;