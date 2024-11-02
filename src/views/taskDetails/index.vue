<template>
  <div class="app-container">
    <div class="title">提交详情</div>

    <!-- 选择课程表单 -->
    <el-row>
      <div class="tools-div">
        <el-form label-width="70px" style="margin: 10px 0 -15px 0" inline>
          <el-row :gutter="20">
            <el-col :lg="12" :md="12" :sm="12" :xs="24">
              <el-form-item label="所属课程">
                <el-select
                  v-model="searchBatch.belongCourseId"
                  filterable
                  placeholder="请选择所属课程(必选)"
                  style="width: 200px"
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

            <el-col :lg="12" :md="12" :sm="12" :xs="24">
              <!-- 如果是修改则不展示 -->
              <el-form-item label="批次类型" prop="batchType">
                <el-select
                  v-model.trim="searchBatch.batchType"
                  filterable
                  placeholder="请选择所属课程(必选)"
                  style="width: 200px"
                  @change="changeCourseSelect"
                >
                  <el-option label="个人作业" value="personal"/>
                  <el-option label="群组作业" value="group"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item>
                <el-button style="width: 100%" type="primary" icon="Refresh" @click="refreshCourseAndBatch()"
                >刷新
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <!-- 批次表格 -->
    <el-row style="margin-top: 10px">
      <el-table :data="batchList" stripe border style="margin-top: 0">
        <!-- 序号 -->
        <el-table-column label="序号" width="60" align="center">
          <template v-slot="scope">
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
        <el-table-column prop="belongCourseName" label="所属课程" align="center"/>
        <!-- 截至时间 -->
        <el-table-column label="截至时间" align="center">
          <template v-slot="scope">
            {{ scope.row.endTime === "1970-01-01 00:00:00" ? "永不截止" : scope.row.endTime }}
          </template>
        </el-table-column>

        <!-- 截至状态 -->
        <el-table-column prop="tag" label="状态" width="80" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.isEnd === 0 ? 'success' : 'danger'" disable-transitions>
              {{ scope.row.isEnd === 0 ? "未截止" : "已截止" }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 已交人数或群数 -->
        <el-table-column
          prop="alreadyCount"
          :label="searchBatch.batchType === 'personal' ? '已交人数' : '已交群数'"
          align="center"
          :width="flexColumnWidth(batchList, searchBatch.batchType === 'personal' ? '已交人数' : '已交群数', 'alreadyCount')"
        >
          <template v-slot="scope"> {{ scope.row.alreadyCount }} / {{ scope.row.totalCount }}</template>
        </el-table-column>

        <!-- 批次文件总大小 -->
        <el-table-column
          prop="sizeOfDirectory"
          label="文件体积"
          align="center"
          :width="flexColumnWidth(batchList, '文件体积', 'sizeOfDirectory')"
        >
          <template v-slot="scope">
            {{ handleDirectorySize(scope.row.sizeOfDirectory) }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" align="center" width="371">
          <!-- isEnd为1时禁用，为0时可用 -->
          <template v-slot="scope">
            <el-tooltip :disabled="scope.row.isEnd === 1" :content="'批次未截止'" placement="top">
              <el-button
                type="primary"
                icon="Download"
                :disabled="scope.row.isEnd === 0"
                @click="handleDownloadFiles(scope.row.id, scope.row.sizeOfDirectory)"
              >下载全部
              </el-button
              >
            </el-tooltip>

            <el-button icon="InfoFilled" type="primary" @click="handleQueryTaskDetails(scope.row.id)"
            >查看已交
            </el-button
            >

            <el-button icon="View" type="primary" @click="handleQueryNoCommit(scope.row)">查看未交</el-button>
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
          style="padding: 30px 0; text-align: center"
          layout="total, prev, pager, next, jumper"
          @current-change="fetchBatchByCourseId"
        />
      </el-row>
    </el-row>

    <!-- 查看个人批次已交人员弹窗 -->
    <el-dialog title="作业提交情况" v-model="personalTaskDetailsDialogVisible" width="70%" top="15px" center>
      <el-row>
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -20px" inline>
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="searchTaskDetails.studentName"
                @input="fetchPersonalTaskDetailsByBatchId()"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-row>
      <!-- 作业详情表单 -->
      <el-row>
        <el-table :data="personalTaskDetailsList" stripe border style="margin-top: 10px">
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (personalTaskDetailsPageInfo.page - 1) * personalTaskDetailsPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column prop="studentName" label="学生姓名" align="center"/>
          <!-- 学号 -->
          <el-table-column prop="studentNumber" label="学号" align="center"/>
          <!-- 所属批次 -->
          <el-table-column prop="belongBatchName" label="所属批次" align="center"/>
          <!-- 所属课程 -->
          <el-table-column prop="belongCourseName" label="所属课程" align="center"/>
          <!-- 提交时间 -->
          <el-table-column
            prop="createTime"
            label="提交时间"
            :width="flexColumnWidth(personalTaskDetailsList, '提交时间', 'createTime')"
            align="center"
          />

          <!-- 批次文件总大小 -->
          <el-table-column
            prop="fileSize"
            label="文件体积"
            align="center"
            :width="flexColumnWidth(personalTaskDetailsList, '文件体积', 'fileSize')"
          >
            <template v-slot="scope">
              {{ handleDirectorySize(scope.row.fileSize) ? handleDirectorySize(scope.row.fileSize) : "无文件" }}
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-tooltip :disabled="scope.row.isEnd === 1" content="批次未截止" placement="right">
                <el-button
                  type="primary"
                  icon="Download"
                  :disabled="scope.row.isEnd === 0"
                  @click="handleDownloadFile(scope.row.taskId)"
                >下载
                </el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 作业详情表格分页插件 -->
      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="personalTaskDetailsPageInfo.page"
          :total="personalTaskDetailsPageInfo.total"
          :page-size="personalTaskDetailsPageInfo.pageSize"
          style="padding: 30px 0; text-align: center"
          layout="total, prev, pager, next, jumper"
          @current-change="fetchPersonalTaskDetailsByBatchId"
        />
      </el-row>
    </el-dialog>

    <!-- 查看群组批次已交人员弹窗 -->
    <el-dialog title="作业提交情况" v-model="groupTaskDetailsDialogVisible" width="70%" top="15px" center>
      <el-row>
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -20px" inline>
            <el-form-item label="群组名称">
              <el-input
                v-model.trim="searchTaskDetails.groupName"
                @input="fetchGroupTaskDetailsByBatchId()"
                placeholder="请输入群组名称(选填)"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-row>
      <!-- 作业详情表单 -->
      <el-row>
        <el-table :data="groupTaskDetailsList" stripe border style="margin-top: 10px">
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (groupTaskDetailsPageInfo.page - 1) * groupTaskDetailsPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column prop="groupName" label="群组名称" align="center"/>
          <!-- 所属批次 -->
          <el-table-column prop="belongBatchName" label="所属批次" align="center"/>
          <!-- 所属课程 -->
          <el-table-column prop="belongCourseName" label="所属课程" align="center"/>
          <!-- 提交时间 -->
          <el-table-column
            prop="createTime"
            label="提交时间"
            :width="flexColumnWidth(groupTaskDetailsList, '提交时间', 'createTime')"
            align="center"
          />

          <!-- 批次文件总大小 -->
          <el-table-column
            prop="fileSize"
            label="文件体积"
            align="center"
            :width="flexColumnWidth(groupTaskDetailsList, '文件体积', 'fileSize')"
          >
            <template v-slot="scope">
              {{ handleDirectorySize(scope.row.fileSize) ? handleDirectorySize(scope.row.fileSize) : "无文件" }}
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-tooltip :disabled="scope.row.isEnd === 1" content="批次未截止" placement="right">
                <el-button
                  type="primary"
                  icon="Download"
                  :disabled="scope.row.isEnd === 0"
                  @click="handleDownloadFile(scope.row.taskId)"
                >下载
                </el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 作业详情表格分页插件 -->
      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="groupTaskDetailsPageInfo.page"
          :total="groupTaskDetailsPageInfo.total"
          :page-size="groupTaskDetailsPageInfo.pageSize"
          style="padding: 30px 0; text-align: center"
          layout="total, prev, pager, next, jumper"
          @current-change="fetchGroupTaskDetailsByBatchId"
        />
      </el-row>
    </el-dialog>

    <!-- 查看未交人员弹窗 -->
    <el-dialog title="未交人员" v-model="notCommitDialogVisible" width="50%" top="15px" center>
      <el-row style="margin-bottom: 10px">
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -22px" inline>
            <el-form-item label="学生姓名">
              <el-input
                v-model.trim="searchNoCommitUser.studentName"
                @input="freshNoCommitUserList()"
                placeholder="请输入学生姓名(选填)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Document" @click="exportNotCommit()">导出Excel</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>

      <el-row>
        <el-table :data="userList" stripe border>
          <!--          <el-table-column type="selection"/>-->
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (noCommitPageInfo.page - 1) * noCommitPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 学生姓名 -->
          <el-table-column prop="name" label="学生姓名" align="center"/>
          <!-- 学号 -->
          <el-table-column prop="studentNumber" label="学号" align="center"/>
          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-tooltip
                :disabled="currentBatch.isEnd === 0 && scope.row.hasEmail"
                :content="currentBatch.isEnd === 1 ? '批次已截止' : '未绑定邮箱'"
                placement="right"
              >
                <el-button
                  type="primary"
                  :disabled="currentBatch.isEnd === 1 || !scope.row.hasEmail"
                  @click="handleRemindUser(scope.row.id)"
                >提醒TA
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="noCommitPageInfo.page"
          :total="noCommitPageInfo.total"
          :page-size="noCommitPageInfo.pageSize"
          style="padding-top: 20px; margin: 0 auto"
          layout="total, prev, pager, next, jumper"
          @current-change="freshNoCommitUserList"
        />
      </el-row>
    </el-dialog>

    <!-- 查看未交群组弹窗 -->
    <el-dialog title="未交群组" v-model="notCommitGroupDialogVisible" width="50%" top="15px" center>
      <el-row style="margin-bottom: 10px">
        <div class="search-div">
          <el-form label-width="70px" style="margin-bottom: -22px" inline>
            <el-form-item label="群组名称">
              <el-input
                v-model.trim="searchNoCommitGroup.groupName"
                @input="freshNoCommitGroupList()"
                placeholder="请输入群组名称(选填)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Document" @click="exportNotCommitGroup()">导出Excel</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>

      <el-row>
        <el-table :data="groupList" stripe border>
          <!--          <el-table-column type="selection"/>-->
          <!-- 序号 -->
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="scope">
              {{ (noCommitGroupPageInfo.page - 1) * noCommitGroupPageInfo.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 群组名称 -->
          <el-table-column prop="name" label="群组名称" align="center"/>
          <!-- 组长 -->
          <el-table-column prop="leaderName" label="组长" align="center"/>
          <!-- 群组名称 -->
          <el-table-column prop="alreadyMember" label="群组人数" align="center"/>

          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="120">
            <template v-slot="scope">
              <el-tooltip
                :disabled="currentBatch.isEnd === 0"
                :content="currentBatch.isEnd === 1 ? '批次已截止' : ''"
                placement="right"
              >
                <el-button
                  type="primary"
                  :disabled="currentBatch.isEnd === 1"
                  @click="handleRemindGroupMember(scope.row.id)"
                >提醒群员
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="noCommitGroupPageInfo.page"
          :total="noCommitGroupPageInfo.total"
          :page-size="noCommitGroupPageInfo.pageSize"
          style="padding-top: 20px; margin: 0 auto"
          layout="total, prev, pager, next, jumper"
          @current-change="freshNoCommitGroupList"
        />
      </el-row>
    </el-dialog>

    <!-- 文件下载进度条 -->
    <el-dialog
      title="正在下载，请稍后..."
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="percentageDialogVisible"
      width="220px"
      center
    >
      <!-- 下载环形进度条 -->
      <el-progress type="circle" :percentage="percentage" style="margin: -20px 0 0 20px"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from "vue";
// 处理表格的列对内容自适应
import {flexColumnWidth} from "@/hooks/useFlexColumnWidth";
import courseApi from "@/api/course";
import batchApi from "@/api/batch";
import taskApi from "@/api/task";
import userApi from "@/api/user";
import taskDetailsApi from "@/api/taskDetails";
import emailApi from "@/api/email";
import excelApi from "@/api/excel";
import {Batch, SearchBatch} from "@/api/batch/types/batch";
import {Course} from "@/api/course/type/course";
import {User} from "@/api/user/types/user";
import {ElMessage} from "element-plus";
import {TaskDetails} from "@/api/taskDetails/types/taskDetails";
import {AxiosResponse} from "axios";
import {ApiResponse} from "../../../types/api";

// 下载环形进度条的百分比
const percentage = ref<number>(0);
// 下载环形进度条的弹窗是否显示
const percentageDialogVisible = ref<boolean>(false);

// 批次列表的分页信息
const batchPageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});

// 个人作业详情的分页信息
const personalTaskDetailsPageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});
// 群组作业详情的分页信息
const groupTaskDetailsPageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});
// 未交人员的分页信息
const noCommitPageInfo = reactive({
  pageSize: 10, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});
