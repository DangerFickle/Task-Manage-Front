<template>
  <div class="app-container">
    <div class="title">群组管理</div>
    <el-row>
      <div class="search-div">
        <el-form label-width="70px">
          <el-row :gutter="20">
            <el-col>
              <p style="float: left; color: #000; font-size: 25px;line-height: 0px;">搜索栏</p>
            </el-col>
            <el-col :md="11" :lg="8" :xl="5">
              <el-form-item label="群组名称">
                <el-input
                  v-model.trim="searchGroup.groupName"
                  @input="fetchGroupData()"
                  style="width: 300px"
                  placeholder="请输入群组名称(选填)"
                />
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 11, offset: 1 }" :lg="{ span: 8, pull: 1 }" :xl="{ span: 5, pull: 1 }">
              <el-form-item label="组长名称">
                <el-input
                  v-model.trim="searchGroup.leaderName"
                  @input="fetchGroupData()"
                  style="width: 300px"
                  placeholder="请输入组长名称(选填)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="display: flex">
            <!--            <el-button type="primary" icon="Search" @click="fetchCourseData()">搜索</el-button>-->
            <el-button icon="Refresh" type="info" @click="resetData">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row>
      <div class="tools-div" style="margin-top: 10px">
        <!--        <el-button type="success" icon="Plus" @click="handleAdd()">添 加</el-button>-->
      </div>
    </el-row>

    <el-form label-width="70px" inline style="margin: 10px 0 -10px 0">
      <el-row>
        <el-col>
          <el-form-item label="所属课程">
            <el-select
              v-model="searchGroup.belongCourse"
              filterable
              placeholder="请选择所属课程(必选)"
              style="width: 200px"
              @change="changeCourseSelect"
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
            <el-button type="primary" icon="Refresh" @click="fetchGroupData()">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="groupManageList" stripe border style="margin-top: 20px">
        <!--        <el-table-column type="selection"/>-->
        <el-table-column label="序号" width="60" align="center">
          <template v-slot="scope">
            {{ (pageInfo.page - 1) * pageInfo.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="群组名称"
          align="center"
          :width="flexColumnWidth(groupManageList, '群组名称', 'name')"
        />
        <el-table-column
          prop="leaderName"
          label="组长"
          align="center"
          :width="flexColumnWidth(groupManageList, '组长', 'leaderName')"
        />
        <el-table-column prop="alreadyMember"
                         :width="100" label="人数"
                         align="center">
          <template v-slot="scope">
            {{ `${scope.row.alreadyMember} / ${scope.row.groupMaxMemberSize}` }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="groupMaxMemberSize"-->
        <!--                         :width="flexColumnWidth(groupManageList, '最大人数', 'groupMaxMemberSize')" label="最大人数"-->
        <!--                         align="center"/>-->


        <!--        <el-table-column label="状态" width="65" align="center">-->
        <!--          <template v-slot="scope">-->
        <!--            <el-switch-->
        <!--              :model-value="scope.row.status === 1"-->
        <!--              inactive-color="#ff4949"-->
        <!--              active-color="#13ce66"-->
        <!--              @change="switchStatus(scope.row)"-->
        <!--            />-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column prop="createTime" label="创建时间" align="center"
                         :width="flexColumnWidth(groupManageList, '创建时间', 'createTime')"/>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button icon="Search" type="info" @click="handleShowMembers(scope.row)">查看成员</el-button>
            <el-button icon="Edit" type="warning" @click="handleAdjustMembers(scope.row)">调整成员</el-button>
            <el-button icon="Delete" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row>
      <!-- 分页组件 -->
      <el-pagination
        :current-page="pageInfo.page"
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        style="padding: 20px 0; margin: 0 auto"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchGroupData"
      />
    </el-row>

    <!-- 群组成员对话框 -->
    <el-dialog :title="currentGroup.name + '成员'" @close="dialogClose" v-model="openMembers" width="50%" top="15px"
               center>
      <el-row style="margin-bottom: 10px">
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -22px" inline>
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="memberPageInfo.name"
                @input="freshMemberList()"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-row>

      <el-row>
        <el-table :data="groupMemberList" stripe border>
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (memberPageInfo.page - 1) * memberPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column prop="name" label="姓名" align="center"/>
          <!-- 学号 -->
          <el-table-column prop="studentNumber" label="学号" align="center"/>
          <el-table-column label="身份" align="center">
            <template v-slot="scope">
              <el-tag size="large" type="success" v-if="scope.row.id === currentGroup.leader">组长</el-tag>
              <el-tag size="large" type="info" v-else>成员</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-button
                type="primary"
                @click="handleEditLeader(scope.row)"
                v-if="currentGroup.leader !== scope.row.id"
              >设为组长
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
          style="padding-top: 20px; margin: 0 auto"
          layout="total, prev, pager, next, jumper"
          @current-change="freshMemberList"
        />
      </el-row>
    </el-dialog>

    <!-- 调整成员对话框 -->
    <el-dialog :title="`调整${currentGroup.name}成员`" @close="transferDialogClose" v-model="openAdjustMembers"
               width="50%"
               top="15px" center
               style="text-align: center"
    >
      <el-transfer
        :titles="['组外成员', '组内成员']"
        v-model="newMemberInfo.newMembers"
        filterable
        filter-placeholder="输入学生姓名"
        :data="transferUserList"
        style="text-align: center"
      />

      <template #footer>
        <div class="dialog-footer" style="">
          <el-button icon="Edit" type="primary" @click="() => {
            if (newMemberInfo.newMembers.length > currentGroup.groupMaxMemberSize) return ElMessage.error('超出群组人数限制')
            if (newMemberInfo.newMembers.length <= 0) return ElMessage.error('组内至少要有一名成员')
              // 准备组长待选人
            leaderCandidateList.splice(0, leaderCandidateList.length, ...transferUserList.filter(m => newMemberInfo.newMembers.includes(m.key)).map(m=>{
              return {
                id: m.key,
                name: m.label
              }
            }))
            openAdjustMembers = false
            openWhoIsLeader = true
          }">确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 指定组长对话框 -->
    <el-dialog :title="`谁是组长`" @close="newLeaderDialogClose" v-model="openWhoIsLeader"
               width="50%"
               top="15px" center
    >
      <el-form
        ref="whoIsLeaderForm"
        :rules="whoIsLeaderRules"
        :model="newMemberInfo"
      >
        <el-form-item prop="newLeader">
          <el-checkbox-group style="width: 100%;text-align: center" v-model="newMemberInfo.newLeader" size="large"
                             :max="1">
            <el-checkbox-button border v-for="candidate in leaderCandidateList" :key="candidate.id"
                                :value="candidate.id"
                                :checked="candidate.id === currentGroup.leader"
                                style="margin: 0 10px 10px 0">
              {{ candidate.name }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="">
          <el-button icon="Edit" type="primary" @click="confirmAdjustMembers">确定</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue"
import {flexColumnWidth} from "@/hooks/useFlexColumnWidth"
import {ElMessage, ElMessageBox, FormInstance, FormRules} from "element-plus"
import {Course} from "@/api/course/type/course";
import {
  adjustMembers,
  deleteGroup,
  editGroupLeader,
  getGroupList,
  getGroupMembers,
  getGroupMembersNotPage
} from "@/api/groupManage";
import userAPI from "@/api/user";
import {SearchGroup} from "@/api/groupManage/type/SearchGroup";
import course from "@/api/course";
import {GroupManage} from "@/api/groupManage/type/GroupManage";
import {Group, GroupMember} from "@/api/group/type/group";

const whoIsLeaderRules = reactive<FormRules<typeof ruleForm>>({
  newLeader: [{required: true, trigger: 'blur', message: '请指定新组长'}],
})


const pageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
})

const memberPageInfo = reactive({
  page: 1,
  pageSize: 5,
  total: 0,
  name: ""
});

const searchGroup = reactive<SearchGroup>({
  // 搜索条件
  belongCourse: "", // 所属课程
  groupName: "", // 群组名称
  leaderName: "", // 组长名字
})


const whoIsLeaderForm = ref<FormInstance>()

const courseList = reactive<Course[]>([]) // 课程列表
const groupManageList = reactive<GroupManage[]>([]) // 群组列表
const groupMemberList = reactive<GroupMember[]>([]) // 群组成员列表
const transferUserList = ref<[]>([]) // transfer里的用户列表
const leaderCandidateList = ref<[]>([]) // 组长待选人列表

const newMemberInfo = reactive<{
  newMembers: Array<string> // 群组新成员列表，调整后的
  newLeader: Array<string>
}>({
  newMembers: [],
  newLeader: []
})


const openMembers = ref<boolean>(false) // 成员列表对话框是否显示
const openAdjustMembers = ref<boolean>(false) // 调整成员对话框是否显示
const openWhoIsLeader = ref<boolean>(false) // 指定组长对话框是否显示
const openAddGroup = ref<boolean>(false) // 新建群组对话框是否显示

const currentGroup = reactive<Group>({
  id: "",
  name: ""
})

// 新建群组，指定组长、成员
async function handleAddGroup() {

}

// 获取穿梭框中显示的数据
async function fetchTransferMemberList() {
  const res = await userAPI.getUserListWithoutMemberNotPage({
    name: "",
    courseId: searchGroup.belongCourse,
    groupId: currentGroup.id
  })
  const newUserList = res.data.map(user => {
    return {
      label: user.name,
      key: user.id,

    }
  })
  transferUserList.value.splice(0, transferUserList.value.length, ...newUserList)

  // 获取已有成员列表
  const resp = await getGroupMembersNotPage(currentGroup.id)
  const memberList = resp.data.map(m => m.id)
  newMemberInfo.newMembers.splice(0, newMemberInfo.newMembers.length, ...memberList)

  openAdjustMembers.value = true
}

// 更新群成员
async function confirmAdjustMembers() {
  whoIsLeaderForm.value.validate(async valid => {
    if (!valid) return
    try {
      await ElMessageBox.confirm(`确定重设群成员`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
      const res = await adjustMembers(currentGroup.id, newMemberInfo.newMembers, newMemberInfo.newLeader)
      if (res.code === 200) {
        ElMessage.success("调整群成员成功")
        await fetchGroupData()
        openWhoIsLeader.value = false
      } else {
        ElMessage.error(res.msg)
      }
    } catch (e) {
    }
  })
}

// 调整指定群组的成员
function handleAdjustMembers(group: Group) {
  Object.assign(currentGroup, group)
  fetchTransferMemberList()
}


// 获取群组列表
async function fetchGroupData(page: number = 1) {
  if (page) pageInfo.page = page
  const res = await getGroupList(searchGroup, pageInfo.page, pageInfo.pageSize)
  if (res.code === 200) {
    groupManageList.splice(0, groupManageList.length, ...res.data.records)
    pageInfo.total = res.data.total
  } else {
    ElMessage.error(res.msg)
  }
}

// 修改指定群组的组长
function handleEditLeader(member: GroupMember) {
  ElMessageBox.confirm(
    `确定将${member.name}设为${currentGroup.name}的新组长`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await editGroupLeader(currentGroup.id, member.id)
    if (res.code === 200) {
      // 重新获取群组列表
      await fetchGroupData()
      // 更新最新的currentGroup
      const newCurrentGroup = groupManageList.find(g => g.id === currentGroup.id)
      Object.assign(currentGroup, newCurrentGroup)
      ElMessage.success("变更组长成功")
    } else {
      ElMessage.error(res.msg)
    }
  }).catch(() => {
  })
}

function changeCourseSelect() {
  fetchGroupData()
}

// 查看指定群组的成员
function handleShowMembers(group: Group) {
  Object.assign(currentGroup, group)
  freshMemberList()
  openMembers.value = true
}

// 获取指定群组的成员
async function freshMemberList(page: number = 1) {
  if (page) memberPageInfo.page = page
  const res = await getGroupMembers(currentGroup.id, memberPageInfo.page, memberPageInfo.pageSize, memberPageInfo.name)
  groupMemberList.splice(0, groupMemberList.length, ...res.data.records)
  memberPageInfo.total = res.data.total
}

// 删除群组
function handleDelete(group: Group) {
  ElMessageBox.confirm(
    `确定删除${group.name}`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await deleteGroup(group.id)
    if (res.code === 200) {
      await fetchGroupData()
      ElMessage.success("删除成功")
    } else {
      ElMessage.error(res.msg)
    }
  }).catch(() => {
  })
}

async function getCourseList() {
  const res = await course.getCourseListOnlyEnabled()
  if (res.code === 200) {
    courseList.splice(0, courseList.length, ...res.data);
  } else {
    ElMessage.error(res.msg)
  }
}

function transferDialogClose() {
  transferUserList.value.splice(0)
}

function newLeaderDialogClose() {
  whoIsLeaderForm.value.resetFields()
  newMemberInfo.newLeader.splice(0)
  leaderCandidateList.value.splice(0)
}

function dialogClose() {
  memberPageInfo.name = ""
}

function addDialogClose() {
}

function resetData() {
  searchGroup.groupName = ""
  searchGroup.leaderName = ""
  fetchGroupData()
}

getCourseList()
</script>

<style scoped></style>
