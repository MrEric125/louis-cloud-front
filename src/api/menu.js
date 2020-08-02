import request from '@/utils/request'

//通过当前用户角色查找所有的menu
export function menuList(data) {
    return request({
      url: '/menu/list',
      method: 'get',
      data
    })
  }