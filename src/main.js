import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import moment from 'moment'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import 'mint-ui/lib/style.css'
import formatDate from './style/js/formatdate'

// 按需引入mint-ui组件
import { DatetimePicker } from 'mint-ui';
import { Cell } from 'mint-ui';
import { Popup } from 'mint-ui';
import { Picker } from 'mint-ui';
import { TabContainer, TabContainerItem } from 'mint-ui';
import { Header } from 'mint-ui';
import { Button } from 'mint-ui';
import { InfiniteScroll } from 'mint-ui';
import { MessageBox } from 'mint-ui';

import { Toast } from 'mint-ui';

// Vue.use(VueRangedatePicker)

Vue.use(InfiniteScroll);
// Vue.use(MessageBox);
Vue.component(Button.name, Button);
Vue.component(Header.name, Header);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Cell.name, Cell);

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        router.push({name: 'Login'})
        if (error.response) {
            console.log(error.response.status)
            switch (error.response.status) {
            // case 401:
            // 返回 401 清除token信息并跳转到登录页面
                case 401:
                    Toast('请进行认证！');
                    // 返回 401 清除token信息并跳转到登录页面
                    break;

                case 504:
                    Toast('验证码错误！');
                    break;
            }
        }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
})

Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;


new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
});
