<template>
  <div class="app-container">
    <div class="title">群组作业</div>
    <!-- 选择课程-->
    <el-row>
      <div class="tools-div" style="margin-bottom: 10px">
        <el-form label-width="70px" inline style="margin: 10px 0 -15px 0">
          <el-row>
            <el-col>
              <el-form-item label="选择课程">
                <el-select
                  v-model="searchBatch.belongCourseId"
                  filterable
                  placeholder="请选择一个课程(必选)"
                  style="width: 200px"
                  @change="changeSelect"
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
                <el-button type="primary" icon="Refresh" @click="refreshCourseAndBatch()">刷新</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row>
      <el-table :data="batchList" stripe border style="margin-top: 0">
        <el-table-column label="序号" width="60" align="center">
          <template v-slot="scope">
            {{ (pageInfo.page - 1) * pageInfo.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="batchName"
          label="批次名称"
          align="center"
          :width="flexColumnWidth(batchList, '批次名称', 'batchName')"
        />
        <el-table-column
          prop="description"
          label="批次描述"
          align="center"
          :width="flexColumnWidth(batchList, '批次描述', 'description')"
        />
        <el-table-column prop="belongCourseName" label="所属课程" align="center"/>

        <el-table-column label="截至时间" align="center">
          <template v-slot="scope">
            {{ scope.row.endTime === "1970-01-01 00:00:00" ? "永不截止" : scope.row.endTime }}
          </template>
        </el-table-column>

        <el-table-column prop="tag" label="截至状态" width="80" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.isEnd === 0 ? 'success' : 'danger'" disable-transitions>
              {{ scope.row.isEnd === 0 ? "未截止" : "已截止" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="tag" label="提交状态" width="80" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.isCommit === 0 ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.isCommit === 0 ? "未提交" : "已提交" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="260">
          <!-- isEnd为1时禁用，为0时可用 -->
          <template v-slot="scope">
            <el-button
              v-if="scope.row.isCommit === 0"
              type="primary"
              icon="Upload"
              :disabled="scope.row.isEnd === 1 || scope.row.isCommit === 1"
              @click="handleSubmit(scope.row.id)"
            >我要提交
            </el-button>

            <el-button
              v-if="scope.row.isCommit === 1"
              icon="Delete"
              type="danger"
              :disabled="scope.row.isEnd === 1 || scope.row.isCommit === 0"
              @click="handleCancelCommit(scope.row.id)"
            >取消提交
            </el-button>

            <el-button
              icon="Download"
              type="primary"
              :disabled="scope.row.isCommit === 0"
              @click="handleDownloadSelf(scope.row.id)"
            >下载文件
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
        style="padding: 30px 0; text-align: center"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchBatchData"
      />
    </el-row>

    <!-- 上传作业 -->
    <el-dialog title="上传作业" v-model="uploadDialogVisible" width="450px" style="text-align: center">
      <el-upload
        drag
        center
        :show-file-list="false"
        :data="commitParameters"
        :http-request="handleCommit"
        :auto-upload="true"
        action=""
        :disabled="uploadAvailable"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip" style="font-size: 15px">上传的文件不得超过50MB！</div>
        </template>
      </el-upload>
    </el-dialog>

    <el-dialog
      title="正在上传，请稍后..."
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="percentageDialogVisible"
      width="300px"
      style="height: 100px"
      center
    >
      <!-- 上传进度条 -->
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="percentage"
        status="success"
        style="margin: 5px;"
      />
    </el-dialog>

    <el-dialog
      title="正在下载，请稍后..."
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="downloadPercentageDialogVisible"
      width="220px"
      center
    >
      <!-- 下载环形进度条 -->
      <el-progress type="circle" :percentage="percentage" style="margin: -20px 0 0 20px"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from "vue"
import taskApi from "@/api/task"
import courseApi from "@/api/course"
import batchApi from "@/api/batch"
import {flexColumnWidth} from "@/hooks/useFlexColumnWidth"
import {Course} from "@/api/course/type/course"
import {Batch, SearchBatch} from "@/api/batch/types/batch"
import {ElLoading, ElMessage, ElMessageBox} from "element-plus"
import {UploadFilled} from "@element-plus/icons-vue";
import {AxiosResponse} from "axios";

const percentage = ref(0) // 上传进度值
const pageInfo = reactive({
  pageSize: 10, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
}) // 分页信息

const searchBatch = reactive<SearchBatch>({
  belongCourseId: "",
  batchName: "", // 批次名称
  batchType: "group", // 批次类型
  description: "", // 批次描述
  isCommit: "", // 查看已提交或未提交
  isEnd: "" // 查看已截止或未截止
})
const courseList = reactive<Array<Course>>([])
let batchList = reactive<Array<Batch>>([])
const uploadDialogVisible = ref<boolean>(false) // 上传作业弹窗
const percentageDialogVisible = ref<boolean>(false) // 上传作业弹窗
const downloadPercentageDialogVisible = ref<boolean>(false) // 上传作业弹窗
const notCommitDialogVisible = ref<boolean>(false) // 上传作业弹窗
const uploadAvailable = ref<boolean>(false) // 选择文件控件，是否能选择文件
// 提交作业时的附带参数
const commitParameters = reactive<{
  belongBatchId: string
  fileSha256: string
}>({
  belongBatchId: "",
  fileSha256: ""
})

onMounted(() => {
  getCourseListOnlyEnabled()
})

function handleDownloadSelf(batchId: string) {
  downloadPercentageDialogVisible.value = true
  taskApi.downloadSelfTaskFile(batchId, percentage, downloadPercentageDialogVisible).then((response) => {
    // 检查下载文件时是否有后端传来的异常信息
    if (response.headers["exception"]) {
      const msg = decodeURIComponent(response.headers["exception"])
      // 关闭未交人员弹窗
      notCommitDialogVisible.value = false
      // 刷新批次列表
      refreshCourseAndBatch()
      ElMessage.error(msg)
      return
    }
    // 下载文件
    handleDownload(response)
  })
}

// 处理下载逻辑，传入response对象
function handleDownload(response: AxiosResponse) {
  // 由于后台返回文件名称是通过response返回的
  // 因此需要从response headers中content-disposition响应头中获取文件名称fileName
  let fileName = response.headers["content-disposition"]
  fileName = fileName.split("=")[1]
  const url = window.URL.createObjectURL(
    new Blob([response.data], {
      type: "application/octet-stream;charset=UTF-8"
    })
  )
  const link = document.createElement("a")
  link.style.display = "none"
  link.href = url
  // decodeURIComponent解决文件名的url转码问题
  link.setAttribute("download", decodeURIComponent(fileName))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  percentage.value = 0 // 重置环形进度条百分比为0
}

// 取消提交作业
function handleCancelCommit(batchId: string) {
  ElMessageBox.confirm(`确认要取消提交吗？此操作不可逆！`, "警告", {
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "确认",
    cancelButtonText: "返回",
    center: true
  })
    .then(() => {
      taskApi.cancelCommitTask(batchId).then((response) => {
        ElMessage({
          type: response.code === 800 ? "error" : "success",
          message: response.msg
        })
        fetchBatchData()
      })
    })
    .catch(() => {
    })
}

// 获取课程列表，只获取已启用的课程
function getCourseListOnlyEnabled() {
  courseApi.getCourseListOnlyEnabled().then((response) => {
    courseList.splice(0, courseList.length, ...response.data)
  })
}

function fetchBatchData(page: number = 0) {
  if (page) {
    pageInfo.page = page
  }
  batchApi.getBatchListIsCommit(searchBatch, pageInfo.page, pageInfo.pageSize).then((response) => {
    if (response.code === 800) {
      ElMessage.error(response.msg)
      // 重新加载课程数据
      getCourseListOnlyEnabled()
      // 重置课程选择框
      searchBatch.belongCourseId = ""
      // 重置批次列表
      batchList = reactive<Array<Batch>>([])
      return
    }
    const {data} = response
    batchList.splice(0, batchList.length, ...data.records)
    pageInfo.total = data.total
    pageInfo.page = data.current
  })
}

function changeSelect() {
  fetchBatchData()
}

function handleSubmit(batchId: string) {
  uploadDialogVisible.value = true
  commitParameters.belongBatchId = batchId
}

// 提交作业文件
async function handleCommit({file}: { file: File }) {
  if(!file.type) {
    ElMessage.error("只能选择文件")
    return
  }
  // 判断文件大小
  if (file.size > 50 * 1024 * 1024) {
    ElMessage({
      type: "error",
      message: "作业文件不得超过50MB，请重新选择"
    })
    return
  }

  // 获取用户在选择的课程所加的群组id，作为提交者id


  // 计算文件的sha256值
  const loading = ElLoading.service({
    target: ".el-upload",
    lock: true,
    text: "正在计算Sha256，速度取决于文件大小...",
    background: "rgba(0, 0, 0, 0.8)"
  })
  // sha256计算过程中禁用文件选择
  uploadAvailable.value = true
  // 使用Web Worker在其他线程计算sha256，防止阻塞主线程，导致网页卡顿
  const worker = new Worker(new URL("@/workerScript/calcSha256.ts", import.meta.url), {type: "module"})
  worker.postMessage(file)
  worker.onmessage = async (e) => {
    commitParameters.fileSha256 = e.data
    worker.terminate() // 关闭worker
    loading.close() // 关闭计算sha256的loading效果

    const fileSuffix = file.name.substring(file.name.lastIndexOf("."))
    const response = await taskApi.checkFileExist(commitParameters.fileSha256, fileSuffix)
    /*
     * TODO 判断文件是否存在，判断是否使用秒传
     *  文件不存在则直接上传，文件存在则使用秒传
     *
     * @Author DengChao
     * @Date 2023/11/8 16:07
     */
    if (response.data) {
      // 文件存在，使用秒传
      uploadDialogVisible.value = false
      // sha256计算结束后，关闭文件选择窗口后，解除禁用
      uploadAvailable.value = false
      percentageDialogVisible.value = true
      const formData = new FormData()
      formData.append("belongBatchId", commitParameters.belongBatchId)
      formData.append("fileSha256", commitParameters.fileSha256)
      formData.append("fileType", fileSuffix)
      formData.append("taskType", "group")
      // 获取文件后缀名
      taskApi.secondTransmit(formData).then((response) => {
        percentage.value = 100
        // 关闭上传进度弹窗
        percentageDialogVisible.value = false
        ElMessage({
          type: response.code === 800 ? "error" : "success",
          message: response.msg
        })
        fetchBatchData()
      })
      // 重置上传进度值
      percentage.value = 0
    } else {
      uploadDialogVisible.value = false // 关闭文件选择弹窗，用户选择文件后，已经开始上传阶段，就可以关闭文件选择弹窗了
      // sha256计算结束后，关闭文件选择窗口后，解除禁用
      uploadAvailable.value = false
      percentageDialogVisible.value = true // 打开上传进度弹窗，在上传过程中，用户可以看到上传的进度
      const formData: FormData = new FormData()
      formData.append("taskFile", file)
      formData.append("belongBatchId", commitParameters.belongBatchId)
      formData.append("fileSha256", commitParameters.fileSha256)
      formData.append("taskType", "group")
      taskApi
        .commitTask(formData, percentage, percentageDialogVisible)
        .then((response) => {
          // 判断是否有后端传回的错误信息
          if (response.code === 800) {
            // 如果上传文件时有错误，就关闭上传进度弹窗
            percentageDialogVisible.value = false
            ElMessage({
              type: "error",
              message: response.msg
            })
          } else {
            ElMessage({
              type: "success",
              message: response.msg
            })
          }
          // 重置上传进度值
          percentage.value = 0
          fetchBatchData()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}

// 重新加载课程和批次数据
function refreshCourseAndBatch() {
  getCourseListOnlyEnabled()
  if (searchBatch.belongCourseId !== "") {
    fetchBatchData()
  }
}
</script>
<style scoped></style>
