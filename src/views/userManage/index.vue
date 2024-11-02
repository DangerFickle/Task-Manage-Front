<template>
  <div class="app-container">
    <div class="title">人员管理</div>
    <el-row>
      <div class="search-div">
        <el-form label-width="70px">
          <el-row :gutter="20">
            <el-col :lg="12" :md="12" :sm="12" :xs="24">
              <el-form-item label="姓名">
                <el-input v-model="searchUser.name" style="width: 100%" placeholder="请输入姓名(选填)"/>
              </el-form-item>
            </el-col>

            <el-col :lg="12" :md="12" :sm="12" :xs="24">
              <el-form-item label="学号">
                <el-input v-model="searchUser.studentNumber" style="width: 100%" placeholder="请输入学号(选填)"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="display: flex">
            <el-button type="primary" icon="Search" @click="fetchUserData()">搜索</el-button>
            <el-button icon="Refresh" @click="resetData">重置</el-button>
            <el-button icon="Refresh" @click="fetchUserData()">刷新</el-button>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row>
      <div class="tools-div" style="margin: 10px 0 10px 0">
        <el-button type="success" icon="Plus" @click="handleAdd()">添加用户</el-button>
        <el-button type="success" icon="Plus" @click="uploadDialogVisible = true">批量添加</el-button>
        <!--                <el-button type="danger" icon="el-icon-delete" @click="handleDeleteByIds()">批量删除</el-button>-->
      </div>
    </el-row>

    <el-row>
      <el-table :data="userList" stripe border style="margin-top: 0px">
        <el-table-column label="序号" width="60" align="center">
          <template v-slot="scope">
            {{ (pageInfo.page - 1) * pageInfo.pageSize + scope.$index + 1 }}
          </template>

        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
          :width="flexColumnWidth(userList, '用户名', 'username')"
        />
        <el-table-column prop="name" label="姓名" align="center" :width="flexColumnWidth(userList, '姓名', 'name')"/>
        <el-table-column
          prop="studentNumber"
          label="学号"
          align="center"
          :width="flexColumnWidth(userList, '学号', 'studentNumber')"
        />
        <el-table-column prop="email" label="邮箱地址" align="center">
          <template v-slot="scope">
            {{ scope.row.email || "暂无" }}
          </template>
        </el-table-column>

        <el-table-column label="可用状态" width="80" align="center">
          <template v-slot="scope">
            <el-switch
              :model-value="scope.row.status === 0"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="switchStatus(scope.row.id)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center"/>

        <el-table-column prop="updateTime" label="修改时间" align="center"/>

        <el-table-column label="操作" align="center" width="200">
          <template v-slot="scope">
            <el-button icon="Edit" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button icon="Delete" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
        @current-change="fetchUserData"
      />
    </el-row>

    <el-dialog :title="dialogTitle" v-model="addOrUpdateDialogVisible" width="450px" center @close="dialogClose()">
      <el-form ref="userForm" :rules="userRules" :model="user" label-width="100px" style="padding-right: 40px">
        <el-form-item label="学号:" prop="studentNumber">
          <el-input v-model.trim="user.studentNumber"/>
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input v-model.trim="user.password"/>
        </el-form-item>

        <el-form-item label="姓名:" prop="name">
          <el-input v-model.trim="user.name"/>
        </el-form-item>

        <el-form-item label="邮箱:" prop="email">
          <el-input v-model.trim="user.email"/>
        </el-form-item>

        <el-form-item v-if="user.roleId !== '1'" label="角色:" prop="roleId">
          <el-select v-model.trim="user.roleId" placeholder="请选择角色">
            <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id"/>
          </el-select>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button icon="RefreshRight" @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="Check" @click="saveOrUpdate()">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="选择Excel文件" :before-close="() => {
          uploadDialogVisible = false
          upLoad.clearFiles(['ready', 'success'])
          batchUserList.splice(0)
        }" v-model="uploadDialogVisible" width="450px" style="text-align: center">
      <el-upload
        ref="upLoad"
        drag
        center
        :show-file-list="true"
        :http-request="handleExcel"
        :on-remove="() => batchUserList.splice(0)"
        :on-exceed="() => ElMessage.error('最多添加一个文件，请删除后再试')"
        :auto-upload="true"
        action=""
        :limit="1"
        :disabled="uploadAvailable"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
        <template #tip>
          <div class="el-upload__tip" style="font-size: 15px">
            文件需以 .xlsx 或 .xls 为后缀<br>
            工作表Sheet1中的字段为[name，studentNumber]
          </div>
        </template>
      </el-upload>

      <div style="margin-top:20px">
        <el-button icon="RefreshRight" @click="() => {
          uploadDialogVisible = false
          upLoad.clearFiles(['ready', 'success'])
          batchUserList.splice(0)
        }">取 消
        </el-button>
        <el-button type="primary" icon="Check" @click="handleBatchAdd()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue"
