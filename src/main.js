import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './tailwind.css'
import './style.css'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.min.css';
createApp(App).use(createPinia()).mount('#app')