const noCommitGroupPageInfo = reactive({
  pageSize: 10, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});

const searchBatch = reactive<SearchBatch>({
  belongCourseId: "",
  batchType: ""
});

const searchTaskDetails = reactive({
  studentName: "",
  groupName: "",
  belongBatchId: ""
});

const searchNoCommitUser = reactive({
  studentName: "",
  belongBatchId: ""
});
const searchNoCommitGroup = reactive({
  groupName: "",
  belongBatchId: ""
});

// 当前正在查看的批次
const currentBatch = reactive<Batch>({
  id: ''
});

// 作业详情对话框是否可见
const personalTaskDetailsDialogVisible = ref<boolean>(false);
const groupTaskDetailsDialogVisible = ref<boolean>(false);

// 未见人员对话框是否可见
const notCommitDialogVisible = ref<boolean>(false);
const notCommitGroupDialogVisible = ref<boolean>(false);

// 作业详情列表
const personalTaskDetailsList = reactive<Array<TaskDetails>>([]);
// 已交群组列表
const groupTaskDetailsList = reactive<Array<TaskDetails>>([]);

// 课程列表，用于下拉框
const courseList = reactive<Array<Course>>([]);

// 批次列表
const batchList = reactive<Array<Batch>>([]);

// 未交人员列表
const userList = reactive<Array<User>>([]);

