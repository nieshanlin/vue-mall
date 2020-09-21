import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import 'default-passive-events'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入进度条查件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入全局样式
import './assets/css/global.css'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 在request拦截其中展示进度条Nprogress.start()

// vue拦截器
axios.interceptors.request.use(config=>{
    Nprogress.start()
 config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中拦截其中隐藏进度条Nprogress.done()
axios.interceptors.response.use(config=>{
    Nprogress.done()
    return config
})
Vue.prototype.$http=axios

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
// 富文本编辑器
Vue.use(VueQuillEditor)
// 创建全局过滤器
Vue.filter('dataFormat',function (originVal) {
const dt=new Date(originVal)
    const y=dt.getFullYear()
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')
    const hh=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const ss=(dt.getSeconds()+'').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
