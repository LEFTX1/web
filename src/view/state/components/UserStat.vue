<template>
    <el-card shadow="always" style="margin-top: 15px;" :body-style="{ padding: '20px' }">
        <template #header>
            <div>
                <span>统计平台男和女比例</span>
            </div>
        </template>
        <div id="mainbox" style="width: 100%;height: 400px;"></div>
    </el-card>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, reactive } from 'vue';


// 初始化统计报表
const handleLoadUserMale = () => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('mainbox'));
    // 绘制图表
    myChart.setOption({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ]
            }
        ]
    })
}



onMounted(() => {
    // 统计性别男女
    handleLoadUserMale()
})

</script>