// 未交群组列表
const groupList = reactive<Array<User>>([]);


function exportNotCommit() {
  excelApi.exportNotCommit(searchNoCommitUser).then((response) => {
    // 检查下载文件时是否有后端传来的异常信息
    if (response.headers["exception"]) {
      const msg = decodeURIComponent(response.headers["exception"]);
      // 关闭未交人员弹窗
      notCommitDialogVisible.value = false;
      // 刷新批次列表
      refreshCourseAndBatch();
      ElMessage.error(msg);
      return;
    }
    handleDownload(response);
  });
}

function exportNotCommitGroup() {

}

// 处理文件大小在列表中的显示
function handleDirectorySize(fileSize: number) {
  if (fileSize === 0) {
    return "无文件";
  }
  if (fileSize >= 1048576) {
    return (fileSize / (1024 * 1024)).toFixed(2) + " MB";
  }
  if (fileSize >= 1024) {
    return (fileSize / 1024).toFixed(2) + " KB";
  }
}

// 根据批次和用户id，提醒单个用户
function handleRemindUser(userId: string) {
  emailApi.remindUser({userId, batchId: searchNoCommitUser.belongBatchId}).then((response) => {
    if (response.code === 800) {
      ElMessage({
        type: "error",
        message: response.msg
      });
      // 刷新课程和批次列表
      refreshCourseAndBatch();
      return;
    }
    ElMessage({
      type: "success",
      message: response.msg
    });
  });
}

