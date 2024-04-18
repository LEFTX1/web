<template>
    <div class="imguload-box">
        <div class="imgbox" v-if="serverData.fullpath && props.showimg">
            <img :src="serverData.fullpath"/>
        </div>
        <el-upload
            :method="uploadOptions.method"
            :name="uploadOptions.name"
            :accept="uploadOptions.accept"
            :data="uploadOptions.data"
            :show-file-list="false"
            :action="uploadOptions.action"
            :on-progress="uploadOptions.handleUploadProgress"
            :on-success="uploadOptions.handleUploadSuccess"
            :on-error="uploadOptions.handleUploadError"
            :headers="uploadOptions.headers"
            ><slot></slot>
        </el-upload>
    </div>
</template>

<script setup>
  import { reactive,ref} from 'vue'
  const apiPath = ref(import.meta.env.VITE_BASE_API)
  // 定义组件的v-model用于吧组件中的数据传递给调用者
  const props = defineProps({
    modelValue: {
       type: [Object,String]
    },
    dir:{
        type: String,
        default: "default"
    },
    showimg: {
        type: Boolean,
        default: true
    }
  })
  const emits = defineEmits(["update:modelValue"])
  // 图片预览的数据
  const serverData = ref({})
  // 文件上传的地址
  const uploadOptions = reactive({
    action:apiPath.value+"/local/upload/file",
    name:"file",
    method:"post",
    accept:'image/png, image/jpeg',
    // 文件上传使用
    headers:{},
    // 文件上传给服务去的参数
    data:{"dir":props.dir},
    // 监听文件上传的进度
    handleUploadProgress(evt, file){
        console.log("文件上传的进度是：",evt)
    },
    // 监听文件上传的错误
    handleUploadError(err,file){
        console.log("上传失败的原因是：",err)
    },
    // 监听文件上传的成功
    handleUploadSuccess(res,file){
        console.log("上传成功返回的数据是：",res)
        serverData.value = res.data 
        emits("update:modelValue", res.data.fullpath)
    }
  })
</script>

<style lang="scss" scoped>
.imgbox{
    width: 200px;
    height: 140px;
    background: #fafafa;
    border:1px solid #eee;
    margin-top:10px;
    display: flex;
    margin-right: 10px;

    img{
      width: 100%;
      object-fit: contain;
    }
  }
  
</style>