import { FC, useMemo, useState } from "react";
import { Producer } from "./pages";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { ColorModeContext } from "./components";

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
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Producer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
