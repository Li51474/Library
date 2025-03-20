import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// 必须在 router 之前使用 pinia
app.use(pinia)
app.use(router)
app.mount('#app')
