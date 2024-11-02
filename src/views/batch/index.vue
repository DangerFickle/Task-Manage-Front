<template>
  <div class="app-container">
    <div class="title">批次管理</div>
    <el-row>
      <div class="search-div">
        <el-form label-width="70px">

          <el-row :gutter="20">

            <el-col>
              <p style="float: left; color: #000; font-size: 25px; line-height: 0px;">搜索栏</p>
            </el-col>

            <el-col :lg="8" :md="12" :sm="12" :xs="24">
              <el-form-item label="批次名称">
                <el-input
                  v-model="searchBatch.batchName"
                  @input="fetchBatchData()"
                  style="width: 100%"
                  placeholder="请输入批次名称(选填)"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="12" :xs="24">
              <el-form-item label="批次描述">
                <el-input
                  v-model="searchBatch.description"
                  @input="fetchBatchData()"
                  style="width: 100%"
                  placeholder="请输入批次描述(选填)"
                />
              </el-form-item>
            </el-col>

            <el-col :lg="8" :md="12" :sm="12" :xs="24">
              <el-form-item label="创建人">
                <el-input
                  v-model="searchBatch.creatorName"
                  @input="fetchBatchData()"
                  style="width: 100%"
                  placeholder="请输入批次创建者(选填)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!--          <el-row>-->

          <!--            <el-col :span="6">-->
          <!--              <el-form-item label="修改人">-->
          <!--                <el-input v-model="searchBatch.modifierName" style="width: 300px" placeholder="请输入批次修改者(选填)"/>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->

          <el-row style="display: flex">
            <!--            <el-button type="primary" icon="Search" @click="fetchBatchData()">搜索</el-button>-->
            <el-button icon="Refresh" type="info" @click="resetData">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </el-row>
    <el-row>
      <div class="tools-div" style="margin-top: 10px; padding-bottom: 0">
        <el-button type="success" icon="Plus" @click="handleAdd()">添加批次</el-button>
        <!--        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteByIds()">批量删除</el-button>-->
        <el-form label-width="70px" inline style="margin: 10px 0 -10px 0">
          <el-row>
            <el-col>
              <el-form-item label="所属课程">
                <el-select
                  v-model="searchBatch.belongCourseId"
                  filterable
                  placeholder="请选择所属课程(必选)"
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
              <el-form-item label="批次类型">
                <el-select
                  v-model="searchBatch.batchType"
                  filterable
                  placeholder="请选择所属课程(必选)"
                  style="width: 200px"
                  @change="changeSelect"
                >
                  <el-option label="个人作业" value="personal" />
                  <el-option label="群组作业" value="group" />
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
      <el-table :data="batchList" stripe border @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection"/> -->
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
        <el-table-column
          prop="belongCourseName"
          label="所属课程"
          align="center"
          :width="flexColumnWidth(batchList, '所属课程', 'belongCourseName')"
        />
        <el-table-column label="状态" width="80" align="center">
          <template v-slot="scope">
            <el-switch
              :model-value="scope.row.isEnd === 0"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="switchStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="批次类型" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.batchType === 'personal' ? 'success' : 'primary'" disable-transitions>
              {{ scope.row.batchType === "personal" ? "个人作业" : "群组作业" }}
            </el-tag>
          </template>
        </el-table-column>

        <!--        <el-table-column-->
        <!--          prop="creatorName"-->
        <!--          label="创建人"-->
        <!--          align="center"-->
        <!--        />-->
        <!--        <el-table-column-->
        <!--          prop="modifierName"-->
        <!--          label="修改人"-->
        <!--          align="center"-->
        <!--        />-->
        <el-table-column prop="createTime" label="创建时间" align="center" />

        <!--        <el-table-column-->
        <!--          prop="updateTime"-->
        <!--          label="修改时间"-->
        <!--          align="center"-->
        <!--        />-->

        <el-table-column label="截至时间" align="center">
          <template v-slot="scope">
            {{ scope.row.endTime === "1970-01-01 00:00:00" ? "永不截止" : scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template v-slot="scope">
            <el-button icon="Edit" @click="handleEdit(scope.row.id)">编辑</el-button>
            <!--            <el-button-->
            <!--              size="small"-->
            <!--              icon="el-icon-delete"-->
            <!--              type="danger"-->
            <!--              @click="handleEnd(scope.row)"-->
            <!--            >停用-->
            <!--            </el-button>-->
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
        style="padding: 30px 0; text-align: center"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchBatchData"
      />
    </el-row>

    <el-dialog :title="dialogTitle" v-model="addOrUpdateDialogVisible" width="450px" center @close="dialogClose()">
      <el-form ref="batchForm" :rules="batchRules" :model="batch" label-width="100px" style="padding-right: 40px">
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
            style="width: 300px"
          >
            <el-option v-for="course in courseList" :key="course.id" :label="course.courseName" :value="course.id" />
          </el-select>
        </el-form-item>

        <!-- 如果是修改则不展示 -->
        <el-form-item v-if="!batch.id" label="批次类型:" prop="batchType">
          <el-select v-model.trim="batch.batchType" filterable placeholder="请选择批次类型(必选)" style="width: 300px">
            <el-option label="个人作业" value="personal" />
            <el-option label="群组作业" value="group" />
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间:" prop="endTime">
          <el-date-picker
            v-model="batch.endTime"
            type="datetime"
            placeholder="选择截止时间"
            style="width: 300px"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
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
import { ref, reactive } from "vue";
import courseApi from "@/api/course/index";
import batchApi from "@/api/batch/index";
import { flexColumnWidth } from "@/hooks/useFlexColumnWidth";
import { Batch, SearchBatch } from "@/api/batch/types/batch";
import { Course } from "@/api/course/type/course";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
// 批次表单验证规则

const batchRules: FormRules = {
  batchName: [{ required: true, message: "请输入批次名", trigger: "blur" }],
  batchType: {
    required: true,
    message: "请选择批次类型",
    trigger: "blur"
  },
  description: [{ required: true, message: "请输入批次描述", trigger: "blur" }],
  belongCourseId: [{ required: true, message: "请选择所属课程", trigger: "blur" }]
};
// 日期选择器配置
const shortcuts = [
  {
    text: "明天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "后天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
      return date;
    }
  },
  {
    text: "一周后",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];
const dialogTitle = ref<string>();
// 分页信息
const pageInfo = reactive({
  pageSize: 5, // 每页显示条数
  page: 1, // 当前页码
  total: 0 // 总记录数
});
const searchBatch = reactive<SearchBatch>({
  belongCourseId: "", // 所属课程中被选中课程的id
  batchName: "", // 批次名称
  batchType: "", // 批次类型
  description: "", // 批次描述
  creatorName: "", // 创建者
  modifierName: "" // 修改者
}); // 搜索条件
// 批次信息
let batch = reactive<Batch>({
  id: "", // 批次id
  batchName: "", // 批次名称
  description: "", // 批次描述
  batchType: "", // 批次类型
  belongCourseId: "", // 所属课程id
  endTime: "" // 截止时间
});
// 批次信息列表
let batchList = reactive<Array<Batch>>([]);
// 课程列表
const courseList = reactive<Array<Course>>([]);
// 添加/修改对话框是否显示
const addOrUpdateDialogVisible = ref<boolean>(false);

const batchForm = ref();

// 添加/修改对话框关闭时触发，重置表单，重置检验效果
function dialogClose() {
  batchForm.value.resetFields();
  resetBatch();
}

function changeSelectForm() {
}

function changeSelect() {
  fetchBatchData(1);
}

// 获取所有课程列表，只获取启用的课程
function getCourseList() {
  courseApi.getCourseListOnlyEnabled().then((response) => {
    courseList.splice(0, courseList.length, ...response.data)
  });
}

function handleSelectionChange() {
}

// 拉取批次数据，分页查询
function fetchBatchData(page: number = 0) {
  if (searchBatch.belongCourseId === "") {
    ElMessage.warning("请先选择所属课程");
    return;
  }
  if (searchBatch.batchType === "") {
    return;
  }
  if (page) {
    pageInfo.page = page;
  }
  batchApi.getBatchListPage(searchBatch, pageInfo.page, pageInfo.pageSize).then((response) => {
    if (response.code === 800) {
      ElMessage.error(response.msg);
      // 清空课程选择框
      searchBatch.belongCourseId = "";
      // 重新获取课程列表
      getCourseList();
      // 清空批次列表
      batchList.splice(0)
      return;
    }
    const { data } = response;
    pageInfo.total = data.total;
    pageInfo.page = data.current;
    batchList.splice(0, batchList.length, ...data.records)
  });
}

function resetData() {
  resetSearchBatch();
  fetchBatchData();
}

function handleAdd() {
  // 打开添加对话框时，重新拉取课程列表
  getCourseList();
  dialogTitle.value = "添加批次";
  addOrUpdateDialogVisible.value = true;
}

// 点击修改按钮，弹出修改对话框，回显数据
function handleEdit(batchId: string) {
  batchApi.getBatchById(batchId).then((response) => {
    const { data } = response;
    // 如果获取到的时是格林威治时间，则不进行赋值
    data.endTime = data.endTime === "1970-01-01 00:00:00" ? "" : data.endTime;
    Object.assign(batch, data)
    dialogTitle.value = "编辑批次";
    addOrUpdateDialogVisible.value = true;
  });
}

function addOrUpdate() {
  batchForm.value.validate((valid: boolean) => {
    if (valid) {
      if (batch.id) {
        updateBatch();
      } else {
        addBatch();
      }
    } else {
      return false;
    }
  });
}

function addBatch() {
  batchApi
    .addBatch(batch)
    .then((response) => {
      // 添加批次成功后，如果所属课程下拉框有选中的课程，则重新拉取批次列表
      if (searchBatch.belongCourseId !== "") {
        fetchBatchData(1);
      }
      addOrUpdateDialogVisible.value = false;
      ElMessage({
        type: response.code === 800 ? "error" : "success",
        message: response.msg
      });
    })
    .catch(() => {
    });
}

function updateBatch() {
  if (batch.endTime === "") batch.endTime = "1970-01-01 00:00:00";
  batchApi
    .updateBatch(batch)
    .then((response) => {
      fetchBatchData();
      addOrUpdateDialogVisible.value = false;
      ElMessage({
        type: response.code === 800 ? "error" : "success",
        message: response.msg
      });
    })
    .catch(() => {
    });
}


function handleDelete(row: Batch) {
  ElMessageBox.confirm(`确认删除 <${row.batchName}> 批次吗？此操作不可逆！`, "警告", {
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    center: true
  })
    .then(() => {
      batchApi
        .deleteByBatchId(row.id)
        .then((response) => {
          fetchBatchData();
          ElMessage({
            type: response.code === 800 ? "error" : "success",
            message: response.msg
          });
        })
        .catch(() => {
        });
    })
    .catch(() => {
    });
}

function switchStatus(row: Batch) {
  const isEnd = row.isEnd === 1 ? 0 : 1;
  batchApi
    .updateStatus(row.id, isEnd)
    .then((response) => {
      ElMessage({
        type: response.code === 800 ? "error" : "success",
        message: response.msg
      });
      fetchBatchData();
    })
    .catch((error) => {
      console.log(error);
    });
}

function refreshCourseAndBatch() {
  getCourseList();
  if (searchBatch.belongCourseId !== "") {
    fetchBatchData();
  }
}

// 重置batch对象，清空所有属性中的值
function resetBatch() {
  batch = reactive<Batch>({
    id: "", // 批次id
    batchName: "", // 批次名称
    description: "", // 批次描述
    batchType: "", // 批次类型
    belongCourseId: "", // 所属课程id
    endTime: "" // 截止时间
  });
}

function resetSearchBatch() {
  searchBatch.batchName = "";
  searchBatch.description = "";
  searchBatch.creatorName = "";
  searchBatch.modifierName = "";
}

getCourseList();
</script>

<style lang="scss">
// 隐藏日期时间选择器的此刻按钮
.el-picker-panel.no-atTheMoment {
  .el-button--text.el-picker-panel__link-btn {
    display: none;
  }
}
</style>
