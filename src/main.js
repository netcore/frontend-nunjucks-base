import 'bootstrap'
import './utils/Validation'
import Vue from 'vue'

new Vue({
    el: '#app'
})

$(() => {
    console.log('%c With ❤️ from Netcore ', 'background: #222; color: #fff; padding-top: 1px; border-radius: 3px')
})

// for HMR
if (module.hot) {
    module.hot.accept()
}
