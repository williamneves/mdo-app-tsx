// ** React Imports
import React, {useState, Fragment, ChangeEvent} from "react"

// ** MUI Imports
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import {styled} from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import {LoadingButton} from "@mui/lab"

// ** Third Party Imports
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import toast from "react-hot-toast"

// ** Hooks
import {useForm} from "react-hook-form"
import {useAuth} from "src/hooks/useAuth"

// ** Custom Components
import TextInputControlled from "components/inputs/TextInputControlled"

// ** Import Sanity Config
import {dbClient, getImageUrl} from "src/configs/sanityConfig"
import AuthUser from "src/interfaces/authUser"

const ImgStyled = styled("img")(({theme}) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({theme}) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center"
  }
}))

const ResetButtonStyled = styled(Button)(({theme}) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(4)
  }
}))

interface Props {
  userDB: AuthUser
}

const TabAccount = ({userDB}: Props) => {
  const {name, email, role, imageAsset, imageURL, profile, stores} = userDB
  const initialProfilePhoto = imageAsset
    ? getImageUrl(imageAsset).url()
    : imageURL

  const {updateUser} = useAuth()

  const schema = yup.object().shape({
    name: yup.string().required("O Nome não pode estar vazio"),
    position: yup.string().required("O Cargo não pode estar vazio")
  })

  const {
    handleSubmit,
    formState: {errors},
    control,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name,
      position: profile?.jobTitle
    }
  })

  // ** States
  const [imgSrc, setImgSrc] = useState(initialProfilePhoto)
  const [newImage, setNewImage] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onChangeFile = async (file: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    const {files} = file.target

    if (files && files.length !== 0) {
      reader.onload = () => {
        setImgSrc(reader.result as any)
      }
      reader.readAsDataURL(files[0])

      setImgSrc(files[0] as any)
      setNewImage(files[0])
    }
  }

  const onSubmit = async (data: {name: string; position: string}) => {
    const toastId = toast.loading("Atualizando informações...")
    setIsLoading(true)

    const newDataObj: {
      name: string
      profile: {
        jobTitle: string
      }
      imageAsset?: any
    } = {
      name: data.name,
      profile: {
        jobTitle: data.position
      }
    }

    if (newImage) {
      try {
        dbClient.assets.upload("image", newImage).then(imageAsset => {
          newDataObj.imageAsset = {
            _type: "image",
            asset: {
              _ref: imageAsset._id,
              _type: "reference"
            }
          }
          updateUser({
            newInfo: newDataObj
          })
          toast.success("Informações atualizadas com sucesso!", {id: toastId})
        })
      } catch (e) {
        toast.error("Erro ao atualizar informações", {id: toastId})
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        await updateUser({
          newInfo: newDataObj
        })
        toast.success("Informações atualizadas com sucesso!", {id: toastId})
      } catch (e) {
        toast.error("Erro ao atualizar informações", {id: toastId})
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{my: 5}}>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <ImgStyled src={imgSrc} alt={name} />
              <Box>
                <ButtonStyled
                  // @ts-ignore
                  component={"label"}
                  variant={"contained"}
                  disabled={isLoading}
                >
                  Trocar Foto
                  <input
                    hidden
                    type={"file"}
                    onChange={onChangeFile}
                    accept={"image/png, image/jpeg"}
                    id={"account-settings-upload-image"}
                  />
                </ButtonStyled>
                <ResetButtonStyled
                  disabled={isLoading}
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    setImgSrc(initialProfilePhoto)
                    setNewImage(null)
                  }}
                >
                  Cancelar
                </ResetButtonStyled>
                <Typography sx={{mt: 4}} component="p" variant="caption">
                  Permitido apenas imagens de até 2MB
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInputControlled
              fullWidth
              label={"Cargo"}
              name={"position"}
              control={control}
              errors={errors}
              disabled={role !== "admin"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInputControlled
              fullWidth
              label={"Nome"}
              name={"name"}
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type={"email"}
              label={"Email"}
              placeholder={email}
              defaultValue={email}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Loja"
              placeholder={stores[0]?.name}
              defaultValue={stores[0]?.name}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <LoadingButton
              type={"submit"}
              variant={"contained"}
              sx={{mr: 4}}
              loading={isLoading}
            >
              Salvar mudanças
            </LoadingButton>
            <Fragment></Fragment>
            <LoadingButton
              onClick={() => reset()}
              variant={"outlined"}
              color={"secondary"}
              loading={isLoading}
              component={"button"}
            >
              Cancelar mudanças
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
