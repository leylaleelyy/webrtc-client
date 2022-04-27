import { FC, useMemo, useState } from "react";
import { Producer } from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { ColorModeContext, Header } from "./components";

const App: FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              bgcolor: "background.default",
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Header />
            <Routes>
              <Route path="/one-on-one" element={<Producer />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
};

export default App;
