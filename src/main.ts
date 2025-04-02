import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const options = {
  position: 'top-left',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6
}

const app = createApp(App)
app.use(Toast, options)

app.mount('#app')

// Ahora que Vue ha registrado el plugin, podemos usar useToast()
// const $toast = app.config.globalProperties.$toast
// $toast.info('You did it!')
