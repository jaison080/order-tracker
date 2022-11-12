import { createTheme, ThemeProvider } from "@mui/material";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Montserrat",
        textTransform: "none",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
