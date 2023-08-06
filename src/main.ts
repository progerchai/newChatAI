import './assets/main.css';

import io from 'socket.io-client';
import { createApp } from 'vue';
import VueSocketIO from 'vue-3-socket.io';
import App from './App.vue';
import router from './router';
const app = createApp(App);
const socketio = new VueSocketIO({
  debug: true,
  connection: io('http://xxxx:8848', { transports: ['websocket'] }),
  options: {
    path: '/socket/',
  },
});
app.use(router);
app.use(socketio);

app.mount('#app');
