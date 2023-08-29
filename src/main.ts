import SvgIcon from '@/components/SvgIcon/index.vue';
import elementIcons from '@/components/SvgIcon/svgicon';
import {
  addDateRange,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictLabels,
} from '@/utils';
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
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;

app.use(ElementUI);
app.use(elementIcons);
app.component('svg-icon', SvgIcon);
app.use(router);
app.use(global, 'global');
directive(app);
app.mount('#app');
