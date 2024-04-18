<template>
    <!---添加和编辑视频 -->        
  
    <el-dialog v-model="dialogVisible" title="添加课程" top="1vh" 
    width="90%" :before-close="handleClose">
    {{ formData}}
      <el-form ref="categoryFormRef" :model="formData" 
        :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
        <el-form-item label="请选择分类" prop="categoryCid">
          <el-cascader
              v-model="categoryFormArr"
              placeholder="请选择分类"
              clearable
              ref="categoryRef"
              :options="categoryList"
              :props="props"
              @change="handleChangeCategoires"
              show-all-levels
              />
        </el-form-item>
        <el-form-item label="课程类型" prop="coursetype">
          <el-select v-model="formData.coursetype"  clearable class="m-2" placeholder="请选择课程类型">
            <el-option v-for="item in [{id:1,title:'基础课'},{id:2,title:'进阶课'},{id:3,title:'面试课'},{id:4,title:'实战课程'}]" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入课程名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入课程描述" 
            maxlength="200" />
        </el-form-item>
        <el-form-item label="课程封面" prop="img">
          <el-input v-model="formData.img"  placeholder="封面"/>
          <img-upload dir="course" v-model="formData.img" :key="formData.id">
            <div class="imgbox-up">
              <span><el-icon><Plus /></el-icon></span>
              <span class="info">必须jpg/png格式，大小 &lt;= 500KB</span>
            </div>
          </img-upload>
        </el-form-item>
        <el-form-item label="课程标签" prop="tags">
          <el-input v-model="formData.tags"  placeholder="请输入课程标签" maxlength="40" />
        </el-form-item>
        <el-form-item label="课程浏览数" prop="views">
          <el-input v-model.number="formData.views" type="number" placeholder="课程浏览数" maxlength="11" />
        </el-form-item>
        <el-form-item label="课程收藏数" prop="collects">
          <el-input v-model.number="formData.collects" type="number" placeholder="课程收藏数" maxlength="11" />
        </el-form-item>
        <el-form-item label="课程评论数量" prop="comments">
          <el-input v-model.number="formData.comments" type="number" placeholder="课程评论数量" maxlength="11" />
        </el-form-item>
        <el-form-item label="作者信息" prop="userid">
          <el-input v-model="formData.avatar"  placeholder="作者信息"  maxlength="200" />
          <el-input v-model="formData.nickname" placeholder="作者信息"  maxlength="60" />
          <el-input v-model.number="formData.userid"  placeholder="作者信息" readonly maxlength="20"/>
        </el-form-item>
        <el-form-item label="课程时长" prop="coursetimer">
          <el-input v-model="formData.coursetimer"  placeholder="课程时长"  maxlength="20" />
        </el-form-item>
        <el-form-item label="课程展示价格" prop="price">
          <el-input v-model="formData.price" type="number"  placeholder="课程展示价格"  maxlength="20" />
        </el-form-item>
        <el-form-item label="课程真实价格" prop="realprice">
          <el-input v-model="formData.realprice"  type="number" placeholder="课程真实价格"  maxlength="20" />
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model.number="formData.status" class="ml-4">
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否允许评论" prop="isComment">
          <el-radio-group v-model.number="formData.isComment" class="ml-4">
            <el-radio :label="1">允许</el-radio>
            <el-radio :label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否最新" prop="isNew">
          <el-radio-group v-model.number="formData.isNew" class="ml-4">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否最热" prop="isHot">
          <el-radio-group v-model.number="formData.isHot" class="ml-4">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐" prop="isPush">
          <el-radio-group v-model.number="formData.isPush" class="ml-4">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除状态" prop="isDelete">
          <el-radio-group v-model.number="formData.isDelete" class="ml-4">
            <el-radio :label="1">已删除</el-radio>
            <el-radio :label="0">未删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程内容明细">
            <ksd-editor v-model="formData.content" :key="formData.id" @created="handleCreated"></ksd-editor>
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
import ImgUpload from '@/components/upload/ImgUpload.vue'
import KsdEditor from '@/components/editor/KsdEditor.vue'
import {userFormVideo,useListVideo} from '@/usejs/videouse.js'
import {ref,onMounted} from 'vue'
const categoryRef = ref("")
const editorRef = ref("")
const {
  dialogVisible,
  formData,
  categoryFormRef,
  categoryFormArr,
  rules,

  handleOpen,
  handleClose,
  handleSubmit
} = userFormVideo(editorRef);
// 封装的复用性
const {
    categoryList,
    categoryArr,
    props
} = useListVideo();

// 改变级联框的时候进行值得处理
const handleChangeCategoires = (e)=>{
  var categoryItems = categoryRef.value.getCheckedNodes()[0];
  var labels = categoryItems.pathLabels
  var values = categoryItems.pathValues
  // 给formData的category赋值
  formData.value.categoryPname = labels[0]
  formData.value.categoryCname = labels[1]
  formData.value.categoryPid = values[0]
  formData.value.categoryCid = values[1]
}

const handleCreated = (editor)=>{
  editor.setHtml(formData.value.content)
}



// 子组件默认包含是私有
defineExpose({
  handleOpen,
  handleClose
})   


</script>

<style lang="scss" scoped>
.imgbox-up{
  width: 200px;
  height: 140px;
  margin-top:10px;
  background: #fafafa;
  border: 1px solid #eee;
  margin-top: 10px;
  display: flex;
  margin-right: 10px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  font-size: 32px;
  justify-content: center;
  color: #eee;

  .info{
    font-size:12px;
    color:#999;
  }
}

.imgbox-up:hover{
  background:#ccc;
}
</style>>