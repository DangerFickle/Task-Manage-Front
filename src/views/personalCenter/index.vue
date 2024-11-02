<template>
  <div class="app-container">
    <div class="title">个人中心</div>

    <el-tabs type="border-card" style="margin-top: 20px">
      <el-tab-pane label="修改密码">
        <el-form
          ref="passwordForm"
          :model="passwordData"
          status-icon
          :rules="passwordRules"
          label-width="100px"
          style="margin-right: 40px"
          center
        >
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="passwordData.oldPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordData.newPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="newPasswordAgain">
              <el-input v-model="passwordData.newPasswordAgain" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPasswordForm()">提交</el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="修改邮箱">
        <el-form
          ref="emailForm"
          :model="emailData"
          status-icon
          :rules="emailRules"
          label-width="80px"
          style="margin-right: 40px"
          center
        >
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <el-form-item label="密码" prop="password">
              <el-input v-model="emailData.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="emailData.email" type="email" autocomplete="off" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEmailForm()">提交</el-button>
              <el-button @click="resetEmailForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import userApi from "@/api/user/index"
import { ElMessage, ElMessageBox, FormItemRule, FormRules } from "element-plus";
import { useUserStore } from "@/store/modules/user"


const validateOldPassword = (rule: FormRules, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请输入旧密码"))
  } else {
    callback()
  }
}
const validateNewPassword = (rule: FormRules, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请输入新密码"))
  } else {
    callback()
  }
}
const validatePassword = (rule: FormRules, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请输入密码"))
  } else {
    callback()
  }
}
const validateNewPasswordAgain = (rule: FormRules, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"))
  } else if (value !== passwordData.newPassword) {
    callback(new Error("两次输入密码不一致!"))
  } else {
    callback()
  }
}
const validateEmail = (rule: FormRules, value: string, callback: Function) => {
  if (value === "") {
    return callback(new Error("邮箱不能为空"))
  }
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
    callback(new Error("请输入正确的邮箱地址"))
  } else {
    callback()
  }
}

// 表单验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [{ validator: validateOldPassword, trigger: "blur" }] as FormItemRule,
  newPassword: [{ validator: validateNewPassword, trigger: "blur" }] as FormItemRule,
  newPasswordAgain: [{ validator: validateNewPasswordAgain, trigger: "blur" }] as FormItemRule
})
// 修改邮箱表单验证规则
const emailRules = reactive<FormRules>({
  password: [{ validator: validatePassword, trigger: "blur" }] as FormItemRule,
  email: [{ validator: validateEmail, trigger: "blur" }] as FormItemRule
})

const passwordForm = ref()
const emailForm = ref()

const resetPasswordForm = () => {
  passwordForm.value.resetFields()
}
const resetEmailForm = () => {
  emailForm.value.resetFields()
}

// 密码表单数据
const passwordData = reactive({
  oldPassword: "",
  newPassword: "",
  newPasswordAgain: ""
})
// 邮箱表单数据
const emailData = reactive({
  password: "",
  email: ""
})

// 处理修改密码逻辑
function submitPasswordForm() {
  passwordForm.value.validate((valid: boolean) => {
    if (valid) {
      // 检验成功，提交表单
      userApi.resetPassword(passwordData).then((response) => {
        // 当后端没有错误信息时重置表单
        if (response.code === 800) {
          ElMessage({
            type: "error",
            message: response.msg
          })
          return
        }
        // 重置表单
        passwordForm.value.resetFields()
        // 提示用户重新登陆
        ElMessageBox.confirm("密码修改成功，请重新登陆", "重新登陆", {
          confirmButtonText: "重新登陆",
          showCancelButton: false,
          type: "success"
        }).then(() => {
          useUserStore().resetToken()
          location.reload()
        })
      })
    } else {
      return false
    }
  })
}
function submitEmailForm() {
  emailForm.value.validate((valid: boolean) => {
    if (valid) {
      // 检验成功，提交修改邮箱表单
      userApi.updateEmail(emailData).then((response) => {
        // 当后端没有错误信息时重置表单
        if (response.code !== 800) {
          // 重置表单
          emailForm.value.resetFields()
        }
        ElMessage({
          type: response.code === 800 ? "error" : "success",
          message: response.msg
        })
      })
    } else {
      return false
    }
  })
}
</script>

<style scoped></style>
