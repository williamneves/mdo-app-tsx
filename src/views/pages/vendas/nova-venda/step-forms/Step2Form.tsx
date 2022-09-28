// ** React Imports
import CurrencyMaskInputControlled from "components/inputs/CurrencyMaskInputControlled";
import React, { useState, useEffect, Fragment } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import LocalOfferTwoToneIcon from "@mui/icons-material/LocalOfferTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import { Button, Grid, Typography, Divider, Box, Alert } from "@mui/material";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// ** Import Components
import TextInputControlled from "components/inputs/TextInputControlled";
import DateInputControlled from "components/inputs/DateInputControlled";
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled";

// ** Import Context and Queries
import * as salesQ from "src/queries/sales";
import * as salesHooks from "src/queries/sales/hooks";

// ** Import Hooks
import { useAuth } from "src/hooks/useAuth";
import { getAllObjectKeys, filterListByKeyValue } from "src/@core/utils/filters";


// ** Rendered Element
interface Step2FormProps {
  onSubmit: any;
  handleStepBack: any;
  steps: Array<{ title: string, subtitle: string }>;
}

const Step2Form = (props: Step2FormProps): JSX.Element => {

  // ** Props and States
  const {
    onSubmit,
    handleStepBack,
    steps
  } = props;

  // ** Api and Context
  const { user: userDB, selectedStore } = useAuth();
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

  // ** Step 2 Dependencies
  // Step 2 Default Values
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
    saleAmount: 0,
    totalQuantity: 1,
    totalCost: 0,
    totalDiscount: 0,
    // Invisible fields
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

  // Step 2 Schema
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
    clearErrors: clearErrorsStep2,
    formState: { errors: errorsStep2 }
  } = useForm({
    defaultValues: step2DefaultValueFields,
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
    replace: replaceSalePayments
  } = useFieldArray({
    control: controlStep2,
    name: "salePayments"
  });

  return (
    <Fragment>
      <form key={1} onSubmit={handleSubmitStep2(onSubmit)} id={"formStep2"}>
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
                        placeholder={"Selecione um produto"}
                        control={controlStep2}
                        errors={errorsStep2}
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
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}
                wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              startIcon={<ChevronLeftIcon />}
              onClick={handleStepBack}
            >
              Voltar
            </Button>
            <Button size="large" endIcon={<ChevronRightIcon />} type="submit" variant="contained" form={"formStep1"}>
              Próximo
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );

};


export default Step2Form;