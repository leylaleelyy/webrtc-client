import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { streamManager } from "../../../common";

export const useDevice = () => {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

  const [videoSelected, setVideoSelected] = useState("");
  const [audioSelected, setAudioSelected] = useState("");

  const [desktopSelected, setDesktopSelected] = useState(false);

  const handleDeviceChange = useCallback(() => {
    // todo: navigator.mediaDevices supported?
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      // todo: add output selector，only Chrome
      setVideoDevices(devices.filter((d) => d.kind === "videoinput"));
      setAudioDevices(devices.filter((d) => d.kind === "audioinput"));
    });
  }, []);

  useEffect(() => {
    streamManager
      .requestPermission()
      .then(() => {
        handleDeviceChange();
      })
      .catch((e) => {
        console.error("request permission error !!!", e);
      });

    // when http cannot get mediaDevices
    navigator.mediaDevices?.addEventListener(
      "devicechange",
      handleDeviceChange
    );

    return () => {
      navigator.mediaDevices?.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [handleDeviceChange]);

  const handleVideoSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setVideoSelected(e.target.value);
      setDesktopSelected(false);
    }
  }, []);

  const handleAudioSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setAudioSelected(e.target.value);
      setDesktopSelected(false);
    }
  }, []);

  const handleResetDevice = useCallback(() => {
    setVideoSelected("");
    setAudioSelected("");
    setDesktopSelected(false);
  }, []);

  const handleDesktopSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        handleResetDevice();
      }
      setDesktopSelected(e.target.checked);
    },
    [handleResetDevice]
  );

  const handleReset = useCallback(() => {
    handleResetDevice();
    setDesktopSelected(false);
    streamManager.resetLocalStream();
  }, [handleResetDevice]);

  return {
    videoSelected,
    audioSelected,
    desktopSelected,
    videoDevices,
    audioDevices,
    handleVideoSelect,
    handleAudioSelect,
    handleReset,
    handleDesktopSelect,
  };
};
