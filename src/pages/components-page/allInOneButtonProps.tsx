import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import MuiButton from "@mui/material/Button";

// @ts-ignore
export default function Link({ mode, href, children, ...props }) {
  if (mode === "link" || !mode) {
    return (
      <NextLink href={href} passHref>
        <MuiLink {...props}>{children}</MuiLink>
      </NextLink>
    );
  } else if (mode === "button") {
    return (
      <NextLink href={'#'} passHref>
        <MuiButton {...props}>{children}</MuiButton>
      </NextLink>
    );
  }
}