import './assets/main.css';
import './style/global.css';
// import ElementUI from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import global from './store/global';
import App from './App.vue';
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
// app.use(ElementUI);
app.use(router);
app.use(global, 'global');
// app.use(socketio);

app.mount('#app');
