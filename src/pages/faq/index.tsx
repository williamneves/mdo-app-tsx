// ** React Imports
import {useState} from "react"

// ** MUI Imports
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import InputAdornment from "@mui/material/InputAdornment"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import TextField from "@mui/material/TextField"

// ** MUI Icons
import SearchIcon from "@mui/icons-material/Search"
import StorefrontIcon from "@mui/icons-material/Storefront"
import TrafficIcon from "@mui/icons-material/Traffic"
import QuizIcon from "@mui/icons-material/Quiz"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import GroupIcon from "@mui/icons-material/Group"

// ** Api Imports
import * as faqApi from "@queries/faqPosts/hooks"
import FaqPost from "interfaces/FaqPost"
import FaqAccordion from "@views/pages/faq/FaqAccordion"
import {matchSorter} from "match-sorter"

const categoryData = {
  vendedores: {
    title: "Vendedores",
    icon: <StorefrontIcon />
  },
  streets: {
    title: "Streets",
    icon: <TrafficIcon />
  },
  gerais: {
    title: "Gerais",
    icon: <QuizIcon />
  },
  ajustesDeConta: {
    title: "Ajustes de Conta",
    icon: <ManageAccountsIcon />
  },
  clientes: {
    title: "Clientes",
    icon: <GroupIcon />
  }
}

// Get Static Props from API
export async function getStaticProps() {
  const faqPosts = await faqApi.getFAQPosts()

  return {
    props: {
      faqPosts
    }
  }
}

const Faq = ({faqPosts}: {faqPosts: FaqPost[]}) => {
  const [search, setSearch] = useState<string>("")

  // Filter the unique categories in faqPosts.category
  const filteredPosts = matchSorter(faqPosts, search, {
    keys: ["question", "answer"]
  })
  const categories = filteredPosts
    .map(faqPost => faqPost.category)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 3
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            paddingX: 6
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
              color: "primary.main"
            }}
          >
            <QuizIcon sx={{fontSize: 36}} />
            <Typography variant="h5">Olá, como podemos ajudar?</Typography>
          </Box>
          <Typography
            variant="subtitle2"
            textAlign={"center"}
            paddingX={4}
            gutterBottom
          >
            Navegue pelas perguntas frequentes ou pesquise abaixo.
          </Typography>
          <FormControl fullWidth={true}>
            <TextField
              value={search}
              onChange={e => setSearch(e.target.value)}
              label={"Pesquise aqui"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} mx={"auto"}>
        {categories.map((category, index) => (
          <Box key={index}>
            <Box sx={{display: "flex", alignItems: "center", mt: 7}}>
              <Avatar variant={"rounded"}>{categoryData[category].icon}</Avatar>
              <Box sx={{ml: 4}}>
                <Typography variant="h6" sx={{lineHeight: "2rem"}}>
                  {categoryData[category].title}
                </Typography>
              </Box>
            </Box>
            <Box sx={{mt: 5}}>
              {filteredPosts.map(question => {
                if (question.category.includes(category))
                  return <FaqAccordion question={question} />
              })}
            </Box>
          </Box>
        ))}
      </Grid>
    </Grid>
  )
}

Faq.acl = {
  subject: "general-page",
  action: "read"
}

export default Faq
