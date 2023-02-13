<template>
  <div class="app-container">
    <div class="title">提交作业</div>
    <!-- 选择课程-->
    <el-row>
      <div class="tools-div" style="margin-bottom: 10px">
        <el-form label-width="70px" inline size="medium" style="margin: 10px 0 -15px 0">
          <el-row>
            <el-col
            >
              <el-form-item label="选择课程">
                <el-select
                  v-model="searchBatch.belongCourseId"
                  filterable
                  placeholder="请先选择一个课程(必选)"
                  style="width: 100%"
                  size="medium"
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
                <el-button type="primary" icon="el-icon-refresh" size="small" @click="refreshCourseAndBatch()">刷新
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row>
      <el-table
        :data="batchList"
        stripe
        border
        style="margin-top: 0"
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
        <el-table-column
          prop="belongCourseName"
          label="所属课程"
          align="center"
        />

        <el-table-column
          label="截至时间"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.endTime === '1970-01-01 00:00:00' ? '永不截止' : scope.row.endTime }}
          </template>
        </el-table-column>

        <el-table-column
          prop="tag"
          label="截至状态"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isEnd === 0 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ scope.row.isEnd === 0 ? '未截止' : '已截止' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="tag"
          label="提交状态"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isCommit === 0 ? 'danger' : 'success'"
              disable-transitions
            >

              {{ scope.row.isCommit === 0 ? '未提交' : '已提交' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="120"
        >
          <!-- isEnd为1时禁用，为0时可用 -->
          <template v-slot="scope">
            <el-button
              type="primary"
              v-if="scope.row.isCommit === 0"
              size="small"
              icon="el-icon-upload2"
              :disabled="scope.row.isEnd === 1 || scope.row.isCommit === 1"
              @click="handleSubmit(scope.row.id)"
            >我要提交
            </el-button>

            <el-button
              v-if="scope.row.isCommit === 1"
              size="small"
              icon="el-icon-delete"
              type="danger"
              :disabled="scope.row.isEnd === 1 || scope.row.isCommit === 0"
              @click="handleCancelCommit(scope.row.id)"
            >取消提交
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
        @current-change="fetchBatchData"
      />
    </el-row>

    <!-- 上传作业 -->
    <el-dialog
      title="上传作业"
      :visible.sync="updateDialogVisible"
      width="450px"
      style="text-align: center"
    >
      <el-upload
        class="upload-demo"
        drag
        center
        :show-file-list="false"
        :data="commitParameters"
        :on-success="onCommitSuccess"
        :http-request="handleCommit"
        :auto-upload="true"
        action=""
      >
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip" style="font-size: 15px">上传的文件不得超过20MB！</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import taskApi from '@/api/task'
import courseApi from '@/api/course'
import batchApi from '@/api/batch'
import {flexColumnWidthFN} from '@/mixins/flexColumnWidth'

export default {
  name: 'CommitTask',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      pageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 分页信息
      searchBatch: {
        belongCourseId: '',
        batchName: '', // 批次名称
        description: '', // 批次描述
        isCommit: '', // 查看已提交或未提交
        isEnd: '' // 查看已截止或未截止
      },
      courseList: [],
      batchList: [],
      updateDialogVisible: false, // 上传作业弹窗
      commitParameters: {
        belongBatchId: ''
      } // 提交作业时的附带参数
    }
  },
  created() {
    this.getCourseListOnlyEnabled()
  },
  methods: {
    handleCancelCommit(batchId) {
      this.$confirm(`确认要取消提交吗？此操作不可逆！`, '警告', {
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '返回',
        center: true
      }).then(() => {
        taskApi.cancelCommitTask(batchId).then(response => {
          this.$message({
            type: response.code === 800 ? 'error' : 'success',
            message: response.msg
          })
          this.fetchBatchData()
        })
      })
        .catch(() => {
        })
    },
    getCourseListOnlyEnabled() {
      courseApi.getCourseListOnlyEnabled().then(response => {
        this.courseList = response.data
      })
    },
    changeSelect() {
      this.fetchBatchData()
    },
    fetchBatchData(page) {
      if (page) {
        this.pageInfo.page = page
      }
      batchApi.getBatchListIsCommit(this.searchBatch, this.pageInfo.page, this.pageInfo.pageSize).then(response => {
        if (response.code === 800) {
          this.$message.error(response.msg)
          // 重新加载课程数据
          this.getCourseListOnlyEnabled()
          // 重置课程选择框
          this.searchBatch.belongCourseId = ''
          // 重置批次列表
          this.batchList = []
          return
        }
        const { data } = response
        this.pageInfo.total = data.total
        this.pageInfo.page = data.current
        this.batchList = data.records
      })
    },
    handleSubmit(batchId) {
      this.updateDialogVisible = true
      this.commitParameters.belongBatchId = batchId
    },
    // beforeCommit(commitFile) {
    //   const doNetLocation = commitFile.name.lastIndexOf('.') // ‘.’最后一次出现的位置
    //   const fileName = commitFile.name.substring(0, doNetLocation) // ’.‘之前的所有字符，即为文件名
    //   const fileNameReg = /^\d{4}D\d{7}\s[\u4e00-\u9fa5]{2,5}/g // 【学号 姓名】的正则表达式
    //   if (!fileNameReg.test(fileName)) {
    //     console.log('文件名不符合条件')
    //     return false
    //   }
    // },
    handleCommit({file}) {
      const formData = new FormData()
      formData.append('taskFile', file)
      formData.append('belongBatchId', this.commitParameters.belongBatchId)
      taskApi.commitTask(formData, this.commitParameters).then(response => {
        this.fetchBatchData()
        this.updateDialogVisible = false
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
      }).catch(error => {
        console.log(error)
      })
    },
    onCommitSuccess(response, file, fileList) {
      console.log('onCommitSuccess')
    },
    // 重新加载课程和批次数据
    refreshCourseAndBatch() {
      this.getCourseListOnlyEnabled()
      if (this.searchBatch.belongCourseId !== '') {
        this.fetchBatchData()
      }
    }
  }

}
</script>

<style scoped>

</style>
