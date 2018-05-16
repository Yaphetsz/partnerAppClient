``<template>
    <div class="index-page">
        <!-- 头部 -->
        <mt-header title="合伙人系统">
            <router-link to="/login" slot="left">
                <mt-button icon="back" @click=quit()>退出</mt-button>
            </router-link>
            <router-link to="/personalInfo" slot="right">
                <img src="../../static/myInfo.png" alt="" style="width: 16px;">
            </router-link>
        </mt-header>

        <div class="panel-body">
            <!-- 公司部分 -->
            <div class="company-choose" @click='chooseCompany'>
                <mt-cell title="选择公司" is-link>
                  <span >{{selectCompany}}</span>
                  <img slot="icon" src="../../static/icon_choose.png" width="14" height="14">
                </mt-cell>
            </div>
            <mt-popup
                v-model="companyPopupVisible"
                position="bottom">
                <mt-picker :slots="companySlots" @change="companyChange"></mt-picker>
            </mt-popup>
            <!-- 合作方 -->
            <div class="partner-choose" @click='choosePartner'>
                <mt-cell title="选择合作方" is-link>
                  <span >{{selectPartner}}</span>
                  <img slot="icon" src="../../static/icon_choose.png" width="14" height="14">
                </mt-cell>
            </div>
            <mt-popup
                v-model="partnerPopupVisible"
                position="bottom">
                <mt-picker :slots="partnerSlots" @change="partnerChange"></mt-picker>
            </mt-popup>
            <!-- 时间部分 -->
            <div class="" style="width:100%;height:48px;margin-top:15px;">
                <div class="column" style="height:100%;">
                    <div class="card" style="padding: 0;margin:0;height:100%;height:100%;">
                        <div class="card-content page-wrap wrap-between" style="background: #f2f2f2;height:100%;">
                            <div class="page-wrap wrap-vcenter" style="">
                                <img src="../../static/icon_choose.png" alt="" width="14" height="14" style="margin-left:10px;padding: 1em 0;">
                                <p style="font-size: 14px;color: #929192;padding: 1em 0;margin-left: 20px;">选择时间</p>
                            </div>
                            <div class="daterange-wrapper" style="padding: .5em 0;margin-right:10px;" configs="selfConfigs">
                                <vue-rangedate-picker
                                   @selected="onDateSelected"
                                    i18n='EN'
                                    value='2018-02-05'
                                    :shortDays="shortDays"
                                    format='YYYY-MM-DD'
                                    :months="monthsList"
                                    :configs="dateConfigs"
                                    righttoleft='false'
                                    :initRange='initRange'
                                    :captions='captions'
                                    :presetRanges='presetRanges'
                                    >
                                </vue-rangedate-picker>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- tab切换部分 -->
            <div class="tab-page" >
                <div class="tab-title">
                    <ul class="page-wrap wrap-between" style="width: 60%;">
                        <li
                            class="in1line"
                            v-for="(item,index) in tabList"
                            :key='index' :class="{active:index==tabFlag}"
                            @click="tabActive(index)">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
                <div class="page-wrap wrap-around content-group">
                    <div class="content-list" v-for="(item,index) in contentList" :key='index'>
                        <h2>{{item.num}}</h2>
                        <p>{{item.content}}</p>
                    </div>
                </div>
                <mt-tab-container v-model="active" v-if="chartShow">
                    <mt-tab-container-item id="tab-container0">
                        <mt-cell title="">
                            <!-- 图表部分 -->
                            <div class="charts-page">
                                 <div id="echart1" :style="{width: '100%', height: '300px'}"></div>
                            </div>
                        </mt-cell>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="tab-container1">
                        <mt-cell>
                            <!-- 图表部分 -->
                            <div class="charts-page">
                                <div id="echart2" :style="{width: '100%', height: '300px'}"></div>
                            </div>
                        </mt-cell>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="tab-container2">
                        <mt-cell>
                            <!-- 图表部分 -->
                            <div class="charts-page">
                                <div id="echart3" :style="{width: '100%', height: '300px'}"></div>
                            </div>
                        </mt-cell>
                    </mt-tab-container-item>
                </mt-tab-container>
            </div>
        </div>

    </div>
</template>
<script>
import { Toast } from 'mint-ui';
import VueRangedatePicker from 'vue-rangedate-picker';
import { Indicator } from 'mint-ui';
import echarts from 'echarts'

