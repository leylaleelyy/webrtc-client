import { useEffect, useState } from "react";
import {
  roomManager,
  RoomState,
  RoomStateChangListener,
} from "../../../common";

export const useRoom = () => {
  const [roomState, setRoomState] = useState<RoomState>(RoomState.leave);

  useEffect(() => {
    const handleRoomStateChange: RoomStateChangListener = (state) => {
      setRoomState(state);
    };

    roomManager.addListener("roomStateChange", handleRoomStateChange);

    return () => {
      roomManager.removeListener("roomStateChange", handleRoomStateChange);
    };
  }, []);
  return { roomState };
};
