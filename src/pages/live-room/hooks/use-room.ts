import { useEffect, useState } from "react";
import {
  MarkedChangeListener,
  roomManager,
  RoomState,
  RoomStateChangListener,
} from "../../../common";

export const useRoom = () => {
  const [roomState, setRoomState] = useState<RoomState>(RoomState.leave);
  const [remoteMark, setRemoteMark] = useState("");

  useEffect(() => {
    const handleRoomStateChange: RoomStateChangListener = (state) => {
      setRoomState(state);
    };

    const handleRemoteStreamMarked: MarkedChangeListener = (mark: string) => {
      setRemoteMark(mark);
    };

    roomManager.addListener("roomStateChange", handleRoomStateChange);
    roomManager.addListener("markedChange", handleRemoteStreamMarked);

    return () => {
      roomManager.removeListener("roomStateChange", handleRoomStateChange);
      roomManager.removeListener("markedChange", handleRemoteStreamMarked);
    };
  }, []);

  return { roomState, remoteMark };
};
