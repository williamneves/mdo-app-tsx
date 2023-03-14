// ** React Imports
import React, {useState} from "react"

// ** MUI Imports
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import CardContent from "@mui/material/CardContent"

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline"
import EyeOffOutline from "mdi-material-ui/EyeOffOutline"

// ** Custom Components
import TextInputControlled from "components/inputs/TextInputControlled"

// ** Hooks Imports
import * as auth from "src/@auth/authHooks"
import {useForm} from "react-hook-form"

// ** Yup Imports
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup/dist/yup"

// ** Third party imports
import toast from "react-hot-toast"

// ** Types
interface PasswordAdornmentProps {
  showPasswordState: boolean
  setShowPassword: React.Dispatch<boolean>
}

const TabSecurity = () => {
  // ** States
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const schema = yup.object().shape({
    oldPassword: yup.string().required("Este campo é obrigatório"),
    newPassword: yup.string().required("Este campo é obrigatório"),
    confirmPassword: yup
      .string()
      .test("equal", "As senhas não conferem", value =>
        verifyPasswordEquality(value as string)
      )
      .required("Este campo é obrigatório")
  })

  const defaultValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }

  const {
    handleSubmit,
    formState: {errors},
    control,
    getValues,
    reset
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema)
  })

  // Verify confirm password is equal to oldPassword
  const verifyPasswordEquality = (confirmPassword: string): boolean =>
    getValues("newPassword") === confirmPassword

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Salvando...")
    const {oldPassword, newPassword} = data
    try {
      await auth.changePassword(oldPassword, newPassword)
      toast.success("Senha alterada com sucesso!", {id: toastId})
      reset(defaultValues)
    } catch (e) {
      console.log(e)
      const errorMessage = e === "Login inválido" ? "Login inválido" : ""
      toast.error(`Erro ao alterar senha! ${errorMessage}`, {id: toastId})
    }
  }

  const PasswordAdornment = ({
    showPasswordState,
    setShowPassword
  }: PasswordAdornmentProps) => (
    <IconButton onClick={() => setShowPassword(!showPasswordState)}>
      {showPasswordState ? <EyeOutline /> : <EyeOffOutline />}
    </IconButton>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} sx={{mt: 5, mb: [0, 6]}}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TextInputControlled
                  name={"oldPassword"}
                  label={"Senha atual"}
                  type={showOldPassword ? "text" : "password"}
                  control={control}
                  errors={errors}
                  InputProps={{
                    endAdornment: (
                      <PasswordAdornment
                        showPasswordState={showOldPassword}
                        setShowPassword={setShowOldPassword}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputControlled
                  name={"newPassword"}
                  label={"Nova senha"}
                  type={showNewPassword ? "text" : "password"}
                  control={control}
                  errors={errors}
                  InputProps={{
                    endAdornment: (
                      <PasswordAdornment
                        showPasswordState={showNewPassword}
                        setShowPassword={setShowNewPassword}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputControlled
                  name={"confirmPassword"}
                  label={"Confirmar nova senha"}
                  type={showConfirmPassword ? "text" : "password"}
                  control={control}
                  errors={errors}
                  InputProps={{
                    endAdornment: (
                      <PasswordAdornment
                        showPasswordState={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                      />
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              mt: 2.5,
              alignItems: "flex-end",
              justifyContent: "center"
            }}
          >
            <img
              alt="avatar"
              src="/images/pages/account-settings-security-illustration.png"
            />
          </Grid>
        </Grid>
        <Divider sx={{mt: 0, mb: 6}} />
        <Box>
          <Button type={"submit"} variant="contained" sx={{mr: 4}}>
            Mudar Senha
          </Button>
          <Button
            type="reset"
            variant="outlined"
            color="secondary"
            onClick={() => reset()}
          >
            Cancelar
          </Button>
        </Box>
      </CardContent>
    </form>
  )
}

export default TabSecurity
