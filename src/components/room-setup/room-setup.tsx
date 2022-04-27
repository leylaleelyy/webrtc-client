import { Button, TextField } from "@mui/material";
import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { roomManager } from "../../common";

export interface RoomSetupProps {
  enterDisabled: boolean;
  leaveDisabled: boolean;
}

export const RoomSetup: FC<RoomSetupProps> = ({
  enterDisabled,
  leaveDisabled,
}) => {
  const [roomId, setRoomId] = useState(0);

  const handleInput = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setRoomId(Number(e.target.value) || 0);
  }, []);

  const handleJoin = useCallback(() => {
    roomManager.join(roomId);
  }, [roomId]);

  const handleLeft = useCallback(() => {
    roomManager.left();
  }, []);
  return (
    <div className="room-setting">
      <TextField
        required
        id="outlined-required"
        label="RoomId"
        value={roomId}
        fullWidth
        onChange={handleInput}
        size="small"
      />

      <div>
        <Button
          variant="contained"
          onClick={handleJoin}
          disabled={enterDisabled}
        >
          Enter Room
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleLeft}
          disabled={leaveDisabled}
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
};
