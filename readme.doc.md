项目目录分为这么几个模块(管理员)
1. 首页
2. 权限设置
    - 用户管理 包括（CRUD,以及批量操作功能）
    - 菜单管理 也就是某个角色能够看到的菜单
    - 权限管理 基于RBAC 模型的操作
    - 角色 基于RBAC 模型
3. 商品
    - 商品列表
    - 添加商品
    - 商品分类
    - 品牌管理
4. 订单
    - 订单列表
    - 订单设置
    - 退货申请处理
    - 退货原因设置
5. 营销
    - 秒杀活动列表
6. 运营监控
    - 数据库监控
    - 接口调用监控
    - 登录信息信息监控
    - 日志监控  
    
    
接口调用响应标准如下
```console
{
  "code":200,
  "message":"success"
  "result":
}
```
接口调用响应说明
code:响应码,为200的时候表示成功
message:响应的提示信息
result:响应实体，前两个响应数据表示的是一种状态，result这个响应表示的是用户实际需要的数据





===============================
vue 实例属性
$data
$props
$options
$parent
$root
$children
$slots
$scopedSlots
$refs
$isServer
$attrs
$listeners

实例方法/数据
$watch
$set
$delete
实例方法/事件
$on
$once
$off
$emit
生命周期
$mount
$forceUpdate
$nextTick
$destroy


## 登录功能

1. 登录
接口：
http://localhost:9528/dev-api/user/login
参数：
{
    "username": "admin",
    "password": "123456"
}
响应：
{
    "code": 200,
    "message": "success",
    "result": {
        "token": "admin-token"
    }
}
2. 用户信息

http://localhost:9528/dev-api/user/info
通过header:
Authorization: admin-token
响应：
{
    "code": 200,
    "message": "Login failed, to use default user token",
    "result": {
        "info": {
            "roles": [
                "admin"
            ],
            "introduction": "I am a super administrator",
            "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            "name": "Super Admin"
        }
    }
}