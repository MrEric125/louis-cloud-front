import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles(query) {
  return request({
    url: '/role/list',
    params: query,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/role/update`,
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/role/delete`,
    method: 'delete',
    data
  })
}
export function selectOne(data) {
  return request({
    url: `/role/selectOne`,
    method: 'get',
    data
  })
}
