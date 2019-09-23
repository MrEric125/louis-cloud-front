import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Layout from '@/layout'

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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
];
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    // children: [
    //   {
    //     path: 'page',
    //     component: () => import('@/views/permission/page'),
    //     name: 'PagePermission',
    //     meta: {
    //       title: 'Page Permission',
    //       roles: ['admin'] // or you can only set roles in sub nav
    //     }
    //   },
    //   {
    //     path: 'directive',
    //     component: () => import('@/views/permission/directive'),
    //     name: 'DirectivePermission',
    //     meta: {
    //       title: 'Directive Permission'
    //       // if do not set roles, means: this page does not require permission
    //     }
    //   },
    //   {
    //     path: 'role',
    //     component: () => import('@/views/permission/role'),
    //     name: 'RolePermission',
    //     meta: {
    //       title: 'Role Permission',
    //       roles: ['admin']
    //     }
    //   }
    // ]
  },
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;

}

export default router;
