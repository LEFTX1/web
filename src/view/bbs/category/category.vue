<!-- eslint-disable no-unused-vars -->
<template>
  <div>
    <div class="ksd-search-container">
      <el-button type="success" icon="Plus" @click="handleOpenAdd">添加</el-button>
      <el-button type="danger" icon="Delete" @click="handleBatchDel">批量删除</el-button>
      <el-select v-model="pageInfo.status" @change="handleSearch" @clear="pageInfo.status=-1" style="margin-left: 10px;" clearable class="m-2" placeholder="Select" size="large">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="pageInfo.keyword" clearable class="w-50" size="small" :input-style="{ 'width': '240px', 'margin': '0 10px' }" placeholder="请输入分类名称" :suffix-icon="Search" />
      <el-button type="success" style="margin-left: 40px;" @click="handleSearch" icon="Search">搜索</el-button>
    </div>
    <el-table v-loading="loading" :data="pageInfo.resultList" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
      <el-table-column label="分类名称" prop="title" align="center"></el-table-column>
      <el-table-column label="状态" width="200">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            size="large"
            active-text="已启用"
            inactive-text="已禁止"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(scope.row,'status')"
          />
        </template>
      </el-table-column>
      <el-table-column label="删除状态" width="200">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDelete"
            size="large"
            active-text="已删除"
            inactive-text="未删除"
            :active-value="1"
            active-color="#ff0000"
            inactive-color="#00ff00"
            :inactive-value="0"
            @change="handleChangeStatus(scope.row,'is_delete')"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template #default="scope">
          <el-input v-model="scope.row.sorted"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column prop="updatedAt" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"><el-icon>
              <Edit />
            </el-icon>编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
            icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" style="display:flex;justify-content: center;">
      <el-pagination :current-page="pageInfo.page" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 50, 80, 100]"
        layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <!--分类添加和编辑 :close-on-press-escape="false" :close-on-click-modal="false"-->
    <el-dialog v-model="dialogVisible" title="添加分类" width="600px" :before-close="handleClose">
      <el-form ref="categoryFormRef" :model="category" :rules="rules" label-width="120px" class="demo-ruleForm"
        :size="formSize" status-icon>
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="category.title" placeholder="请输入分类名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input v-model="category.description" type="textarea" placeholder="请输入分类描述" maxlength="50" />
        </el-form-item>
        <el-form-item label="分类排序" prop="sorted">
          <el-input v-model="category.sorted" type="number" placeholder="请输入分类排序" maxlength="11" />
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="category.status" class="ml-4">
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除状态" prop="isDelete">
          <el-radio-group v-model="category.isDelete" class="ml-4">
            <el-radio :label="1">已删除</el-radio>
            <el-radio :label="0">未删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit"><el-icon>
              <Check />
            </el-icon>保存</el-button>
          <el-button @click="handleCloseDialog"><el-icon>
              <Close />
            </el-icon>关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { loadBbsCategoryData, saveBbsCategory, updateBbsCategory, updateStatus, delBbsCategory, delBbsCategorys } from '@/api/bbscategory.js'
import { onMounted, reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import Ksd from '@/utils/index.js'
// 这里是添加和编辑-------------------------------------------
const dialogVisible = ref(false)
const categoryFormRef = ref(null)
const category = reactive({
  title: '',
  description: '',
  parentId: 0,
  sorted: 0,
  status: 1,
  isDelete: 0
})

const rules = reactive({
  title: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
})

const statusOptions = reactive([{value:-1,label:"请选择状态"},{value:1,label:"发布"},{value:0,label:"未发布"}])

// 打开添加
const handleOpenAdd = () => {
  dialogVisible.value = true
}

// 打开编辑
const handleEdit = (index, row) => {
  // 把row的数据拷贝一份给category,这样就是两个对象实例的。编辑就不会应row的响应式
  Object.assign(category, row)
  // 数据回填form
  dialogVisible.value = true
}

// 如果未来你查询列表的数据不是全查，而是局部查询（案例查询）就必须根据ID去查询一次在返回整个行数据进行编辑
// const handleEdit = async (index,row) => {
//   const categoryDB = await getCategory(row.id)
//   category = categoryDB
//   // 数据回填form
//   dialogVisible.value = true
// }

// 关闭添加和编辑
const handleCloseDialog = () => {
  dialogVisible.value = false
}

// 交换关闭
const handleClose = () => {
  ElMessageBox.confirm(
    '你确定要离开吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    handleCloseDialog()
  })
}

