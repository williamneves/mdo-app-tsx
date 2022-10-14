// ** React Imports
// ** MUI Icons

// ** MUI Imports
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";


// ** Import Queries
import { useQueryClient } from "@tanstack/react-query";
import { SaleCardList } from "@views/pages/vendas/nova-venda/NewSaleMockup";
// ** MUI Imports
import { Fragment, useState } from "react";

// ** Import Third Party Libraries
import toast from "react-hot-toast";

// ** Styled Components
import StepperWrapper from "src/@core/styles/mui/stepper";

// ** Import Interfaces
import Sale from "src/interfaces/Sale";
import * as salesQ from "src/queries/sales";

// ** Import Components
import Step1Form from "./step-forms/Step1Form";
import Step2Form from "./step-forms/Step2Form";
import Step3Form from "./step-forms/Step3Form";
import Step4Form from "./step-forms/Step4Form";
import StepperCustomDot from "./StepperCustomDot";

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

const NovaVendaWizard = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hasErrorsStep1, setHasErrorsStep1] = useState<boolean>(false);
  const [hasErrorsStep2, setHasErrorsStep2] = useState<boolean>(false);
  const [hasErrorsStep3, setHasErrorsStep3] = useState<boolean>(false);
  const [resetAll, setResetAll] = useState<boolean>(false);
  const [step1Data, setStep1Data] = useState<Partial<Sale> | null>(null);
  const [step2Data, setStep2Data] = useState<Partial<Sale> | null>(null);
  const [step3Data, setStep3Data] = useState<Partial<Sale> | null>(null);
  const [saleObject, setSaleObject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newSale, setNewSale] = useState<Sale | null>(null);

  // ** Fetchs
  const queryClient = useQueryClient();
  const createNewSale = salesQ.useCreateSaleMutation(queryClient);

  // ** Handlers
  // Handle Submit
  const onSubmit = async (data: any): Promise<void> => {
    console.log(data);
    if (activeStep === 0) {
      setStep1Data(data);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (activeStep === 1) {
      setStep2Data(data);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (activeStep === 2) {
      setStep3Data(data);
      setSaleObject({
        ...step1Data,
        ...step2Data,
        ...data
      });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (activeStep === 3) {
      // console.log("income data", data);
      // console.log("SaleObject", saleObject);
      // const newSale = await createSale(saleObject);
      // console.log("newSale", newSale);
      setIsSubmitting(true);
      const newSaleToast = toast.loading("Salvando Venda...");

      try {
        const data = await createNewSale.mutateAsync(saleObject);
        setNewSale(data);
        toast.success("Venda salva com sucesso!", { id: newSaleToast, duration: 4000 });
        setIsSubmitting(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (err) {
        toast.error("Erro ao salvar venda!", { id: newSaleToast, duration: 4000 });
        console.log(err);
        setIsSubmitting(false);
      }

    }
  };

  // Handle Reset
  const handleReset = () => {
    // Reset all steps
    setStep1Data(null);
    setStep2Data(null);
    setStep3Data(null);
    setSaleObject(null);
    setActiveStep(0);

    toast("Os campos estão limpos, pode começar uma nova venda!");
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
            setSaleObject={setSaleObject}
            step1Data={step1Data}
            setStep1Data={setStep1Data}
          />
        );
      case 1:
        return (
          <Step2Form
            setHasErrors={setHasErrorsStep2}
            onSubmit={onSubmit}
            handleStepBack={handleBack}
            steps={steps}
            step2Data={step2Data}
          />
        );
      case 2:
        return (
          <Step3Form
            setHasErrors={setHasErrorsStep3}
            onSubmit={onSubmit}
            handleStepBack={handleBack}
            steps={steps}
            step3Data={step3Data}
          />
        );
      case 3:
        return (
          <Step4Form
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            handleStepBack={handleBack}
            steps={steps}
            setActiveStep={setActiveStep}
            step4Data={saleObject}
          />
        );
      default:
        return null;
    }
  };

  // ** Render Steps
  const renderContent = () => {
    return getStepContent(activeStep);
  };

  if (activeStep !== steps.length)
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

  else return (
    <Fragment>
      <Card>
        <CardHeader
          title={`👏 Parabéns! Venda #${newSale?.saleNumber || 2222} criada com sucesso!`}
          subtitle="A venda foi criada com sucesso!"
        />
        <Divider sx={{ paddingY: 0, marginY: 0, width: "100%" }} />
        <CardContent>

          <SaleCardList newSaleMockup={newSale} />
        </CardContent>
        <Divider sx={{ paddingY: 0, marginY: 0, width: "100%" }} />
        <CardActions sx={{ justifyContent: "flex-end", paddingY: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReset}
            sx={{ marginY: 3 }}
          >
            Criar Nova Venda
          </Button>
        </CardActions>

      </Card>
    </Fragment>
  );
};

export default NovaVendaWizard;