import React, { useEffect, useRef, useState } from "react";
import { StreamChangeListener, streamManager } from "../../common";
import { LivePlayer } from "../live-player";
import "./style.scss";

export interface RemoteVideoProps {
  className?: string;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({ className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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

    streamManager.addListener("remoteStreamChange", handleStreamChange);

    return () => {
      streamManager.removeListener("remoteStreamChange", handleStreamChange);
    };
  }, []);

  return (
    <div className="container">
      <div>remote video:</div>
      <LivePlayer videoRef={videoRef} loading={loading} />
    </div>
  );
};
