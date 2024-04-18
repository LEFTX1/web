<template>
    <div>
        <div class="ksd-search-container">
          
            <el-row >
                <el-col :span="4">
                    <el-button type="success" icon="Plus" @click="handleAddVideo">添加</el-button>
                    <el-button type="danger" icon="Delete" @click="handleBatchDel">批量删除</el-button>
                </el-col>
                <el-col :span="4">
                    <el-cascader
                        v-model="categoryArr"
                        placeholder="请选择分类"
                        clearable
                        :options="categoryList"
                        :props="props"
                        show-all-levels
                        />
                </el-col>
                <el-col :span="4">
                    <el-select v-model="queryParams.status"  @clear="queryParams.status = -1"
                         clearable class="m-2" placeholder="请选择帖子状态" size="large">
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="searchDateArr"
                        type="daterange"
                        range-separator="To"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :size="size"
                    />
                </el-col>
                <el-col :span="4">
                    <el-input v-model="queryParams.keyword" style="margin-left: 20px;" clearable  size="small" placeholder="请输入分类名称" :suffix-icon="Search" />
                </el-col>
                <el-col :span="2">
                    <el-button style="margin-left: 40px;" type="success" @click="handleSearch" icon="Search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange"
            height="calc(100vh - 280px)" style="width: 100%">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column fixed label="ID" prop="id" align="center" width="180"></el-table-column>
            <el-table-column label="标题" prop="title" width="340"></el-table-column>
            <el-table-column label="分类" width="180">
                <template #default="scope">
                   {{ scope.row.categoryPname }} / {{ scope.row.categoryCname }} 
                </template>
            </el-table-column>
            <el-table-column label="浏览数" prop="views" width="80"></el-table-column>
            <el-table-column label="评论数" prop="comments" width="80"></el-table-column>
            <el-table-column label="允许评论" prop="comment" width="80"></el-table-column>
            <el-table-column label="发帖人" prop="nickname" width="100"></el-table-column>
            <el-table-column label="发帖时间" width="220">
                <template #default="scope">{{ formatDate(scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column label="更新时间" width="220">
                <template #default="scope">{{ formatDate(scope.row.updateTime) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100">
                <template #default="scope">
                    <span v-if="scope.row.status == 1" style="color:green">已发布</span>
                    <span v-if="scope.row.status == 0" style="color:red">未发布</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="200" label="操作">
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
            <el-pagination :current-page="queryParams.pageNum" :page-size="queryParams.pageSize"
                :page-sizes="[10, 20, 30, 50, 80, 100]" layout="total, sizes, prev, pager, next, jumper"
                :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!--添加视频-->
        <add-video ref="addVideoRef"></add-video>
    </div>
</template>
  
<script setup>
import {useListVideo,userFormVideo} from '@/usejs/videouse.js'
import AddVideo from './components/AddVideo.vue'
import { formatDate } from '@/utils/format.js'

const {
    queryParams,
    props,
    statusOptions,
    categoryArr,
    searchDateArr,
    categoryList,
    tableData,
    total,
    addVideoRef,
    handleEdit,

    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleAddVideo
} = useListVideo()



</script>
  
<style scoped lang="scss">
.ksd-search-container {
    margin-bottom: 10px;
    background: #f7fbff;
    padding: 6px;
}
</style>