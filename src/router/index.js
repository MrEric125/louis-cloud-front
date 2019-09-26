import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限设置',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/permission/user'),
        name: 'user',
        meta: {
          title: '用户管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/permission/menu'),
        name: '菜单管理',
        meta: {
          title: '菜单管理'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: '角色管理',
        meta: {
          title: '角色管理',
          roles: ['admin']
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/permission/permission'),
        name: '权限管理',
        meta: {
          title: '权限管理',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    alwaysShow: true, // will always show the root menu
    name: 'product',
    meta: {
      title: '商品管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children:[
      {
        path:'/list',
        component:()=>import('@/views/product/list'),
        name:'商品列表',
        meta:{
          title: '商品列表', noCache: true
        }
      },
      {
        path:'/insert',
        component:()=>import('@/views/product/insert'),
        name:'添加商品',
        meta:{
          title: '添加商品', noCache: true
        }
      },
      {
        path:'/category',
        component:()=>import('@/views/product/category'),
        name:'商品分类',
        meta:{
          title: '商品分类', noCache: true
        }
      },
      {
        path:'/Brand',
        component:()=>import('@/views/product/brand'),
        name:'品牌管理',
        meta:{
          title: '品牌管理', noCache: true
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    alwaysShow: true, // will always show the root menu
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children:[
      {
        path:'/list',
        component:()=>import('@/views/order/list'),
        name:'订单列表',
        meta:{
          title: '订单列表', noCache: true
        }
      },
      {
        path:'/setting',
        component:()=>import('@/views/order/setting'),
        name:'订单设置',
        meta:{
          title: '订单设置', noCache: true
        }
      },
      {
        path:'/backProcess',
        component:()=>import('@/views/order/backProcess'),
        name:'退货申请处理',
        meta:{
          title: '退货申请处理', noCache: true
        }
      },
      {
        path:'/backReasonSetting',
        component:()=>import('@/views/order/backReasonSetting'),
        name:'退货原因设置',
        meta:{
          title: '退货原因设置', noCache: true
        }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/market/spikeList',
    alwaysShow: true, // will always show the root menu
    name: 'market',
    meta: {
      title: '营销管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children:[
      {
        path:'/list',
        component:()=>import('@/views/market/spikeList'),
        name:'秒杀活动列表',
        meta:{
          title: '秒杀活动列表', noCache: true
        }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    // redirect: '/monitor/list',
    alwaysShow: true, // will always show the root menu
    name: 'monitor',
    meta: {
      title: '运营监控',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children:[
      {
        path:'/database',
        component:()=>import('@/views/monitor/database'),
        name:'数据库监控',
        meta:{
          title: '数据库监控', noCache: true
        }
      },
      {
        path:'/interface',
        component:()=>import('@/views/monitor/interface'),
        name:'接口调用监控',
        meta:{
          title: '接口调用监控', noCache: true
        }
      },
      {
        path:'/loginMessage',
        component:()=>import('@/views/monitor/loginMessage'),
        name:'登录信息信息监控',
        meta:{
          title: '登录信息信息监控', noCache: true
        }
      },
      {
        path:'/log',
        component:()=>import('@/views/monitor/log'),
        name:'日志监控',
        meta:{
          title: '日志监控', noCache: true
        }
      }
    ]
  },



  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  tableRouter,





  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/MrEric125/louis-cloud-front',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