import {flexColumnWidth} from "@/hooks/useFlexColumnWidth"
import userApi from "@/api/user"
import roleApi from "@/api/role"
import {ElLoading, ElMessage, ElMessageBox, FormRules} from "element-plus"
import {User} from "@/api/user/types/user"
import {Role} from "@/api/role/type/role"
import {read, utils} from 'xlsx'
import {UploadFilled} from "@element-plus/icons-vue";

const userRules = reactive<FormRules>({
  studentNumber: [{required: true, message: "请输入学号", trigger: "blur"}],
  name: [{required: true, message: "请输入姓名", trigger: "blur"}],
  roleId: [{required: true, message: "请选择角色", trigger: "blur"}]
})
const pageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
}) // 分页信息
const user = reactive<User>({
  id: "",
  studentNumber: "",
  password: "",
  name: "",
  email: "",
  roleId: "",
  roleName: ""
})

const userList = reactive<Array<User>>([]) // 用户列表
const batchUserList = reactive<Array<User>>([]) // 即将批量添加的用户列表
const roleList = reactive<Array<Role>>([]) // 角色列表
// 搜索用户
const searchUser = reactive<User>({
  name: "",
  studentNumber: ""
})

const addOrUpdateDialogVisible = ref<boolean>(false)
const uploadDialogVisible = ref<boolean>(false)
const uploadAvailable = ref<boolean>(false)

const userForm = ref()
const upLoad = ref()
const dialogTitle = ref<string>()


onMounted(() => {
  fetchUserData()
})

function dialogClose() {
  // 清空输入框
  userForm.value.resetFields()
  resetUser()
}

// 切换用户的可用性
function switchStatus(userId: string) {
  userApi.switchStatus(userId).then((response) => {
    ElMessage({
      type: response.code === 800 ? "error" : "success",
      message: response.msg
    })
    fetchUserData()
  })
}

// 重置搜索
function resetData() {
  // 重置searchUser对象
  searchUser.username = ""
  searchUser.name = ""
  searchUser.studentNumber = ""
  searchUser.email = ""
}

function resetUser() {
  user.id = ""
  user.studentNumber = ""
  user.password = ""
  user.name = ""
  user.email = ""
  user.roleId = ""
  user.roleName = ""
}

// 添加用户时的前置处理
function handleAdd() {
  fetchRoleList()
  dialogTitle.value = "添加用户"
  // 显示添加/修改对话框
  addOrUpdateDialogVisible.value = true
}

// Excel文件处理完毕后，将batchUserList发送到后端
async function handleBatchAdd() {
  // 禁用文件选择组件
  uploadAvailable.value = true
  // 开启loading
  const loading = ElLoading.service({
    target: ".el-upload-dragger",
    lock: true,
    text: "正在处理...",
    background: "rgba(0, 0, 0, 0.8)"
  })
  // 发送网络请求
  const res = await userApi.addUserBatch(batchUserList)
  if (res.code === 200) {
    // 重新拉取用户列表
    fetchUserData()
    uploadDialogVisible.value = false
    ElMessage.success("批量添加成功")
    // 清除文件列表
    upLoad.value.clearFiles(['ready', 'success'])
  } else {
    ElMessage.error(res.msg)
    upLoad.value.clearFiles(['ready', 'success'])
  }
  batchUserList.splice(0)
  uploadAvailable.value = false
  loading.close()
}


