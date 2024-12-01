import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomToastStyles.css'; // Custom CSS for toasts

const CakeProcessor = ({ onCakeReady, onCakeBurnt }) => {
  const [isProcessing, setIsProcessing] = useState(false); // Track if a process is ongoing
  const websocketRef = useRef(null); // Ref for WebSocket

  const handleWebSocketMessage = (e, toastId) => {
    try {
      const data = JSON.parse(e.data);
      if (data.type === 'connection_established' || data.type === 'progress') {
        toast.update(toastId, {
          render: `${data.progress}/6: ${data.message}`,
          progress: Number(data.progress) / 6,
          icon: '🔄', // Dynamic icon
          className: 'toast-progress',
        });
      } else if (data.type === 'completed') {
        toast.dismiss(toastId);
        toast.success('🎉 Cake is ready!', {
          icon: '🎂',
          className: 'toast-success',
        });
        onCakeReady(); // Notify parent about the completed cake
        setIsProcessing(false);
      } else if (data.type === 'error') {
        toast.update(toastId, {
          type: 'error',
          render: `⚠️ ${data.message}`,
          icon: '🔥',
          className: 'toast-error',
        });
        onCakeBurnt(); // Notify parent about the burnt cake
        setIsProcessing(false);
      }
    } catch (error) {
      toast.update(toastId, {
        type: 'error',
        render: '❌ An unexpected error occurred!',
        icon: '❗',
        className: 'toast-error',
      });
      setIsProcessing(false);
    }
  };

  const requestProcess = (temperature = 'low') => {
    if (isProcessing) return;
    setIsProcessing(true);

    const channelId = Math.floor(Math.random() * 10000);
    const websocket = new WebSocket(
      `ws://localhost:8000/ws/bar/${channelId}/${temperature}/`
    );
    websocketRef.current = websocket;

    const toastId = toast('🔄 Processing your cake...', {
      type: 'info',
      icon: '🍰',
      theme: 'colored',
      position: 'bottom-right',
      autoClose: false,
      closeOnClick: false,
      className: 'toast-info',
    });

    websocket.onmessage = (e) => handleWebSocketMessage(e, toastId);

    websocket.onerror = () => {
      toast.update(toastId, {
        type: 'error',
        render: '❌ WebSocket connection error!',
        icon: '🚨',
        className: 'toast-error',
      });
      setIsProcessing(false);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsProcessing(false);
    };
  };

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => requestProcess()}
        disabled={isProcessing}
        style={{
          margin: '0 10px',
          backgroundColor: '#4caf50',
          color: '#fff',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
        }}
      >
        Make Cake
      </button>
      <button
        onClick={() => requestProcess('high')}
        disabled={isProcessing}
        style={{
          margin: '0 10px',
          backgroundColor: '#f44336',
          color: '#fff',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
        }}
      >
        Make Cake (High Temperature)
      </button>
    </div>
  );
};

export default CakeProcessor;
