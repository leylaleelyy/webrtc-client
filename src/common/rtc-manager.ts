import { streamManager } from "./stream-manager";
import { roomManager } from "./room-manager";
import { ChartManager } from "./chart-manager";
export class RTCManager {
  private connection: RTCPeerConnection;

  private statsChart: ChartManager | undefined;

  constructor() {
    this.connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "turn:leylalee.top:3478",
          username: "aaaaaa",
          credential: "bbbbbb",
        },
      ],
      iceTransportPolicy: "relay",
      iceCandidatePoolSize: 0,
    });

    this.connection.addEventListener("icecandidate", (e) => {
      console.log(`icecandidate: ${e.candidate}`);
      roomManager.sendMessage({
        type: "icecandidate",
        candidate: e.candidate?.toJSON(),
      });
    });

    this.connection.addEventListener("track", (e) => {
      console.log("track", e);
      streamManager.addTrackToRemoteStream(e.track);
    });

    this.connection.addEventListener("iceconnectionstatechange", (e) => {
      console.log(
        "iceconnectionstatechange -->",
        this.connection.iceConnectionState
      );
    });

    this.connection.addEventListener("icegatheringstatechange", () => {
      console.log(
        "icegatheringstatechange --->",
        this.connection.iceGatheringState
      );
    });

    this.connection.addEventListener("connectionstatechange", () => {
      this.handleConnectStateChange();
    });

    streamManager
      .getLocalStream()
      ?.getTracks()
      .forEach((track) => {
        console.log("add local track --->", track.label);
        this.connection.addTrack(track);
      });
  }

  async createOffer() {
    const offer = await this.connection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    console.log("createOffer --->", offer);

    this.connection.setLocalDescription(offer).then(() => {
      console.log("LocalDescription is set");
    });

    return offer;
  }

  async setRemoteOffer(offer: RTCSessionDescriptionInit) {
    this.connection.setRemoteDescription(offer).then(() => {
      console.log("RemoteDescription is set");
    });
    const answer = await this.connection.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    this.connection.setLocalDescription(answer).then(() => {
      console.log("LocalDescription is set");
    });

    return answer;
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    await this.connection.setRemoteDescription(answer);
    console.log("RemoteDescription is set");
  }

  async addCandidate(candidate: RTCIceCandidate) {
    await this.connection.addIceCandidate(candidate);
    console.log(`IceCandidate added`);
  }

  handleConnectStateChange() {
    switch (this.connection.connectionState) {
      case "connected":
        this.updateStats();
    }
  }

  updateStats() {
    let receivedAudioBytes = 0;
    let receivedVideoBytes = 0;
    let sentAudioBytes = 0;
    let sentVideoBytes = 0;

    let startTime = 0;
    setInterval(async () => {
      const rtpReceivers = this.connection.getReceivers();
      const rtpVideoReceiver = rtpReceivers.find(
        (rece) => rece.track.kind === "video"
      );
      const rtpAudioReceiver = rtpReceivers.find(
        (rece) => rece.track.kind === "audio"
      );

      const rtpSenders = this.connection.getSenders();
      const rtpVideoSender = rtpSenders.find(
        (rece) => rece.track?.kind === "video"
      );
      const rtpAudioSender = rtpSenders.find(
        (rece) => rece.track?.kind === "audio"
      );

      const receVideoStats = await rtpVideoReceiver?.getStats();
      const receAudioStats = await rtpAudioReceiver?.getStats();
      const sendVideoStats = await rtpVideoSender?.getStats();
      const sendAudioStats = await rtpAudioSender?.getStats();

      let receAudioRate = 0;
      let receVideoRate = 0;
      let sentAudioRate = 0;
      let sentVideoRate = 0;

      receVideoStats?.forEach((stat: RTCTransportStats) => {
        if (stat.type === "inbound-rtp") {
          console.log(`trackId:${stat.id}`);
          const currentBytes = stat.bytesReceived ?? 0;
          receVideoRate = currentBytes - receivedVideoBytes;
          receivedVideoBytes = currentBytes ?? 0;
        }
      });

      receAudioStats?.forEach((stat: RTCTransportStats) => {
        if (stat.type === "inbound-rtp") {
          console.log(`trackId:${stat.id}`);

          const currentBytes = stat.bytesReceived ?? 0;
          receAudioRate = currentBytes - receivedAudioBytes;
          receivedAudioBytes = currentBytes ?? 0;
        }
      });

      sendVideoStats?.forEach((stat: RTCTransportStats) => {
        if (stat.type === "outbound-rtp") {
          console.log(`trackId:${stat.id}`);
          const currentBytes = stat.bytesSent ?? 0;
          sentVideoRate = currentBytes - sentVideoBytes;
          sentVideoBytes = currentBytes ?? 0;
        }
      });

      sendAudioStats?.forEach((stat: RTCTransportStats) => {
        if (stat.type === "outbound-rtp") {
          console.log(`trackId:${stat.id}`);
          const currentBytes = stat.bytesSent ?? 0;
          sentAudioRate = currentBytes - sentAudioBytes;
          sentAudioBytes = currentBytes ?? 0;
        }
      });
      if (this.statsChart) {
        this.statsChart.chartLabels.push(String(startTime++));
        this.statsChart.chartVideoReceive.push(
          Math.floor((receVideoRate * 8) / 1024)
        );
        this.statsChart.chartAudioReceive.push(
          Math.floor((receAudioRate * 8) / 1024)
        );
        this.statsChart.chartVideoSend.push(
          Math.floor((sentVideoRate * 8) / 1024)
        );
        this.statsChart.chartAudioSend.push(
          Math.floor((sentAudioRate * 8) / 1024)
        );
        this.statsChart.updateChart();
      }
    }, 1000);
  }

  setChart(chart?: ChartManager) {
    if (chart) {
      this.statsChart = chart;
    }
  }

  updateBitrate(bitrate: number) {
    if (!this.connection) return;
    console.log("set MaxBitrate to :", bitrate);
    this.connection.getSenders().forEach((sender) => {
      if (sender.track?.kind === "video") {
        let param = sender.getParameters();
        param.encodings[0].maxBitrate = bitrate * 1024;
        sender
          .setParameters(param)
          .then(() => {
            param = sender.getParameters();
            console.log("video sender encodings");
          })
          .catch((e) => {
            console.error("error:", e);
          });
      }
    });
  }

  close() {
    streamManager.resetRemoteStream();
    this.connection.close();
  }
}
