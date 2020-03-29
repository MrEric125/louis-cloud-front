import Mock from 'mockjs'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mock-Pan' })


const todoList =[]
const todoCount =10


const visibilities=['all','active','completed']

for (let index = 0; index <todoCount; index++) {
    var rand = Math.floor( Math.random() * visibilities.length );
    var data =visibilities.slice(rand, 1)[0];
    todoList.push(Mock.mock({
        id:'@increment',
        timestamp:+Mock.Random.date('T'),
        todo: '@first',
        visibility: data

    }))
    
}



export default [
  // username search
  {
    url: '/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 200,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list
  {
    url: '/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        result: {
          total: 20,
          'items|20': [{
            order_no: '@guid()',
            timestamp: +Mock.Random.date('T'),
            username: '@name()',
            price: '@float(1000, 15000, 0, 2)',
            'status|1': ['success', 'pending']
          }]
        }
      }
    }
  }
 
]