// 交换关闭
const handleDelete = async (index, row) => {
  const result = await Ksd.confirm('提示', '你确定要抛弃我吗？', { cbtn: '容我想想', sbtn: '直接删了', type: 'error' })
  if (result === 'confirm') {
    const res = await delBbsCategory(row.id)
    if (res.data === 'ok') {
      Ksd.success('删除成功!!!')
      // 第一种方案：单删行，不刷新 (删除最后一条要记得删除，可能还要同步总数)
      //pageInfo.resultList.splice(index, 1)
      //pageInfo.total --
      //if( pageInfo.resultList.length === 0){
      //  handleLoadData()
      //}
      // 第二种方案：直接调用查询方法(推荐)
      handleLoadData()
    }
  }
}

// 保存和编辑
const handleSubmit = async () => {
  await categoryFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      let res
      let message = '添加成功'
      category.sorted = parseInt(category.sorted)
      if (category.id) {
        message = '编辑成功'
        res = await updateBbsCategory(category)
      } else {
        res = await saveBbsCategory(category)
      }

      if (res.code === 0) {
        // 关闭当前添加窗口
        handleCloseDialog()
        // 重置model对象
        categoryFormRef.value.resetFields()
        categoryFormRef.value.clearValidate()
        // 添加刷新当前页
        handleLoadData()
        Ksd.success(message)
      }
    }
  })
}

// 这里是查询-------------------------------------------------

// 1: 设置请求分页的参数
const pageInfo = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  status: -1,
  resultList: [],
  keyword: ''
})
//获取删除的ids
const ids = ref([])
const loading = ref(false)

// 2: 数据加载
const handleLoadData = async () => {
  loading.value = true
  const res = await loadBbsCategoryData(pageInfo)
  loading.value = false
  pageInfo.total = res.data.total
  pageInfo.resultList = res.data.list
}

// 搜索
const handleSearch = () => {
  pageInfo.page = 1
  pageInfo.resultList = []
  handleLoadData()
}

// 点击分页改变
const handleCurrentChange = (pageNum) => {
  pageInfo.page = pageNum
  handleLoadData()
}

// 点击每页显示多少条改变
const handleSizeChange = (pageSize) => {
  pageInfo.pageSize = pageSize
  handleLoadData()
}

// 批量状态的事件
const handleSelectionChange = (rows) => {
  ids.value = rows.map(row => row.id)
}

// 批量删除
const handleBatchDel = async () => {
  if (ids.value.length === 0) {
    Ksd.warn("请选择一项进行操作!!!")
    return
  }

  const result = await Ksd.confirm("提示", "你确定执行【批量删除】吗?")
  if (result === "confirm") {
    const idstrings = ids.value.join(",")
    const res = await delBbsCategorys(idstrings)
    if (res.data === 'ok') {
      Ksd.success('删除成功!!!')
      handleLoadData()
    }
  }
}

// 状态修改和处理--status/isdelete/
const handleChangeStatus = async (row,field) => {
  var params = {id:row.id,field}
   if(field=="status")params.value = row.status
   if(field=="is_delete")params.value = row.isDelete
   await updateStatus(params)
   Ksd.success("状态修改成功!!!")
}

// 3: 生命周期初始化数据加载
onMounted(() => {
  handleLoadData()
})
</script>

<style scoped lang="scss">
.ksd-search-container {
  margin-bottom: 10px;
  background: #f7fbff;
  padding: 6px;
  display: flex;
}
</style>