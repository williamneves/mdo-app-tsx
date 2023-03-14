// ** React Imports
import { Fragment, useState } from "react"
import { PortableText } from "@portabletext/react"
import { getImageUrl } from "src/configs/sanityConfig"
import AccordionSummary from "@mui/material/AccordionSummary"
import ChevronDown from "mdi-material-ui/ChevronDown"
import Typography from "@mui/material/Typography"
import AccordionDetails from "@mui/material/AccordionDetails"
import Accordion from "@mui/material/Accordion"
import FaqPost from "interfaces/FaqPost"

// ** Rendered Element
interface FaqAccordionProps {
  question: FaqPost
}

const components = {
  types: {
    image: (props: any) => {
      const { value } = props
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0.5rem"
          }}
        >
          <img
            src={getImageUrl(value.asset._ref).url()}
            alt={value.alt}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
              objectPosition: "center",
              margin: "1rem 0"
            }}
          />
        </div>
      )
    }
  }
}

const FaqAccordion = ({ question }: FaqAccordionProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Fragment>
      <Accordion
        key={question._id}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary
          expandIcon={<ChevronDown />}
          id={`faq-accordion--header`}
          aria-controls={`faq-accordion--content`}
        >
          <Typography
            variant={"subtitle1"}
            sx={{ lineHeight: "2rem", fontSize: "1.125rem" }}
          >
            {question.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PortableText components={components} value={question.answer} />
        </AccordionDetails>
      </Accordion>
    </Fragment>
  )
}

export default FaqAccordion
