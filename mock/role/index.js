import Mock from 'mockjs'
import { deepClone } from '../../src/utils/index.js'
import { asyncRoutes, constantRoutes } from './routes.js'

const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    zhName: '管理员',
    enName: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    createTime: '2019-9-26 23:07:44',
    childRole: '子角色',
    routes: routes
  },
  {
    zhName: '编辑者',
    enName: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    createTime: '2019-9-26 23:07:44',
    childRole: '子角色',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    zhName: '访问者',
    enName: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    createTime: '2019-9-26 23:07:44',
    childRole: '子角色',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

export default [
  // mock get all routes form server
  {
    url: '/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/role',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
