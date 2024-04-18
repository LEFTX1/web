<template>
    <div class="main">
        <h3>vue3 表单验证</h3>
        <form >
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
            </div>
        </form>
    </div>
</template>
<script setup>
import { reactive } from "vue"
import axios from 'axios'
import Ksd from '@/utils/index.js'

// 响应式数据
const formData = reactive({
    'username': '',
    'password': '',
    'cpassword': '',
})

const handleValidatorUsername = ()=>{
    if(!formData.username){
        Ksd.error("请输入用户名!!!")
        return;
    }
}

// 验证
const validate = {
    async validator(){
        // 获取表单formData的数据（v-model）
        if(!formData.username){
            Ksd.error("请输入用户名!!!")
            return Promise.reject("username");
        }
        if(!formData.password){
            Ksd.error("请输入密码!!!")
            return Promise.reject("password");
        }
        if(!formData.cpassword){
            Ksd.error("请输入确认密码!!!")
            return Promise.reject("cpassword");
        }
        // 密码是否相同
        if(formData.password != formData.cpassword){
            Ksd.error("输入确认密码和密码不一致!!!")
            return Promise.reject("cpassword");
        }
        return Promise.resolve("success");
    }
}

const handleSubmit = async ()=>{
   try{
      const resp = await validate.validator()
      console.log(resp)
      alert("success")

      axios.post("toLogin");
      
   }catch(e){
      document.querySelector("#"+e).focus();
   }
}
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