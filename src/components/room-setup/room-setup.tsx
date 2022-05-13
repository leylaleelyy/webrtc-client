import { Button, TextField } from "@mui/material";
import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { roomManager } from "../../common";

export interface RoomSetupProps {
  enterDisabled: boolean;
  leaveDisabled: boolean;
  onAction?: () => void;
}

export const RoomSetup: FC<RoomSetupProps> = ({
  enterDisabled,
  leaveDisabled,
  onAction: handleAction,
}) => {
  const [roomId, setRoomId] = useState(0);

  const handleInput = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setRoomId(Number(e.target.value) || 0);
  }, []);

  const handleJoin = useCallback(() => {
    roomManager.join(roomId);
    handleAction?.();
  }, [roomId, handleAction]);

  const handleLeft = useCallback(() => {
    roomManager.left();
    handleAction?.();
  }, [handleAction]);
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
          sx={{ marginRight: 1 }}
        >
          Enter
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleLeft}
          disabled={leaveDisabled}
        >
          Leave
        </Button>
      </div>
    </div>
  );
};