function handleRemindGroupMember(groupId: string) {
}

// 根据批次id查询未交人员或群组
function handleQueryNoCommit(batch: Batch) {
  // 每次打开未交人员表格时，清空搜索条件
  searchNoCommitUser.studentName = "";
  // 将传入的batchId赋值给未交人员查询条件对象
  searchNoCommitUser.belongBatchId = batch.id;

  searchNoCommitGroup.groupName = "";
  searchNoCommitGroup.belongBatchId = batch.id;
  // 当前正在查看的批次
  currentBatch.isEnd = batch.isEnd;
  if (searchBatch.batchType === 'group') {
    freshNoCommitGroupList()
  } else {
    freshNoCommitUserList();
  }
}

// 根据批次id查询未交人员
function freshNoCommitUserList(page: number = 1) {
  if (page) {
    noCommitPageInfo.page = page;
  }
  // 发送请求获取未交人员列表
  userApi.getNoCommitUserList(searchNoCommitUser, noCommitPageInfo.page, noCommitPageInfo.pageSize)
    .then((response) => {
      if (response.code === 800) {
        ElMessage.error(response.msg);
        return;
      }
      const {data} = response
      noCommitPageInfo.total = data.total;
      noCommitPageInfo.page = data.current;
      userList.splice(0, userList.length, ...data.records)
      notCommitDialogVisible.value = true; // 打开未交人员对话框
    });
}

