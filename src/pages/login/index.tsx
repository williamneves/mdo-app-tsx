// ** React Imports
import {useState, ReactNode, MouseEvent} from "react"

// ** Next Imports
import Link from "next/link"

// ** MUI Components
import Alert from "@mui/material/Alert"
import MuiLink from "@mui/material/Link"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import InputLabel from "@mui/material/InputLabel"
import IconButton from "@mui/material/IconButton"
import Box, {BoxProps} from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import useMediaQuery from "@mui/material/useMediaQuery"
import OutlinedInput from "@mui/material/OutlinedInput"
import {styled, useTheme} from "@mui/material/styles"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import Typography, {TypographyProps} from "@mui/material/Typography"
import MuiFormControlLabel, {
  FormControlLabelProps
} from "@mui/material/FormControlLabel"

// ** Icons Imports
import Google from "mdi-material-ui/Google"
import EyeOutline from "mdi-material-ui/EyeOutline"
import EyeOffOutline from "mdi-material-ui/EyeOffOutline"

// ** Third Party Imports
import * as yup from "yup"
import {useForm, Controller} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"

// ** Hooks
import {useAuth} from "src/hooks/useAuth"
import useBgColor from "src/@core/hooks/useBgColor"
import {useSettings} from "src/@core/hooks/useSettings"

// ** Configs
import themeConfig from "src/configs/themeConfig"

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout"

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2"

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({theme}) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled("img")(({theme}) => ({
  maxWidth: "48rem",
  [theme.breakpoints.down("xl")]: {
    maxWidth: "38rem"
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: "30rem"
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({theme}) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 400
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({theme}) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({theme}) => ({
  fontWeight: 600,
  letterSpacing: "0.18px",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: {marginTop: theme.spacing(8)}
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({theme}) => ({
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary
    }
  })
)

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Insira um email válido")
    .required("Email é obrigatório"),
  password: yup.string().min(6, "Mín 6 dígitos").required("Senha é obrigatória")
})

const defaultValues = {
  password: "",
  email: ""
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgClasses = useBgColor()
  const {settings} = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down("md"))

  // ** Vars
  const {skin} = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const {email, password} = data
    auth.login({email, password}, () => {
      setError("email", {
        type: "manual",
        message: "Email ou Senha inválida"
      })
    })
  }

  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : "auth-v2-login-illustration"

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt="login-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? {borderLeft: `1px solid ${theme.palette.divider}`}
            : {}
        }
      >
        <Box
          sx={{
            p: 7,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper"
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <svg
                width={47}
                fill="none"
                height={26}
                viewBox="0 0 268 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fillOpacity="0.4"
                  fill="url(#paint0_linear_7821_79167)"
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fillOpacity="0.4"
                  fill="url(#paint1_linear_7821_79167)"
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)"
                />
                <defs>
                  <linearGradient
                    y1="0"
                    x1="25.1443"
                    x2="25.1443"
                    y2="143.953"
                    id="paint0_linear_7821_79167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    y1="0"
                    x1="25.1443"
                    x2="25.1443"
                    y2="143.953"
                    id="paint1_linear_7821_79167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <Typography
                variant="h6"
                sx={{
                  ml: 2,
                  lineHeight: 1,
                  fontWeight: 700,
                  fontSize: "1.5rem !important"
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{mb: 6}}>
              <TypographyStyled variant="h5">{`Bem vindo ao ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
              <Typography variant="body2">
                Por favor entre com a sua conta e comece a aventura
              </Typography>
            </Box>
            <Alert
              icon={false}
              sx={{
                py: 3,
                mb: 6,
                ...bgClasses.primaryLight,
                "& .MuiAlert-message": {p: 0}
              }}
            >
              <Typography
                variant="caption"
                sx={{mb: 2, display: "block", color: "primary.main"}}
              >
                O seu email é seu primeiro nome + ultimo nome +
                _mdo@wisefam.com.br
              </Typography>
              <Typography
                variant="caption"
                sx={{display: "block", color: "primary.main"}}
              >
                Exemplo: <strong>anamaria_mdo@wisefam.com.br</strong>
              </Typography>
            </Alert>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{mb: 4}}>
                <Controller
                  name="email"
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange, onBlur}}) => (
                    <TextField
                      autoFocus
                      id={"email"}
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder="seunome_mdo@wisefam.com.br"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText
                    id="email-helper-text"
                    sx={{color: "error.main"}}
                  >
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="auth-login-v2-password"
                  error={Boolean(errors.password)}
                >
                  Senha
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange, onBlur}}) => (
                    <OutlinedInput
                      id="password"
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText
                    sx={{color: "error.main"}}
                    id="password-helper-text"
                  >
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between"
                }}
              >
                <FormControlLabel
                  label="Lembrar-me"
                  control={<Checkbox />}
                  sx={{
                    "& .MuiFormControlLabel-label": {color: "text.primary"}
                  }}
                />
                <Link passHref href="/forgot-password">
                  <Typography
                    component={MuiLink}
                    variant="body2"
                    sx={{color: "primary.main"}}
                  >
                    Esqueceu sua senha?
                  </Typography>
                </Link>
              </Box>
              <Button
                fullWidth
                id="login-button"
                disabled={
                  (Boolean(errors?.email) || Boolean(errors?.password)) &&
                  errors?.email?.message !== "Email ou Senha inválida"
                }
                size="large"
                type="submit"
                variant="contained"
                sx={{
                  mb: 7
                }}
              >
                Entrar
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center"
                }}
              >
                <Typography sx={{mr: 2, color: "text.secondary"}}>
                  Novo na nossa plataforma?
                </Typography>
                <Typography>
                  <Link passHref href="/register">
                    <Typography
                      component={MuiLink}
                      sx={{color: "primary.main"}}
                    >
                      Crie sua conta
                    </Typography>
                  </Link>
                </Typography>
              </Box>
              {/* <Divider sx={{mt: 5, mb: 7.5, "& .MuiDivider-wrapper": {px: 4}}}>
                ou
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Link href="/" passHref>
                  <IconButton
                    id="google-login-button"
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Google sx={{color: "#db4437"}} />
                  </IconButton>
                </Link>
              </Box> */}
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
