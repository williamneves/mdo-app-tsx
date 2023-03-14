// ** React Imports
import { yupResolver } from "@hookform/resolvers/yup/dist/yup"

// ** MUI Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import RestartAltIcon from "@mui/icons-material/RestartAlt"

// ** MUI Imports
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography
} from "@mui/material"

// ** Import Components
import AutocompleteInputControlled from "components/inputs/AutocompleteInputControlled"
import TextInputControlled from "components/inputs/TextInputControlled"
import React, { Fragment, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"

// ** Import Hooks

// ** Import Context and Queries
import * as salesQ from "src/queries/sales"

// ** Third Party Imports
import * as yup from "yup"

// ** Rendered Element
interface Step3FormProps {
  setHasErrors: (value: boolean) => void
  onSubmit: any
  handleStepBack: any
  steps: Array<{ title: string; subtitle: string }>
  step3Data: any
  mode: "create" | "edit"
}

const Step3Form = (props: Step3FormProps): JSX.Element => {
  // ** Props and States
  const { setHasErrors, onSubmit, handleStepBack, steps, step3Data, mode } =
    props

  // ** Fetchs
  const { data: allOrigins } = salesQ.useAllOriginQuery()

  // *** Start Step 3 Dependencies

  // *** Step 3 Default Values
  const step3DefaultValue = {
    origin: [],
    schedule: false,
    scheduleDiscount: false,
    observations: ""
  }

  // ** Step 3 Schema
  const step3Schema = yup.object().shape({
    observations: yup.string().nullable(),
    // Array of strings
    origin: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().nullable()
        })
      )
      .min(1, "Selecione pelo menos uma origem")
      .required("Selecione pelo menos uma origem")
      .nullable(),
    schedule: yup.boolean(),
    scheduleDiscounted: yup.boolean()
  })

  // ** Step 3 Form Hook
  const {
    reset: resetStep3,
    control: controlStep3,
    handleSubmit: handleSubmitStep3,
    setValue: setValueStep3,
    watch: watchStep3,
    formState: {
      errors: errorsStep3,
      isDirty: isDirtyStep3,
      isValid: isValidStep3,
      submitCount: submitCountStep3
    }
  } = useForm({
    defaultValues: step3Data || step3DefaultValue,
    resolver: yupResolver(step3Schema),
    mode: "onSubmit"
  })

  // *** Step 3 Functions
  // ** Reset Form
  useEffect(() => {
    if (step3Data === null) {
      resetStep3()
    }
  }, [step3Data])

  // ** Set Validation Step
  useEffect(() => {
    if (!isValidStep3 && submitCountStep3 > 0) {
      toast.error("Verifique os campos obrigatórios")
      setHasErrors(!isValidStep3)
    }
  }, [isValidStep3, submitCountStep3, isDirtyStep3])

  // * set scheduleDiscount to false if schedule is false
  useEffect(() => {
    // Subscribe to watchStep3
    const watchSubscription = watchStep3((value, { name }) => {
      if (name === "schedule" && value.schedule === false) {
        setValueStep3("scheduleDiscount", false)
      }
    })

    // Cleanup subscription on unmount
    return () => watchSubscription.unsubscribe()
  }, [watchStep3])

  // *** End Step 3 Dependencies

  return (
    <Fragment>
      <form key={1} onSubmit={handleSubmitStep3(onSubmit)} id={"formStep3"}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography
              variant='body2'
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {steps[2].title}
            </Typography>
            <Typography variant='caption' component='p'>
              {steps[2].subtitle}
            </Typography>
          </Grid>

          {/* Step 3 Fields */}
          <Grid item xs={12} lg={9}>
            <AutocompleteInputControlled
              name='origin'
              label='Como conheceu a loja?'
              placeholder='Meio de divulgação'
              control={controlStep3}
              options={allOrigins && allOrigins.length > 0 ? allOrigins : []}
              optionLabel='displayName'
              filterKeys={["displayName"]}
              multiple
              errors={errorsStep3}
              limitTags={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='schedule'
                control={controlStep3}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <FormGroup row>
                    <FormControlLabel
                      label='Fez Consulta?'
                      control={<Switch checked={value} onChange={onChange} />}
                    />
                  </FormGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='scheduleDiscount'
                control={controlStep3}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <FormGroup row>
                    <FormControlLabel
                      label='Consulta com Desconto?'
                      control={
                        <Switch
                          checked={value}
                          onChange={onChange}
                          disabled={!watchStep3("schedule")}
                        />
                      }
                    />
                  </FormGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInputControlled
              name={"observations"}
              label={"Mais informações"}
              errors={errorsStep3}
              control={controlStep3}
              multiline
              rows={5}
            />
          </Grid>

          {/* VOLTAR E PROXIMO */}
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
            >
              Voltar
            </Button>
            {mode === "edit" && (
              <Button
                size='large'
                variant='outlined'
                color='secondary'
                endIcon={<RestartAltIcon />}
                onClick={() => resetStep3()}
              >
                Desfazer
              </Button>
            )}
            <Button
              size='large'
              endIcon={<ChevronRightIcon />}
              type='submit'
              variant='contained'
              form={"formStep3"}
            >
              Próximo
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  )
}

export default Step3Form
