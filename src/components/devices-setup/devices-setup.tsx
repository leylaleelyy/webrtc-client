import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { FC, ChangeEvent } from "react";

export interface DeviceSetupProps {
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  videoSelected: string;
  audioSelected: string;
  onVideoSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onAudioSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const DevicesSetup: FC<DeviceSetupProps> = (props) => {
  const {
    videoDevices,
    audioDevices,
    videoSelected,
    audioSelected,
    onVideoSelect: handleVideoSelect,
    onAudioSelect: handleAudioSelect,
    onReset: handleReset,
  } = props;

  return (
    <Stack>
      <FormControl>
        <FormLabel>Video Device Selector</FormLabel>
        <RadioGroup onChange={handleVideoSelect}>
          {videoDevices.map((device) => (
            <FormControlLabel
              key={device.deviceId}
              value={device.deviceId}
              control={<Radio checked={device.deviceId === videoSelected} />}
              label={device.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <FormControl>
        <FormLabel>Audio Device Selector</FormLabel>
        <RadioGroup onChange={handleAudioSelect}>
          {audioDevices.map((device) => (
            <FormControlLabel
              key={device.deviceId}
              value={device.deviceId}
              control={<Radio checked={device.deviceId === audioSelected} />}
              label={device.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Button onClick={handleReset}>Reset</Button>
    </Stack>
  );
};
