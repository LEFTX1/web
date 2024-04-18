<template>
  <div style="padding: 20px;background: #fff;">
    <div class="ksd-search-container">
      <el-button type="success" icon="Plus" @click="handleOpenAdd">添加一级分类</el-button>
    </div>
    <el-table
      :data="categoryList"
      style="margin-bottom: 20px"
      row-key="id"
      border
      :default-expand-all="false"
    >
      <el-table-column prop="id" label="ID" width="主键" align="center"/>
      <el-table-column prop="categoryName" label="分类名称" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            size="large"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(scope.row,'status')"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="删除状态" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDelete"
            size="large"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(scope.row,'is_delete')"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="排序" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.sorted"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
            {{ formatTimeToStr(scope.row.createTime,"yyyy/MM/dd hh:mm:ss") }}  
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template #default="scope">
            {{ formatTimeToStr(scope.row.updateTime,"yyyy/MM/dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="300px">
        <template #default="scope">
          <el-button size="small" :disabled="scope.row.parentId != 0" type="primary" @click="handleAddCategory(scope.row)"><el-icon>
              <Plus />
            </el-icon>添加子分类</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row,scope.row.parentId==0)"><el-icon>
              <Edit />
            </el-icon>编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
            icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--添加分类-->
    <add-category ref="addCategoryRef" @success="handleReload"></add-category>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { loadCategory,delById} from "@/api/videocategory"
import { formatTimeToStr } from '@/utils/date'
import AddCategory from '@/view/video/components/AddCategory.vue'
import Ksd from '@/utils/index.js'

// 获取添加子组件的对象
const addCategoryRef = ref(null);
// 打开添加一级分类
const handleOpenAdd = ()=>{
  addCategoryRef.value.handleOpen();
}
// 打开添加子分类
const handleAddCategory = (row)=>{
  addCategoryRef.value.handleAddOpen(row,true);
}
// 编辑就打开
const handleEdit = (row,flag)=>{
  addCategoryRef.value.handleOpen(row,flag);
}
// 添加和编辑成功的刷新方法
const handleReload = ()=>{
  handleLoadData()
}

// 数据的管理和搜索查询
const searchForm = reactive({
  keyword:"",
  status:"",
})

const rules = reactive({
  title: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
})

// 定义接受分类数据的容器--响应式
var categoryList = ref([])

// 定义查询分类数据的方法
const handleLoadData = async () => {
  const res = await loadCategory()
  categoryList.value = res.data
}

// 删除分类
const handleDelete = async (index,row)=>{
  alert(1)
  const res = await delById(row.id)
  console.log("res",res);
}


// 生命周期执行函数
onMounted(() => {
  handleLoadData()
})
</script>

<style scoped>

.ksd-search-container{
  margin-bottom: 10px;
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>