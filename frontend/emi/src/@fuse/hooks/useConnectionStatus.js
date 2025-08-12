import { useEffect, useRef, useState } from 'react';

/**
 * @returns {Boolean} isConnected - Validates if either `isOnline` or `isApiOnline` is false.
 */
export default function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiOnline, setIsApiOnline] = useState(true);
  const [ws, setWs] = useState(null);
  const pingIntervalRef = useRef(null); 

  const connectWebSocket = () => {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const socket = new WebSocket(process.env.REACT_APP_GRAPHQL_WS_END_POINT, "graphql-ws");
    setWs(socket);

    socket.onopen = () => {
      const token = localStorage.getItem('jwt_access_token');
      const connectionParams = JSON.stringify({
        type: "connection_init",
        payload: {
          authToken: token || '',
        },
      });
      socket.send(connectionParams);

     
      pingIntervalRef.current = setInterval(() => {
        socket.send(JSON.stringify({ 
          type: 'connection_init',
          payload: {
          authToken: token || '',
        }
      }));
      }, 240000); // 4 minutes
    };

    socket.onclose = (event) => {
      setIsApiOnline(false);
      clearInterval(pingIntervalRef.current); 
      if (!event.wasClean) {
        setTimeout(connectWebSocket, 10000)
      }
    };

    socket.onerror = (error) => {
      setIsApiOnline(false);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'connection_ack') {
        setIsApiOnline(true);
      }
    };
  };

  useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    connectWebSocket();
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (ws) {
        ws.close();
        clearInterval(pingIntervalRef.current); 
      }
    };
  }, [ws]);

  const isConnected = isOnline && isApiOnline;
  return { isConnected };
};