// 数组去重
function unique(array){
    var n = [];
    for(var i = 0; i < array.length; i++){
        if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
}
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}
function day7() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return {start: start, end:end}
}
export default {
    name: "",
    data: () => ({
        partnerObj:{'1':'平台方', '2':'合作方', '3':'渠道方', '4':'居间方', '5':'渠道方秘书', '6':'运营方', '7':'运营方秘书'},
        dateConfigs:{},
        presetRanges:{
            today7: function () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                return {
                  label: '最近7天', active: true, dateRange: {start: start, end: end}
                }
             },
             thisMonth: function () {const n = new Date()
                 const end = new Date()
                 const start = new Date()
                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                return {
                   label: '最近1月', active: false, dateRange:  {start: start, end: end}
            }},
             lastYear: function () {const n = new Date()
                 const end = new Date()
                 const start = new Date()
                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
                return {
                   label: '最近1年', active: false, dateRange:  {start: start, end: end}
            }}
        },
        captions:{
          'title': '日期',
          'ok_button': '确定'
       },
        shortDays:['周日','周一','周二','周三','周四','周五','周六'],
        initRange:day7(),
        monthsList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月',
                    '8月', '9月', '10月', '11月', '12月'],
        righttoleft:'true',
        showFlag: -1,
        tabShow: false,
        chartShow: true,
        datePopupVisible: false,
        companyPopupVisible: false,
        partnerPopupVisible: false,
        dateRangeShow: false,

        selectDate: '',
        selectPartner: '',
        companySlots: [         //  返回的键值对拆开  id
            {                   //  通过对应的索引来查询
              flex: 1,
              values: [],   //  name 机构名 数组
              className: 'company-slot',
              textAlign: 'center'
            }
        ],
        dateSlots: [
            {
                flex: 1,
                values: ['2015-01-01', '2015-02-02', '2015-03-03', '2015-04-03', '2015-05-05', '2015-06-06'],
                className: 'slot1',
                textAlign: 'right'
            }, {
                divider: true,
                content: '-',
                className: 'slot2'
            }, {
                flex: 1,
                values: ['2015-01-01', '2015-02-02', '2015-03-03', '2015-04-03', '2015-05-05', '2015-06-06'],
                className: 'slot3',
                textAlign: 'left'
            }
        ],
        partnerSlots: [     // 合作方
            {
              flex: 1,
              values: [],
              className: 'partner-slot',
              textAlign: 'center'
            }
        ],
        active: 'tab-container0',
        tabList: [
            {name: ' '}
        ],
        tabFlag: '-1',
        // 图表部分
        currentLine: '1',
        createAt: [],       //时间
        orgId: '',          //选中的机构id
        selectCompany:  '', // 选中展示的公司名称
        partnerType: '',    //选中展示的合作方名称
        partnerIdArr: [], // 合作方id
        partnerTypeArr: [], // 合作方类型
        partnerTypeIdList: [], //选中的合作方类型id list
        partnerTypeId: '',    //选中的合作方类型id
        type: '',           //车辆、订单、租金
        contentList: [],    //
        lineOption: "",
        orgList: [],      // api/org/list 获取的data
        nameList: [],     //机构名称列表
        idList: [],       //机构id列表
        typeList: [],     //机构类型列表
        roleTypeList: [],     //合作方类型列表
        selectType: [],       //选中机构type
        selectRoleType: [],     //选中的合作方type
        iIndex: '',       //选中的机构index
        pIndex: '',       //选中的合作方index
        titleName: '',
        unitName: '',
        selectedDate: {
            start: '',
            end: ''
          }
    }),
    methods:{
        onDateSelected: function (daterange) {
            console.log(daterange,"daterranger");
            this.selectedDate = daterange;
            this.query();
        },
        quit(){
            sessionStorage.clear();
        },
        dateShow(){
            this.dateRangeShow = true;
        },
        // 机构
        chooseCompany(val){
            this.companyPopupVisible=true;
            this.tabFlag=-1;
        },
        // 合作方
        choosePartner(val){
            this.partnerPopupVisible=true;
        },
        // 机构变化   获取合作方请求
        companyChange(picker, values) {
            let that = this;
            // that.chartShow=false;
            console.log(picker);
            that.selectCompany=values.join();
            // 机构匹配index
            let arr = that.companySlots[0].values;
            // console.log(arr,"llllllll");
            that.iIndex = arr.indexOf(values[0]);
            // 获取到对应机构id
            that.partnerSlots[0].values = [];
            that.partnerIdArr = [];
            that.partnerTypeArr = [];
            that.orgId = that.idList[that.iIndex];

            for(let i=0; i<that.orgList.length; i++){
                if(that.orgList[i].company_id === that.orgId) {
                    that.partnerIdArr.push(that.orgList[i].partnerid);
                    that.partnerTypeArr.push(that.orgList[i].role_type);
                    that.partnerSlots[0].values.push( that.partnerObj[(that.orgList[i].role_type).toString()]+"-"+that.orgList[i].pname);
                }
            }
            that.selectType=that.typeList[that.iIndex];
            let params={
                org_type: that.selectType,
                partner_type: that.partnerTypeArr[0]
            }
            that.getAccess(params)
         },
        // 合作方变化
        partnerChange(picker, values) {
            var that = this;
            // that.chartShow=false;
            console.log( '当前机构索引',this.iIndex);
            that.orgId = that.idList[that.iIndex];
                console.log( '当前机构id',that.orgId);
            this.selectPartner=values.join();
            console.log( '当前机构选择的合作方',that.selectPartner);
            this.partnerType=values;
            console.log("partnerType", values);
            // 合作方匹配index
            let arr = that.partnerSlots[0].values;
            console.log("合作方arr", arr);
            that.pIndex = arr.indexOf(values[0]);
            console.log("that.Pindex",that.pIndex);
            that.selectRoleType=that.partnerTypeArr[that.pIndex];
            // access验证
            let params = {
                org_type: that.selectType,
                partner_type: that.selectRoleType
            }
            that.getAccess(params);
        },
        tabActive(index){
            let that = this;
            console.log();
            that.tabFlag = index;
            that.active ='tab-container'+index;
            console.log(index,'zjwxsb');
            console.log("that.tabList",that.tabList);

            let arr = that.tabList;
            for(let i=0;i<arr.length;i++){
                if(arr[index].name == '车辆'){
                    that.currentLine=1;
                    that.type='bike';
                    that.titleName='车辆日均出租频次';
                    that.unitName='次';
                }else if(arr[index].name == '订单'){
                    that.currentLine=2;
                    that.type='order';
                    that.titleName='车辆订单数';
                    that.unitName='单';
                }else if(arr[index].name == '租金'){
                    that.currentLine=3;
                    that.type='income';
                    that.titleName='车辆租金收入';
                    that.unitName='元';
                }
            }
            that.query();
        },
        //  图表部分
        // 查询
        query(){
            let that = this;
            // console.log("that.chartShow",that.chartShow);
            console.log("查询的index",that.tabFlag)
            console.log("查询type::",that.type);
            var type = that.type,
                createAt = [
                    that.selectedDate.start,
                    that.selectedDate.end,
                ],
                orgId = that.orgId, //this.orgId,
                partnerType = that.partnerIdArr[that.pIndex]+','+ that.partnerTypeArr[that.pIndex]; //this.partnerType;
                if(!createAt[0] || !createAt[1]){
                    Toast('请点击日期确定按钮，选择完整时间！');
                    return;
                }
                if(!orgId || !that.partnerIdArr[that.pIndex] || !that.partnerTypeArr[that.pIndex] ){
                    Toast('请选择完整信息！');
                    Indicator.open('加载中...');
                    return;
                }
            let params = {
                createAt,
                orgId,
                partnerType,
                type
            }
            console.log(params,"params::::::");
            that.$axios.get('/api/statistics/data', {params: params}).then(function (res) {
                console.log('res::::',res);
                if(res.data.code===200){
                    Indicator.close();
                    that.insertOption(res.data.data,'echart'+that.currentLine);
                    that.draw('echart'+that.currentLine);
                    that.contentList = res.data.data.contentList;
                    for(let i=0;i<that.contentList.length;i++){
                        if(that.contentList[i].num==null){
                            console.log("dasdsa1");
                            that.contentList[i].num='0'
                        }
                    }
                    console.log("内容部分",that.contentList);
                }
            }).catch((error) => {
                console.log(`查询err: ${error}`)
            })
        },
        // 获取公司列表
        getCompany(){
            // 页面初始化
            let that= this;
            let _url = '/api/org/list';
            this.$axios.get(_url).then(function (res) {
                console.log("公司列表::",res);
                // let arr = res.data.data.tableData;
                that.orgList = res.data.data;
                let exist = {}, _nameList=[], _idList=[], _typeList=[], _roleTypeList=[], _partnerTypeIdList=[];
                for(let i=0;i<that.orgList.length;i++){
                    if(exist[that.orgList[i].company_id]){

                    }else{
                        exist[that.orgList[i].company_id] = true;
                        _nameList.push(that.orgList[i].cname)
                        _idList.push(that.orgList[i].company_id)
                        _typeList.push(that.orgList[i].ctype)
                        _roleTypeList.push(that.orgList[i].role_type)
                        _partnerTypeIdList.push(that.orgList[i].partnerid)
                    }
                }
                that.nameList = _nameList
                that.idList = _idList
                that.typeList = _typeList
                that.roleTypeList= _roleTypeList
                that.partnerTypeIdList = _partnerTypeIdList

                // 获取对应的合作方id
                that.partnerTypeId=that.partnerTypeIdList[0];
                console.log('partnerTypeId', that.partnerTypeId);
                that.companySlots[0].values = that.nameList;


                let params={
                    org_type: that.typeList[0],
                    partner_type: that.roleTypeList[0]
                }
                that.getAccess(params);
            }).catch((err) => {
                console.log(err);
            });
        },
        // 获取对应权限
        getAccess(params){
            console.log('getAccess Params:', params)
            let that = this;
            that.$axios.get('/api/org/access', {params: params}).then(function (res) {
                console.log('张继伟access res::::',res);
                let _access={};
                _access=res.data.data.access;
                console.log(_access);
                if(_access){
                    that.tabShow=true;
                    that.chartShow=true;
                    //  1.租金， 2.订单， 3车辆
                    if(_access=='1'){
                        that.tabList=[{name:'租金'}];
                    }else if(_access=='1,2'){
                        that.tabList=[{name:'租金'},{name:'订单'}];
                    }else if(_access=='1,3'){
                        that.tabList=[{name:'租金'},{name:'车辆'}];
                    }else if(_access=='2'){
                        that.tabList=[{name:'订单'}];
                    }else if(_access=='2,3'){
                        that.tabList=[{name:'订单'},{name:'车辆'}];
                    }else if(_access=='3'){
                        that.tabList=[{name:'车辆'}];
                    }else if(_access=='1,2,3'){
                        that.tabList=[{name:'租金'},{name:'订单'},{name:'车辆'}];
                    }
                    console.log(that.tabList,"tabList");
                }else{
                    that.tabList=[{name: ''}];
                    that.tabShow=false;
                }
            }).catch((error) => {
                console.log(`查询err: ${error}`)
            })
        },

        //填充生成折线图配置项
        insertOption(data,which){
            let that = this;
            console.log(data,which);
            switch (which) {
                case 'bike':
                break;

                case 'order':
                break;

                case 'income':
                break;
            }
            let option = {
                title:{
                    text: this.titleName
                },
                xAxis: {
                    type: 'category',
                    data: data.chartX,
                },
                yAxis: {
                    type: 'value',
                    name: this.unitName
                },
                series: [{
                    type:'line',
                    data:data.chartData,
                }]
            };
            that.lineOption = option;
            console.log("曲线参数:",that.lineOption);
        },
        // 绘制折线图
        draw(id){
            console.log("绘制折线图id:",id);
            let that = this;
            let option = that.lineOption;
            that.charts = echarts.init(document.getElementById(id));
            that.charts.setOption(option);
            window.onresize = function () {
                echarts.init(document.getElementById(id)).resize();
            };
        },
    },

    beforeMount() {
      //do something before mounting vue instance
    },
    mounted() {
        // this.selectedDate.start=new Date().Format("yyyy-MM-dd");
        this.getCompany();

    },
    components: {
        VueRangedatePicker
     },
}
</script>
<style media="screen">
    html,body{
        background: #fff;
        margin: 0;
        padding: 0;
    }
    .calendar{
        box-shadow: none!important;
        padding-bottom: 20px!important;
        overflow: hidden!important;
    }
    .calendar-range{
        position: absolute!important;
        right: 0!important;
        padding: 0 30px!important;
    }
    .calendar-wrap{
        position: absolute!important;
        width: 78%!important;
    }
    .calendar-range{
        position: absolute!important;
        width: 45%!important;
    }
    .calendar-range{
        border-left: none!important;
        top: 95px!important;
        right: -10px!important;
        margin-right: -48px!important;
    }
    .calendar-btn-apply{
        width: 55px!important;
    }
    .index-page{
        width: 100%;
    }
    .index-page .mint-header{
        height: 44px;
        width: 100%;
        background: #f2f2f2;
        color: #000;
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
    }
    .index-page .panel-body{
        margin-top: 44px;
    }
    .company-choose{
        margin-top: 69px;
    }
    .company-choose .mint-cell-value span{
        display: inline-block;
        width: 200px;
        text-align: right;
    }
    .date-choose,.partner-choose{
        margin-top: 15px
    }
    .mint-popup{
        width: 100%;
    }
    .date-range{
        width: 100px;
        height: 155px;
        border-radius: 5px;
        padding-top: 8px;
        position: absolute;
        top: 107px;
        right: 20px;
        z-index: 10;
        background: #fff;
        text-align: center;
    }
    .date-range p{
        line-height: 36px;
    }
    /**向下的三角**/
    .sanjiao_down{
        width:0;
        height:0;
        z-index: 99;
        position: absolute;
        top:-14px;
        right: 5px;
        overflow:hidden;
        font-size: 0;
        line-height: 0;
        border-width:7px;
        border-style:solid dashed dashed dashed;
        border-color:transparent transparent #fff transparent ;
    }
    .mint-cell{
        background: #f2f2f2;
    }
    .mint-cell-value{
        color: #4ca274;
    }
    .mint-cell-title{
        color: #929192;
    }
    .mint-cell-text{
        margin-left: 15px;
    }
    .is-link{

    }
    /*
        tab切换部分
     */
     .tab-title{
         width: 100%;
         height: 66px;
         padding-top: 15px;
     }
     .tab-title ul{
         /* width: 225px; */
         margin: 0 auto;
         color: #49a167;
         border: 1px solid #49a167;
         border-radius: 10px;
         overflow: hidden;
         -webkit-appearance: none;
     }
     .tab-title li{
         width: 100%;
         height: 36px;
         line-height: 36px;
         border-right: 1px solid #49a167;
         text-align: center;
         padding: 0 5px;
         -webkit-box-orient: vertical;
         -webkit-line-clamp: 1
     }
     .tab-title ul li:last-child{
         border-right: 0;
     }
     .active{
         color: #fff;
         background: #49a167;
         background-clip: padding-box;
         border: 1px solid #49a167;
     }

     .content-group{
         padding: 10px 0 20px;
     }
     .content-group h2{
         font-size: 18px;
     }
     .content-group p{
         margin-top: 5px;
     }
    /*
        图表部分
     */
     .charts-page{
         width: 100%;
         /* height: 500px; */
         margin-top: 15px;
     }
     .top-page{
         width: 100%;
         height: 175px;
         padding: 15px 0;
     }
     .top-page div{
         width: 50%;
         text-align: center;
     }
    .top-page h3{
         font-size: 30px;
         color: #4ca274;
     }
     .top-page p{
         margin-top: 10px;
     }
     .day-rent-page{
         /* border-right: 1px solid #d0d0d0; */
     }
     .mint-tab-container-wrap,.mint-tab-container,.tab-page,.mint-cell-wrapper,.charts-page{
         margin: 0 auto;
     }
     .mint-tab-container .mint-cell{
         padding-top: 15px;
     }
     .mint-cell-title,.tab-page{
         font-size: 14px!important;
     }
     .mint-cell-value{
         font-size: 14px;
     }
     .tab-page .mint-cell-value{
         width: 100%;
     }

     .content-list{
         width: 50%;
         text-align: center;
     }


     .main {
     min-height: 500px;
   }
   .compact-wrapper {
     min-height: 350px;
   }
   .card{
     padding: 1em;
     margin: 0 .5em;
   }
  .calendar-head,.calendar_month_left,.calendar_month_right{
       width: 100%!important;
   }
   .calendar{
       width: 100%!important;
       height: 97%!important;
       left: 0!important;
       top: 243px!important;
   }
   .input-date{
       color: #4ca274;
       text-align: center;
   }
   .company-choose .mint-cell-value {
       width: 180px!important;
   }
   .calendar_preset li{
       width: 60px!important;
       padding: 5px!important;
   }
</style>
