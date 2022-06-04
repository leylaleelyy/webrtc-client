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

  const [mark, setMark] = useState("");

  const handleInput = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setRoomId(Number(e.target.value) || 0);
  }, []);

  const handleMark = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setMark(e.target.value);
  }, []);

  const handleJoin = useCallback(() => {
    roomManager.join(roomId);
    handleAction?.();
  }, [roomId, handleAction]);

  const handleAddMark = useCallback(() => {
    roomManager.addWaterMark(mark);
  }, [mark]);

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

      <TextField
        required
        id="outlined-required"
        label="WaterMark"
        value={mark}
        fullWidth
        onChange={handleMark}
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
          sx={{ marginRight: 1 }}
        >
          Leave
        </Button>
        <Button
          variant="contained"
          onClick={handleAddMark}
          disabled={!mark}
          sx={{ marginRight: 1 }}
        >
          Add Mark
        </Button>
      </div>
    </div>
  );
};
