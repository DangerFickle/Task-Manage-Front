import {type RouteRecordRaw, createRouter} from "vue-router"
import {history, flatMultiLevelRoutes} from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {title: "首页", svgIcon: "dashboard", affix: true}
      }
    ]
  },

  {
    path: "/personalTask",
    component: Layouts,
    meta: {
      roles: ["system", "normal", "user"]
    },
    children: [
      {
        path: "index",
        name: "PersonalTask",
        component: () => import("@/views/personalTask/index.vue"),
        meta: {
          title: "个人作业",
          elIcon: "Files"
        }
      }
    ]
  },
  {
    path: "/groupTask",
    component: Layouts,
    meta: {
      roles: ["system", "normal", "user"]
    },
    children: [
      {
        path: "index",
        name: "GroupTask",
        component: () => import("@/views/groupTask/index.vue"),
        meta: {
          title: "群组作业",
          elIcon: "ChatLineSquare"
        }
      }
    ]
  },

  {
    path: "/myGroup",
    component: Layouts,
    meta: {
      roles: ["normal", "user", "system"]
    },
    children: [
      {
        path: "index",
        name: "Group",
        component: () => import("@/views/myGroup/index.vue"),
        meta: {
          title: "我的群组",
          elIcon: "ChatLineRound"
        }
      }
    ]
  },

  {
    path: "/group",
    component: Layouts,
    meta: {
      roles: ["system", "normal"]
    },
    children: [
      {
        path: "index",
        name: "group",
        component: () => import("@/views/group/index.vue"),
        meta: {title: "群组管理", elIcon: "List"}
      }
    ]
  },

  {
    path: "/courseManage",
    component: Layouts,
    name: "courseManage",
    meta: {
      roles: ["system", "normal"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/course/index.vue"),
        meta: {title: "课程管理", elIcon: "Memo"}
      }
    ]
  },

  {
    path: "/batchManage",
    component: Layouts,
    meta: {
      roles: ["system", "normal"]
    },
    children: [
      {
        path: "index",
        name: "batchManage",
        component: () => import("@/views/batch/index.vue"),
        meta: {title: "批次管理", elIcon: "List"}
      }
    ]
  },

  {
    path: "/taskDetails",
    component: Layouts,
    meta: {
      roles: ["system", "normal"]
    },
    children: [
      {
        path: "index",
        name: "TaskDetails",
        component: () => import("@/views/taskDetails/index.vue"),
        meta: {
          title: "提交详情",
          elIcon: "FolderChecked"
        }
      }
    ]
  },

  {
    path: "/userManage",
    component: Layouts,
    meta: {
      roles: ["system"]
    },
    children: [
      {
        path: "index",
        name: "UserManage",
        component: () => import("@/views/userManage/index.vue"),
        meta: {
          title: "人员管理",
          elIcon: "Avatar"
        }
      }
    ]
  },
  {
    path: "/personalCenter",
    component: Layouts,
    meta: {
      roles: ["system", "normal", "user"]
    },
    children: [
      {
        path: "index",
        name: "personalCenter",
        component: () => import("@/views/personalCenter/index.vue"),
        meta: {
          title: "个人中心",
          elIcon: "User"
        }
      }
    ]
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const {name, meta} = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
