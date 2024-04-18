import service from '@/utils/request'


// 查询分类信息
export const loadCategory = () => {
    return service.get('/videocategory/find')
}

// 修改视频分类状态
export const updateStatus = (data) => {
  return service({
    url: '/videocategory/update/status',
    method: 'post',
    data
  })
}
  
// 查询第一级分类
export const findRoot = () => {
  return service({
    url: '/videocategory/findRoot',
    method: 'get'
  })
}
  

// 保存分类信息
export const saveVideoCategory = (data) => {
  return service({
    url: '/videocategory/save',
    method: 'post',
    data
  })
}

// 更新分类信息
export const updateVideoCategory = (data) => {
  return service({
    url: '/videocategory/update',
    method: 'post',
    data
  })
}
  

// 根据ID删除当前分类信息
export const delById = (id) => {
  return service({
    url: `/videocategory/delete/${id}`,
    method: 'delete'
  })
}