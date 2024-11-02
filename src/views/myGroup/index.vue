<template>
  <div class="app-container">
    <div class="title">我的群组</div>

    <!-- 选择课程表单 -->
    <el-row>
      <div class="tools-div">
        <el-form label-width="70px" style="margin: 10px 0 -15px 0" inline>
          <el-row>
            <el-col>
              <el-form-item label="所属课程">
                <el-select
                  v-model="searchGroup.belongCourseId"
                  filterable
                  placeholder="请选择所属课程(必选)"
                  style="width: 200px"
                  @change="changeCourseSelect()"
                >
                  <el-option
                    v-for="course in courseList"
                    :key="course.id"
                    :label="course.courseName"
                    :value="course.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Refresh" @click="fetchGroup()">刷新</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row v-if="group.id === ''">
      <div class="tools-div" style="margin-top: 10px">
        <el-button type="success" icon="Edit" @click="openGroupIndexDialog()" v-if="searchGroup.belongCourseId">创建群组
        </el-button>
        <el-button type="success" icon="Plus" @click="handleJoin()" v-if="searchGroup.belongCourseId">加入群组
        </el-button>
      </div>
    </el-row>

    <el-row v-if="group.id !== ''">
      <div class="tools-div" style="margin-top: 10px">
        <el-button type="danger" icon="Delete" @click="handleQuitGroup()">退出群组</el-button>
        <el-button type="warning" v-if="userStore.userId === group.leader" icon="Switch"
                   @click="freshTransMemberList()">
          转让组长
        </el-button>
        <el-button type="primary" v-if="userStore.userId === group.leader" icon="Plus" @click="handleAddMember()">
          添加成员
        </el-button>
      </div>
    </el-row>


    <el-row>
      <h2 style="color: #000;font-weight: normal">群组成员: {{ group.name }}</h2>
    </el-row>

    <el-row>
      <!-- 成员信息 -->
      <el-table
        :data="memberList"
        stripe
        border
      >
        <!--        <el-table-column type="selection"/>-->
        <el-table-column
          label="序号"
          width="80"
          prop="id"
          align="center"
        >
          <template v-slot="scope">
            {{ (memberPageInfo.page - 1) * memberPageInfo.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名字"
          align="center"
        />

        <el-table-column
          prop="studentNumber"
          label="学号"
          align="center"
        />
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.email ? scope.row.email : "无" }}
          </template>
        </el-table-column>
        <el-table-column
          label="身份"
          align="center"
        >
          <template v-slot="scope">
            <el-tag size="large" type="success" v-if="scope.row.id === group.leader">组长</el-tag>
            <el-tag size="large" type="info" v-else>成员</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="500"
          v-if="userStore.userId === group.leader"
        >
          <template v-slot="scope">
            <!--                    <el-button-->
            <!--                      v-if="scope.row.isMind === 1"-->
            <!--                      size="small"-->
            <!--                      icon="el-icon-edit"-->
            <!--                      @click="showMembers(scope.row.id)"-->
            <!--                    >-->
            <!--                      申请处理-->
            <!--                    </el-button>-->
            <!--                    <el-button-->
            <!--                      v-if="scope.row.isMind === 1"-->
            <!--                      size="small"-->
            <!--                      icon="el-icon-edit"-->
            <!--                      @click="handleEdit(scope.row.id)"-->
            <!--                    >-->
            <!--                      编辑-->
            <!--                    </el-button>-->
            <el-button
              v-if="userStore.userId === group.leader && scope.row.id !== group.leader"
              icon="DeleteFilled"
              type="danger"
              @click="kickOutMember(scope.row)"
            >
              踢出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row>
      <!-- 分页组件 -->
      <el-pagination
        :current-page="memberPageInfo.page"
        :total="memberPageInfo.total"
        :page-size="memberPageInfo.pageSize"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchGroup"
      />
    </el-row>

    <!-- 选择成员对话框 -->
    <el-dialog title="选择成员" v-model="openUsers" width="50%" top="15px" center>
      <el-row style="margin-bottom: 10px">
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -22px" inline>
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="searchUser.name"
                @input="freshUserList()"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-row>

      <el-row>
        <el-table :data="userList" stripe border>
          <!--          <el-table-column type="selection"/>-->
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (userPageInfo.page - 1) * userPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column prop="name" label="学生姓名" align="center"/>
          <!-- 学号 -->
          <el-table-column prop="studentNumber" label="学号" align="center"/>
          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-button
                type="primary"
                @click="addUserToGroup(scope.row)"
              >添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="userPageInfo.page"
          :total="userPageInfo.total"
          :page-size="userPageInfo.pageSize"
          style="padding-top: 20px; margin: 0 auto"
          layout="total, prev, pager, next, jumper"
          @current-change="freshUserList"
        />
      </el-row>
    </el-dialog>


    <!-- 转让群主的选择成员对话框 -->
    <el-dialog title="选择成员" v-model="openTransMembers" width="50%" top="15px" center>
      <el-row style="margin-bottom: 10px">
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -22px" inline>
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="transMemberPageInfo.name"
                @input="freshTransMemberList()"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-row>

      <el-row>
        <el-table :data="transMemberList" stripe border>
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (transMemberPageInfo.page - 1) * transMemberPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column prop="name" label="学生姓名" align="center"/>
          <!-- 学号 -->
          <el-table-column prop="studentNumber" label="学号" align="center"/>
          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-button
                type="primary"
                @click="handleTransferLeader(scope.row)"
              >转让
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="transMemberPageInfo.page"
          :total="transMemberPageInfo.total"
          :page-size="transMemberPageInfo.pageSize"
          style="padding-top: 20px; margin: 0 auto"
          layout="total, prev, pager, next, jumper"
          @current-change="freshTransMemberList"
        />
      </el-row>
    </el-dialog>

    <!-- 填写第几组的弹窗 -->
    <el-dialog :title="'您是第几组？'" @close="closeGroupIndexDialog" width="450px" v-model="openGroupIndex" center>
      <el-form ref="groupIndexForm" :rules="groupIndexRules" :model="searchGroup" label-width="120px">
        <el-form-item prop="groupIndex">
          <el-input-number v-model="searchGroup.groupIndex" :controls="false" validate-event :min="1" :max="currentCourse.groupMaxSize"/>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="RefreshRight" @click="closeGroupIndexDialog">取 消</el-button>
        <el-button type="primary" icon="Check" @click="handleCreate">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from "vue";