// 用户选择文件后开始解析excel
async function handleExcel({file} : {file: File}) {
  const {name} = file
  const suffix = name.substring(name.indexOf("."))
  const suffixArr = ['.xlsx', '.xls']
  if (!suffixArr.includes(suffix)) {
    ElMessage.error("文件后缀错误")
    upLoad.value.clearFiles(['ready'])
    return
  }

  const userArray: Array<User> = await new Promise((resolve, reject) => {
    // 禁用文件选择组件
    uploadAvailable.value = true
    // 开启loading
    const loading = ElLoading.service({
      target: ".el-upload-dragger",
      lock: true,
      text: "正在处理Excel的数据，速度取决于文件大小...",
      background: "rgba(0, 0, 0, 0.8)"
    })
    const reader = new FileReader()
    reader.onload = (e) => {
      if(e.target === null) return
      const workbook = read(e.target.result)
      if (!workbook.Sheets.Sheet1) {
        uploadAvailable.value = false
        loading.close()
        ElMessage.error("请将用户数据放入Sheet1工作表")
        reject()
      } else {
        const userArray: Array<User> = utils.sheet_to_json(workbook.Sheets.Sheet1)
        if (userArray.length === 0) {
          uploadAvailable.value = false
          loading.close()
          ElMessage.error("Sheet1工作表没有数据")
          reject()
        } else {
          loading.close()
          resolve(userArray)
        }
      }
    }
    reader.readAsArrayBuffer(file)
  })
  uploadAvailable.value = false
  batchUserList.splice(0, batchUserList.length, ...userArray);
}

// 编辑用户的回显
function handleEdit(userId: string) {
  fetchRoleList()
  // 获取用户信息，回显数据
  userApi.getUserById(userId).then((response) => {
    // @ts-ignore
    const {data} = response
    user.id = data.id
    user.studentNumber = data.studentNumber
    user.name = data.name
    user.email = data.email
    user.roleId = data.roleId
    dialogTitle.value = "编辑用户"
    // 显示添加/修改对话框
    addOrUpdateDialogVisible.value = true
  })
}

// 更新用户
function updateUser() {
  userApi.updateUser(user).then((response) => {
    ElMessage({
      type: response.code === 800 ? "error" : "success",
      message: response.msg
    })
    addOrUpdateDialogVisible.value = false
    fetchUserData()
  })
}

// 添加用户
function saveUser() {
  userApi.addUser(user).then((response) => {
    ElMessage({
      type: response.code === 800 ? "error" : "success",
      message: response.msg
    })
    // 关闭对话框
    addOrUpdateDialogVisible.value = false
    // 刷新数据
    fetchUserData()
  })
}

function saveOrUpdate() {
  userForm.value.validate((valid: boolean) => {
    if (valid) {
      if (user.id) {
        updateUser()
      } else {
        saveUser()
      }
    } else {
      return false
    }
  })
}

// 删除指定用户
function handleDelete(userId: string) {
  // 提示用户是否确认删除
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // 确认删除
      userApi.deleteById(userId).then((response) => {
        ElMessage({
          type: response.code === 800 ? "error" : "success",
          message: response.msg
        })
        fetchUserData()
      })
    })
    .catch(() => {
    })
}

// 获取用户列表
function fetchUserData(page: number = 0) {
  if (page) {
    pageInfo.page = page
  }
  userApi.getUserList(searchUser, pageInfo.page, pageInfo.pageSize).then((response) => {
    userList.splice(0, userList.length, ...response.data.records)
    pageInfo.page = response.data.current
    pageInfo.total = response.data.total
  })
}

// 获取角色列表
function fetchRoleList() {
  roleApi.getRoleList().then((response) => {
    roleList.splice(0, roleList.length, ...response.data)
  })
}
</script>

<style scoped></style>
