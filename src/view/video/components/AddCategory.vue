<template>
  <!--添加主分类 -->
  <el-dialog v-model="dialogVisible" :close-on-press-escape="false" 
  :close-on-click-modal="false" :title="categoryTitle"
    width="600px" :before-close="handleClose">
    <el-form ref="videoCategoryFormRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="父分类" prop="parentId">
        <!-- 如果添加的一级分类---父分类parentId=0,并且不能选中
        如果添加的子分类，====子分类的对应父分类要被选中，通过可以更换 -->
        <el-select v-model="formData.parentId" :disabled="formData.parentId==0 || rootFlag" clearable class="m-2" 
        placeholder="请选择主分类" size="large">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="请输入分类名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="分类描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入分类描述" maxlength="50" />
      </el-form-item>
      <el-form-item label="分类排序" prop="sorted">
        <el-input v-model="formData.sorted" type="number" placeholder="请输入分类排序" maxlength="11" />
      </el-form-item>
      <el-form-item label="发布状态" prop="status">
        <el-radio-group v-model="formData.status" class="ml-4">
          <el-radio :label="1">发布</el-radio>
          <el-radio :label="0">未发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="删除状态" prop="isDelete">
        <el-radio-group v-model="formData.isDelete" class="ml-4">
          <el-radio :label="1">已删除</el-radio>
          <el-radio :label="0">未删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit"><el-icon>
            <Check />
          </el-icon>保存</el-button>
        <el-button @click="handleClose"><el-icon>
            <Close />
          </el-icon>关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref,reactive} from 'vue'
import { findRoot,saveVideoCategory,updateVideoCategory } from '@/api/videocategory.js'
import Ksd from '@/utils/index.js'

// 自定义事件
const emits = defineEmits(["success"])

// 让页面子组件显示出来
const dialogVisible = ref(false)
const rootFlag = ref(false)
// 定义分类数据容器接收
var categoryList = ref([])
var categoryTitle = ref("添加父分类")
// 这个用于调用form表单的方法和事件，主要用于做校验和重置等相关操作
const videoCategoryFormRef = ref({});
// 定义form保存的对象数据模型-v-model
const formData = ref({
  parentId:0,
  categoryName: '',
  description: '',
  sorted: 1,
  status: 1,
  isDelete: 0
})
// 调用校验规则
const rules = reactive({
  parentId: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
})

// 加载一级分类
const loadCategoriesData = async () => {
    const res = await findRoot();
    categoryList.value = res.data;
}

// 添加父分类
const handleOpen = async (row,flag) => {
  // 加载分类
  await loadCategoriesData()
  // 添加根分类
  categoryList.value.unshift({id:0,categoryName:"根分类"})
  // 编辑当前的数据
  if(row){
    // 编辑当前的数据
    formData.value = row
    // 编辑框的标题更改
    categoryTitle.value = "编辑父分类【"+row.categoryName+"】"
  }else{
    handleReset()
    formData.parentId = 0
    // 编辑框的标题更改
    categoryTitle.value = "添加父分类"
  }
   // 打开编辑框
  dialogVisible.value = true
}


const handleAddOpen = async (row,flag) => {
  // 加载分类
  await loadCategoriesData()
  rootFlag.value = flag
  // 重置成最初状态来添加子分类
  handleReset(); 
  // 把父亲分类选择，代表你的子分类要挂载到拿个父分类下
  formData.value.parentId = row.id;
  // 编辑框的标题更改
  categoryTitle.value = "给【"+row.categoryName+"】添加子分类"
  // 打开添加框
  dialogVisible.value = true
}

// 关闭
const handleClose = () => {
  dialogVisible.value = false
  categoryList.value = []
  handleReset();
  categoryTitle.value = "添加分类";
}

// 提交保存
const handleSubmit = async () => {
  // 进行数据校验
  await videoCategoryFormRef.value.validate(async (valid)=>{
    if(valid){
      //formData.value.createTime = null;
      //formData.value.updateTime = null;
      
      //delete formData.value.createTime
      //delete formData.value.updateTime

      formData.value.sorted = formData.value.sorted * 1
      if(formData.value.id){
        // 执行编辑
        await updateVideoCategory(formData.value) 
        // 提示
        Ksd.success("更新分类【"+formData.value.categoryName+"】成功!")
      }else{
        // 执行保存
        await saveVideoCategory(formData.value) 
        // 提示
        Ksd.success("添加分类【"+formData.value.categoryName+"】成功!")
      }
      // 关闭方法
      handleClose();
      // 刷新父窗口的事件
      emits("success");
    }
  })
}

//重置
const handleReset = ()=>{
    formData.value = {
      parentId:0,
      categoryName: '',
      description: '',
      sorted: 1,
      status: 1,
      isDelete: 0
    }
}

// 子组件默认包含是私有
defineExpose({
  handleOpen,
  handleAddOpen,
  handleClose
})
</script>

<style lang="scss" scoped></style>>