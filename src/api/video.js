import service from '@/utils/request'


// 查询视频信息
export const findVideoPage = (params) => {
    return service.get('/video/find/page',{params})
}



// 保存视频信息
export const saveVideo = (data = {}) => {
    return service.post('/video/save',data)
}

// 更新视频信息
export const updateVideo = (data = {}) => {
    return service.post('/video/update',data)
}

// 根据id查询视频信息
export const getByID = (id) => {
    return service.get('/video/get/'+id)
}





