import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入Vant组件
import { 
  Button, 
  Field, 
  RadioGroup, 
  Radio, 
  Cell, 
  Calendar, 
  Popup, 
  TimePicker, 
  NavBar, 
  Tabbar, 
  TabbarItem, 
  Loading, 
  Empty, 
  Rate,
  showToast,
  showConfirmDialog
} from 'vant'

import 'vant/lib/index.css'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// 注册Vant组件
app.use(Button)
app.use(Field)
app.use(RadioGroup)
app.use(Radio)
app.use(Cell)
app.use(Calendar)
app.use(Popup)
app.use(TimePicker)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Loading)
app.use(Empty)
app.use(Rate)

app.use(pinia)
app.use(router)
app.mount('#app')