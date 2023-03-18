<template>
  <div class="app-container">
    <div class="title">批次管理</div>
    <el-row>
      <div class="search-div">
        <el-form label-width="70px" size="medium">
          <el-row
            :gutter="20"
          >
            <el-col
              :md="11"
              :lg="6"
              :xl="5"
            >
              <el-form-item label="批次名称">
                <el-input v-model="searchBatch.batchName" style="width: 100%" placeholder="请输入批次名称(选填)" />
              </el-form-item>
            </el-col>
            <el-col
              :md="{ span: 11, offset: 1 }"
              :lg="{span: 6, pull: 1}"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="批次描述">
                <el-input v-model="searchBatch.description" style="width: 100%" placeholder="请输入批次描述(选填)" />
              </el-form-item>
            </el-col>

            <el-col
              :md="11"
              :lg="{ span: 6, pull: 1 }"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="创建人">
                <el-input v-model="searchBatch.creatorName" style="width: 100%" placeholder="请输入批次创建者(选填)" />
              </el-form-item>
            </el-col>
          </el-row>

          <!--          <el-row>-->

          <!--            <el-col :span="6">-->
          <!--              <el-form-item label="修改人">-->
          <!--                <el-input v-model="searchBatch.modifierName" style="width: 100%" placeholder="请输入批次修改者(选填)"/>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->

          <el-row style="display:flex">
            <el-button type="primary" icon="el-icon-search" size="small" @click="fetchBatchData()">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetData">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </el-row>
    <el-row>
      <div class="tools-div" style="margin-top: 10px; padding-bottom: 0">
        <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd()">添加批次</el-button>
        <!--        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeleteByIds()">批量删除</el-button>-->
        <el-form label-width="70px" inline size="medium" style="margin: 10px 0 -10px 0">
          <el-row>
            <el-col>
              <el-form-item label="所属课程">
                <el-select
                  v-model="searchBatch.belongCourseId"
                  filterable
                  placeholder="请选择所属课程(必选)"
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
        style="margin-top: 0px"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection"/> -->
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
          :width="flexColumnWidth(batchList, '所属课程', 'belongCourseName')"
        />
        <el-table-column label="可用状态" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.isEnd === 0"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="switchStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="创建人"
          align="center"
        />
        <el-table-column
          prop="modifierName"
          label="修改人"
          align="center"
        />
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
          label="截至时间"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.endTime === "1970-01-01 00:00:00" ? '永不截止' : scope.row.endTime }}
          </template>
        </el-table-column>
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
            <!--            <el-button-->
            <!--              size="small"-->
            <!--              icon="el-icon-delete"-->
            <!--              type="danger"-->
            <!--              @click="handleEnd(scope.row)"-->
            <!--            >停用-->
            <!--            </el-button>-->
            <el-button
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
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
        @current-change="fetchBatchData"
      />
    </el-row>

    <el-dialog title="添加/修改" @close="dialogClose()" :visible.sync="addOrUpdateDialogVisible" width="450px" center>
      <el-form ref="batchForm" :rules="batchRules" :model="batch" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="批次名称:" prop="batchName">
          <el-input v-model.trim="batch.batchName" />
        </el-form-item>

        <el-form-item label="批次描述:" prop="description">
          <el-input v-model.trim="batch.description" />
        </el-form-item>

        <el-form-item label="所属课程:" prop="belongCourseId">
          <el-select
            v-model.trim="batch.belongCourseId"
            filterable
            placeholder="请选择所属课程(必选)"
            style="width: 100%"
            size="medium"
          >
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.courseName"
              :value="course.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间:" prop="endTime">
          <el-date-picker
            v-model="batch.endTime"
            type="datetime"
            placeholder="选择截止时间"
            style="width: 100%"
            size="medium"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            popper-class="no-atTheMoment"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from '@/api/course'
import batchApi from '@/api/batch'
import { flexColumnWidthFN } from '@/mixins/flexColumnWidth'

