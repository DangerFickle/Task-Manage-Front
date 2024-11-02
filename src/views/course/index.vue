<template>
  <div class="app-container">
    <div class="title">课程管理</div>
    <el-row>
      <div class="search-div">
        <el-form label-width="70px">
          <el-row :gutter="20">
            <el-col>
              <p style="float: left; color: #000; font-size: 25px;line-height: 0px;">搜索栏</p>
            </el-col>
            <el-col :md="11" :lg="6" :xl="5">
              <el-form-item label="课程名称">
                <el-input
                  v-model.trim="searchCourse.courseName"
                  @input="fetchCourseData()"
                  style="width: 300px"
                  placeholder="请输入课程名称(选填)"
                />
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 11, offset: 1 }" :lg="{ span: 6, pull: 1 }" :xl="{ span: 5, pull: 1 }">
              <el-form-item label="课程描述">
                <el-input
                  v-model.trim="searchCourse.description"
                  @input="fetchCourseData()"
                  style="width: 300px"
                  placeholder="请输入课程描述(选填)"
                />
              </el-form-item>
            </el-col>

            <el-col :md="11" :lg="{ span: 6, pull: 1 }" :xl="{ span: 5, pull: 1 }">
              <el-form-item label="创建人">
                <el-input
                  v-model.trim="searchCourse.creatorName"
                  @input="fetchCourseData()"
                  style="width: 300px"
                  placeholder="请输入课程创建人(选填)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--            <el-col :span="6">-->
            <!--              <el-form-item label="修改者">-->
            <!--                <el-input-->
            <!--                  v-model.trim="searchCourse.modifierName"-->
            <!--                  style="width: 200px"-->
            <!--                  placeholder="请输入课程修改者(选填)"-->
            <!--                />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
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
        <el-button type="success" icon="Plus" @click="handleAdd()">添 加</el-button>
        <!--        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeleteByIds()">批量删除</el-button>-->
      </div>
    </el-row>

    <el-row>
      <el-table :data="courseList" stripe border style="margin-top: 20px" @selection-change="handleSelectionChange">
        <!--        <el-table-column type="selection"/>-->
        <el-table-column label="序号" width="60" align="center">
          <template v-slot="scope">
            {{ (pageInfo.page - 1) * pageInfo.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
          :width="flexColumnWidth(courseList, '课程名称', 'courseName')"
        />
        <el-table-column
          prop="description"
          label="课程描述"
          align="center"
          :width="flexColumnWidth(courseList, '课程描述', 'description')"
        />
        <el-table-column prop="groupMaxMemberSize"
                         :width="flexColumnWidth(courseList, '群组最大人数', 'groupMaxMemberSize')" label="群组最大人数"
                         align="center"/>
        <el-table-column prop="groupMaxSize"
                         :width="flexColumnWidth(courseList, '最大群组数', 'groupMaxSize')" label="最大群组数"
                         align="center"/>
        <el-table-column prop="creatorName" label="创建人" align="center"/>
        <el-table-column prop="modifierName" label="修改人" align="center"/>

        <el-table-column label="状态" width="65" align="center">
          <template v-slot="scope">
            <el-switch
              :model-value="scope.row.status === 1"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="switchStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column prop="updateTime" label="修改时间" align="center"/>
        <el-table-column label="操作" align="center" width="240">
          <template v-slot="scope">
            <el-button icon="Edit" @click="handleEdit(scope.row.id)">编辑</el-button>
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
        @current-change="fetchCourseData"
      />
    </el-row>

    <el-dialog :title="dialogTitle" @close="dialogClose()" width="450px" v-model="addOrUpdateDialogVisible" center>
      <el-form ref="courseForm" :rules="courseRules" :model="course" label-width="120px">
        <el-form-item label="课程名称:" prop="courseName">
          <el-input v-model.trim="course.courseName"/>
        </el-form-item>
        <el-form-item label="课程描述:" prop="description">
          <el-input v-model.trim="course.description"/>
        </el-form-item>
        <el-form-item label="群组最大人数:" prop="groupMaxMemberSize">
          <el-input v-model.number="course.groupMaxMemberSize"/>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="RefreshRight" @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="Check" @click="addOrUpdate()">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, onMounted} from "vue"
import courseApi from "@/api/course"
import {flexColumnWidth} from "@/hooks/useFlexColumnWidth"
import {ElMessage, ElMessageBox, FormRules} from "element-plus"
import {Course, SearchCourse} from "@/api/course/type/course";

const courseRules: FormRules = {
  courseName: [{required: true, message: "请输入课程名", trigger: "blur"}],
  description: [{required: true, message: "请输入课程描述", trigger: "blur"}],
  groupMaxMemberSize: [{required: true, validator: checkGroupMaxMemberSize, trigger: "blur"}]
}

function checkGroupMaxMemberSize(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error("请输入群组最大人数"))
    return
  }
  if (typeof value !== 'number') {
    callback(new Error("请输入数字"))
    return
  }
  if (value <= 0) {
    callback(new Error("不可小于等于0"))
    return
  }
  callback()
}

const pageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
})

const searchCourse = reactive<SearchCourse>({
  // 搜索条件
  courseName: "", // 课程名称
  description: "", // 课程描述
  creatorName: "", // 创建者名字
  modifierName: "" // 修改者名字
})

const dialogTitle = ref<string>()

const courseList = reactive<Course[]>([]) // 课程列表

const addOrUpdateDialogVisible = ref<boolean>(false) // 添加/修改对话框是否显示

const course = reactive<Course>({
  // 课程信息
  id: "", // 课程id
  courseName: "", // 课程名称
  description: "", // 课程描述
  groupMaxMemberSize: undefined // 群组最大人数
})

let selectValue = reactive<Course[]>([]) // 选择的要删除的项

const courseForm = ref()


function dialogClose() {
  // 清空表单
  courseForm.value.resetFields()
  resetCourse()
}

async function fetchCourseData(page: number = 0) {
  if (page) {
    pageInfo.page = page
  }
  try {
    const response = await courseApi.getCourseListPage(searchCourse, pageInfo.page, pageInfo.pageSize)
    const {data} = response
    pageInfo.total = data.total
    pageInfo.page = data.current
    // 替换数组courseList中的元素
    courseList.splice(0, courseList.length, ...data.records)
  } catch (error) {
    console.log(error)
  }
}

function resetData() {
  resetSearchCourse()
  fetchCourseData(1)
}

function handleEdit(id: string) {
  courseApi
    .getCourseById(id)
    .then((response) => {
      const {data} = response
      Object.assign(course, data)
      dialogTitle.value = "编辑课程"
      addOrUpdateDialogVisible.value = true
    })
    .catch((error) => {
      console.log(error)
    })
}

function handleAdd() {
  dialogTitle.value = "添加课程"
  addOrUpdateDialogVisible.value = true
}

function handleDelete(row: Course) {
  ElMessageBox.confirm(`确认删除 <${row.courseName}> 课程吗？此操作不可逆！`, "警告", {
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    center: true
  })
    .then(() => {
      courseApi
        .deleteCourseById(row.id)
        .then((response) => {
          fetchCourseData()
          ElMessage({
            type: response.code === 800 ? "error" : "success",
            message: response.msg
          })
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch((error) => {
    })
}

// 切换课程的可用性
function switchStatus(row: Course) {
  const status = row.status === 1 ? 0 : 1
  courseApi
    .updateStatus(row.id, status)
    .then((response) => {
      fetchCourseData()
      ElMessage({
        type: response.code === 800 ? "error" : "success",
        message: response.msg
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// 保存或更新课程信息
function addOrUpdate() {
  courseForm.value.validate((valid: boolean) => {
    if (valid) {
      if (course.id) {
        updateCourse()
      } else {
        addCourse()
      }
    } else {
      return false
    }
  })
}

function updateCourse() {
  courseApi
    .updateCourse(course)
    .then((response) => {
      fetchCourseData()
      addOrUpdateDialogVisible.value = false
      ElMessage({
        type: response.code === 800 ? "error" : "success",
        message: response.msg
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

function addCourse() {
  courseApi
    .addCourse(course)
    .then((response) => {
      fetchCourseData(1)
      addOrUpdateDialogVisible.value = false
      ElMessage({
        type: response.code === 800 ? "error" : "success",
        message: response.msg
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// 复选框发生变化执行方法
function handleSelectionChange(selection: Array<Course>) {
  selectValue = selection
}

// 批量删除
function handleDeleteByIds() {
  if (selectValue.length === 0) {
    ElMessage({
      type: "warning",
      message: "请至少选择一项"
    })
    return
  }
  ElMessageBox.confirm(`确认删除所选课程吗？此操作不可逆！`, "警告", {
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    center: true
  })
    .then(() => {
      const ids: Array<string> = []
      selectValue.forEach((item) => {
        ids.push(item.id)
      })
      courseApi
        .deleteBatchByIds(ids)
        .then((response) => {
          fetchCourseData()
          ElMessage({
            type: response.code === 800 ? "error" : "success",
            message: response.msg
          })
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch((error) => {
    })
}

function resetSearchCourse() {
  searchCourse.courseName = ""
  searchCourse.description = ""
  searchCourse.creatorName = ""
  searchCourse.modifierName = ""
}

function resetCourse() {
  course.id = ""
  course.courseName = ""
  course.description = ""
  course.groupMaxMemberSize = null
}

fetchCourseData()
</script>

<style scoped></style>
