import Vue from 'vue';
import Router from 'vue-router';

import Index from '../components/Index.vue';
import Login from '../components/Login.vue';
import PersonalInfo from '../components/PersonalInfo.vue';

Vue.use(Router);
const router =  new Router({
    routes: [
        {
            path: '/',
            component: Index,
        },
        {
            name: 'Login',
            path: '/login',
            component: Login,
        },
        {
            path: '/personalInfo',
            component: PersonalInfo,
        },
    ]
})
export default router;
