<template>
    <div class="personal-info">
        <!-- 头部 -->
        <mt-header title="个人信息">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>

        </mt-header>
        <div class="pic">
            <img src="../../static/info_bg.png" alt="" style="width:100%;">
        </div>
        <div class="page-wrap wrap-between tel-box">
            <div class="page-wrap wrap-vcenter tel">
                <img src="../../static/phone.png" alt="">
                <p>手机号</p>
            </div>
            <p class="tel-num">{{mobile}}</p>
        </div>
        <div class="">
            <p class="belong-company">所属机构</p>
            <ul class="company-list">
                <li class="in1line" v-for="item in companyList">{{ item }}</li>
            </ul>
        </div>
        <p class="quit" @click="quit">退出登录</p>
    </div>
</template>
<script>

export default {
    name: "",
    data: () => ({
        mobile: sessionStorage.getItem('mobile'),
        companyList: []
    }),
    methods:{
        quit(){
            this.$router.push('/login');
            sessionStorage.clear();
        },
    },
    mounted() {
      //do something after mounting vue instance
      let that= this;
      let _url = '/api/org/list';
      this.$axios.get(_url).then(function (res) {
          console.log("个人信息公司列表::",res);
          that.companyList=res.data.data.map(function(o){
              return o.cname;
          })
      }).catch((err) => {
          console.log(err);
      });
    }
}
</script>
<style media="screen">
    .personal-info{
        background: #fff;
        padding-bottom: 20px;
    }
    .personal-info .mint-header{
        background: #f2f2f2;
        color: #000;
    }
    .personal-info .tel-box{
        height: 40px;
        line-height: 40px;
    }
    .personal-info .tel{
        padding-left: 10px;
    }
    .personal-info .tel img{
        width: 27px;
        height: 25px;
    }
    .personal-info .tel p{
        color: #949494;
        margin-left: 8px;
    }
    .personal-info .tel-num{
        color: #11b26c;
        padding-right: 25px;
    }
    .pic{
        color: #f4f4f4;
    }
    .personal-info .belong-company{
        height: 44px;
        padding-top: 18px;
        padding-left: 10px;
        background: #f0eff5;
        color: #949494;
    }
    .personal-info .company-list{
        overflow: hidden;
    }
    .personal-info .company-list li{
        width: 100%;
        height: 46px;
        color: #11b26c;
        line-height: 46px;
        margin-left: 10px;
        border-bottom: 1px solid #d9d9d9;
    }
    .personal-info .company-list li:last-child{
        border-bottom: none;
    }
    .personal-info .quit{
        color: #fa6869;
        text-align: center;
        margin-top: 10px;
    }
</style>
