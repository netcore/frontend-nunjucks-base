import './bootstrap'
import './classes/Validation'
import API from './classes/Api'

Vue.prototype.$api = API
Vue.prototype.$http = axios

new Vue({
	el: '#app'
})

$(() => {
	console.log('Hello World')
})