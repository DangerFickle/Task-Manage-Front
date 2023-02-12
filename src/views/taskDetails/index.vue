<template>
  <div class="app-container">
    <div class="title">提交详情</div>

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
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="searchTaskDetails.studentName"
                style="width: 100%"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="small" @click="fetchCourseData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

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
              <el-form-item label="所属课程">
                <el-select
                  v-model="searchTaskDetails.belongCourseId"
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
            </el-col>
            <el-col
              :md="{ span: 11, offset: 1 }"
              :lg="{span: 6, pull: 1}"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="所属批次">
                <el-select
                  v-model="searchTaskDetails.belongBatchId"
                  filterable
                  placeholder="请选择所属批次(必选)"
                  style="width: 100%"
                  size="medium"
                  @change="changeBatchSelect"
                >
                  <el-option
                    v-for="batch in batchList"
                    :key="batch.id"
                    :label="batch.batchName"
                    :value="batch.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
    </el-row>

    <el-row>
      <div class="tools-div" style="margin-top: 10px">
        <el-button type="primary" icon="el-icon-download" size="small" @click="handleAdd()">批量下载</el-button>
        <el-button type="success" icon="el-icon-search" size="small" @click="handleAdd()">查询未交人员</el-button>

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
          prop="studentName"
          label="学生姓名"
          align="center"
        />
        <el-table-column
          prop="studentNum"
          label="学号"
          align="center"
        />
        <el-table-column
          prop="belongCourseName"
          label="所属课程"
          align="center"
        />
        <el-table-column
          prop="belongBatchName"
          label="所属批次"
          align="center"
        />

        <!--        <el-table-column label="状态" width="61">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-switch-->
        <!--              :value="scope.row.status === 1"-->
        <!--              @change="switchStatus(scope.row)"-->
        <!--            />-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column
          prop="createTime"
          label="提交时间"
          align="center"
        />
        <!--        <el-table-column-->
        <!--          prop="updateTime"-->
        <!--          label="修改时间"-->
        <!--          width="200"-->
        <!--        />-->
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
              @click="handleEdit(scope.row.id)"
            >下载文件
            </el-button>
            <!--            <el-button-->
            <!--              size="small"-->
            <!--              icon="el-icon-delete"-->
            <!--              type="danger"-->
            <!--              @click="handleDelete(scope.row)"-->
            <!--            >删除-->
            <!--            </el-button>-->
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
  </div>
</template>

<script>
import {flexColumnWidthFN} from '@/mixins/flexColumnWidth'
import courseApi from '@/api/course'
import batchApi from '@/api/batch'
export default {
  name: 'TaskDetails',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      pageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 分页信息
      searchTaskDetails: {
        studentName: '',
        belongCourseId: '',
        belongBatchId: ''
      },
      taskDetailsList: [
        {
          id: 1,
          studentName: '张三',
          studentNum: '2021D2280322',
          belongCourseName: '软件工程',
          belongBatchName: '张三',
          createTime: '2020-01-01 12:00:00',
        },
        {
          id: 2,
          studentName: '李四',
          studentNum: '2021D2280322',
          belongCourseName: '软件工程',
          belongBatchName: '张三',
          createTime: '2020-01-01 12:00:00',
        },
        {
          id: 3,
          studentName: '王五',
          studentNum: '2021D2280322',
          belongCourseName: '软件工程',
          belongBatchName: '张三',
          createTime: '2020-01-01 12:00:00',
        },
      ],
      courseList: [],
      batchList: [],
    }
  },
  created() {
    // 获取课程列表
    this.getCourseList()
  },
  methods: {
    // 获取课程列表
    getCourseList() {
      courseApi.getCourseList().then(response => {
        this.courseList = response.data
      })
    },
    // 当选择了课程之后，获取对应课程的批次列表
    changeCourseSelect() {
      batchApi.getBatchListByCourseId(this.searchTaskDetails.belongCourseId).then(response => {
        this.batchList = response.data
      })
    },
    // 当选择了批次之后，获取对应批次的作业详情列表
    changeBatchSelect() {

    }

  }
}
</script>

<style scoped>

</style>
