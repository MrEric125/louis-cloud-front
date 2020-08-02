import Mock from 'mockjs'

const list =[]
const count =10


const visibilities=[true,false]

for (let index = 0; index <count; index++) {
    var rand = Math.floor( Math.random() * visibilities.length );
    var data =visibilities.slice(rand, 1)[0];
    list.push(Mock.mock({
        id:'@increment',
        timestamp:+Mock.Random.date('T'),
        todoText: '@first',
        done: data

    }))
    
}

export default[
    {
        url: '/todo/list',
        type: 'get',
        
        response:config=>{
            const { visibility }=config.query
            let mockList=[]
            if(visibility && visibility==='completed'){
                mockList=list.filter(item=>item.done)

            }else if(visibility=='active'){
                mockList=list.filter(item=>!item.done)

            }else{
                mockList=list

            }
            return{
                code:200,
                result:{
                    todos:mockList
                    
                },
                message:"success"
            }
        }
    },{
        url: '/todo/del',
        type: 'delete',
        
        response:config=>{
            // 如果使用的requestbody的形式那么参数就是在body中获取
            const {id}=config.body
            let mockList=list.filter(item=>{
               if(id && item.id===id) return false
               return true 
            })
            return{
                code:200,
                result:{
                    todos:mockList 
                },
                message:"success"
            }
        }
    },{
        url: '/todo/edit',
        type: 'post',
        
        response:config=>{
            const { id,todo,visibility }=config.edit
            
            let mockList=list.map(item=>{
               if(id && item.id===id) {
                   item.todo=todo
                   item.visibility=visibility
               }
            })
            return{
                code:200,
                result:{
                    todos:mockList
                    
                },
                message:"success"
            }
        }
    }
    ,{
        url: '/todo/add',
        type: 'post',
        
        response:config=>{
            const { todoText }=config.body
            

            var lastItemId=list.length
            list.push({id:lastItemId+1,
                todoText:todoText,
                done:false}
                )
            return{
                code:200,
                result:{
                    todos:list
                    
                },
                message:"success"
            }
        }
    }
]