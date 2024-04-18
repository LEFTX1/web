<template>
  <div style="padding: 20px;background: #fff;">
    <div class="ksd-search-container">
      <el-button type="success" icon="Plus" @click="handleOpenAdd">添加一级分类</el-button>
      <el-button type="danger" icon="Delete" @click="handleBatchDel">批量删除</el-button>
      <el-select v-model="searchForm.status" @change="handleSearch" @clear="searchForm.status=-1" style="margin-left: 10px;" clearable class="m-2" placeholder="请选择帖子状态" size="large">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="searchForm.keyword" clearable class="w-50" size="small" :input-style="{ 'width': '240px', 'margin': '0 10px' }" placeholder="请输入分类名称" :suffix-icon="Search" />
      <el-button type="success" style="margin-left: 40px;" @click="handleSearch" icon="Search">搜索</el-button>
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
      <el-table-column label="删除状态" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDelete"
            size="large"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(scope.row,'is_delete')"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.sorted"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
            {{ formatTimeToStr(scope.row.createTime,"MM/yyyy/dd hh:mm:ss") }}  
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template #default="scope">
            {{ formatTimeToStr(scope.row.updateTime,"yyyy/MM/dd hh:mm:ss") }}  
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"><el-icon>
              <Plus />
            </el-icon>添加子分类</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"><el-icon>
              <Edit />
            </el-icon>编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
            icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--添加分类-->
    <add-category></add-category>
    

    <el-tree :data="categoryList" v-if="false" show-checkbox node-key="id" 
      default-expand-all 
      draggable
      ref="categoryTreeRef"
      @node-click="handleClick"
      :expand-on-click-node="false">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.categoryName }}</span>
          <span>
            <el-switch
              v-model="data.status"
              size="small"
              active-text="已启用"
              inactive-text="已禁止"
              :active-value="1"
              :inactive-value="0"
              @change="handleChangeStatus(data,'status')"
            /> 
            <a @click="handleEdit(node,data)"> 修改 </a>
            <a style="margin-left: 8px" @click="handleDel(node, data)"> 删除 </a>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { loadCategory, updateStatus } from "@/api/videocategory"
import Ksd from '@/utils/index.js'
import { formatTimeToStr } from '@/utils/date'
import AddCategory from '@/view/video/components/AddCategory.vue'

// 数据的管理和搜索查询
const searchForm = reactive({
  keyword:"",
  status:"",
})




// 定义接受分类数据的容器--响应式
var categoryList = ref([])
const checkedIds = ref([])
const categoryTreeRef = ref({})

// 定义查询分类数据的方法
const handleLoadData = async () => {
  const res = await loadCategory()
  categoryList.value = res.data
  // 把所有的节点都选中
  checkedIds.value = res.data.map(data => data.id)
  // 使用method的方式来选择节点
  categoryTreeRef.value.setCheckedKeys(checkedIds.value)
}

// 提交方法
const handleSubmit = () => {
  const allSelectIds = categoryTreeRef.value.getCheckedKeys()
  console.log('allSelectIds',allSelectIds)
}

//删除
const handleDel = (node,data)=>{
  console.log("你要删除的id是",node,data)
  categoryTreeRef.value.remove(node,data)
}

//编辑
const handleEdit = (node,data)=>{
  console.log("编辑的信息是",node,data)
  data.categoryName = "javaxxxxxx"
}

// 点击触发 
const handleClick = (data,node)=>{
  console.log(node,data)
}


// 状态修改和处理--status/isdelete/
const handleChangeStatus = async (row,field) => {
  var params = {id:row.id,field}
   if(field=="status")params.value = row.status
   await updateStatus(params)
   Ksd.success("状态修改成功!!!")
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