import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const exclusiveRoute = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', role: ['system', 'normal', 'user'] }
    }]
  },

  {
    path: '/commitTask',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CommitTask',
        component: () => import('@/views/commitTask/index'),
        meta: {
          title: '提交作业',
          icon: 'el-icon-upload',
          role: ['normal', 'user']
        }
      }
    ]
  },

  // {
  //   path: '/jobManage',
  //   component: Layout,
  //   redirect: '/jobManage/courseManage',
  //   name: 'jobManage',
  //   meta: {
  //     title: '作业管理',
  //     icon: 'el-icon-folder-opened',
  //     role: ['system', 'normal']
  //   },
  //   children: [
  //     {
  //       path: 'courseManage',
  //       component: () => import('@/views/course/index'), // Parent router-view
  //       name: 'courseManage',
  //       meta: { title: '课程管理', role: ['system', 'normal'], icon: 'el-icon-reading' }
  //     },
  //     {
  //       path: 'batchManage',
  //       component: () => import('@/views/batch/index'),
  //       name: 'batchManage',
  //       meta: { title: '批次管理', role: ['system', 'normal'], icon: 'el-icon-document-copy' }
  //     }
  //   ]
  // },

  {
    path: '/courseManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'courseManage',
        component: () => import('@/views/course/index'),
        meta: { title: '课程管理', role: ['system', 'normal'], icon: 'el-icon-reading' }
      }
    ]
  },

  {
    path: '/batchManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'batchManage',
        component: () => import('@/views/batch/index'),
        meta: { title: '批次管理', role: ['system', 'normal'], icon: 'el-icon-document-copy' }
      }
    ]
  },

  {
    path: '/taskDetails',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TaskDetails',
        component: () => import('@/views/taskDetails/index'),
        meta: {
          title: '提交详情',
          icon: 'el-icon-folder-checked',
          role: ['system', 'normal']
        }
      }
    ]
  },

  {
    path: '/userManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'UserManage',
        component: () => import('@/views/userManage/index'),
        meta: {
          title: '人员管理',
          icon: 'el-icon-s-custom',
          role: ['system']
        }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    name: 'personal',
    children: [
      {
        path: 'index',
        name: 'Personal',
        component: () => import('@/views/personal/index'),
        meta: {
          title: '个人中心',
          icon: 'el-icon-user-solid',
          role: ['system', 'normal', 'user']
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
