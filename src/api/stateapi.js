import service from '@/utils/request'


// @Summary 统计平台用户每个月的主从量
export const userRegState = (year) => {
  return service({
    url: '/state/user/reg?year='+year,
    method: 'get'
  })
}


// @Summary 统计平台用户每个月的主从量-明细
export const findUserRegState = (data) => {
    return service({
      url: '/state/user/detail',
      method: 'post',
      data
    })
  }
  