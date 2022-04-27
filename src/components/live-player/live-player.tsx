import { CircularProgress, styled } from "@mui/material";
import { FC, MutableRefObject } from "react";
import "./style.scss";

export interface LivePlayerProps {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  loading: boolean;
}

const Loading = styled(CircularProgress)({
  position: "absolute",
  left: "calc(50% - 20px)",
  top: "calc(50% - 20px)",
});

export const LivePlayer: FC<LivePlayerProps> = ({ videoRef, loading }) => {
  return (
    <div className="live-player-container">
      {loading && <Loading />}
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};
