<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
            <div>
                <span>统计学相伴2023年度每个月的用户注册量</span>
            </div>
        </template>
        <div id="chinaMap" style="width: 100%;height: 800px;"></div>
    </el-card>
</template>

<script setup>
import { onMounted } from 'vue'
import echarts from "@/utils/echarts";
import chinaMap from '@/utils/china.json'

const sdata = [
    {"name": "北京市", "value": 42, "rukuNum":42,"chukuNum":8},
    {"name": "上海市", "value": 688, "rukuNum":688,"chukuNum":299},
    {"name": "黑龙江省", "value": 7, "rukuNum":7,"chukuNum":0}
]
const handleLoadMap = () => {
    // 中国地图
    echarts.registerMap('china', chinaMap); //注册地图数据
    const mychart = echarts.init(document.getElementById("chinaMap"));
    const option = {
        //浮动提示框
        title: { text: '全国各地信息统计情况', left: "4%", top: "3%" },
        tooltip: {
            backgroundColor: "rgba(50,50,50,0.7)",
            textStyle: { color: "#fff" },
            formatter(params, ticket, callback) {
                //  就是series配置项中的data数据遍历
                let value = 0, rukuNum = 0, chukuNum = 0;
                const data = params.data;
                if (data) {
                    value = data.value;
                    rukuNum = data.rukuNum;
                    chukuNum = data.chukuNum;
                }
                let html = `<div>入库数量：${rukuNum}</div>
                    <div>出库数量：${chukuNum}</div>`
                return html;
            }
        },
        visualMap: {
            type: "piecewise",
            min: 0,
            max: 5000,
            itemWidth: 40,
            top: 60, 
            left: 20,
            pieces: [
                { gt: 900, lt: 1000, label: '900-1000', color: '#6ad86e' }, // (900, 1000]
                { gt: 500, lt: 900, label: '500-900', color: '#9adcfa' }, // (500, 900]
                { gt: 310, lt: 500, label: '310-500', color: '#ffeb3b' }, // (310, 500]
                { gt: 100, lt: 300, label: '100-300', color: '#ff9800' }, // (200, 300]
                { gt: 0, lt: 100, label: '>100', color: 'orangered' } // (10, 200]
            ]
        },
        geo: {
            map: "china",
            zoom: 2,
            roam: true,
            aspectScale: 0.75,
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
                label: { show: false }, 
                data: sdata
            }
        ]
    }
    mychart.on("click",function(params){
        console.log("params",params)
    })
    mychart.setOption(option);
    window.addEventListener("resize", function () { mychart.resize(); });
}


onMounted(() => {
    handleLoadMap();
})
</script>