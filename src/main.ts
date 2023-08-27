import ElementUI from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import directive from './directive'; // directive
import router from './router';
import global from './store/global';
import './style/global.css';
const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误S
};

app.use(ElementUI);
app.use(router);
app.use(global, 'global');
directive(app);
app.mount('#app');
