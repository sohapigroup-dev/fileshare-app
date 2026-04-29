import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://fileshare-api-p4j5.onrender.com';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
	socket = io(SOCKET_URL, {
		transports: ['websocket'],
	});

	socket.on('connect', () => {
		console.log('Socket connecte :', socket?.id);
		socket?.emit('user:join', { userId });
	});

	socket.on('disconnect', () => {
		console.log('Socket deconnecte');
	});

	return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
	socket?.disconnect();
	socket = null;
};
