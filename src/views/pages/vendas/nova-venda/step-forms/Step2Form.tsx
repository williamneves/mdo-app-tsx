// ** React Imports
import React, { useEffect, Fragment } from "react";

// ** MUI Imports
import { Button, Grid, Typography, Divider, Box, Alert } from "@mui/material";

// ** MUI Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import LocalOfferTwoToneIcon from "@mui/icons-material/LocalOfferTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import CalculateIcon from "@mui/icons-material/Calculate";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import toast from "react-hot-toast";

// ** Import Components
import CurrencyMaskInputControlled from "components/inputs/CurrencyMaskInputControlled";
import TextInputControlled from "components/inputs/TextInputControlled";
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled";

// ** Import Context and Queries
import * as salesQ from "src/queries/sales";

// ** Import Hooks
import { useAuth } from "src/hooks/useAuth";
import { calculateSales, getPrincipalPaymentMethod } from "../hooks";
import calcSalesScore from "./scoreCalculation";
import { formattedCurrency } from "@core/utils/formatCurrency";


// ** Rendered Element
interface Step2FormProps {
  setHasErrors: (value: boolean) => void;
  onSubmit: any;
  handleStepBack: any;
  steps: Array<{ title: string, subtitle: string }>;
  step2Data: any;
  mode?: "create" | "edit";
}

