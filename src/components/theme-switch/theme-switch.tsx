import { IconButton, useTheme } from "@mui/material";
import { createContext, useContext } from "react";
import { BrightnessLow, BrightnessHigh } from "@mui/icons-material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={colorMode.toggleColorMode}
      color="inherit"
    >
      {theme.palette.mode === "dark" ? <BrightnessLow /> : <BrightnessHigh />}
    </IconButton>
  );
};
