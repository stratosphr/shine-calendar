import Vue     from 'vue'
import App     from './App.vue'
import vuetify from './plugins/vuetify'
import './registerServiceWorker'
import router  from './router'
import store   from './store'

Vue.config.productionTip = false

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.'
Vue.config.warnHandler = function (msg, vm, trace) {
    if (msg !== ignoreWarnMessage) {
        console.error(msg, trace)
    }
}

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
