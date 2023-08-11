import './assets/main.css';

// import io from 'socket.io-client';
import { createApp } from 'vue';
// import VueSocketIO from 'vue-3-socket.io';
import App from './App.vue';
import VueMarkdown from 'vue-markdown';
import 'katex/dist/katex.min.css';
import router from './router';
const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误S
};
// const socketio = new VueSocketIO({
//   debug: true,
//   connection: io('http://xxxx:8848', { transports: ['websocket'] }),
//   options: {
//     path: '/socket/',
//   },
// });
app.use(router);
// app.use(socketio);
app.component('VueMarkdown',VueMarkdown)

app.mount('#app');