function freshNoCommitGroupList(page: number = 1) {
  if (page) {
    noCommitPageInfo.page = page;
  }
  // 发送请求获取未交人员列表
  userApi.getNoCommitGroupList(searchNoCommitGroup, noCommitPageInfo.page, noCommitPageInfo.pageSize)
    .then((response) => {
      if (response.code === 800) {
        ElMessage.error(response.msg);
        return;
      }
      const {data} = response
      noCommitGroupPageInfo.total = data.total;
      noCommitGroupPageInfo.page = data.current;
      groupList.splice(0, groupList.length, ...data.records)
      notCommitGroupDialogVisible.value = true; // 打开未交人员对话框
    });
}

// 下载单个文件
function handleDownloadFile(taskId: string) {
  percentageDialogVisible.value = true; //  打开下载环形进度条的弹窗
  taskApi.downloadTaskFile(taskId, percentage, percentageDialogVisible).then((response) => {
    // 检查下载文件时是否有后端传来的异常信息
    if (response.headers["exception"]) {
      const msg = decodeURIComponent(response.headers["exception"]);
      if (msg === "该作业不存在") {
        // 重新获取作业列表
        handleFetchTaskDetailsByBatchId();
      }
      ElMessage.error(msg);
      // 重置环形进度条百分比为0
      percentage.value = 0;
      return;
    }
    // 下载文件
    handleDownload(response);
  });
}

// 根据批次id批量下载
function handleDownloadFiles(batchId: string, sizeOfDirectory: number) {
  // 检查是否有文件可下载
  if (sizeOfDirectory === 0) {
    ElMessage.error("当前没有文件")
    return
  }
  percentageDialogVisible.value = true //  打开下载环形进度条的弹窗
  taskApi.downloadBatchFiles(batchId, percentage, percentageDialogVisible).then((response) => {
    // 检查下载文件时是否有后端传来的异常信息
    if (response.headers["exception"]) {
      const msg = decodeURIComponent(response.headers["exception"]);
      if (msg === "该批次不存在" || msg === "该批次还未截止" || msg === "该批次下还没有作业") {
        // 刷新批次列表
        fetchBatchByCourseId();
      } else if (msg === "所属课程已被禁用") {
        // 重置课程下拉选择框
        searchBatch.belongCourseId = "";
        // 刷新课程列表
        getCourseList();
        // 重置批次列表
        batchList.splice(0)
      }
      if (msg !== "") {
        ElMessage.error(msg);
        // 重置环形进度条百分比为0
        percentage.value = 0;
        return;
      }
    }
    // 处理下载逻辑
    handleDownload(response);
  });
}

// 处理下载逻辑，传入response对象
function handleDownload(response: ApiResponse<any>) {
  // 由于后台返回文件名称是通过response返回的
  // 因此需要从response headers中content-disposition响应头中获取文件名称fileName
  let fileName = response.headers["content-disposition"];
  fileName = fileName.split("=")[1];
  const url = window.URL.createObjectURL(
    new Blob([response.data], {
      type: "application/octet-stream;charset=UTF-8"
    })
  );
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  // decodeURIComponent解决文件名的url转码问题
  link.setAttribute("download", decodeURIComponent(fileName));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  percentage.value = 0; // 重置环形进度条百分比为0
}

