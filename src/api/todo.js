import request from '@/utils/request'

export function getTodos(query) {
  return request({
    url: '/todo/list',
    params: query,
    method: 'get'
  })
}
export function delTodo(param) {
  return request({
    url: '/todo/del',
    data: param,
    method: 'delete'
  })
}
export function addTodo(param) {
  return request({
    url: '/todo/add',
    data: param,
    method: 'post'
  })
}
export function editTodo(param) {
  return request({
    url: '/todo/edit',
    data: param,
    method: 'post'
  })
}
