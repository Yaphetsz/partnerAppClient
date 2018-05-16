<template>
    <div class="login-page">
        <h3>欢迎登陆</h3>
        <div class="phone-box">
            <input type="text" name="" value="" placeholder="输入手机号" v-model="mobile">
        </div>
        <div class="code-box">
            <input class="enter-code" type="text" v-model="code" name="" value="" placeholder="输入验证码"><button
                    class="get-code" @click="getCode" :disabled="dis">{{msgCode}}</button>
        </div>
        <button type="button" @click="login" class="login">登录</button>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
export default {
    name: "",
    data: () => ({
        mobile: '',
        code: '',
        show: true,
        msgCode: '获取验证码',
        timer: null,
        dis: false,
    }),
    methods:{
        getCode(){
            var that = this;

            let param = {
                mobile: that.mobile
            }
            // 18600564408
            console.log("param:::",param);
            if(!param.mobile == ''){
                if(/^1\d{10}$/.test(this.mobile)){
                    that.$axios.get('/api/login/code',{params: param}).then(function (res) {
                        console.log('res:::',res);
                        if(res.data.code === 200){
                            // this.unClick=true;
                            const TIME_COUNT = 60;
                            if (!that.timer) {
                                that.msgCode = TIME_COUNT;
                                that.show = false;
                                that.timer = setInterval(() => {
                                    if (that.msgCode > 0 && that.msgCode <= TIME_COUNT) {
                                        that.msgCode--;
                                    } else {
                                        that.show = true;
                                        clearInterval(that.timer);
                                        that.timer = null;
                                        that.msgCode='获取验证码';
                                    }
                                }, 1000)
                            }
                            Toast('发送验证码成功，请注意查收！');
                        }else{
                            Toast('发送验证码失败，请重试！');
                        }
                    }).catch((err) => {
                        Toast('发送验证码失败，请重试！');
                    });
                }else{
                    Toast('手机号格式不正确！');
                }
            }else{
                Toast('请输入手机号！');
            }
        },
        login(){

            var that = this;
            let param = {
                mobile:  that.mobile,
                code:  that.code,
            }
            console.log(param)
            if( that.mobile == '' && that.code == ''){
                Toast('请填写信息！')
            }else if( /^1\d{10}$/.test(that.mobile) && that.code ){
                that.$axios.post('/api/login/in', param).then(function (res) {
                    console.log('登录res:::',res);
                    // token 保存在session中
                    if(res.data.code === 200){
                        let id = res.data.data.id;
                        let name = res.data.data.name;
                        let token = res.data.data.token;
                        let mobile = res.data.data.mobile;
                        sessionStorage.setItem('id',id);
                        sessionStorage.setItem('name',name);
                        sessionStorage.setItem('mobile',mobile);
                        sessionStorage.setItem('token',token);
                        that.$router.push('/');
                    }else{
                        Toast('失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }else if( that.mobile == '' && !that.code == ''){
                Toast('请填写手机号！')
            }else if( !that.mobile == '' && that.code == ''){
                Toast('请填写验证码！')
            }else{
                Toast('请填写正确的信息！')
            }
        }
    },
    mounted() {
      //do something after mounting vue instance
    },
    watch: {
        msgCode(val){
            console.log(val,"watch::监听");
            if( val === '获取验证码' ){
                this.dis=false;
            }else{
                this.dis=true;
            }
        }
    }
}
</script>
<style media="screen">
    html,body{
        background: #FFF;
    }
    .login-page{
        text-align: center;
        padding-top: 60px;
    }
    .login-page h3{
        font-size: 25px;
        color: #615f5f;
    }
    .phone-box,.code-box{
        width: 100%;
        text-align: center;
        box-sizing: border-box;
    }
    .phone-box input,.code-box input{
        box-sizing: border-box;
        font-size: 16px;
        height: 50px;
        outline: none;
        color: #333;
        border: 1px solid #d3d3d3;
        vertical-align: middle;
        padding-left: 20px;
        -webkit-appearance: none;
    }
    .code-box button{
        box-sizing: border-box;
        height: 50px;
        outline: none;
        color: #333;
        border: 1px solid #d3d3d3;
        vertical-align: middle;
        padding-left: 20px;
        -webkit-appearance: none;
        color:#fff;
        font-size: 12px;
        text-align: center;
    }
    .phone-box input{
        width: 90%;
        border-radius: 30px;
        margin-top: 45px;
        padding-left: 20px;
    }
    .code-box{
        margin-top: 45px;
        overflow: hidden;
        text-align: center;
    }
    .code-box .enter-code{
        width: 61%;
        padding-left: 20px;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        border-right: none;
    }
    .code-box .get-code{
        width: 29%;
        border: 1px solid #ebb65a;
        padding-left: 10px;
        background: #ebb65a;
        border-left: none;
        box-sizing: border-box;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
    }
    .get-code::-webkit-input-placeholder{
        color:#fff;
        font-size: 12px;
        text-align: center;
    }
    .login-page .login{
        width: 85%;
        height: 50px;
        color: #fff;
        font-size: 18px;
        background: #20b976;
        border-radius: 35px;
        margin-top: 60px;
        outline: none;
        border: none;
    }

</style>
