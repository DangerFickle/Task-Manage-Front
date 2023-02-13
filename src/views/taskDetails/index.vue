<template>
  <div class="app-container">
    <div class="title">提交详情</div>

    <!-- 选择课程表单 -->
    <el-row>
      <div class="tools-div">
        <el-form label-width="70px" size="medium" style="margin: 10px 0 -15px 0" inline>
          <el-row>
            <el-col>
              <el-form-item label="所属课程">
                <el-select
                  v-model="searchBatch.belongCourseId"
                  filterable
                  placeholder="请选择所属课程(必选)"
                  style="width: 100%"
                  size="medium"
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
                <el-button type="primary" icon="el-icon-refresh" size="small" @click="refreshCourseAndBatch()">刷新</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <!-- 批次表格 -->
    <el-row style="margin-top: 10px">
      <el-table
        :data="batchList"
        stripe
        border
        style="margin-top: 0"
      >
        <!-- 序号 -->
        <el-table-column
          label="序号"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            {{ (batchPageInfo.page - 1) * batchPageInfo.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 批次名称 -->
        <el-table-column
          prop="batchName"
          label="批次名称"
          align="center"
          :width="flexColumnWidth(batchList, '批次名称', 'batchName')"
        />
        <!-- 批次描述 -->
        <el-table-column
          prop="description"
          label="批次描述"
          align="center"
          :width="flexColumnWidth(batchList, '批次描述', 'description')"
        />

        <!-- 所属课程 -->
        <el-table-column
          prop="belongCourseName"
          label="所属课程"
          align="center"
        />
        <!-- 截至时间 -->
        <el-table-column
          label="截至时间"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.endTime === '1970-01-01 00:00:00' ? '永不截止' : scope.row.endTime }}
          </template>
        </el-table-column>

        <!-- 截至状态 -->
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

        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="350"
        >
          <!-- isEnd为1时禁用，为0时可用 -->
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              :disabled="false"
              @click="handleDownloadFiles(scope.row.id)"
            >一键下载
            </el-button>

            <el-button
              size="small"
              icon="el-icon-info"
              type="primary"
              :disabled="false"
              @click="handleQueryTaskDetails(scope.row.id)"
            >查看详情
            </el-button>

            <el-button
              size="small"
              icon="el-icon-view"
              type="primary"
              :disabled="false"
              @click="handleQueryNoCommit(scope.row.id)"
            >查看未交
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 批次详情表格分页插件 -->
      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="batchPageInfo.page"
          :total="batchPageInfo.total"
          :page-size="batchPageInfo.pageSize"
          style="padding: 30px 0; text-align: center;"
          layout="total, prev, pager, next, jumper"
          @current-change="fetchBatchByCourseId"
        />
      </el-row>
    </el-row>

    <!-- 作业提交情况弹窗 -->
    <el-dialog title="作业提交情况" :visible.sync="taskDetailsDialogVisible" width="70%" center>
      <el-row>
        <div class="search-div">
          <el-form label-width="70px" size="medium" style="margin: 10px 0 -15px 0" inline>
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="searchTaskDetails.studentName"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="fetchTaskDetailsByBatchId()">搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>

      <el-row>
        <el-table
          :data="taskDetailsList"
          stripe
          border
          style="margin-top: 10px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"/>
          <!-- 序号 -->
          <el-table-column
            label="序号"
            width="50"
            align="center"
          >
            <template slot-scope="scope">
              {{ (taskDetailsPageInfo.page - 1) * taskDetailsPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column
            prop="studentName"
            label="学生姓名"
            align="center"
          />
          <!-- 学号 -->
          <el-table-column
            prop="studentNumber"
            label="学号"
            align="center"
          />
          <!-- 所属课程 -->
          <el-table-column
            prop="belongCourseName"
            label="所属课程"
            align="center"
          />
          <!-- 所属批次 -->
          <el-table-column
            prop="belongBatchName"
            label="所属批次"
            align="center"
          />
          <!-- 提交时间 -->
          <el-table-column
            prop="createTime"
            label="提交时间"
            align="center"
          />

          <!-- 操作 -->
          <el-table-column
            label="操作"
            align="center"
            width="120"
          >
            <template v-slot="scope">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-download"
                :disabled="scope.row.isEnd === 0"
                @click="handleDownloadFile(scope.row.taskId)"
              >下载文件
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 作业详情表格分页插件 -->
      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="taskDetailsPageInfo.page"
          :total="taskDetailsPageInfo.total"
          :page-size="taskDetailsPageInfo.pageSize"
          style="padding: 30px 0; text-align: center;"
          layout="total, prev, pager, next, jumper"
          @current-change="fetchTaskDetailsByBatchId"
        />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 处理表格的列对内容自适应
import {flexColumnWidthFN} from '@/mixins/flexColumnWidth'
import courseApi from '@/api/course'
import batchApi from '@/api/batch'
import taskApi from '@/api/task'
import taskDetailsApi from '@/api/taskDetails'

export default {
  name: 'TaskDetails',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      batchPageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 批次列表的分页信息
      taskDetailsPageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 作业详情的分页信息
      searchBatch: {
        belongCourseId: ''
      },
      searchTaskDetails: {
        studentName: '',
        belongBatchId: ''
      },
      taskDetailsDialogVisible: false, // 作业详情对话框是否可见
      taskDetailsList: [],
      courseList: [],
      batchList: []
    }
  },
  created() {
    // 获取课程列表
    this.getCourseList()
  },
  methods: {
    // 根据批次id批量下载
    handleDownloadFiles(batchId) {
      taskApi.downloadTaskFiles(batchId).then(response => {
        if (response.code === 800) {
          this.$message.error(response.msg)
          // 刷新课程详情数据列表
          this.refreshCourseAndBatch()
        }
      })
    },
    handleSelectionChange() {

    },
    // 下载单个文件
    handleDownloadFile(taskId) {
      taskApi.downloadTaskFile(taskId).then(response => {
        if (response.code === 800) {
          this.$message.error(response.msg)
          // 刷新课程详情数据列表
          this.fetchTaskDetailsByBatchId()
          return
        }

      })
    },
    // 获取课程列表，只获取已启用的课程
    getCourseList() {
      courseApi.getCourseListOnlyEnabled().then(response => {
        this.courseList = response.data
      })
    },
    // 根据所属课程id获取批次列表
    fetchBatchByCourseId(batchPage) {
      if (batchPage) {
        this.batchPageInfo.page = batchPage
      }
      batchApi.getBatchListIsCommit(this.searchBatch, this.batchPageInfo.page, this.batchPageInfo.pageSize).then(response => {
        if (response.code === 800) {
          this.$message.error(response.msg)
          // 刷新课程列表数据
          this.getCourseList()
          // 重置所属课程id
          this.searchBatch.belongCourseId = ''
          // 重置批次列表
          this.batchList = []
          return
        }
        const { data } = response
        this.batchPageInfo.total = data.total
        this.batchPageInfo.page = data.current
        this.batchList = data.records
      })
    },
    // 根据批次id获取作业详情列表
    fetchTaskDetailsByBatchId(taskDetailsPage) {
      if (taskDetailsPage) {
        this.taskDetailsPageInfo.page = taskDetailsPage
      }
      // 获取批次下的作业详情列表
      taskDetailsApi.getDetailsByBatchId(this.searchTaskDetails, this.taskDetailsPageInfo.page, this.taskDetailsPageInfo.pageSize).then(response => {
        if (response.code === 800) {
          this.$message.error(response.msg)
          // 刷新批次列表数据
          this.fetchBatchByCourseId()
          return
        }
        const { data } = response
        console.log(data)
        this.taskDetailsPageInfo.total = data.total
        this.taskDetailsPageInfo.page = data.current
        this.taskDetailsList = data.records
        this.taskDetailsDialogVisible = true
      })
    },
    // 点击查看详情按钮后弹出作业详情对话框，显示出表单
    handleQueryTaskDetails(batchId) {
      // 将要查询的批次id赋值给作业详情查询对象的属性中
      this.searchTaskDetails.belongBatchId = batchId
      // 获取批次下的作业详情列表
      this.fetchTaskDetailsByBatchId(1)
    },
    // 当选择了课程之后，获取对应课程的批次列表
    changeCourseSelect() {
      this.fetchBatchByCourseId()
    },
    // 刷新课程列表以及批次列表
    refreshCourseAndBatch() {
      this.getCourseList()
      if (this.searchBatch.belongCourseId !== '') {
        this.fetchBatchByCourseId()
      }
    }
  }
}
</script>

<style scoped>

</style>