function handleSelectionChange() {
}

// 获取课程列表，只获取已启用的课程
function getCourseList() {
  courseApi.getCourseListOnlyEnabled().then((response) => {
    courseList.splice(0, courseList.length, ...response.data)
  });
}

// 根据所属课程id获取批次列表
function fetchBatchByCourseId(batchPage: number = 1) {
  if (searchBatch.belongCourseId === "") {
    ElMessage.warning("请先选择所属课程");
    return;
  }
  if (searchBatch.batchType === "") {
    return;
  }

  if (batchPage !== 1) {
    batchPageInfo.page = batchPage;
  }
  batchApi.getBatchListIsCommitAndCount(searchBatch, batchPageInfo.page, batchPageInfo.pageSize).then((response) => {
    if (response.code === 800) {
      ElMessage.error(response.msg);
      // 刷新课程列表数据
      getCourseList();
      // 重置所属课程id
      searchBatch.belongCourseId = "";
      // 重置批次列表
      batchList.splice(0)
      return;
    }
    const {data} = response;
    batchPageInfo.total = data.total;
    batchPageInfo.page = data.current;
    batchList.splice(0, batchList.length, ...data.records)
  });
}

// 根据批次id获取个人作业详情列表
function fetchPersonalTaskDetailsByBatchId(taskDetailsPage: number = 1) {
  if (taskDetailsPage != 1) {
    personalTaskDetailsPageInfo.page = taskDetailsPage;
  }
  // 获取批次下的作业详情列表
  taskDetailsApi
    .getDetailsByBatchId(searchTaskDetails, personalTaskDetailsPageInfo.page, personalTaskDetailsPageInfo.pageSize)
    .then((response) => {
      if (response.code === 800) {
        ElMessage.error(response.msg);
        // 刷新批次列表数据
        fetchBatchByCourseId();
        return;
      }
      const {data} = response;
      personalTaskDetailsPageInfo.total = data.total;
      personalTaskDetailsPageInfo.page = data.current;
      personalTaskDetailsList.splice(0, personalTaskDetailsList.length, ...data.records)
      personalTaskDetailsDialogVisible.value = true;
    });
}

// 根据批次id获取群组作业详情列表
function fetchGroupTaskDetailsByBatchId(taskDetailsPage: number = 1) {
  if (taskDetailsPage != 1) {
    groupTaskDetailsPageInfo.page = taskDetailsPage;
  }
  // 获取批次下的作业详情列表
  taskDetailsApi
    .getGroupDetailsByBatchId(searchTaskDetails, groupTaskDetailsPageInfo.page, groupTaskDetailsPageInfo.pageSize)
    .then((response) => {
      if (response.code === 800) {
        ElMessage.error(response.msg);
        // 刷新批次列表数据
        fetchBatchByCourseId();
        return;
      }
      const {data} = response;
      groupTaskDetailsPageInfo.total = data.total;
      groupTaskDetailsPageInfo.page = data.current;
      groupTaskDetailsList.splice(0, groupTaskDetailsList.length, ...data.records)
      groupTaskDetailsDialogVisible.value = true;
    });
}

function handleFetchTaskDetailsByBatchId() {
  if (searchBatch.batchType === 'group') {
    fetchGroupTaskDetailsByBatchId()
  } else {
    fetchPersonalTaskDetailsByBatchId()
  }
}

// 点击查看已交按钮后弹出作业详情对话框，显示出表单
function handleQueryTaskDetails(batchId: string) {
  // 清空查询已交的查询条件
  searchTaskDetails.studentName = "";
  searchTaskDetails.groupName = "";
  // 将要查询的批次id赋值给作业详情查询对象的属性中
  searchTaskDetails.belongBatchId = batchId;
  // 获取批次下的作业详情列表
  handleFetchTaskDetailsByBatchId();
}

// 当选择了课程之后，获取对应课程的批次列表
function changeCourseSelect() {
  fetchBatchByCourseId();
}

// 刷新课程列表以及批次列表
function refreshCourseAndBatch() {
  getCourseList();
  if (searchBatch.belongCourseId !== "") {
    fetchBatchByCourseId();
  }
}

getCourseList();
</script>

<style scoped></style>
