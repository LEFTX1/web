import service from '@/utils/request'

// 查询帖子
export const loadBbsData = (data) => {
  return service({
    url: '/bbs/page',
    method: 'post',
    data
  })
}

// export const loadBbsData = (data) => {
//   return service({
//     url: `/bbs/page?page=${data.page}&pageSize=${data.pageSize}&keyword=${data.keyword}`,
//     method: 'get',
//   })
// }

// 根基ID查询帖子
export const getBbs = (params) => {
  return service({
    url: '/bbs/get',
    method: 'get',
    params
  })
}

// 根基ID查询帖子
export const getBbsDetail = (id) => {
  return service({
    url: `/bbs/get?id=${id}`,
    method: 'get'
  })
}

// 保存帖子
export const saveBbs = (data) => {
  return service({
    url: '/bbs/save',
    method: 'post',
    data
  })
}

// 根据id删除帖子
export const delBbs = (id) => {
  return service({
    url: `/bbs/delete/${id}`,
    method: 'delete',
  })
}

// 批量删除帖子
export const delBbses = (ids) => {
  return service({
    url: `/bbs/deletes?ids=${ids}`,
    method: 'delete',
  })
}

// 编辑帖子
export const updateBbs = (data) => {
  return service({
    url: '/bbs/update',
    method: 'post',
    data
  })
}
