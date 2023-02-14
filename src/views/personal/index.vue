<template>
  <div class="app-container">
    <div class="title">个人中心</div>

    <el-tabs type="border-card" style="margin-top: 20px">
      <el-tab-pane label="修改密码">
        <el-form
          ref="passwordForm"
          :model="passwordForm"
          status-icon
          :rules="passwordRules"
          label-width="100px"
          style="margin-right: 40px"
          center
        >
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
            :lg="8"
            :xl="6"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="确认新密码" prop="newPasswordAgain">
              <el-input v-model="passwordForm.newPasswordAgain" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPasswordForm('passwordForm')">提交</el-button>
              <el-button @click="resetForm('passwordForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>

      </el-tab-pane>

      <el-tab-pane label="修改邮箱">
        <el-form
          ref="emailForm"
          :model="emailForm"
          status-icon
          :rules="emailRules"
          label-width="80px"
          style="margin-right: 40px"
          center

        >
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
            :lg="8"
            :xl="6"
          >
            <el-form-item label="密码" prop="password">
              <el-input v-model="emailForm.password" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="emailForm.email" type="email" autocomplete="off"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEmailForm('emailForm')">提交</el-button>
              <el-button @click="resetForm('emailForm')">重置</el-button>
            </el-form-item>

          </el-col>

        </el-form>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import userApi from '@/api/user'
import store from '@/store'

export default {
  name: 'Personal',
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateNewPasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('邮箱不能为空'))
      }
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    return {
      // 表单数据
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      emailForm: {
        password: '',
        email: ''
      },
      // 表单验证规则
      passwordRules: {
        oldPassword: [
          {validator: validateOldPassword, trigger: 'blur'}
        ],
        newPassword: [
          {validator: validateNewPassword, trigger: 'blur'}
        ],
        newPasswordAgain: [
          {validator: validateNewPasswordAgain, trigger: 'blur'}
        ]
      },
      // 修改邮箱表单验证规则
      emailRules: {
        password: [
          {validator: validatePassword, trigger: 'blur'}
        ],
        email: [
          {validator: validateEmail, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 处理修改密码逻辑
    submitPasswordForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 检验成功，提交表单
          userApi.resetPassword(this.passwordForm).then(response => {
            // 当后端没有错误信息时重置表单
            if (response.code === 800) {
              this.$message({
                type: 'error',
                message: response.msg
              })
              return
            }
            // 重置表单
            this.resetForm(formName)
            // 提示用户重新登陆
            this.$confirm('密码修改成功，请重新登陆', '重新登陆', {
              confirmButtonText: '重新登陆',
              showCancelButton: false,
              type: 'success'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
          })
        } else {
          return false
        }
      })
    },
    submitEmailForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 检验成功，提交修改邮箱表单
          userApi.updateEmail(this.emailForm).then(response => {
            // 当后端没有错误信息时重置表单
            if (response.code !== 800) {
              // 重置表单
              this.resetForm(formName)
            }
            this.$message({
              type: response.code === 800 ? 'error' : 'success',
              message: response.msg
            })
          })
        } else {
          return false
        }
      })
    },
    // 处理修改邮箱逻辑
    // 传入表单名，重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
