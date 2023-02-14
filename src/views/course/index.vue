<template>
  <div class="app-container">
    <div class="title">课程管理</div>
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
              <el-form-item label="课程名称">
                <el-input
                  v-model.trim="searchCourse.courseName"
                  style="width: 100%"
                  placeholder="请输入课程名称(选填)"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="{ span: 11, offset: 1 }"
              :lg="{span: 6, pull: 1}"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="课程描述">
                <el-input
                  v-model.trim="searchCourse.description"
                  style="width: 100%"
                  placeholder="请输入课程描述(选填)"
                />
              </el-form-item>
            </el-col>

            <el-col
              :md="11"
              :lg="{ span: 6, pull: 1 }"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="创建人">
                <el-input
                  v-model.trim="searchCourse.creatorName"
                  style="width: 100%"
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

          <el-row style="display:flex">
            <el-button type="primary" icon="el-icon-search" size="small" @click="fetchCourseData()">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetData">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-row>
      <div class="tools-div" style="margin-top: 10px">
        <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd()">添 加</el-button>
        <!--        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeleteByIds()">批量删除</el-button>-->
      </div>
    </el-row>

    <el-row>
      <el-table
        :data="courseList"
        stripe
        border
        style="margin-top: 20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"/>
        <el-table-column
          label="序号"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
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
          label="状态"
          width="61"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status === 1"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="switchStatus(scope.row)"
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
          width="240"
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
        @current-change="fetchCourseData"
      />
    </el-row>

    <el-dialog title="添加/修改" @close="dialogClose()" :visible.sync="addOrUpdateDialogVisible" width="400px" center style="margin: 40px">
      <el-form ref="courseForm" :rules="courseRules" :model="course" label-width="100px" size="small"
               style="padding-right: 40px;">
        <el-form-item label="课程名称:" prop="courseName">
          <el-input v-model.trim="course.courseName"/>
        </el-form-item>
        <el-form-item label="课程描述:" prop="description">
          <el-input v-model.trim="course.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small"
                   @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import courseApi from '@/api/course'
import { flexColumnWidthFN } from '@/mixins/flexColumnWidth'

export default {
  name: 'Course',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      // 课程表单验证规则
      courseRules: {
        courseName: [
          { required: true, message: '请输入课程名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入课程描述', trigger: 'blur' }
        ]
      },
      pageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 分页信息
      searchCourse: {
        courseName: '', // 课程名称
        description: '', // 课程描述
        creatorName: '', // 创建者名字
        modifierName: '' // 修改者名字
      }, // 搜索条件
      courseList: [], // 课程列表
      addOrUpdateDialogVisible: false, // 添加/修改对话框是否显示
      course: {
        id: '', // 课程id
        courseName: '', // 课程名称
        description: '' // 课程描述
      }, // 课程信息
      selectValue: [] // 选择的要删除的项
    }
  },
  created() {
    // 调用列表方法
    this.fetchCourseData()
  },
  methods: {
    // 添加/修改对话框关闭时触发，重置表单，重置检验效果
    dialogClose() {
      this.$refs.courseForm.resetFields()
    },
    fetchCourseData(page) {
      if (page) {
        this.pageInfo.page = page
      }
      courseApi.getCourseListPage(this.searchCourse, this.pageInfo.page, this.pageInfo.pageSize).then(response => {
        const {data} = response
        this.pageInfo.total = data.total
        this.pageInfo.page = data.current
        this.courseList = data.records
      }).catch(error => {
        console.log(error)
      })
    },
    resetData() {
      this.resetSearchCourse()
      this.fetchCourseData(1)
    },
    handleEdit(id) {
      courseApi.getCourseById(id).then(response => {
        const {data} = response
        this.course.id = data.id
        this.course.courseName = data.courseName
        this.course.description = data.description
        this.addOrUpdateDialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    handleAdd() {
      this.addOrUpdateDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm(`确认删除 <${row.courseName}> 课程吗？此操作不可逆！`, '警告', {
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        courseApi.deleteCourseById(row.id).then(response => {
          this.fetchCourseData()
          this.$message({
            type: response.code === 800 ? 'error' : 'success',
            message: response.msg
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
      })
    },
    // 切换课程的可用性
    switchStatus(row) {
      const status = row.status === 1 ? 0 : 1
      courseApi.updateStatus(row.id, status).then(response => {
        this.fetchCourseData()
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存或更新课程信息
    saveOrUpdate() {
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          if (this.course.id) {
            this.updateCourse()
          } else {
            this.addCourse()
          }
        } else {
          return false
        }
      })
    },
    updateCourse() {
      courseApi.updateCourse(this.course).then(response => {
        this.fetchCourseData()
        this.addOrUpdateDialogVisible = false
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
        // this.resetCourse()
      }).catch(error => {
        console.log(error)
      })
    },
    addCourse() {
      courseApi.addCourse(this.course).then(response => {
        this.fetchCourseData(1)
        this.addOrUpdateDialogVisible = false
        this.$message({
          type: response.code === 800 ? 'error' : 'success',
          message: response.msg
        })
      }).catch(error => {
        console.log(error)
      })
    },
    // 复选框发生变化执行方法
    handleSelectionChange(selection) {
      this.selectValue = selection
    },
    // 批量删除
    handleDeleteByIds() {
      if (this.selectValue.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一项'
        })
        return
      }
      this.$confirm(`确认删除所选课程吗？此操作不可逆！`, '警告', {
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        const ids = []
        this.selectValue.forEach(item => {
          ids.push(item.id)
        })
        courseApi.deleteBatchByIds(ids).then(response => {
          this.fetchCourseData()
          this.$message({
            type: response.code === 800 ? 'error' : 'success',
            message: response.msg
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
      })
    },
    resetSearchCourse() {
      this.searchCourse.courseName = ''
      this.searchCourse.description = ''
      this.searchCourse.creatorName = ''
      this.searchCourse.modifierName = ''
    }
  }
}
</script>

<style scoped>

</style>
