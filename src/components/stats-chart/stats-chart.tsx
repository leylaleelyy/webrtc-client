import { FC, useEffect, useRef } from "react";
import { ChartManager, roomManager } from "../../common";

export const StatsChart: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartManager | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      chartRef.current = roomManager.initStatsChart(
        canvasRef.current.getContext("2d")!
      );
    }
  }, []);
  return (
    <div className="stats-chart">
      <canvas ref={canvasRef} width="400" height="200" />
    </div>
  );
};
