import { io, Socket } from 'socket.io-client';
import { API_BASE_URL, RemoteAPI } from './api';

let socketInstance: Socket | null = null;

export function getSocket(explicitToken?: string): Socket {
  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: async (cb) => {
        try {
          const token = explicitToken || (await RemoteAPI.getAuthToken());
          cb({ token: token || '' });
        } catch {
          cb({ token: '' });
        }
      },
    });

    socketInstance.on('connect_error', () => {
      // Silently handle socket auth/connection errors without leaking sensitive data
    });
  } else if (explicitToken) {
    socketInstance.auth = { token: explicitToken };
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
  }

  return socketInstance;
}

export const SocketClient = {
  joinQueue(queueId: string) {
    if (!queueId) return;
    const socket = getSocket();
    socket.emit('join_queue', queueId);
  },

  leaveQueue(queueId: string) {
    if (!queueId) return;
    const socket = getSocket();
    socket.emit('leave_queue', queueId);
  },

  joinPatientAlerts(phone: string) {
    if (!phone) return;
    const socket = getSocket();
    socket.emit('join_patient', phone.replace(/\D/g, ''));
  },

  onQueueStatusChanged(callback: (data: { queueId: string; status: 'ACTIVE' | 'PAUSED'; isPaused: boolean; reason?: string }) => void) {
    const socket = getSocket();
    socket.on('queue:status_changed', callback);
    return () => {
      socket.off('queue:status_changed', callback);
    };
  },

  onTokenCreated(callback: (data: { queueId: string; tokenNumber: string; tokenType: string; patientName: string; positionAhead: number }) => void) {
    const socket = getSocket();
    socket.on('queue:token_created', callback);
    return () => {
      socket.off('queue:token_created', callback);
    };
  },

  onEmergencyAlert(callback: (data: { queueId: string; tokenNumber: string; patientName: string; message: string }) => void) {
    const socket = getSocket();
    socket.on('queue:emergency_alert', callback);
    return () => {
      socket.off('queue:emergency_alert', callback);
    };
  },

  onTokenCalled(callback: (data: { queueId: string; currentTokenNumber: string; patientName: string; tokenType?: string; nextTokenNumber?: string }) => void) {
    const socket = getSocket();
    socket.on('queue:token_called', callback);
    return () => {
      socket.off('queue:token_called', callback);
    };
  },

  onTokenServing(callback: (data: { queueId: string; tokenId: string; tokenNumber: string }) => void) {
    const socket = getSocket();
    socket.on('queue:token_serving', callback);
    return () => {
      socket.off('queue:token_serving', callback);
    };
  },

  onTokenCompleted(callback: (data: { queueId: string; tokenId: string; tokenNumber: string }) => void) {
    const socket = getSocket();
    socket.on('queue:token_completed', callback);
    return () => {
      socket.off('queue:token_completed', callback);
    };
  },

  onTokenSkipped(callback: (data: { queueId: string; tokenId: string; tokenNumber: string; reason?: string }) => void) {
    const socket = getSocket();
    socket.on('queue:token_skipped', callback);
    return () => {
      socket.off('queue:token_skipped', callback);
    };
  },

  onTokenCancelled(callback: (data: { queueId: string; tokenId: string; tokenNumber: string; reason?: string }) => void) {
    const socket = getSocket();
    socket.on('queue:token_cancelled', callback);
    return () => {
      socket.off('queue:token_cancelled', callback);
    };
  },

  connect(explicitToken?: string) {
    const socket = getSocket(explicitToken);
    if (explicitToken) {
      socket.auth = { token: explicitToken };
    }
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  },

  disconnect() {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  },
};

