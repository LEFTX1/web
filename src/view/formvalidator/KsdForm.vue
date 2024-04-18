<template>
    <form ref="formRef">
        <slot></slot>
    </form>
</template>

<script setup>
import { ref } from "vue"

// 自定义属性
const props = defineProps({
    model:{
        type:Object,
        default:{}
    },
    rules:{
        type:Object,
        default:{} 
    }
})

const formRef = ref();
// 重置表单
const resetFields = () => {
    formRef.value.reset();
}

// 验证方法
const validate = async (callback) => {
    var modelData = props.model; //{username:"xxx","password":"xxx"}
    var rulesData = props.rules; //{"username":{required:true}}
    // 遍历规则-开始和数据模型中的数据开始进行校验
    for(const key in rulesData){
        // 获取到验证的属性
        var field = key;
        // 获取验证属性的规则
        var rule = rulesData[key]
        // 获取需要验证的数据模型
        for(var ckey in rule){
            var message = rule["message"]
            // 获取
            if((ckey == "required" && rule[ckey]) &&  !modelData[field]){
                callback && callback(false,message)
                return Promise.resolve(message)
            }
        }
    }

    callback && callback(true,"success")
    return Promise.resolve(true);
}


// 清除验证

// 单个属性验证

// 暴露方法
defineExpose({
    resetFields,
    validate
})


</script>
