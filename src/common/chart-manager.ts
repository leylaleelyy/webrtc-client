import Chart from "chart.js/auto";

const chartColors = {
  red: "rgb(255,99,132)",
  orange: "rgb(225,159,64)",
  yellow: "rgb(255,205,86)",
  green: "rgb(75,192,192)",
  blue: "rgb(54,162,235)",
  purple: "rgb(153,102,255)",
  grey: "rgb(201,203,207)",
};

export class ChartManager {
  public chartLabels: string[] = [];
  public chartVideoSend: number[] = [];
  public chartVideoReceive: number[] = [];
  public chartAudioSend: number[] = [];
  public chartAudioReceive: number[] = [];
  public chart: Chart;
  constructor(ctx: CanvasRenderingContext2D) {
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: "Video Sent",
            backgroundColor: chartColors.red,
            borderColor: chartColors.red,
            fill: false,
            data: this.chartVideoSend,
          },
          {
            label: "Video Receive",
            backgroundColor: chartColors.orange,
            borderColor: chartColors.orange,
            fill: false,
            data: this.chartVideoReceive,
          },
          {
            label: "Audio Sent",
            backgroundColor: chartColors.green,
            borderColor: chartColors.green,
            fill: false,
            data: this.chartAudioSend,
          },
          {
            label: "Audio Receive",
            backgroundColor: chartColors.blue,
            borderColor: chartColors.blue,
            fill: false,
            data: this.chartAudioReceive,
          },
        ],
      },

      options: {
        responsive: true,
        hover: {
          mode: "index",
        },
      },
    });
  }

  updateChart() {
    this.chart.update();
  }

  getDate() {
    return {
      chartLabels: this.chartLabels,
      chartVideoSend: this.chartVideoSend,
      chartVideoReceive: this.chartVideoReceive,
      chartAudioSend: this.chartAudioSend,
      chartAudioReceive: this.chartAudioReceive,
    };
  }
}
