import { FC, useEffect } from "react";
import { roomManager } from "../../common";

interface StatsPanelProps {}

export const StatsPanel: FC<StatsPanelProps> = () => {
  useEffect(() => {
    window.setInterval(async () => {
      await roomManager.sendReceiverStats();
    }, 2000);
  }, []);
  return (
    <div className="stats-panel">
      <div className="audio-container">
        <div>packetsReceived:</div>
        <div>packetsLost:</div>
        <div>bytesReceived:</div>
        <div>jitter:</div>
      </div>
      <div className="video-container">
        <div>packetsReceived:</div>
        <div>packetsLost:</div>
        <div>bytesReceived:</div>
      </div>
    </div>
  );
};
