import { TextField } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { logger } from "../../common";

export const Logger: FC = () => {
  const [value, setValue] = useState(logger.getLogMessage());
  const loggerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let timer: number;
    timer = window.setInterval(() => {
      const latestMessage = logger.getLogMessage();
      if (latestMessage !== value) {
        setValue(latestMessage);
        const textArea = loggerRef.current?.querySelector("[rows='30']");
        if (textArea) {
          textArea.scrollTop = textArea.scrollHeight;
        }
      }
    }, 1000);
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  });
  return (
    <TextField
      ref={loggerRef}
      fullWidth
      label="Logger"
      multiline
      disabled
      value={value}
      rows={30}
      sx={{ overflow: "auto" }}
    />
  );
};
