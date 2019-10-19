import Mock from 'mockjs'
import {compare} from "../src/utils";
// import { asyncRoutes, constantRoutes } from './role/routes.js'
// import { deepClone } from '../src/utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}
// const routes = deepClone([...constantRoutes, ...asyncRoutes])

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}


const userList=[]

const count=30

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    id:'@increment',
    registryTime:+Mock.Random.date('T'),
    username:'@title(2,3)',
    realName:'@title(1,2)',
    email:'@title(1,2)',
    phone:'@title(1,2)',
  }))

}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },
  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },



  // mock get all users form server
  {
    url: '/user/list',
    type: 'get',
    response: config => {
      const {username,page=1,limit=20,sort,sortCondition}=config.query

      let mockList=userList.filter(item=>{
        return !(username && item.username !== username);
      })

      //根据条件排序

      mockList.sort(compare(sort == null ? 'id' : sort, sortCondition))

      const pageList=mockList.filter((item,index)=>
        index < limit * page && index >= limit * (page - 1)
      )
      return {
        code: 20000,
        data: {
          list: pageList,
          total: mockList.length
          // pageSize: 10,
          // pageNum: 1
        }
      }
    }
  },

  // add role
  {
    url: '/user/add',
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
    url: '/user/update',
    type: 'put',
    response: _=>{
      return {
        code: 20000,
        data:{
          status: 'success'
        }
      }

    }
  },

  // delete role
  {
    url: '/user/delete',
    type: 'delete',
    response: {
      code: 20000,
      response: _=>{
        return {
          code: 20000,
          data:{
            status: 'success'
          }
        }
      }
    }
  }
]
