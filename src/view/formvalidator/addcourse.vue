<!-- <template>

    <form action="" method="post">
        {{ formData }}
        <p>标题：<input type="text" v-model.trim="formData.title"></p>
        <p>描述：<input type="text" v-model.trim="formData.desc"></p>
        <p>金额：<input type="text" v-model.trim="formData.money"></p>
        <p>邮箱：<input type="text" v-model.trim="formData.email"></p>
        <p><button @click.prevent="handleAddCourse">添加课程</button></p>
    </form>

</template>

<script setup>
import {ref} from 'vue'
import Ksd from '@/utils/index.js'
//import Validator from '@/view/formvalidator/validator.js'
//import Validator from 'validator'
// 定义一个数据模式
const formData = ref({
    title:"",
    desc:"",
    money:0,
    email:""
})


const validator = {
     async validate(){
        // 这里写方法
        if(Validator.isEmpty(formData.value.title)){
            Ksd.message("请输入标题!!!");
            return Promise.reject({field:"title",msg:"请输入标题"});
        }

        if(Validator.isEmpty(formData.value.desc)){
            Ksd.message("请输入描述!!!");
            return Promise.reject({field:"desc",msg:"请输入描述"});
        }

        if(Validator.isEmpty(formData.value.money)){
            Ksd.message("请输入金额!!!");
            return Promise.reject({field:"money",msg:"请输入金额"});
        }

        if(!Validator.isNumber(formData.value.money)){
            Ksd.message("金额必须是数字!!!");
            return Promise.reject({field:"money",msg:"金额必须是数字"});
        }

        if(Validator.isEmpty(formData.value.email)){     
            Ksd.message("请输入邮箱!!!");
            return Promise.reject({field:"email",msg:"请输入邮箱"});
        }

        if(!Validator.isEmail(formData.value.email)){
            Ksd.message("邮箱不合法!!!");
            return Promise.reject({field:"email",msg:"邮箱不合法"});
        }
        
        return Promise.resolve(true);
    }
}

// es7 async +await
const handleAddCourse = async ()=>{
    try{
        const flag = await validator.validate();
        if(flag){
            alert("success")
        }
    }catch(e){
        alert(JSON.stringify(e))
    }
}




// const validator = {
//     async validate(){
//         // 这里写方法
//         if(!formData.value.username){
//             Ksd.message("请输入用户名!!!");
//             return Promise.reject(false);
//         }

//         if(!formData.value.password){
//             Ksd.message("请输入密码!!!");
//             return Promise.reject(false);
//         }

//         return Promise.resolve(true);
//     }
// }

// // 添加课程的方法
// const handleAddCourse = async ()=>{
//     var valid = await validator.validate();
//     if(valid){
//         alert("success")
//     }
// }

</script>

<style scoped lang="scss">

</style> -->