export default {
  name: 'Batch',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      // 批次表单验证规则
      batchRules: {
        batchName: [
          { required: true, message: '请输入批次名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入批次描述', trigger: 'blur' }
        ],
        belongCourseId: [
          { required: true, message: '请选择所属课程', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '明天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '后天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }, // 日期选择器配置
      pageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 分页信息
      searchBatch: {
        belongCourseId: '', // 所属课程中被选中课程的id
        batchName: '', // 批次名称
        description: '', // 批次描述
        creatorName: '', // 创建者
        modifierName: '' // 修改者
      }, // 搜索条件
      batch: {
        id: '', // 批次id
        batchName: '', // 批次名称
        description: '', // 批次描述
        belongCourseId: '', // 所属课程id
        endTime: '' // 截止时间
      }, // 批次信息
      batchList: [], // 批次信息列表
      courseList: [], // 课程列表
      addOrUpdateDialogVisible: false // 添加/修改对话框是否显示
    }
  },
  created() {
    // 获取课程列表，所属课程下拉框数据
    this.getCourseList()
  },
  methods: {
    // 添加/修改对话框关闭时触发，重置表单，重置检验效果
    dialogClose() {
      this.$refs.batchForm.resetFields()
    },
    changeSelectForm() {

    },
    // 所属课程下拉菜单所选项改变时触发
    changeSelect(courseId) {
      this.searchBatch.selectedCourseId = courseId
      this.fetchBatchData(1)
    },
    // 获取所有课程列表，只获取启用的课程
    getCourseList() {
      courseApi.getCourseListOnlyEnabled().then(response => {
        this.courseList = response.data
      })
    },
    handleSelectionChange() {
    },
    // 拉取批次数据，分页查询
    fetchBatchData(page) {
      if (this.searchBatch.belongCourseId === '') {
        this.$message.warning('请先选择所属课程')
        return
      }
      if (page) {
        this.pageInfo.page = page
      }
      batchApi.getBatchListPage(this.searchBatch, this.pageInfo.page, this.pageInfo.pageSize).then(response => {
        if (response.code === 800) {
          this.$message.error(response.msg)
          // 清空课程选择框
          this.searchBatch.belongCourseId = ''
          // 重新获取课程列表
          this.getCourseList()
          // 清空批次列表
          this.batchList = []
          return
        }
        const { data } = response
        this.pageInfo.total = data.total
        this.pageInfo.page = data.current
        this.batchList = data.records
      })
    },
    resetData() {
      this.resetSearchBatch()
      this.fetchBatchData(1)
    },
    handleAdd() {
      // 打开添加对话框时，重新拉取课程列表
      this.getCourseList()
      this.addOrUpdateDialogVisible = true
    },
    // 点击修改按钮，弹出修改对话框，回显数据
    handleEdit(batchId) {
      batchApi.getBatchById(batchId).then(response => {
        const { data } = response
        this.batch.id = data.id
        this.batch.batchName = data.batchName
        this.batch.description = data.description
        this.batch.belongCourseId = data.belongCourseId
        // 如果获取到的时是格林威治时间，则不进行赋值
        this.batch.endTime = data.endTime === '1970-01-01 00:00:00' ? '' : data.endTime
        this.addOrUpdateDialogVisible = true
      })
    },
    saveOrUpdate() {
      this.$refs.batchForm.validate((valid) => {
        if (valid) {
          if (this.batch.id) {
            this.updateBatch()
          } else {
            this.addBatch()
          }
        } else {
          return false
        }
      })
    },
    addBatch() {
      batchApi.addBatch(this.batch).then(response => {
        // 添加批次成功后，如果所属课程下拉框有选中的课程，则重新拉取批次列表
        if (this.searchBatch.belongCourseId !== '') {
          this.fetchBatchData(1)
        }
        this.addOrUpdateDialogVisible = false
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
      }).catch(() => {
      })
    },
    updateBatch() {
      batchApi.updateBatch(this.batch).then(response => {
        this.fetchBatchData(1)
        this.addOrUpdateDialogVisible = false
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
      }).catch(() => {})
    },
    handleDelete(row) {
      this.$confirm(`确认删除 <${row.batchName}> 批次吗？此操作不可逆！`, '警告', {
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        batchApi.deleteByBatchId(row.id).then(response => {
          this.fetchBatchData()
          this.$message({
            type: response.code === 800 ? 'error' : 'success',
            message: response.msg
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    switchStatus(row) {
      const isEnd = row.isEnd === 1 ? 0 : 1
      batchApi.updateStatus(row.id, isEnd).then(response => {
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
        this.fetchBatchData()
      }).catch(error => {
        console.log(error)
      })
    },
    refreshCourseAndBatch() {
      this.getCourseList()
      if (this.searchBatch.belongCourseId !== '') {
        this.fetchBatchData(1)
      }
    },
    // 重置batch对象，清空所有属性中的值
    resetBatch() {
      this.batch.id = ''
      this.batch.batchName = ''
      this.batch.description = ''
      this.batch.belongCourseId = ''
      this.batch.endTime = ''
    },
    resetSearchBatch() {
      this.searchBatch.batchName = ''
      this.searchBatch.description = ''
      this.searchBatch.creatorName = ''
      this.searchBatch.modifierName = ''
    }
  }
}
</script>

<style lang="scss">
// 隐藏日期时间选择器的此刻按钮
.el-picker-panel.no-atTheMoment {
  .el-button--text.el-picker-panel__link-btn {
    display: none;
  }
}
</style>
