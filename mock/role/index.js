import Mock from 'mockjs'
import { deepClone ,compare} from '../../src/utils/index.js'
import { asyncRoutes, constantRoutes } from './routes.js'

const routes = deepClone([...constantRoutes, ...asyncRoutes])


const roles=[]

const count=30

for (let i = 0; i < count; i++) {
  roles.push(Mock.mock({
    id:'@increment',
    createTime:+Mock.Random.date('T'),
    zhName:'@title(2,3)',
    enName:'@title(1,2)',
    description:'@title(5, 10)'
  }))

}
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
    url: '/role/list',
    type: 'get',
    response: config=> {
      const {enName,page=1,limit=20,sort,sortCondition}=config.query

      let mockList=roles.filter(item=>{
        return !(enName && item.enName !== enName);

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
    url: '/role/add',
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
    url: '/role/update',
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
    url: '/role/delete',
    type: 'delete',
    response: _=>{
      return {
        code: 20000,
        data:{
          status: 'success'
        }
      }
    }
  },
  {
    url: '/role/selectOne',
    type: 'get',
    response: _=>{
      return {
        code: 20000,
        result:{
              id:'2',
              zhName:'用户',
              enName:'user',
              description:'deddddsdsd'
        },
        status: 'success'
      }
    }
  }
]
