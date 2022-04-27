import React, { useEffect, useRef, useState } from "react";
import { StreamChangeListener, streamManager } from "../../common";
import { LivePlayer } from "../live-player";
import "./style.scss";

export interface LocalPreviewProps {
  videoSelected?: string;
  audioSelected?: string;
}

export const LocalPreview: React.FC<LocalPreviewProps> = ({
  videoSelected = "",
  audioSelected = "",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleStreamChange: StreamChangeListener = (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setLoading(false);
      }
      if (!stream) {
        setLoading(true);
      }
    };
    streamManager.addListener("localStreamChange", handleStreamChange);

    return () => {
      streamManager.removeListener("localStreamChange", handleStreamChange);
    };
  }, []);

  useEffect(() => {
    streamManager.start(videoSelected, audioSelected);
  }, [videoSelected, audioSelected]);

  return (
    <div className="container">
      <div>local preview:</div>
      <LivePlayer videoRef={videoRef} loading={loading} />
    </div>
  );
};
