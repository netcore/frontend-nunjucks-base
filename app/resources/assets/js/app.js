import './bootstrap.js'
import './classes/Validation.js'
import API from './classes/Api.js'

Vue.prototype.$api = API
Vue.prototype.$http = axios

new Vue({
	el: '#app'
})

$(() => {
	console.log('Hello World')
})