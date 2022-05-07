import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
} from "@mui/material";
import {
  PhotoCameraOutlined,
  GraphicEqOutlined,
  DvrOutlined,
  RotateLeftOutlined,
} from "@mui/icons-material";
import { FC, ChangeEvent } from "react";

export interface DeviceSetupProps {
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  videoSelected: string;
  audioSelected: string;
  desktopSelected: boolean;
  onDesktopSelect: (event: ChangeEvent<HTMLInputElement>) => void;
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
    desktopSelected,
    onDesktopSelect: handleDesktopSelect,
    onVideoSelect: handleVideoSelect,
    onAudioSelect: handleAudioSelect,
    onReset: handleReset,
  } = props;

  return (
    <Stack>
      <FormControl>
        <Divider textAlign="left">
          <PhotoCameraOutlined
            sx={{ marginRight: 1, verticalAlign: "middle", fontSize: "24px" }}
          />
          <span style={{ verticalAlign: "middle" }}>Video Device Selector</span>
        </Divider>
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
      <FormControl>
        <Divider textAlign="left">
          <GraphicEqOutlined
            sx={{ marginRight: 1, verticalAlign: "middle", fontSize: "24px" }}
          />
          <span style={{ verticalAlign: "middle" }}>Audio Device Selector</span>
        </Divider>
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
      <FormControl>
        <Divider textAlign="left">
          <DvrOutlined
            sx={{ marginRight: 1, verticalAlign: "middle", fontSize: "24px" }}
          />
          <span style={{ verticalAlign: "middle" }}>Desktop Selector</span>
        </Divider>

        <FormControlLabel
          control={
            <Checkbox
              checked={desktopSelected}
              onChange={handleDesktopSelect}
            />
          }
          label="Share Desktop"
        />
      </FormControl>
      <Button onClick={handleReset}>
        <RotateLeftOutlined sx={{ marginRight: 1 }} />
        Reset
      </Button>
    </Stack>
  );
};
