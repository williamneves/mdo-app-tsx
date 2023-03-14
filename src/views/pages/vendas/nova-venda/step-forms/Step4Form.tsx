// ** React Imports
import React, { Fragment } from "react"

// ** MUI Imports
import {
  Box,
  Button,
  Divider,
  Typography,
  Grid,
  Alert,
  TextField,
  FormControlLabel,
  Switch,
  FormGroup,
  Checkbox,
  InputAdornment
} from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"

// ** MUI Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import UpdateIcon from "@mui/icons-material/Update"

// ** Third Party Imports
import moment from "moment"

// ** Import Hooks
import { formattedCurrency } from "src/@utils/formatCurrency"

// ** Rendered Element
interface Step4FormProps {
  onSubmit: any
  handleStepBack: any
  steps: Array<{ title: string; subtitle: string }>
  step4Data: any
  setActiveStep: (value: number) => void
  isSubmitting: boolean
  mode: "create" | "edit"
}

const Step4Form = (props: Step4FormProps): JSX.Element => {
  // ** Props and States
  const {
    onSubmit,
    handleStepBack,
    steps,
    step4Data,
    setActiveStep,
    isSubmitting,
    mode
  } = props

  console.log(step4Data)

  // ** Functions
  // Paid Amount
  const paidAmount = (payments: any) => {
    if (!payments) return 0
    let sum = 0
    payments.forEach((payment: any) => {
      sum += parseFloat(payment.paymentAmount)
    })
    return sum
  }

  // ** Handle Submit
  const handleFinalStep = () => {
    onSubmit(step4Data)
  }

  return (
    <div key={4}>
      <Grid container spacing={5} key={4}>
        <Grid item xs={12}>
          <Typography
            variant='body2'
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {steps[3].title}
          </Typography>
          <Typography variant='caption' component='p'>
            {steps[3].subtitle}
          </Typography>
        </Grid>
        {/* Step 1 Fields */}
        <Grid item xs={12}>
          <Alert severity='info' sx={{ marginBottom: 5 }}>
            <Typography variant='body2'>
              Revise os dados abaixo, e se precisar fazar alguma alteração,
              clique em <ModeEditIcon sx={{ fontSize: "14px" }} /> <b>EDITAR</b>
              .
            </Typography>
            <Typography variant='body2'>
              Se tudo estiver correto, clique em{" "}
              <AddShoppingCartIcon sx={{ fontSize: "14px" }} /> <b>CONFIRMAR</b>
              .
            </Typography>
          </Alert>
          <Divider textAlign='center' sx={{ marginTop: 3, marginBottom: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircleIcon color={"primary"} />
              <Typography variant={"h6"}>01 - Dados Iniciais</Typography>
              <Button
                size={"small"}
                variant='outlined'
                color='primary'
                startIcon={<ModeEditIcon />}
                onClick={() => setActiveStep(0)}
              >
                EDITAR
              </Button>
            </Box>
          </Divider>
        </Grid>
        {/* Sale Number */}
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Sale Number"}
            defaultValue={step4Data["saleNumber"]}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Número no POV */}
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Número no P.D.V"}
            defaultValue={step4Data["PDVNumber"]}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Data da Venda */}
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Data da Venda"}
            defaultValue={moment(step4Data["date"]).format("DD/MM/YYYY")}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Cliente */}
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Cliente"}
            defaultValue={step4Data["client"]?.name}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Vendedor */}
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Vendedor"}
            defaultValue={step4Data["vendor"]?.name}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Loja */}
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Loja"}
            defaultValue={step4Data["store"]?.name}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Step 2 Fields */}
        <Grid item xs={12}>
          <Divider textAlign='center' sx={{ marginTop: 3, marginBottom: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircleIcon color={"primary"} />
              <Typography variant={"h6"}>02 - Dados da Venda</Typography>
              <Button
                size={"small"}
                variant='outlined'
                color='primary'
                startIcon={<ModeEditIcon />}
                onClick={() => setActiveStep(1)}
              >
                EDITAR
              </Button>
            </Box>
          </Divider>
        </Grid>
        {step4Data["products"]?.map((item: any, index: number) => {
          return (
            //  Product Name
            <Fragment key={item.product._id}>
              <Grid item xs={12}>
                <Divider textAlign='left' sx={{ marginY: 0 }}>
                  <Typography variant={"subtitle2"}>
                    {`Produto #${index + 1}`}
                  </Typography>
                </Divider>
              </Grid>
              <Grid container spacing={5} item xs={12}>
                {/* Produto */}
                <Grid item xs={12} sm={4} lg={3}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Produto"}
                    defaultValue={item.product.title}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>
                {/* QTD */}
                <Grid item xs={6} sm={3} lg={2}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"QTD"}
                    defaultValue={item.quantity}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>
                {/* Preço */}
                <Grid item xs={6} sm={3} lg={2}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Preço"}
                    defaultValue={formattedCurrency(item.price)}
                    inputProps={{
                      readOnly: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>R$</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                {/* Custo */}
                <Grid item xs={6} sm={3} lg={3}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Custo"}
                    defaultValue={formattedCurrency(item.cost)}
                    inputProps={{
                      readOnly: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>R$</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                {/* Desconto */}
                <Grid item xs={6} sm={3} lg={2}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Desconto"}
                    defaultValue={formattedCurrency(item.discount)}
                    inputProps={{
                      readOnly: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>R$</InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Fragment>
          )
        })}
        {step4Data["salePayments"]?.map((item: any, index: number) => {
          return (
            //  Product Name
            <Fragment key={item.paymentMethod._id}>
              <Grid item xs={12}>
                <Divider textAlign='left' sx={{ marginY: 0 }}>
                  <Typography variant={"subtitle2"}>
                    {`Pagamento #${index + 1}`}
                  </Typography>
                </Divider>
              </Grid>
              <Grid container spacing={5} item xs={12}>
                {/* Método de Pagamento */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Método de Pagamento"}
                    defaultValue={item.paymentMethod.title}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>
                {/* Valor */}
                <Grid item xs={8} sm={4}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Valor"}
                    defaultValue={formattedCurrency(item.paymentAmount)}
                    inputProps={{
                      readOnly: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>R$</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                {/* Parcelas */}
                <Grid item xs={4} sm={2}>
                  <TextField
                    fullWidth
                    size={"small"}
                    id='form-props-required'
                    label={"Parcelas"}
                    defaultValue={item.splitQuantity}
                    inputProps={{
                      readOnly: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>x</InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Fragment>
          )
        })}
        {/* Step 2 Fields */}
        <Grid item xs={12}>
          <Divider textAlign='center' sx={{ marginTop: 3, marginBottom: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircleIcon color={"primary"} />
              <Typography variant={"h6"}>03 - Outras Informações</Typography>
              <Button
                size={"small"}
                variant='outlined'
                color='primary'
                startIcon={<ModeEditIcon />}
                onClick={() => setActiveStep(2)}
              >
                EDITAR
              </Button>
            </Box>
          </Divider>
        </Grid>
        {/* Origens */}
        <Grid item xs={12}>
          <Typography variant={"body1"}>
            <b>Origens:</b>
          </Typography>
          <FormGroup row>
            {step4Data["origin"]?.map((item: any) => {
              return (
                <Fragment key={item._id}>
                  <FormControlLabel
                    key={item._id}
                    label={item.displayName}
                    control={
                      <Checkbox
                        disabled={true}
                        defaultChecked
                        name='basic-checked'
                      />
                    }
                  />
                </Fragment>
              )
            })}
          </FormGroup>
          {/* Fez Consulta */}
          <FormGroup row>
            <FormControlLabel
              label='Fez Consulta?'
              control={
                <Switch disabled={true} checked={step4Data["schedule"]} />
              }
            />
          </FormGroup>
          {/* Consulta teve Desconto */}
          <FormGroup row>
            {step4Data["schedule"] && (
              <FormControlLabel
                label='Consulta teve Desconto?'
                control={
                  <Switch
                    disabled={true}
                    checked={step4Data["scheduleDiscounted"]}
                  />
                }
              />
            )}
          </FormGroup>
        </Grid>
        {/* Observações */}
        <Grid item xs={12} sm={6}>
          <Typography variant={"body1"}>
            <b>Observações:</b>
          </Typography>
          <Typography variant={"body2"}>
            {step4Data["observations"] || "Sem observações"}
          </Typography>
        </Grid>

        {/* Revisão da Venda Final*/}

        <Grid item xs={12}>
          <Divider textAlign='center' sx={{ marginTop: 3, marginBottom: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant={"h6"}>Resumo da Venda</Typography>
            </Box>
          </Divider>
        </Grid>
        <Grid item xs={12}>
          <Alert severity='info' sx={{ marginBottom: 5 }}>
            <Typography variant='body2'>
              Se todos os datos estiverem corretos, clique em{" "}
              {mode !== "edit" ? (
                <>
                  <b>LANÇAR VENDA</b>
                  <AddShoppingCartIcon sx={{ fontSize: "16px" }} />{" "}
                </>
              ) : (
                <>
                  <b>ATUALIZAR VENDA</b>
                  <UpdateIcon sx={{ fontSize: "16px" }} />{" "}
                </>
              )}
            </Typography>
          </Alert>
        </Grid>
        {/* Data da Venda */}
        <Grid item xs={6} sm={3} lg={3}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Data da Venda"}
            defaultValue={moment(step4Data["date"]).format("DD/MM/YYYY")}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>
        {/* Valor da Nota Fiscal */}
        <Grid item xs={6} sm={3} lg={3}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Valor da Nota Fiscal"}
            defaultValue={formattedCurrency(step4Data["saleAmount"])}
            inputProps={{
              readOnly: true
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>R$</InputAdornment>
              )
            }}
          />
        </Grid>
        {/* Valor Pago */}
        <Grid item xs={6} sm={3} lg={3}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Valor Pago"}
            defaultValue={formattedCurrency(
              paidAmount(step4Data["salePayments"])
            )}
            inputProps={{
              readOnly: true
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>R$</InputAdornment>
              )
            }}
          />
        </Grid>
        {/* Forma de Pagamento */}
        <Grid item xs={6} sm={3} lg={3}>
          <TextField
            fullWidth
            size={"small"}
            id='form-props-required'
            label={"Forma de Pagamento"}
            defaultValue={step4Data["paymentMethod"].title}
            inputProps={{
              readOnly: true
            }}
          />
        </Grid>

        {/* Lançar Venda */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem"
          }}
        >
          <Button
            size='large'
            variant='outlined'
            color='secondary'
            startIcon={<ChevronLeftIcon />}
            onClick={handleStepBack}
            disabled={isSubmitting}
          >
            Voltar
          </Button>
          <LoadingButton
            size='large'
            type='submit'
            variant='contained'
            endIcon={mode !== "edit" ? <AddShoppingCartIcon /> : <UpdateIcon />}
            loadingPosition={"end"}
            loading={isSubmitting}
            onClick={handleFinalStep}
          >
            {mode === "edit"
              ? isSubmitting
                ? "Atualizando..."
                : "Atualizar Venda"
              : isSubmitting
              ? "Lançando Venda"
              : "Lançar Venda"}
          </LoadingButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default Step4Form
