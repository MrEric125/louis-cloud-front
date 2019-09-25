import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function addUser(userdto) {
  return request({
    url: '/user/add',
    method: 'post',
    params: { userdto }
  })
}
export function deleteUser(userId) {
  return request({
    url: '/user/delete',
    method: 'delete',
    params: { userId }
  })
}
export function getUsers() {
  return request({
    url: '/user/search',
    method: 'get'
    // params: {  }
  })
}
export function updateUser(user) {
  return request({
    url: '/user/update',
    method: 'put',
    params: { user }
  })
}
