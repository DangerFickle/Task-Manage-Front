<template>
  <div class="app-container">
    <div class="title">我的群组</div>

    <!-- 选择课程表单 -->
    <!--    <el-row>-->
    <!--      <div class="tools-div">-->
    <!--        <el-form label-width="70px" size="medium" style="margin: 10px 0 -15px 0" inline>-->
    <!--          <el-row>-->
    <!--            <el-col>-->
    <!--              <el-form-item label="所属课程">-->
    <!--                <el-select-->
    <!--                  v-model="courseSearch.belongCourseId"-->
    <!--                  filterable-->
    <!--                  placeholder="请选择所属课程(必选)"-->
    <!--                  style="width: 100%"-->
    <!--                  size="medium"-->
    <!--                  @change="changeCourseSelect"-->
    <!--                >-->
    <!--                  <el-option-->
    <!--                    v-for="course in courseList"-->
    <!--                    :key="course.id"-->
    <!--                    :label="course.courseName"-->
    <!--                    :value="course.id"-->
    <!--                  />-->
    <!--                </el-select>-->
    <!--              </el-form-item>-->

    <!--              <el-form-item>-->
    <!--                <el-button type="primary" icon="el-icon-refresh" size="small" @click="getCourseList">刷新-->
    <!--                </el-button>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </el-form>-->
    <!--      </div>-->
    <!--    </el-row>-->

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
              <el-form-item label="群组名称">
                <el-input
                  v-model.trim="searchGroup.groupName"
                  style="width: 100%"
                  placeholder="请输入群组名称(选填)"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="{ span: 11, offset: 1 }"
              :lg="{span: 6, pull: 1}"
              :xl="{span: 5, pull: 1}"
            >
              <el-form-item label="创建人">
                <el-input
                  v-model.trim="searchGroup.creatorName"
                  style="width: 100%"
                  placeholder="请输入课程描述(选填)"
                />
              </el-form-item>
            </el-col>

            <!--            <el-col-->
            <!--              :md="11"-->
            <!--              :lg="{ span: 6, pull: 1 }"-->
            <!--              :xl="{span: 5, pull: 1}"-->
            <!--            >-->
            <!--              <el-form-item label="创建人">-->
            <!--                <el-input-->
            <!--                  v-model.trim="searchGroup.creatorName"-->
            <!--                  style="width: 100%"-->
            <!--                  placeholder="请输入课程创建人(选填)"-->
            <!--                />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
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
        <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate()">创建群组</el-button>
        <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd()">加入群组</el-button>
      </div>
    </el-row>


    <el-row>
      <el-table
        :data="groupList"
        stripe
        border
        style="margin-top: 20px"
      >
        <!--        <el-table-column type="selection"/>-->
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
          prop="groupName"
          label="群组名称"
          align="center"
        />
        <el-table-column
          prop="belongCourseName"
          label="所属课程"
          align="center"
        />
        <el-table-column
          prop="modifierName"
          label="群组人数"
          width="80"
          align="center"
        />

        <el-table-column
          prop="tag"
          label="是否组长"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isMind === 1 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ scope.row.isMind === 1 ? '是' : '否' }}
            </el-tag>
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
          label="操作"
          align="center"
        >
          <template v-slot="scope">
            <el-button
              v-if="scope.row.isMind === 1"
              size="small"
              icon="el-icon-edit"
              @click="showMembers(scope.row.id)"
            >
              查看组员
            </el-button>
            <el-button
              v-if="scope.row.isMind === 1"
              size="small"
              icon="el-icon-edit"
              @click="showMembers(scope.row.id)"
            >
              处理申请
            </el-button>
            <el-button
              v-if="scope.row.isMind === 1"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isMind === 1"
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDissolve(scope.row)"
            >
              解散群组
            </el-button>

            <el-button
              v-if="scope.row.isMind === 0"
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleExit(scope.row)"
            >
              退出群组
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
        @current-change="fetchGroupData"
      />
    </el-row>


  </div>
</template>

<script>
import courseApi from '@/api/course'
import { flexColumnWidthFN } from '@/mixins/flexColumnWidth'

export default {
  name: 'Group',
  mixins: [flexColumnWidthFN],
  data() {
    return {
      courseSearch: {
        belongCourseId: '',
      },
      pageInfo: {
        pageSize: 5, // 每页显示条数
        page: 1, // 当前页码
        total: 0 // 总记录数
      }, // 分页信息
      courseList: [],
      groupList: [
        {
          groupName: '测试群组',
          belongCourseName: '测试课程',
          creatorName: '测试创建人',
          modifierName: '测试修改人',
          createTime: '2020-01-01',
          updateTime: '2020-01-01',
          isMind: 1
        }

      ],
      searchGroup: {}
    }
  },
  created() {
    // 获取课程列表
    this.getCourseList()
  },
  methods: {
    handleAdd() {

    },
    handleCreate() {

    },
    getCourseList() {
      courseApi.getCourseListOnlyEnabled().then(response => {
        this.courseList = response.data
      })
    },
    fetchGroupData() {

    },
    changeCourseSelect() {

    }
  }
}
</script>

<style scoped>

</style>
