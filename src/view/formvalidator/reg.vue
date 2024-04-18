<template>
    <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
            <el-input v-model="loginForm.pass" placeholder="请输入密码" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="loginForm.checkPass" placeholder="请输入确认密码" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
            <el-input v-model.number="loginForm.age" placeholder="请输入年龄"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm">注册</el-button>
            <el-button @click="resetForm">重置 </el-button>
            <el-button @click="clearValidForm">清除验证</el-button>
        </el-form-item>
    </el-form>
</template>
  
<script  setup>
import { reactive, ref } from 'vue'

// 定义一个表单的ref
const loginFormRef = ref()

// 定义表单的响应式数据，建议都使用reactive
const loginForm = reactive({
    pass: '',
    checkPass: '',
    age: '',
})


// rule 验证规则
// value 你填写表的值 
// callback 就是验证的错误和正确的提示
const validateCheckPass = (rule,value,callback)=>{
     if (value !== loginForm.pass) {
        callback(new Error("确认密码和密码不一致!"))
    } else {
        callback()
    }
}

const validateCheckPassLen = (rule,value,callback)=>{
   if (value.length < 3 || value.length > 20) {
        callback(new Error("密码长度是3到20位!"))
    } else {
        callback()
    }
}

// 验证规则
const rules = reactive({
    pass:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validateCheckPassLen, trigger: 'blur' }
    ],
    checkPass:[
         { required: true, message: '请输入确认密码', trigger: 'blur' },
         { validator: validateCheckPassLen, trigger: 'blur' },
         { validator: validateCheckPass, trigger: 'blur' }
    ],
    age:{ required: true, message: '请输入年龄', trigger: 'blur' },
})


// 提交表单
const submitForm = () => {
    loginFormRef.value.validate((valid) => {
        // 如果为valid = true 校验全部都是正确的
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}

// 重置表单
const resetForm = () => {
   loginFormRef.value.resetFields()
}

// 清除验证
const clearValidForm = () => {
   loginFormRef.value.clearValidate()
}

</script>
  