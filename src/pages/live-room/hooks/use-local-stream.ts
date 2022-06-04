import { useEffect, useState } from "react";
import { StreamChangeListener, streamManager } from "../../../common";

export const useLocalStream = () => {
  const [localStreamReady, setLocalStreamReady] = useState(false);
  useEffect(() => {
    const handleLocalStreamReady: StreamChangeListener = (stream) => {
      setLocalStreamReady(!!stream);
    };

    streamManager.addListener("localStreamChange", handleLocalStreamReady);

    return () => {
      streamManager.removeListener("localStreamChange", handleLocalStreamReady);
    };
  }, []);

  return { localStreamReady };
};

