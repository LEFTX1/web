<template>
    <div style="border: 1px solid #ccc">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
        />
        <Editor
            style="height: 500px; overflow-y: hidden;"
            :defaultConfig="editorConfig"
            mode="default"
            v-model="modelValue"
            @onChange="handleChange"
            @onCreated="handleCreated"
        />
    </div>
    </template>
    
    <script setup>
    import '@wangeditor/editor/dist/css/style.css' // 引入 css
    import {shallowRef,ref } from 'vue'
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const toolbarConfig = {}
    const editorConfig = { MENU_CONF: {}, placeholder: '请输入内容...' }
    
    // 自定义v-model属性的时候处理
    const props = defineProps("[modelValue]")
    const emits = defineEmits(["update:modelValue","created"])
    const handleChange = (editor) => {
        emits("update:modelValue",editor.getHtml())
    }

    const handleCreated = (editor) => {
        editorRef.value = editor // 记录 editor 实例，重要！
        emits("created",editor)
    }
    
    editorConfig.MENU_CONF['uploadImage'] = {
        server: '/api/local/upload/wangeditor',
        // form-data fieldName ，默认值 'wangeditor-uploaded-image'
        fieldName: 'file',
        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 2 * 1024 * 1024, // 1M
        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],
        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
        meta: {
            dir: 'course'
        },
        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: false,
        // 自定义增加 http  header
        headers: {
            Accept: 'text/x-json',
            otherKey: 'xxx'
        },
        // 跨域是否传递 cookie ，默认为 false
        withCredentials: true,
        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒
        // 上传之前触发
        onBeforeUpload(file) { // TS 语法
        // onBeforeUpload(file) {    // JS 语法
            // file 选中的文件，格式如 { key: file }
            return file
    
            // 可以 return
            // 1. return file 或者 new 一个 file ，接下来将上传
            // 2. return false ，不上传这个 file
        },
    
        // 上传进度的回调函数
        onProgress(progress) {  // TS 语法
        // onProgress(progress) {       // JS 语法
            // progress 是 0-100 的数字
            console.log('progress', progress)
        },
    
        // 单个文件上传成功之后
        onSuccess(file, res) {  // TS 语法
        // onSuccess(file, res) {          // JS 语法
            console.log(`${file.name} 上传成功`, res)
            
        },
    
        // 单个文件上传失败
        onFailed(file, res) {   // TS 语法
        // onFailed(file, res) {           // JS 语法
            console.log(`${file.name} 上传失败`, res)
        },
    
        // 上传错误，或者触发 timeout 超时
        onError(file, err, res) {  // TS 语法
        // onError(file, err, res) {               // JS 语法
            console.log(`${file.name} 上传出错`, err, res)
        }
    }
    
  
    
    </script>    