import courseApi from "@/api/course";
import {flexColumnWidth} from "@/hooks/useFlexColumnWidth";
import {Course} from "@/api/course/type/course";
import {getGroup, kickOut, quitGroup, addMember, createGroup, transferLeader} from "@/api/group";
import {Group, GroupMember} from "@/api/group/type/group";
import {ElMessage, ElMessageBox} from "element-plus";
import {useUserStoreHook} from "@/store/modules/user";
import userApi from "@/api/user";
import {User} from "@/api/user/types/user";

const userStore = useUserStoreHook();


const searchUser = reactive<{
  name: string,
  groupId: string
}>({
  name: "",
  groupId: ""
});

// 分页信息
const userPageInfo = reactive({
  pageSize: 10, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});

const memberPageInfo = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const transMemberPageInfo = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  name: "",
  groupId: ""
});

const searchGroup = reactive({
  belongCourseId: "",
  groupIndex: null
});

function resetGroup() {
  group.id = "";
  group.name = "";
  group.leader = "";
  group.belongCourse = "";
  group.createTime = "";
  group.updateTime = "";
}

const currentCourse = reactive<Course>({
  id: ""
})

const group = reactive<Group>({
  id: "",
  name: "",
  leader: "",
  belongCourse: "",
  alreadyMember: undefined,
  groupMaxMemberSize: undefined,
  createTime: "",
  updateTime: ""
});

const groupIndexRules = reactive({
  groupIndex: {required: true, message: '请输入组数', trigger: 'blur'},
})

const groupIndexForm = ref()

const openTransMembers = ref<boolean>(false)
const openGroupIndex = ref<boolean>(false)
const openUsers = ref<boolean>(false);

const userList = reactive<Array<User>>([]);
const memberList = reactive<Array<GroupMember>>([]);
const transMemberList = reactive<Array<GroupMember>>([]);
const courseList = reactive<Array<Course>>([]);

function openGroupIndexDialog() {
  openGroupIndex.value = true
}

