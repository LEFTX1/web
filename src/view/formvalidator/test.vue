<template>
    <div class="main">
        <h3>vue3 表单验证</h3>
        <ksd-form ref="videoForm" :model="formData" :rules="rules">
            <div>
                <label class="label">账号</label>
                <input  type="text" id="username" @blur="handleValidatorUsername" v-model="formData.username" placeholder="请输入账号" class="input" />
            </div>
            <div>
                <label class="label">密码</label>
                <input  tyep="password" id="password" v-model="formData.password" type="text" class="input"  placeholder="请输入密码"  />
            </div>
            <div>
                <label class="label">确认密码</label>
                <input  tyep="password" id="cpassword" v-model="formData.cpassword" type="text" class="input"  placeholder="请输入密码"  />
            </div>
            <div>
                <button @click.prevent="handleSubmit">保存</button>
                <button @click.prevent="handleReset">重置</button>
            </div>
        </ksd-form>
    </div>
</template>
<script setup>
import { reactive, ref } from "vue"
import KsdForm from './KsdForm.vue'
import Ksd from '@/utils/index.js'
const videoForm = ref({});
const formData = reactive({username:"",password:""})
const rules = reactive({
    'username':{required:true,message:"请输入用户名"},
    'password':{required:true,message:"请输入密码"},
})

// 重置
const handleReset = ()=>{
    videoForm.value.resetFields();
}

// 提交
const handleSubmit =  () => {
    videoForm.value.validate((valid,msg)=>{
        if(valid){
            alert("success")
        }else{
            alert(msg)
        }
    })
}

// const handleSubmit = async () => {
//     try{
//         const valid = await videoForm.value.validate();
//         alert(valid)
//     }catch(e){
//         alert(e)
//     }
// }
</script>
<style lang="css">
.main{
    text-align:center;
}
.label {
    padding-right: 10px;
    padding-left: 10px;
    display: inline-block;
    box-sizing: border-box;
    width: 100px;
    text-align: right;
}
.input {
    width: 200px;
    height: 30px;
    text-indent: 1em;
    margin-top:10px;
}
</style>