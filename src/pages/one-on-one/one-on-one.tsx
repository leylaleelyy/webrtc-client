import "webrtc-adapter";
import React, { useMemo, useState, useCallback } from "react";
import { RoomState } from "../../common";
import {
  RemoteVideo,
  LocalPreview,
  DevicesSetup,
  RoomSetup,
  StatsChart,
  ThemeSwitch,
} from "../../components";
import "./style.scss";
import { useDevice, useLocalStream, useRoom } from "./hooks";
import {
  Toolbar,
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { PaperSection } from "./style";

import { Menu as MenuIcon } from "@mui/icons-material";

const drawerWidth = 360;

interface LayoutProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export const Producer: React.FC<LayoutProps> = (props) => {
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

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const drawer = useMemo(
    () => (
      <>
        <Divider
          textAlign="center"
          sx={{ height: "64px", alignItems: "center" }}
        >
          <Chip label="SETTINGS" />
        </Divider>
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
            onAction={handleDrawerToggle}
          />
        </PaperSection>
      </>
    ),
    [
      handleDrawerToggle,
      audioDevices,
      audioSelected,
      desktopSelected,
      handleAudioSelect,
      handleDesktopSelect,
      handleReset,
      handleVideoSelect,
      localStreamReady,
      roomState,
      videoDevices,
      videoSelected,
    ]
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        height: "100vh",
        overflow: "auto",
        display: "flex",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          maxHeight: "64px",
          boxSizing: "border-box",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            WebRTC WebApp
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <ThemeSwitch />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Stack>
          <Stack
            divider={<Divider orientation="vertical" flexItem />}
            direction={{ xs: "column", sm: "row" }}
          >
            <PaperSection
              elevation={8}
              sx={{
                flexGrow: 1,
              }}
            >
              <LocalPreview
                videoSelected={videoSelected}
                audioSelected={audioSelected}
                displayDesktop={desktopSelected}
              />
            </PaperSection>
            <PaperSection
              elevation={8}
              sx={{
                flexGrow: 1,
              }}
            >
              <RemoteVideo />
            </PaperSection>
          </Stack>
          <PaperSection elevation={8}>
            <StatsChart />
          </PaperSection>
        </Stack>
      </Box>
    </Box>
  );
};
