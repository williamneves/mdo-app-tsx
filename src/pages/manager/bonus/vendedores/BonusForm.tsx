// ** React Imports
import { useEffect, useState } from "react";

// ** Interfaces Imports
import User from "@src/interfaces/User";
import IBonus, { IBonusEntries } from "@src/interfaces/Bonus";
import Goal from "@src/interfaces/Goal";
import Store from "@src/interfaces/Store";
import Sale from "@src/interfaces/Sale";

// ** MUI Imports
import { Grid, Box, Button, IconButton, Divider, Typography, Alert } from "@mui/material";
import Chip from "src/@core/components/mui/chip/index";

// ** Components Imports
import TextInputControlled from "@views/components/inputs/TextInputControlled";
import CurrencyMaskInputControlled from "@views/components/inputs/CurrencyMaskInputControlled";
import SelectInputController from "@views/components/inputs/SelectInputController";
import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import toast from "react-hot-toast";

import moment from "moment";
import "moment-timezone";


import saleBonusPerVendor from "@src/@utils/bonusUtils";

interface IBonusBrief {
  bonusAmount: number;
  totalSales: number;
  totalBonus: number;
  totalDiscounts: number;
  bonusName: string;
  bonusDescription: string;
}

interface IBonusFormProps {
  employee: Partial<User>;
  bonusAmount: number;
  setBonusAmount: (amount: number) => void;
  bonusStatus: IBonusBrief | null;
  setBonusStatus: (status: IBonusBrief) => void;
  goal: Partial<Goal>;
  store: Partial<Store>;
  sales?: Sale[];
}