const Step2Form = (props: Step2FormProps): JSX.Element => {

  // ** Props and States
  const {
    onSubmit,
    handleStepBack,
    steps,
    step2Data,
    setHasErrors,
    mode,
  } = props;

  console.log("step2Data", step2Data);

  // ** Api and Context
  const { selectedStore } = useAuth();
  const { data: allProducts } = salesQ
    .useAllProductsByReferenceQuery(selectedStore!._id,
      {
        placeholder: [],
        enabled: !!selectedStore
      });
  const { data: allPaymentMethods } = salesQ
    .useAllPaymentMethodsByReferenceQuery(selectedStore!._id,
      {
        placeholder: [],
        enabled: !!selectedStore
      });

  // *** Step 2 Dependencies

  // ** Step 2 Default Values
  const step2DefaultValueFields = {
    products: [
      {
        product: {
          title: ""
        },
        price: 0,
        quantity: 1,
        discount: 0,
        cost: 0
      }
    ],
    salePayments: [
      {
        paymentMethod: {
          title: ""
        },
        paymentAmount: 0,
        splitQuantity: 1
      }
    ],
    // Readonly fields
    saleAmountDisplay: "0",
    totalCostDisplay: "0",
    totalDiscountDisplay: "0",
    // Invisible fields
    saleAmount: 0,
    totalQuantity: 1,
    totalCost: 0,
    totalDiscount: 0,
    paymentMethod: {
      title: ""
    },
    splitQuantity: null,
    score: 0,
    profit: 0,
    markup: 0
  };

  const step2DefaultValueProducts = [
    {
      product: {
        title: ""
      },
      price: 0,
      quantity: 1,
      discount: 0,
      cost: 0
    }
  ];

  const step2DefaultValueSalePayments = [
    {
      paymentMethod: {
        title: ""
      },
      paymentAmount: 0,
      splitQuantity: 1
    }
  ];

  // ** Step 2 Schema
  const step2Schema = yup.object().shape({
    products: yup.array().of(
      yup.object().shape({
        product: yup
          .object()
          .shape({
            title: yup.string().nullable().required("Produto é obrigatório")
          })
          .required("Produto é obrigatório")
          .nullable(),
        // Price minimum value 1
        price: yup
          .number()
          .min(1, "Mínimo R$ 1,00")
          .required("Obrigatório*")
          .transform((value) => (isNaN(value) ? undefined : value))
          .nullable(),
        // Quantity minimum value 1 max 10
        quantity: yup
          .number()
          .min(1, "Mínimo 1")
          .max(10, "Máximo 10")
          .required("*")
          .transform((value) => (isNaN(value) ? undefined : value))
          .nullable(),
        // Discount is not required
        discount: yup
          .number()
          .nullable()
          .transform((value) => (isNaN(value) ? undefined : value)),
        // Cost is required
        cost: yup
          .number()
          .min(1, "Mínimo R$ 1,00")
          .required("Obrigatório *")
          .nullable()
          .transform((value) => (isNaN(value) ? undefined : value))
      })
    ),
    // Sale payments is required
    salePayments: yup.array().of(
      yup.object().shape({
        paymentMethod: yup
          .object()
          .shape({
            title: yup
              .string()
              .required("Forma de pagamento é obrigatório")
              .nullable()
          })
          .required("Forma de pagamento é obrigatório")
          .nullable(),
        // Payment amount minimum value 1
        paymentAmount: yup
          .number()
          .min(1, "Valor mínimo de R$ 1,00")
          .required("Obrigatório*")
          .transform((value) => (isNaN(value) ? undefined : value))
          .nullable(),

        // Split quantity minimum value 1 max 10
        splitQuantity: yup
          .number()
          .min(1, "Quantidade mínima de 1")
          .max(24, "Quantidade máxima de 24")
          .required("*")
          .transform((value) => (isNaN(value) ? undefined : value))
          .nullable()
      })
    )
  });

  // ** Step 2 Hooks
  const {
    reset: resetStep2,
    control: controlStep2,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    getValues: getValuesStep2,
    watch: watchStep2,
    setError: setErrorStep2,
    formState: {
      errors: errorsStep2,
      isValid: isValidStep2,
      isDirty: isDirtyStep2,
      submitCount: submitCountStep2
    }
  } = useForm({
    defaultValues: step2Data || step2DefaultValueFields,
    resolver: yupResolver(step2Schema),
    mode: "onSubmit"
  });

  // Field Array for Step 2
  const {
    fields: productsFields,
    append: appendProducts,
    remove: removeProducts
  } = useFieldArray({
    control: controlStep2,
    name: "products"
  });

  // Field Array for Step 2
  const {
    fields: salePaymentsFields,
    append: appendSalePayments,
    remove: removeSalePayments,
  } = useFieldArray({
    control: controlStep2,
    name: "salePayments"
  });

  // ** Step 2 Functions

  // ** Reset Form
  useEffect(() => {
    if (step2Data === null) {
      resetStep2();
    }
  }, [step2Data]);

  // ** Set Validation Step
  useEffect(() => {
    if (!isValidStep2 && submitCountStep2 > 0) {
      toast.error("Verifique os campos obrigatórios");
      setHasErrors(!isValidStep2);
    }
  }, [isValidStep2, submitCountStep2, isDirtyStep2]);

  // * Watch form step 2 for make the calculations
  useEffect(() => {
    // If on edit mode, set the initial values
    if (mode === "edit") {
      setValueStep2("saleAmountDisplay", formattedCurrency(step2Data?.saleAmount));
      setValueStep2("totalCostDisplay", formattedCurrency(step2Data?.totalCost));
      setValueStep2("totalDiscountDisplay", formattedCurrency(step2Data?.totalDiscount));
    }

    // Create the watch subscription
    const watchSubscription = watchStep2((values, { name }) => {
      // Set saleAmount value dynamically
      if (
        name?.split(".")[1] === "price" ||
        name?.split(".")[1] === "quantity"
      ) {
        // @ts-ignore
        setValueStep2("saleAmount", calculateSales(values, "saleAmount"));
        // @ts-ignore
        setValueStep2("saleAmountDisplay", formattedCurrency(calculateSales(values, "saleAmount")));
      }
      // Set QTD total value dynamically
      if (name?.split(".")[1] === "quantity") {
        // @ts-ignore
        setValueStep2("totalQuantity", calculateSales(values, "totalQuantity"));
      }
      // Set totalCost value dynamically
      if (
        name?.split(".")[1] === "cost" ||
        name?.split(".")[1] === "quantity"
      ) {
        // @ts-ignore
        setValueStep2("totalCost", calculateSales(values, "totalCost"));
        // @ts-ignore
        setValueStep2("totalCostDisplay", formattedCurrency(calculateSales(values, "totalCost")));
      }
      // Set totalDiscount value dynamically
      if (name?.split(".")[1] === "discount") {
        // @ts-ignore
        setValueStep2("totalDiscount", calculateSales(values, "totalDiscount"));
        // @ts-ignore
        setValueStep2("totalDiscountDisplay", formattedCurrency(calculateSales(values, "totalDiscount")));
      }
    });
    // Cleanup subscription on unmount
    return () => watchSubscription.unsubscribe();
  }, [watchStep2, mode]);

  const onSubmitStep2 = (data: any) => {
    console.log(data);
    if (calculateSales(data, "totalPayments") !== data.saleAmount) {
      data.salePayments.forEach((payment: any, index: number) => {
        // @ts-ignore
        setErrorStep2(`salePayments[${index}].paymentAmount`, {
          // @ts-ignore
          totalPayment: { message: "A soma dos pagamentos não é igual ao valor da venda" }
        });
      });
      return;
    }

    // If is equal, set the principal paymentMethod
    const principalPaymentMethod = getPrincipalPaymentMethod(data);
    // Set the principal paymentMethod to the sale
    console.log(principalPaymentMethod);
    setValueStep2("paymentMethod", principalPaymentMethod.paymentMethod);
    // Set the splitQuantity to the sale
    setValueStep2("splitQuantity", principalPaymentMethod.splitQuantity);
    
    // Now, calculate others stats
    const salesScore = calcSalesScore(data);
    // Set score to the sale
    setValueStep2("score", salesScore.score);
    // Set profit to the sale
    setValueStep2("profit", salesScore.profit);
    // Set markup to the sale
    setValueStep2("markup", salesScore.markup);

    // Submit the form
    onSubmit(getValuesStep2());
  };

  return (
    <Fragment>
      <form key={1} onSubmit={handleSubmitStep2(onSubmitStep2)} id={"formStep2"}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {steps[1].title}
            </Typography>
            <Typography variant="caption" component="p">
              {steps[1].subtitle}
            </Typography>
          </Grid>

          {/* Step 2 Fields */}

          {/* Produtos */}
          <Grid item xs={12}>
            <Divider textAlign="center" sx={{ marginY: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocalOfferTwoToneIcon />
                <Typography variant="h5">Produtos</Typography>
              </Box>
            </Divider>
            <Alert severity="info">
              <Typography variant="body2">
                Adicione cada produto da venda separadamente. Não esqueça de
                colocar o custo do produto.
              </Typography>
            </Alert>

            {/*  Array */}
            {productsFields.map((product, index) => {
              const fieldName = `products[${index}]`;
              return (
                <Fragment key={product.id}>
                  <Grid item xs={12}>
                    <Divider textAlign="left" sx={{ marginY: 4 }}>
                      {`Produto #${index + 1}`}
                      <Button
                        variant="text"
                        onClick={() => removeProducts(index)}
                        color={"error"}
                        size={"small"}
                        startIcon={<DeleteTwoToneIcon />}
                      >
                        Remover
                      </Button>
                    </Divider>
                  </Grid>
                  <Grid
                    container
                    justifyContent={"space-between"}
                    rowGap={3}
                  >
                  </Grid>
                  <Grid
                    container
                    justifyContent={"space-between"}
                    rowGap={3}
                  >
                    <Grid item xs={12} sm={4}>
                      <AutocompleteInputControlled
                        name={`${fieldName}.product`}
                        label={"Produto"}
                        errors={errorsStep2}
                        placeholder={"Selecione um produto"}
                        control={controlStep2}
                        options={allProducts && allProducts.length > 0 ? allProducts : []}
                        optionLabel={"title"}
                        filterKeys={["title"]}
                      />
                    </Grid>
                    <Grid item xs={3} sm={1}>
                      <TextInputControlled
                        type={"number"}
                        name={`${fieldName}.quantity`}
                        label={"QTDE"}
                        control={controlStep2}
                        errors={errorsStep2}
                      />
                    </Grid>
                    <Grid item xs={8} sm={2}>
                      <CurrencyMaskInputControlled
                        name={`${fieldName}.price`}
                        label={"Preço"}
                        control={controlStep2}
                        errors={errorsStep2}
                        startAdornment={"R$"}
                        // Select all text on focus
                        onFocus={(e) => e.target.select()}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <CurrencyMaskInputControlled
                        name={`${fieldName}.cost`}
                        label={"Custo"}
                        control={controlStep2}
                        errors={errorsStep2}
                        startAdornment={"R$"}
                        // Select all text on focus
                        onFocus={(e) => e.target.select()}
                      />
                    </Grid>
                    <Grid item xs={5} sm={2}>
                      <CurrencyMaskInputControlled
                        name={`${fieldName}.discount`}
                        label={"Desconto"}
                        control={controlStep2}
                        errors={errorsStep2}
                        startAdornment={"R$"}
                        // Select all text on focus
                        onFocus={(e) => e.target.select()}
                      />
                    </Grid>
                  </Grid>
                </Fragment>
              );
            })}
            <Divider textAlign="left" sx={{ marginY: 4 }}>
              <Button
                variant="text"
                size={"small"}
                color={"primary"}
                onClick={() => appendProducts(step2DefaultValueProducts)}
              >
                <AddCircleTwoToneIcon sx={{ marginInlineEnd: 2 }} />
                Novo Produto
              </Button>
            </Divider>
          </Grid>

          {/* Pagamentos */}
          <Grid container item spacing={1} xs={12}>
            <Grid item xs={12}>
              <Divider textAlign="center" sx={{ marginY: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PointOfSaleTwoToneIcon />
                  <Typography variant={"h5"}>Pagamentos</Typography>
                </Box>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  Adicione um ou mais pagamentos para essa venda.
                </Typography>
              </Alert>
            </Grid>

            {/*  salePayment Field */}
            <Grid item container xs={12} spacing={3
            }>
              {salePaymentsFields.map((salePayment, index) => {
                const fieldName = `salePayments[${index}]`;
                return (
                  <Fragment key={salePayment.id}>
                    <Grid item xs={12}>
                      <Divider textAlign="left">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                          }}
                        >
                          <Typography variant={"subtitle1"}>
                            {`Pagamento #${index + 1}`}
                          </Typography>
                          <Button
                            variant="text"
                            onClick={() => removeSalePayments(index)}
                            color={"error"}
                            size={"small"}
                            startIcon={<DeleteTwoToneIcon />}
                          >
                            Remover
                          </Button>
                        </Box>
                      </Divider>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={5}
                    >
                    </Grid>
                    {/* PaymentMethod */}
                    <Grid item xs={12} sm={6}>
                      <AutocompleteInputControlled
                        name={`${fieldName}.paymentMethod`}
                        label={"Forma de Pagamento"}
                        placeholder={"Selecione uma forma de pagamento"}
                        control={controlStep2}
                        errors={errorsStep2}
                        options={allPaymentMethods && allPaymentMethods.length > 0 ? allPaymentMethods : []}
                        optionLabel={"title"}
                        filterKeys={["title"]}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <CurrencyMaskInputControlled
                        name={`${fieldName}.paymentAmount`}
                        label={"Valor"}
                        control={controlStep2}
                        errors={errorsStep2}
                        startAdornment={"R$"}
                        // Select all text on focus
                        onFocus={(e) => e.target.select()}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextInputControlled
                        type={"number"}
                        name={`${fieldName}.splitQuantity`}
                        label={"Parcelas"}
                        errors={errorsStep2}
                        control={controlStep2}
                        startAdornment={"x"}
                      />
                    </Grid>
                  </Fragment>
                );
              })}
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ marginY: 4 }}>
                <Button
                  variant="text"
                  size={"small"}
                  onClick={() =>
                    appendSalePayments(step2DefaultValueSalePayments)
                  }
                >
                  <AddCircleTwoToneIcon sx={{ marginInlineEnd: 2 }} />
                  Novo Pagamento
                </Button>
              </Divider>
            </Grid>
          </Grid>

          {/* Totais */}
          <Grid container spacing={1} item xs={12}>
            <Grid item xs={12}>
              <Divider textAlign="center" sx={{ marginY: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CalculateIcon />
                  <Typography variant={"h5"}>Totais</Typography>
                </Box>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ marginBottom: 5 }}>
                <Typography variant="body2">
                  Os valores abaixo são calculados automaticamente. Os campos
                  são bloqueados para edição. Use os valores para revisar seus dados.
                </Typography>
              </Alert>
            </Grid>
            <Grid item container xs={12} spacing={5}>
              <Grid item xs={8} sm={4}>
                <TextInputControlled
                  name={"saleAmountDisplay"}
                  label={"Total da Venda (N.F.)"}
                  control={controlStep2}
                  errors={errorsStep2}
                  startAdornment={"R$"}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextInputControlled
                  name={"totalQuantity"}
                  label={"QTDE Total"}
                  control={controlStep2}
                  errors={errorsStep2}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextInputControlled
                  name={"totalCostDisplay"}
                  label={"Custo Total"}
                  control={controlStep2}
                  errors={errorsStep2}
                  startAdornment={"R$"}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextInputControlled
                  name={"totalDiscountDisplay"}
                  label={"Desconto Total"}
                  control={controlStep2}
                  errors={errorsStep2}
                  startAdornment={"R$"}
                  readOnly={true}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* VOLTAR E PROXIMO */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              startIcon={<ChevronLeftIcon />}
              onClick={handleStepBack}
            >
              Voltar
            </Button>
            <Button size="large" endIcon={<ChevronRightIcon />} type="submit" variant="contained" form={"formStep2"}>
              Próximo
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default Step2Form;