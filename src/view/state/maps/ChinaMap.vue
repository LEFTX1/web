<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
            <div class="header">
                <span>统计学相伴平台用户每个城市的注册量</span>
            </div>
        </template>
        <div id="chinaMap" style="width: 100%;height: 600px;"></div>
    </el-card>
</template>

<script setup>
import { onMounted } from 'vue'
import echarts from '@/utils/echarts.js'
import china from '@/utils/china.json'

const handleLoadMap = async () => {
    //const sdata = await queryUserReg();
    const sdata = [
        { "name": "北京市", "value": 42, "rukuNum": 42, "chukuNum": 8 },
        { "name": "上海市", "value": 688, "rukuNum": 688, "chukuNum": 299 },
        { "name": "黑龙江省", "value": 7, "rukuNum": 7, "chukuNum": 0 },
        { "name": "广东省", "value": 1557, "rukuNum": 1557, "chukuNum": 0 }
    ];

    echarts.registerMap('china', china); //注册地图数据
    const mychart = echarts.init(document.getElementById("chinaMap"));

    // 查看配置项：https://echarts.apache.org/zh/option.html#options
    const option = {
        //浮动提示框
        tooltip: {
            backgroundColor: "rgba(0,0,0,1)",
            textStyle: { color: "#fff" },
            formatter(params, ticket, callback) {
                // params.data 就是series配置项中的data数据遍历
                let value = 0, rukuNum = 0, chukuNum = 0;
                if (params.data) {
                    value = params.data.value;
                    rukuNum = params.data.rukuNum;
                    chukuNum = params.data.chukuNum;
                }
                let html = `
                <div>城市名字：${params.data.name}</div>
                <div>入库数量：${rukuNum}</div>
                    <div>出库数量：${chukuNum}</div>`
                return html;
            }
        },
        visualMap: {
            type: "piecewise",
            min: 0,
            max: 5000,
            itemWidth: 40,
            top: 60, left: 20,
            pieces: [ // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
                { gt: 1000, label: '>1000', color: '#4d70ff' }, // (900, 1000]
                { gt: 900, lt: 1000, label: '900-1000', color: '#6ad86e' }, // (900, 1000]
                { gt: 500, lt: 900, label: '500-900', color: '#9adcfa' }, // (500, 900]
                { gt: 310, lt: 500, label: '310-500', color: '#ffeb3b' }, // (310, 500]
                { gt: 100, lt: 300, label: '100-300', color: '#ff9800' }, // (200, 300]
                { gt: 0, lt: 100, label: '>100', color: 'orangered' } // (10, 200]
            ]
        },
        geo: {
            map: "china",
            zoom: 2.2,
            roam:true,
            label: { show: true },
            itemStyle: {
                borderColor: 'rgba(0, 0, 0, 0.2)',
                // areaColor: '#8DBFEB',  //地图的背景色
                emphasis: { // 高亮状态下的多边形和标签样式
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        series: [
            {
                name: "",
                type: "map",
                geoIndex: 0, 
                label: { show: true }, 
                data: sdata
            }
        ]
    }

    mychart.setOption(option);
    window.addEventListener("resize", function () { mychart.resize(); });

}

// 生命周期加载地图
onMounted(() => {
    handleLoadMap();
})
</script>

<style scoped lang="scss">
.header {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
</style>