export default function BonusForm(props: IBonusFormProps) {
  // ** Props
  const { employee, bonusAmount, setBonusAmount, bonusStatus, setBonusStatus, goal, store, sales } = props;

  // ** States
  const [autoGeneratedBonus, setAutoGeneratedBonus] = useState<IBonusEntries | null>(null);

  const getAutoGeneratedBonus = (index: number) => {
    const bonus = saleBonusPerVendor(sales!, 4);
    const bonusEntries: IBonusEntries = {
      type: "sales",
      value: bonus.bonus,
      operation: "add",
      description: bonus.description
    };
    setAutoGeneratedBonus(bonusEntries);
    // @ts-ignore
    setValue(`bonusEntries[${index}]`, bonusEntries);
  };

  // * Schema
  const schema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório"),
    description: yup.string().nullable(),
    bonusRange: yup
      .object()
      .shape({
        dateStart: yup.date().required("Data de início é obrigatória"),
        dateEnd: yup.date().required("Data de fim é obrigatória")
      })
      .required("Faixa de bônus é obrigatório"),
    bonusEntries: yup.array().of(
      yup.object().shape({
        type: yup.string().required("Tipo é obrigatório"),
        description: yup.string().nullable(),
        operation: yup.string().required("Operação é obrigatória"),
        value: yup.number().required("Valor é obrigatório")
      })
    ),
    paymentType: yup.string().required("Tipo de pagamento é obrigatório"),
    bonusAmount: yup.number().required("Valor do bônus é obrigatório")
  });

  // * Default Values
  const defaultValues: IBonus = {
    inactive: false,
    deleted: false,
    name: "",
    description: "",
    paymentType: "cash",
    bonusRange: {
      dateStart: moment().startOf("month"),
      dateEnd: moment().endOf("month")
    },
    bonusEntries: [
      {
        type: "others",
        description: "",
        operation: "add",
        value: 0
      }
    ],
    bonusAmount: 0,
    goal: goal,
    user: employee,
    store: store
  };

  const bonusEntriesAdd = {
    type: "others",
    description: "",
    operation: "add",
    value: 0
  };

  const bonusEntriesRemove = [
    {
      type: "others",
      description: "",
      operation: "subtract",
      value: 0
    }
  ];

  // * React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "onBlur"
  });

  // * React Hook Form - Field Array
  const {
    fields: bonusEntriesArray,
    append,
    remove
    // @ts-ignore
  } = useFieldArray({
    control,
    name: "bonusEntries"
  });

  const paymentTypesArray = [
    {
      key: "cash",
      value: "cash",
      label: "Dinheiro"
    },
    {
      key: "points",
      value: "points",
      label: "Pontos"
    },
    {
      key: "others",
      value: "others",
      label: "Outros"
    }
  ];

  const bonusTypesArray = [
    {
      key: "sales",
      value: "sales",
      label: "Vendas"
    },
    {
      key: "clientsTaken",
      value: "clientsTaken",
      label: "Clientes Abordados"
    },
    {
      key: "appointmentsCreated",
      value: "appointmentsCreated",
      label: "Consultas Agendadas"
    },
    {
      key: "shareBonus",
      value: "shareBonus",
      label: "Comissão de Participação"
    },
    {
      key: "managerBonus",
      value: "managerBonus",
      label: "Metas Gerenciais"
    },
    {
      key: "others",
      value: "others",
      label: "Outros"
    },
    {
      key: "healthCare",
      value: "healthCare",
      label: "Plano de Saúde"
    },
    {
      key: "generalDiscount",
      value: "generalDiscount",
      label: "Desconto de ajuste"
    }
  ];

  const getBonusAmount = (bonus: IBonus) => {
    let bonusAmount = 0;
    bonus.bonusEntries.forEach((entry) => {
      if (entry.operation === "add") {
        bonusAmount += entry.value;
      } else {
        bonusAmount -= entry.value;
      }
    });
    return bonusAmount;
  };

  const getBonusTotal = (bonus: IBonus) => {
    let bonusTotal = 0;
    bonus.bonusEntries.forEach((entry) => {
      if (entry.operation === "add") {
        bonusTotal += entry.value;
      }
    });
    return bonusTotal;
  };

  const getBonusDiscount = (bonus: IBonus) => {
    let bonusDiscount = 0;
    bonus.bonusEntries.forEach((entry) => {
      if (entry.operation === "subtract") {
        bonusDiscount += entry.value;
      }
    });
    return bonusDiscount;
  };

  const getTotalSalesAmount = (sales: Sale[]) => {
    let totalSalesAmount = 0;
    sales.forEach((sale) => {
      totalSalesAmount += sale.saleAmount;
    });
    return totalSalesAmount;
  };

  // ** Effects
  // * Watch for bonusAmount changes
  useEffect(() => {

    // @ts-ignore
    const subscription = watch(() => {
      let bonusBrief: IBonusBrief = {
        bonusAmount: 0,
        totalSales: 0,
        totalBonus: 0,
        totalDiscounts: 0,
        bonusName: "",
        bonusDescription: ""
      };

      const bonus = getValues();

      bonusBrief.bonusAmount = getBonusAmount(bonus);
      bonusBrief.totalSales = getTotalSalesAmount(sales!);
      bonusBrief.totalBonus = getBonusTotal(bonus);
      bonusBrief.totalDiscounts = getBonusDiscount(bonus);
      bonusBrief.bonusName = bonus.name;
      bonusBrief.bonusDescription = bonus.description;

      setBonusStatus(bonusBrief);
    });

    return () => subscription.unsubscribe();


    // @ts-ignore
  }, [watch]);

  // * Handle Submit
  const onSubmit = (data: IBonus) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={`bonusForm${employee._id}`}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} textAlign="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3
              }}>
              <Typography variant="h6">Informações do Bônus</Typography>
            </Box>
          </Divider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputControlled
            control={control}
            errors={errors}
            name="name"
            label="Nome do Bônus"
            placeholder="Nome do Bônus"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectInputController
            control={control}
            errors={errors}
            name="paymentType"
            label="Forma de Bonificação"
            placeholder="Forma de Bonificação"
            selectItems={{
              items: paymentTypesArray
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputControlled
            multiline
            minRows={4}
            control={control}
            errors={errors}
            name="description"
            label="Descrição"
            placeholder="Descrição"
          />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} textAlign="center">
            <Typography variant="h6">Entradas</Typography>
          </Divider>
          <Grid container spacing={5} item xs={12}>
            {
              !bonusEntriesArray.some((entry) => entry.operation === "add") && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    textAlign="center"
                  >
                    Você não adicionou nenhuma entrada de <b>bônus</b>.
                  </Typography>
                </Grid>
              )
            }
            {bonusEntriesArray.map((bonusEntry, index) => {
              const fieldName = `bonusEntries[${index}]`;

              if (bonusEntry.operation !== "add") return null;

              // Create an array with all add operations
              const bonusEntriesSubtract = bonusEntriesArray.filter(
                (bonusEntry) => bonusEntry.operation === "add"
              );

              const myIndex = bonusEntriesSubtract.findIndex(
                (b) => b.id === bonusEntry.id
              );


              // @ts-ignore
              return (
                <Grid container spacing={5} item xs={12} key={bonusEntry.id}>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} textAlign="left">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}>
                        {`Entrada #${myIndex + 1}`}
                        <Button
                          size="small"
                          onClick={() => remove(index)}
                          sx={{ ml: 2 }}
                          color="error"
                          startIcon={<DeleteTwoToneIcon />}>
                          Remover
                        </Button>
                      </Box>
                    </Divider>
                  </Grid>
                  <Grid item xs={12}>
                    {
                      // @ts-ignore
                      watch(`${fieldName}.type`) === "sales" && autoGeneratedBonus && (
                        <Alert
                          severity="info"
                          sx={{ mb: 2 }}
                        >
                          <Typography variant="body1">
                            Este bônus foi gerado automaticamente, portanto, não é possível alterar o valor.
                          </Typography>
                        </Alert>
                      )
                    }
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <SelectInputController
                      control={control}
                      errors={errors}
                      name={`${fieldName}.operation`}
                      label="Operação"
                      placeholder="Operação"
                      // @ts-ignore
                      readOnly={watch(`${fieldName}.type`) === "sales" && autoGeneratedBonus}
                      selectItems={{
                        items: [
                          {
                            key: "add",
                            value: "add",
                            label: "Bônus"
                          },
                          {
                            key: "subtract",
                            value: "subtract",
                            label: "Desconto"
                          }
                        ]
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <SelectInputController
                      control={control}
                      errors={errors}
                      name={`${fieldName}.type`}
                      label="Tipo"
                      placeholder="Tipo"
                      // @ts-ignore
                      readOnly={watch(`${fieldName}.type`) === "sales" && autoGeneratedBonus}
                      selectItems={{
                        items: bonusTypesArray
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CurrencyMaskInputControlled
                      control={control}
                      errors={errors}
                      name={`${fieldName}.value`}
                      label="Valor"
                      placeholder="Valor"
                      startAdornment={"R$"}
                      onFocus={(e) => e.target.select()}
                      // @ts-ignore
                      readOnly={watch(`${fieldName}.type`) === "sales" && autoGeneratedBonus}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInputControlled
                      multiline
                      minRows={3}
                      control={control}
                      errors={errors}
                      name={`${fieldName}.description`}
                      label="Descrição"
                      placeholder="Descrição"
                      // @ts-ignore
                      readOnly={watch(`${fieldName}.type`) === "sales" && autoGeneratedBonus}
                    />
                  </Grid>
                  {
                    // @ts-ignore
                    watch(`${fieldName}.type`) === "sales" &&
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={() => getAutoGeneratedBonus(index)}
                        sx={{ float: "right" }}
                      >
                        Gerar Bônus de Vendas
                      </Button>
                    </Grid>
                  }
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                  }}>
                  <Button
                    size="small"
                    variant="text"
                    // @ts-ignore
                    onClick={() => append(bonusEntriesAdd)}
                    endIcon={<ControlPointTwoToneIcon />}>
                    Adicionar Entrada
                  </Button>
                </Box>
              </Divider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} textAlign="center">
            <Typography variant="h6">Saídas</Typography>
          </Divider>
          <Grid container spacing={5} item xs={12}>

            {
              !bonusEntriesArray.some((entry) => entry.operation === "subtract") && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    textAlign="center"
                  >
                    Você não adicionou nenhuma entrada de <b>desconto</b>.
                  </Typography>
                </Grid>
              )
            }

            {bonusEntriesArray.map((bonusEntry, index) => {
              const fieldName = `bonusEntries[${index}]`;

              if (bonusEntry.operation === "add") return null;

              // Create an array with all subtract operations
              const bonusEntriesSubtract = bonusEntriesArray.filter(
                (bonusEntry) => bonusEntry.operation === "subtract"
              );

              const myIndex = bonusEntriesSubtract.findIndex(
                (b) => b.id === bonusEntry.id
              );


              return (
                <Grid container spacing={5} item xs={12} key={bonusEntry.id}>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} textAlign="left">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}>
                        {`Saída #${myIndex + 1}`}
                        <Button
                          size="small"
                          onClick={() => remove(index)}
                          sx={{ ml: 2 }}
                          color="error"
                          startIcon={<DeleteTwoToneIcon />}>
                          Remover
                        </Button>
                      </Box>
                    </Divider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <SelectInputController
                      control={control}
                      errors={errors}
                      name={`${fieldName}.operation`}
                      label="Operação"
                      placeholder="Operação"
                      readOnly={true}
                      selectItems={{
                        items: [
                          {
                            key: "subtract",
                            value: "subtract",
                            label: "Desconto",
                            selected: true
                          }
                        ]
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <SelectInputController
                      control={control}
                      errors={errors}
                      name={`${fieldName}.type`}
                      label="Tipo"
                      placeholder="Tipo"
                      selectItems={{
                        items: bonusTypesArray
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CurrencyMaskInputControlled
                      control={control}
                      errors={errors}
                      name={`${fieldName}.value`}
                      label="Valor"
                      placeholder="Valor"
                      startAdornment={"R$"}
                      onFocus={(e) => e.target.select()}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInputControlled
                      multiline
                      minRows={3}
                      control={control}
                      errors={errors}
                      name={`${fieldName}.description`}
                      label="Descrição"
                      placeholder="Descrição"
                    />
                  </Grid>
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                  }}>
                  <Button
                    size="small"
                    variant="text"
                    // @ts-ignore
                    onClick={() => append(bonusEntriesRemove)}
                    endIcon={<ControlPointTwoToneIcon />}>
                    Adicionar Saída
                  </Button>
                </Box>
              </Divider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider
            textAlign={"center"}
          >
            <Typography
              variant={"h6"}
            >
              Totais
            </Typography>
          </Divider>
        </Grid>
        <Grid item xs={12}>
          <Divider
            textAlign={"center"}
          >
            <Typography
              variant={"h6"}
            >
              Ações
            </Typography>
          </Divider>
        </Grid>
        <Grid
          item
          xs={12}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Button
            variant={"outlined"}
            color={"primary"}
            onClick={() => reset()}
          >
            Resetar
          </Button>
          <Button
            variant={"outlined"}
            color={"primary"}
            type={"submit"}
          >
            Salvar Rascunho
          </Button>
          <Button
            variant={"outlined"}
            color={"primary"}
            type={"submit"}
          >
            Lançar Bônus
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
