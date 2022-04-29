import { streamManager } from "./stream-manager";
import { roomManager } from "./room-manager";
import { logger } from "./logger-manager";

export interface RTCStatsInfo {
  mediaType: "audio" | "video";
  packetsReceived?: number;
  packetsLost?: number;
  bytesReceived?: number;
  jitter?: number;
}

export class RTCManager {
  private connection: RTCPeerConnection;
  private receiver: RTCRtpReceiver;
  public rtcMessage: string = "";
  public rtcAudioStatsInfo: RTCStatsInfo;
  public rtcVideoStatsInfo: RTCStatsInfo;

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

    this.receiver = this.connection.getReceivers()[0];
    this.rtcAudioStatsInfo = {
      mediaType: "audio",
      packetsReceived: 0,
      packetsLost: 0,
      bytesReceived: 0,
      jitter: 0,
    };

    this.rtcVideoStatsInfo = {
      mediaType: "video",
      packetsReceived: 0,
      packetsLost: 0,
      bytesReceived: 0,
      jitter: 0,
    };

    this.connection.addEventListener("icecandidate", (e) => {
      console.log(`icecandidate: ${e.candidate}`);
      logger.addLogMessage(`icecandidate: ${e.candidate}\n`, "rtc");
      roomManager.sendMessage({
        type: "icecandidate",
        candidate: e.candidate?.toJSON(),
      });
    });

    this.connection.addEventListener("track", (e) => {
      console.log("track", e);
      logger.addLogMessage(`track: ${e}`, "rtc");
      streamManager.addTrackToRemoteStream(e.track);
    });

    this.connection.addEventListener("iceconnectionstatechange", (e) => {
      console.log(
        "iceconnectionstatechange -->",
        this.connection.iceConnectionState
      );
      logger.addLogMessage(
        `iceconnectionstatechange -->${this.connection.iceConnectionState}\n`,
        "rtc"
      );
    });

    this.connection.addEventListener("icegatheringstatechange", () => {
      console.log(
        "icegatheringstatechange --->",
        this.connection.iceGatheringState
      );
      logger.addLogMessage(
        `icegatheringstatechange --->${this.connection.iceGatheringState}\n`,
        "rtc"
      );
    });

    streamManager
      .getLocalStream()
      ?.getTracks()
      .forEach((track) => {
        console.log("add local track --->", track.label);
        logger.addLogMessage(`add local track --->${track.label}\n`, "rtc");
        this.connection.addTrack(track);
      });
  }

  async createOffer() {
    const offer = await this.connection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    console.log("createOffer --->", offer);
    logger.addLogMessage(`createOffer --->${offer}\n`, "rtc");

    this.connection.setLocalDescription(offer).then(() => {
      console.log("LocalDescription is set");
      logger.addLogMessage("LocalDescription is set\n", "rtc");
    });

    return offer;
  }

  async setRemoteOffer(offer: RTCSessionDescriptionInit) {
    this.connection.setRemoteDescription(offer).then(() => {
      console.log("RemoteDescription is set");
      logger.addLogMessage("RemoteDescription is set\n", "rtc");
    });
    const answer = await this.connection.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    this.connection.setLocalDescription(answer).then(() => {
      console.log("LocalDescription is set");
      logger.addLogMessage("LocalDescription is set\n", "rtc");
    });

    return answer;
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    await this.connection.setRemoteDescription(answer);
    console.log("RemoteDescription is set");
    logger.addLogMessage("RemoteDescription is set\n", "rtc");
  }

  async addCandidate(candidate: RTCIceCandidate) {
    await this.connection.addIceCandidate(candidate);
    logger.addLogMessage("IceCandidate added\n", "rtc");
    console.log(`IceCandidate added`);
  }

  async getReceiverStats() {
    const stats = await this.receiver?.getStats();
    if (stats) {
      stats.forEach((e: RTCStats & RTCReceivedRtpStreamStats) => {
        if (e.type === "inbound-rtp") {
          console.log("stats", e);
        }
      });
    }
  }

  getMessage() {
    return this.rtcMessage;
  }

  close() {
    streamManager.resetRemoteStream();
    this.connection.close();
  }
}
