import "webrtc-adapter";
import React from "react";
import { RoomState } from "../../common";
import {
  RemoteVideo,
  LocalPreview,
  DevicesSetup,
  RoomSetup,
  StatsChart,
} from "../../components";
import "./style.scss";
import { useDevice, useLocalStream, useRoom } from "./hooks";
import { Grid } from "@mui/material";
import { PaperSection } from "./style";

export const Producer: React.FC = () => {
  const { localStreamReady } = useLocalStream();
  const { roomState } = useRoom();
  const {
    videoSelected,
    audioSelected,
    videoDevices,
    audioDevices,
    desktopSelected,
    handleDesktopSelect,
    handleVideoSelect,
    handleAudioSelect,
    handleReset,
  } = useDevice();

  return (
    <Grid container padding={1} style={{ height: "calc(100% - 64px)" }}>
      <Grid item xs={3}>
        <PaperSection elevation={8}>
          <DevicesSetup
            videoDevices={videoDevices}
            onVideoSelect={handleVideoSelect}
            audioDevices={audioDevices}
            onAudioSelect={handleAudioSelect}
            videoSelected={videoSelected}
            audioSelected={audioSelected}
            desktopSelected={desktopSelected}
            onDesktopSelect={handleDesktopSelect}
            onReset={handleReset}
          />
        </PaperSection>
        <PaperSection elevation={8}>
          <RoomSetup
            enterDisabled={!localStreamReady || roomState !== RoomState.leave}
            leaveDisabled={roomState === RoomState.leave}
          />
        </PaperSection>
      </Grid>
      <Grid item xs sx={{ height: "100%" }}>
        <PaperSection elevation={8}>
          <LocalPreview
            videoSelected={videoSelected}
            audioSelected={audioSelected}
            displayDesktop={desktopSelected}
          />
          <RemoteVideo />
        </PaperSection>
      </Grid>
      <Grid item xs={3} sx={{ height: "100%", maxHeight: "100%" }}>
        <PaperSection elevation={8}>
          <StatsChart />
        </PaperSection>
      </Grid>
    </Grid>
  );
};
