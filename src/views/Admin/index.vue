<script setup>
import {
  addUser,
  changeUserStatus,
  delUser,
  getUser,
  listUser,
  resetUserPwd,
  updateUser,
} from '@/service/admin';
import { getToken } from '@/utils';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getCurrentInstance, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { DepartTree } from './components/index';
const router = useRouter();
const { proxy } = getCurrentInstance();
const store = useStore('global');
const isSuperAdmin = store.state.role === 'super_admin';
const isAdmin = ['super_admin', 'admin'].includes(store.state.role);
if (!isAdmin) {
  router.push('/404.html');
}
const sys_normal_disable = [
  { value: 1, label: '启用' },
  { value: 0, label: '停用' },
];
const sys_user_sex = {};
const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref([]);
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const { role } = store.state;
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: 'Bearer ' + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData',
});
/**
 * 处理数据变化
 */
const handleChange = (data) => {
  queryParams.value = { ...queryParams.value, ...data };
  getList();
};
// 列显隐信息
const columns = ref([
  { label: `用户id`, visible: true },
  { label: `用户名称`, visible: true },
  { label: `学校`, visible: true },
  { label: `手机号码`, visible: true },
  { label: `状态`, visible: true },
  { label: `token额度`, visible: true },
  { label: `已用token`, visible: true },
  { label: `创建时间`, visible: true },
  { label: `角色权限`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phone: undefined,
    status: undefined,
    deptId: undefined,
    dateRange: undefined,
    teacherId: undefined,
  },
  rules: {
    userName: [
      { required: true, message: '用户名称不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户名称长度必须介于 2 和 20 之间',
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '用户密码不能为空', trigger: 'blur' },
      {
        min: 5,
        max: 20,
        message: '用户密码长度必须介于 5 和 20 之间',
        trigger: 'blur',
      },
    ],
    email: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change'],
      },
    ],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur',
      },
    ],
  },
});
const { queryParams, form, rules } = toRefs(data);
watch(
  () => data.queryParams.pageSize,
  () => {
    getList();
  }
);
watch(
  () => data.queryParams.pageNum,
  () => {
    getList();
  }
);
/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(queryParams.value).then((res) => {
    if (res.code === 'SUCCESS') {
      const data = res.data;
      userList.value = data.rows;
      total.value = data.total;
    }
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm('queryRef');
  queryParams.value.deptId = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const uids = row.uid || ids.value;
  proxy.$modal
    .confirm('是否确认删除用户id为"' + uids + '"的数据项？')
    .then(() => {
      delUser(uids).then((res) => {
        if (res.code === 'SUCCESS') {
          getList();
          proxy.$modal.msgSuccess('删除成功');
        }
      });
    });
}

/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.status === 0 ? '停用' : '启用';
  proxy.$modal
    .confirm('确认要' + text + '"' + row.userName + '"用户吗?')
    .then(() => {
      changeUserStatus({ uid: row.uid, status: row.status }).then((res) => {
        if (res.code === 'SUCCESS') {
          proxy.$modal.msgSuccess(text + '成功');
        }
      });
    })
    .catch(function () {
      row.status = row.status === 0 ? 1 : 0;
    });
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case 'handleResetPwd':
      handleResetPwd(row);
      break;
    case 'handleAuthRole':
      handleAuthRole(row);
      break;
    default:
      break;
  }
}

/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy
    .$prompt('请输入"' + row.userName + '"的新密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
    })
    .then(({ value }) => {
      resetUserPwd({ uid: row.uid, password: value }).then((res) => {
        if (res.code === 'SUCCESS') {
          proxy.$modal.msgSuccess('修改成功，新密码是：' + value);
        }
      });
    })
    .catch(() => {});
}
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.uid);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    'system/user/importTemplate',
    {},
    `user_template_${new Date().getTime()}.xlsx`
  );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs['uploadRef'].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      '</div>',
    '导入结果',
    { dangerouslyUseHTMLString: true }
  );
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs['uploadRef'].submit();
}
/** 重置操作表单 */
function reset() {
  form.value = {
    uid: undefined,
    deptId: undefined,
    userName: undefined,
    password: undefined,
    phone: undefined,
    email: undefined,
    sex: undefined,
    status: '0',
    remark: undefined,
    postIds: [],
    roleIds: [],
  };
  proxy.resetForm('userRef');
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
function handleAdd() {
  proxy.$modal.notify('暂未开放，敬请期待');
  proxy.reset();
  getUser().then((response) => {
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    open.value = true;
    title.value = '添加用户';
    form.value.password = initPassword.value;
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  proxy.$modal.notify('暂未开放，敬请期待');
  reset();
  const uid = row.uid || ids.value;
  getUser(uid).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = '修改用户';
    form.password = '';
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['userRef'].validate((valid) => {
    if (valid) {
      if (form.value.uid != undefined) {
        updateUser(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}
const handleSizeChange = (size) => {
  const params = _.cloneDeep(queryParams.value);
  queryParams.value = { ...params, pageSize: size };
};

const handleCurrentChange = (page) => {
  const params = _.cloneDeep(queryParams.value);
  queryParams.value = { ...params, pageNum: page };
};
getList();
</script>
<template>
  <div class="app-container" v-if="isAdmin">
    <el-row :gutter="20">
      <!--学校数据-->
      <el-col :span="4" :xs="24" v-if="isSuperAdmin">
        <DepartTree :on-change="handleChange" />
      </el-col>
      <!--用户数据-->
      <el-col :span="isSuperAdmin ? 20 : 24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
              v-model="queryParams.dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="用户id"
            align="center"
            key="uid"
            prop="uid"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="用户名称"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="学校"
            align="center"
            key="deptName"
            prop="deptName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="center"
            key="phone"
            prop="phone"
            v-if="columns[3].visible"
            width="120"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            v-if="columns[4].visible"
          >
            <template #default="scope">
              <span @click="handleStatusChange(scope.row)">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="token额度"
            align="center"
            key="token"
            prop="token"
            v-if="columns[5].visible"
            width="120"
          />
          <el-table-column
            label="已用token"
            align="center"
            key="usedToken"
            prop="usedToken"
            v-if="columns[6].visible"
            width="120"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            v-if="columns[7].visible"
            width="160"
          >
            <template #default="scope">
              <span>{{
                dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm')
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip
                content="修改"
                placement="top"
                v-if="['super_admin'].includes(role)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="top"
                v-if="['super_admin'].includes(role)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="重置密码"
                placement="top"
                v-if="['super_admin'].includes(role)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Key"
                  @click="handleResetPwd(scope.row)"
                  v-hasPermi="['system:user:resetPwd']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          v-show="total > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryParams.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属学校" prop="deptId">
              <el-tree-select
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择归属学校"
                check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.uid == undefined"
              label="用户名称"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                placeholder="请输入用户名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.uid == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <!-- <upload-filled /> -->
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.app-container {
  padding: 24px 20px;
}
.pagination {
  margin-top: 12px;
}
</style>
