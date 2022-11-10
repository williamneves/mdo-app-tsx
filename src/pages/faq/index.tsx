// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import AccordionSummary from "@mui/material/AccordionSummary";
import ChevronDown from "mdi-material-ui/ChevronDown";
import Avatar from "@mui/material/Avatar";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";

// ** MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/material/Accordion";
import Cellphone from "mdi-material-ui/Cellphone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const data = [
  {
    id: 1,
    title: "Comuns",
    icon: Cellphone,
    questions: [
      {
        id: 1,
        question: "Como cadastrar um novo cliente?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        expanded: false
      },
      {
        id: 2,
        question: "Como lançar uma venda?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        expanded: false
      }
    ]
  },
  {
    id: 2,
    title: "Conta",
    icon: AccountCircleIcon,
    questions: [
      {
        id: 1,
        question: "Como mudar a senha?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        expanded: false
      }
    ]
  }
];

type Question = typeof data[0];

const Faq = () => {

  const [dataState, setQuestionsState] = useState<Question[]>(data);

  const handleExpandClick = (dataID: number, questionID: number) => {
    setQuestionsState((prevState) => {
      const question = prevState.find((item) => item.id === dataID)?.questions.find((item) => item.id === questionID);
      if (question) {
        question.expanded = !question.expanded;
      }
      return [...prevState];
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredData: Question[] = [];
    data.map((item) => {
      const questions = item.questions.filter((question) =>
        question.question.toLowerCase().includes(event.target.value.toLowerCase()));
      if (questions.length > 0) {
        filteredData.push({ ...item, questions });
      }
    });
    setQuestionsState(filteredData);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 3 }}>
        <Typography variant="h4" gutterBottom>Olá, como podemos ajudar?</Typography>
        <Typography variant="subtitle2" gutterBottom>
          ou escolha uma categoria para encontrar rapidamente a ajuda de que precisa
        </Typography>
        <FormControl>
          <TextField
            onChange={handleChange}
            label={"Faça uma pergunta"}
            inputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} margin={"auto"}>
        {
          dataState.map((data, index) => (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 7 }}>
                <Avatar variant={"rounded"}>
                  <data.icon sx={{ fontSize: "1.375rem" }} />
                </Avatar>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="h6" sx={{ lineHeight: "2rem" }}>
                    {data.title}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 5 }}>
                {
                  data.questions.map((question) => (
                    <Accordion
                      key={index}
                      expanded={question.expanded}
                      onChange={() => handleExpandClick(data.id, question.id)}
                    >
                      <AccordionSummary
                        expandIcon={<ChevronDown />}
                        id={`faq-accordion--header`}
                        aria-controls={`faq-accordion--content`}
                      >
                        <Typography>{question.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{question.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))
                }
              </Box>
            </Box>
          ))
        }
      </Grid>
    </Grid>
  );
};

export default Faq;