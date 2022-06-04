import { Paper } from "@mui/material";
import { styled } from "@mui/system";

export const PaperSection = styled(Paper)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: "60px",
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  boxSizing: "border-box",
}));
