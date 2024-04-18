<template>
     <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
            <div>
                <span>统计学相伴2023年度每个月的用户注册量</span>
                <select v-model="selectYear" @change="handleChangeYear">
                    <option value="">--请选择年份--</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div>
        </template>
        <div id="main" style="width: 100%;height: 400px;"></div>
        
        <div v-if="userInfoDatas && userInfoDatas.length > 0" style="padding:10px;background:#fafafa;">
            <el-table v-loading="loading" :data="userInfoDatas"  style="width: 100%">
            <el-table-column label="ID" prop="id"  ></el-table-column>
            <el-table-column label="名字" prop="username"></el-table-column>
            <el-table-column label="昵称" prop="nickname"></el-table-column>
            <el-table-column label="性别" prop="sex"></el-table-column>
            <el-table-column label="年龄" prop="age"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column label="工作" prop="job"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            </el-table>
            <div class="pagination" style="display:flex;justify-content: center;">
            <el-pagination :current-page="pageInfo.page" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 50, 80, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
            </div>
        </div>    
    </el-card>


</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted,reactive,ref } from 'vue';
import {userRegState,findUserRegState} from '@/api/stateapi.js'
// 年份选择的响应式数据定义
const selectYear = ref(new Date().getFullYear()-1);
let myChart = null

//装在用户容器的响应式数组对象
const userInfoDatas = ref([])
const pageInfo = reactive({page:1,pageSize:10,total:0,ym:""})
const handleLoadUser = async ()=>{
    const res = await findUserRegState(pageInfo);
    userInfoDatas.value = res.data.list
    pageInfo.page = res.data.page
    pageInfo.pageSize = res.data.pageSize
    pageInfo.total = res.data.total
}

// 点击每页查询
const handleCurrentChange = (page)=>{
    pageInfo.page = page;
    handleLoadUser();
}

// 改变pageSize查询
const handleSizeChange = (pageSize)=>{
    pageInfo.pageSize = pageSize;
    pageInfo.page = 0;
    pageInfo.pageSize = 10;
    handleLoadUser();
}

// 改变年份查询统计信息
const handleChangeYear = ()=>{
    userInfoDatas.value = [];
    // 加载统计报表信息
    handleLoadCharts();
}


// 初始化统计报表
const handleLoadCharts = async () => {
    const year = selectYear.value;
    const resp = await userRegState(year);
    const regStateArr = resp.data;

    // 转换成map数据解构---把二维---一维
    var params = {};
    if(regStateArr && regStateArr.length > 0){
        regStateArr.forEach(c=>{
            params[c.ym] = c.cnum;
        })
    }

    // 每个月
    var xdata = [];
    // 每个月对应的数据 
    var ydata = [];
    const color = [
        '#c23531',
        '#2f4554',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
    ]
    for(let i=1;i<=12;i++){
        var key = year+"-"+(i<10?("0"+i):i);
        xdata.push(key);
        ydata.push( {
          value: params[key] || 0,
          itemStyle: {
            color: color[Math.floor(Math.random() * color.length)]
          }
        });
    }
  
    // 基于准备好的dom，初始化echarts实例
    if(myChart){
        myChart.dispose();
    }

    myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
        tooltip: {},
        xAxis: {
            data: xdata
        },
        legend: {
            show: true
        },
        yAxis: {},
        series: [{
            name: '注册量',
            type: 'bar',
            data: ydata
        }]
    });

    // 点击获取行为
    myChart.on('click',(params)=>{
        // 获取当前点击的柱形的name和索引
        //var dataIndex = params.dataIndex;
        var ym = params.name;
        // 执行查询
        pageInfo.ym = ym
        handleLoadUser();
    });

   
}


onMounted(() => {
    // 初始化统计报表
    handleLoadCharts()
    window.addEventListener('resize', function() {
        myChart.resize();
    });
})

</script>