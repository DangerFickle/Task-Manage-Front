<template>
  <div class="app-container">
    <div class="title">人员管理</div>
    <el-row>
      <div class="search-div">
        <el-form label-width="70px" size="medium">
          <el-row
            :gutter="20"
          >
            <el-col
              :md="{ span: 11, offset: 1 }"
              :lg="{span: 6, pull: 1}"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="姓名">
                <el-input v-model="searchUser.name" style="width: 100%" placeholder="请输入姓名(选填)" />
              </el-form-item>
            </el-col>

            <el-col
              :md="11"
              :lg="{ span: 6, pull: 1 }"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="学号">
                <el-input v-model="searchUser.studentNumber" style="width: 100%" placeholder="请输入学号(选填)" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="display:flex">
            <el-button type="primary" icon="el-icon-search" size="small" @click="fetchUserData()">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetData">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row>
      <div class="tools-div" style="margin: 10px 0 10px 0">
        <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd()">添加用户</el-button>
        <!--        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeleteByIds()">批量删除</el-button>-->
      </div>
    </el-row>

    <el-row>
      <el-table
        :data="userList"
        stripe
        border
        style="margin-top: 0px"
      >
        <el-table-column
          label="序号"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            {{ (pageInfo.page - 1) * pageInfo.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
          :width="flexColumnWidth(userList, '用户名', 'username')"
        />
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          :width="flexColumnWidth(userList, '姓名', 'name')"
        />
        <el-table-column
          prop="studentNumber"
          label="学号"
          align="center"
          :width="flexColumnWidth(userList, '学号', 'studentNumber')"
        />
        <el-table-column
          prop="email"
          label="邮箱地址"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.email || '暂无' }}
          </template>
        </el-table-column>

        <el-table-column label="可用状态" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status === 0"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="switchStatus(scope.row.id)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        />

        <el-table-column
          prop="updateTime"
          label="修改时间"
          align="center"
        />

        <el-table-column
          label="操作"
          align="center"
          width="200"
        >
          <template v-slot="scope">
            <el-button
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
            >编辑
            </el-button>
            <el-button
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除
            </el-button>
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
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchUserData"
      />
    </el-row>

    <el-dialog title="添加/修改" :visible.sync="addOrUpdateDialogVisible" width="450px" center @close="dialogClose()">
      <el-form
        ref="userForm"
        :rules="userRules"
        :model="user"
        label-width="100px"
        size="small"
        style="padding-right: 40px;"
      >
        <el-form-item label="学号:" prop="studentNumber">
          <el-input v-model.trim="user.studentNumber" />
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input v-model.trim="user.password" />
        </el-form-item>

        <el-form-item label="姓名:" prop="name">
          <el-input v-model.trim="user.name" />
        </el-form-item>

        <el-form-item label="邮箱:" prop="email">
          <el-input v-model.trim="user.email" />
        </el-form-item>

        <el-form-item label="角色:" prop="roleId">
          <el-select
            v-model.trim="user.roleId"
            placeholder="请选择角色"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="角色:" prop="roleId">-->
        <!--          <el-radio-group v-model="user.roleId">-->
        <!--            <el-radio-->
        <!--              v-for="role in roleList"-->
        <!--              :key="role.id"-->
        <!--              :label="role.id"-->
        <!--            >{{ role.roleName }}-->
        <!--            </el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { flexColumnWidthFN } from '@/mixins/flexColumnWidth'
import userApi from '@/api/user'
import roleApi from '@/api/role'

export default {
  name: 'UserManage',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      userRules: {
        studentNumber: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },
      pageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 分页信息
      user: {
        id: '',
        studentNumber: '',
        password: '',
        name: '',
        email: '',
        roleId: '',
        roleName: ''
      },
      userList: [], // 用户列表
      roleList: [], // 角色列表
      searchUser: {
        name: '',
        studentNumber: ''
      }, // 搜索用户
      addOrUpdateDialogVisible: false
    }
  },
  created() {
    this.fetchUserData()
  },
  methods: {
    // 添加/修改对话框关闭时触发，重置表单，重置检验效果
    dialogClose() {
      // 清空输入框
      this.user = {
        id: '',
        studentNumber: '',
        password: '',
        name: '',
        email: '',
        roleId: '',
        roleName: ''
      }
      this.$refs.userForm.resetFields()
    },
    // 切换用户的可用性
    switchStatus(userId) {
      userApi.switchStatus(userId).then(response => {
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
        this.fetchUserData()
      })
    },
    // 重置搜索
    resetData() {
      // 重置searchUser对象
      this.searchUser = {
        username: '',
        name: '',
        studentNumber: '',
        email: ''
      }
      // 刷新数据
      this.fetchUserData()
    },
    // 添加用户时的前置处理
    handleAdd() {
      this.fetchRoleList()
      // 显示添加/修改对话框
      this.addOrUpdateDialogVisible = true
    },
    // 编辑用户的回显
    handleEdit(userId) {
      this.fetchRoleList()
      // 获取用户信息，回显数据
      userApi.getUserById(userId).then(response => {
        const { data } = response
        this.user.id = data.id
        this.user.studentNumber = data.studentNumber
        this.user.name = data.name
        this.user.email = data.email
        this.user.roleId = data.roleId
        // 显示添加/修改对话框
        this.addOrUpdateDialogVisible = true
      })
    },
    // 更新用户
    updateUser() {
      userApi.updateUser(this.user).then(response => {
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
        this.addOrUpdateDialogVisible = false
        this.fetchUserData()
      })
    },
    // 添加用户
    saveUser() {
      userApi.addUser(this.user).then(response => {
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
        // 关闭对话框
        this.addOrUpdateDialogVisible = false
        // 刷新数据
        this.fetchUserData()
      })
    },
    saveOrUpdate() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (this.user.id) {
            this.updateUser()
          } else {
            this.saveUser()
          }
        } else {
          return false
        }
      })
    },
    // 删除指定用户
    handleDelete(userId) {
      // 提示用户是否确认删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除
        userApi.deleteById(userId).then(response => {
          this.$message({
            type: response.code === 800 ? 'error' : 'success',
            message: response.msg
          })
          this.fetchUserData()
        })
      }).catch(() => {
      })
    },
    // 获取用户列表
    fetchUserData(page) {
      if (page) {
        this.pageInfo.page = page
      }
      userApi.getUserList(this.searchUser, this.pageInfo.page, this.pageInfo.pageSize).then(response => {
        this.userList = response.data.records
        this.pageInfo.page = response.data.current
        this.pageInfo.total = response.data.total
      })
    },
    // 获取角色列表
    fetchRoleList() {
      roleApi.getRoleList().then(response => {
        this.roleList = response.data
      })
    }

  }
}
</script>

<style scoped>

</style>