function closeGroupIndexDialog() {
  searchGroup.groupIndex = null
  openGroupIndex.value = false
}

function getCourseList() {
  courseApi.getCourseListOnlyEnabled().then(response => {
    courseList.splice(0, courseList.length, ...response.data);
  });
}

function changeCourseSelect() {
  // 获取当前用户在此课程加入的群组信息
  fetchGroup();
}

// 创建以自己为组长的群组
function handleCreate() {
  groupIndexForm.value.validate(async valid => {
    if (valid) {
      if (searchGroup.belongCourseId === "") {
        ElMessage.error("请先选择一门课程");
        return;
      }
      const res = await createGroup(searchGroup)
      if (res.code === 200) {
        fetchGroup()
        ElMessage.success('创建群组成功')
        openGroupIndex.value  = false
      } else {
        ElMessage.error(res.msg)
      }
    }
  })

}

// 拉取群成员信息
function freshTransMemberList(page: number = 1) {
  if (page) transMemberPageInfo.page = page
  transMemberPageInfo.groupId = group.id
  userApi.getTransMemberList(transMemberPageInfo).then(res => {
    const {data, msg} = res
    if (res.code === 200) {
      transMemberList.splice(0, transMemberList.length, ...data.records)
      transMemberPageInfo.total = data.total
      openTransMembers.value = true
    } else {
      ElMessage.error(msg)
    }
  })
}

// 拉取群组信息
function fetchGroup(page: number = 1) {
  if (page) memberPageInfo.page = page
  if (searchGroup.belongCourseId === "") {
    ElMessage.error("请先选择一门课程");
    getCourseList()
    return;
  }
  getGroup(memberPageInfo.page, memberPageInfo.pageSize, searchGroup.belongCourseId).then(res => {
    const {data} = res;
    if (data) {
      Object.assign(group, data);
      memberList.splice(0, memberList.length, ...data.members.records);
      memberPageInfo.total = data.members.total
    } else {
      resetGroup();
      memberList.splice(0, memberList.length);
      memberPageInfo.total = 0;
    }
  });
}


// 踢出成员
function kickOutMember(row: GroupMember) {
  ElMessageBox.confirm(
    `确认将${row.name}踢出当前群组`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    kickOut(group.id, row.id).then(res => {
      if (res.code === 200) {
        ElMessage.success("踢出成功");
        fetchGroup();
      } else {
        ElMessage.error(res.msg)
      }
    });
  }).catch(() => {
  });

}

// 加入群组
function handleJoin() {

}


// 主动退出群组
function handleQuitGroup() {
  ElMessageBox.confirm(
    `确认退出当前群组`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    quitGroup(group.id).then(res => {
      if (res.code === 200) {
        ElMessage.success("退出成功");
        fetchGroup()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {
  });
}

// 将组长转让给其他组员
function handleTransferLeader(user: User) {
  ElMessageBox.confirm(
    `确认将群主转让给${user.name}`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    transferLeader(user.id, group.id).then(res => {
      if (res.code === 200) {
        ElMessage.success("转让成功")
        fetchGroup()
        openTransMembers.value = false
      } else {
        ElMessage.success("转让失败")
      }
    })
  }).catch(() => {
  })

}

// 组长添加组员
function handleAddMember() {
  // 拉取所有用户
  freshUserList()
}

// 添加单个组员
function addUserToGroup(row: User) {
  ElMessageBox.confirm(
    `确定将${row.name}添加到当前群组`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    addMember(row.id, group.id).then(res => {
      if (res.code === 200) {
        // 移除成岩
        ElMessage.success("添加成功");
        // 拉取群组信息
        fetchGroup()
        // 拉取所有用户
        freshUserList()
      } else {
        ElMessage.error(res.msg);
      }
    });
  }).catch(() => {
  })

}

// 获取用户列表
function freshUserList(page: number = 1) {
  if (page) userPageInfo.page = page;
  searchUser.groupId = group.id
  userApi.getUserListWithoutMember(searchUser, userPageInfo.page, userPageInfo.pageSize).then(res => {
    // 过滤掉组内成员
    userList.splice(0, userList.length, ...res.data.records)
    userPageInfo.total = res.data.total;
    openUsers.value = true;
  });
}

getCourseList();
</script>

<style scoped>

</style>
