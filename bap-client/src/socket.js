import { io } from 'socket.io-client';
import { BACKEND_WSS_URL } from './config';

export const socket = io(BACKEND_WSS_URL,{
    transports: ['websocket'],
});