import { ref,reactive, onMounted,getCurrentInstance, watch} from 'vue'
import { findVideoPage } from '@/api/video.js'
import { loadCategory } from "@/api/videocategory"
import {saveVideo,updateVideo,getByID} from '@/api/video.js'
import Ksd from '@/utils/index.js'

// 查询列表
export  function useListVideo(){
    // 获取到子组件addvideo的对象
    const addVideoRef = ref({})
    const categoryList = ref([{id:-1,title:'请选择分类'}])
    const props = { expandTrigger: true,value:"id",label:"categoryName"}
    const statusOptions = ref([{id:-1,title:'请选择状态'},{id:1,title:"发布"},{id:0,title:"未发布"}])

    
    // 搜索的分类id
    const categoryArr = ref([])
    const searchDateArr = ref([])

    // 1: 设置请求分页的参数
    const queryParams = reactive({
        // 分页信息
        pageNum: 1,
        pageSize: 10,
        // 状态搜索
        status: 1,
        // 搜索的分类
        categoryId:-1,
        categoryCid:-1,
        // 搜索的挂坚持
        keyword: '',
        // 创建时间的范围搜索
        startTime: '',
        endTime: '',
    })

    // 获取请求的结果
    const tableData  = ref([])
    const total  = ref(0)

   

    // 监听
    watch(categoryArr,(value)=>{
        if(value && value.length == 2){
            queryParams.categoryId = value[0]
            queryParams.categoryCid = value[1]
        }
    })

    watch(searchDateArr,(value)=>{
        if(value && value.length == 2){
            queryParams.startTime = value[0]+" 00:00:00"
            queryParams.endTime = value[1]+" 23:59:59"
        }
    })

    //执行搜索
    const handleSearch = ()=>{
        // 从第一页开始搜索
        queryParams.pageNum = 1
        queryParams.pageSize = 10
        // 清空容器
        tableData.value = []
        // 执行查询
        handleLoadData();
    }

    // 查询视频信息
    const handleLoadData = async () => {
        const resp = await findVideoPage(queryParams)
        tableData.value = resp.data.list
        total.value = resp.data.total
    }

    // 分页改变
    const handleCurrentChange = (pno)=>{
        queryParams.pageNum = pno
        handleLoadData();
    }

    const handleSizeChange = (psize)=>{
        queryParams.pageSize = psize
        handleLoadData();
    }


    // 添加视频
    const handleAddVideo = () => {
        addVideoRef.value.handleOpen()
    }

    // 查询视频分类
    const handleLoadCategoryTree = async () => {
        const resp = await loadCategory()
        categoryList.value = resp.data;
    }

    // 编辑数据
    const handleEdit = (index,row)=>{
        addVideoRef.value.handleOpen(row)
    }

    // 生命周期执行函数
    onMounted(()=>{
        // 加载分类信息
        handleLoadCategoryTree();
        // 加载列表数据
        handleLoadData()
    })
    

    return {
        props,
        addVideoRef,
        statusOptions,
        categoryArr,
        
        searchDateArr,
        tableData,
        total,
        queryParams,
        categoryList,


        handleSearch,
        handleEdit,
        handleCurrentChange,
        handleSizeChange,
        handleAddVideo
    }
}

