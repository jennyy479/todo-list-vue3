import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './tailwind.css'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue'
import '@mdi/font/css/materialdesignicons.min.css';
const app = createApp(App);
app.use(Antd);

app.use(createPinia());
app.use(Antd);

app.mount('#app');