// form管理
export function userFormVideo(editorRef){
    // 让页面子组件显示出来
    const dialogVisible = ref(false)
    // 定义验证的表单
    const categoryFormRef = ref()
    // 用于回填分类级联框的选中问题
    const categoryFormArr = ref([])
    let {ctx:that, proxy} = getCurrentInstance()
    // 定义表单的数据模型
    const formData = ref({
        title:"",//主题标题
        content:"",//	主题内容
        tags:"",//	主题标签
        description:"",//	主题缩略描述
        views:0,//	主题浏览次数
        isComment:1,//	0不可以评论 1可以评论
        isDelete:0,//	删除状态0未删除1删除
        avatar:"",//	作者头像
        nickname:"",//	昵称
        status:1,//	发布状态 1发布 0未发布
        userid:0,//	用户
        img:"",//	封面图
        collects:0,//	收藏数
        comments:0,//	评论数量
        coursetimer:"",//	课程时长
        price:"",//	原始价格2499
        realprice:"",//	真实价格1499
        coursetype:1,//	课程类型 1 基础课  2 进阶课  4 面试课  3 实战课程
        isNew:0,//	是否最新 1是 0否
        isHot:0,//	是否最热 1是 0否
        isPush:0,//	是否推荐 1是0 否
        categoryPid:"",//	主题分类ID
        categoryPname:"",//	分类标题
        categoryCid:"",//	子分类ID
        categoryCname:"",//	子分类标题
    })
    
    // 数据的验证规则
    const rules = reactive({
        title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 2, max: 28, message: '标题的长度必须是2到5长度', trigger: 'blur' },
        ],

        img:[
            { required: true, message: '请上传一个封面', trigger: 'blur' },
            { validator: (rule,value,callback)=>{
                if (value.lastIndexOf('png')==-1 ) {
                     callback(new Error("请选择一个图片!"))
                 } else {
                     callback()
                 }
             }, trigger: 'blur' }
        ],

        categoryCid:[
            { required: true,message:"请选择一个分类", trigger: 'change' },
        ],
        
        status:{
            type:"number",
            required: true,
            message: '请选择一个状态',
            trigger: 'change',
        },
        description:{ required: true, message: '请输入内容', trigger: 'blur' },
    })
    
    // 打开
    const handleOpen = async (row) => {
         // 重置表单
        if(row && row.id){
            const resp = await getByID(row.id);
            formData.value = resp.data
            categoryFormArr.value = [resp.data.categoryPid,resp.data.categoryCid]
            dialogVisible.value = true
            that.$forceUpdate()
        }else{
            handleReset()
            dialogVisible.value = true
        }
    }

    // 重置
    const  handleReset = ()=>{
        // 清除验证
        if(categoryFormRef.value){
            categoryFormRef.value.clearValidate()
        }
        categoryFormArr.value = []
        // 恢复数据---有问题
        formData.value = {
            title:"",//主题标题
            content:"",//	主题内容
            tags:"",//	主题标签
            description:"",//	主题缩略描述
            views:0,//	主题浏览次数
            isComment:1,//	0不可以评论 1可以评论
            isDelete:0,//	删除状态0未删除1删除
            avatar:"",//	作者头像
            nickname:"",//	昵称
            status:1,//	发布状态 1发布 0未发布
            userid:0,//	用户
            img:"",//	封面图
            collects:0,//	收藏数
            comments:0,//	评论数量
            coursetimer:'',//	课程时长
            price:'',//	原始价格2499
            realprice:'',//	真实价格1499
            coursetype:1,//	课程类型 1 基础课  2 进阶课  4 面试课  3 实战课程
            isNew:0,//	是否最新 1是 0否
            isHot:0,//	是否最热 1是 0否
            isPush:0,//	是否推荐 1是0 否
            categoryPid:"",//	主题分类ID
            categoryPname:"",//	分类标题
            categoryCid:"",//	子分类ID
            categoryCname:"",//	子分类标题
        }
    }
  
    // 关闭
    const handleClose = () => {
      dialogVisible.value = false  
      // 重置表单
      handleReset()
    }
    
    // 提交保存的方法
    const handleSubmit = async ()=>{
        try{
            const valid = await categoryFormRef.value.validate()
            if(valid){
                // 保存课程
                const resp = await saveVideo(formData.value)
                if( resp .code === 0){
                    Ksd.success("添加成功")
                }else{
                    if(resp.code == 702){
                        Ksd.error(resp.msg)
                    }else{
                        var validatData =resp.data//{title:{"minlen":"xxxxx"}}
                        for(var key in validatData){
                            for(var key2 in validatData[key]){
                                Ksd.error(key+"===>"+validatData[key][key2])
                            }
                        }
                    }
                }
            }
        }catch(e){
            console.log("e",e)
        }
    }
  
    // 这个地方就是页面中需要使用的属性和方法
    return {
        dialogVisible,
        categoryFormRef,
        rules,
        formData,
        categoryFormArr,

        handleOpen,
        handleClose,
        handleSubmit
    }
}