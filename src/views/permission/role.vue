<template>
  <div class="app-container">



    <el-card class="filter-container" style="padding: 20px">

        <div style="float:left">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddRole">
            新建角色
          </el-button>
        </div>
        <div style="float:right;margin-right: 150px">
          <el-input  placeholder="角色英文名称" style="width: 300px; margin-right: 20px;" class="filter-item" />
          <el-button  class=" filter-item" type="primary" icon="el-icon-search" @click="handleSelect">
            查询
          </el-button>
          <el-button  class="filter-item" type="primary" icon="el-icon-download" @click="handleSelect">
            导出
          </el-button>
        </div>
    </el-card>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="编号" width="80" align="center">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column min-width="30" align="center" label="中文角色名"  >
        <template slot-scope="scope">
          {{ scope.row.zhName }}
        </template>
      </el-table-column>
      <el-table-column min-width="30" align="center" label="英文角色名" >
        <template slot-scope="scope">
          {{ scope.row.enName }}
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="角色描述" >
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column min-width="30" align="center" label="创建时间" >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">編輯</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色中文名">
          <el-input v-model="role.zhName" placeholder="角色中文名" />
        </el-form-item>
        <el-form-item label="角色英文名">
          <el-input v-model="role.enName" placeholder="角色英文名" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="role.pageNum"
        :page-size="role.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  id: '',
  chName: '',
  enName: '',
  description: '',
  createTime: '',
  routes: []
};

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      total: null,
      pageNum: 1,
      pageSize: 10,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes();
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes();
      this.serviceRoutes = res.data
      // this.routes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles();
      this.rolesList = res.data.list
    },



    //todo 查询所有的permission,这个permission就是用于查看menus的
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.__generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },

    handleSelect(){

    },

    handleBatchOperate(){

    },
    handleSizeChange(val){

      this.rolesList.pageNum = 1;
      this.rolesList.pageSize = val;
      debugger
      this.getList();
    },
    handleCurrentChange(val){
      this.pageNum = val;
      this.getList();
    },
    getList(){
      getRoles(this.role).then(response => {
        this.rolesList = response.data.list;
        this.total = response.data.total;
        this.pageNum = response.data.pageNum;
        this.pageSize = response.data.pageSize;
      });
    },

    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.__generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.id = data.id
        this.rolesList.push(this.role)
      }

      const { chName, enName,description, createTime } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色中文名: ${chName}</div>
            <div>角色英文名: ${enName}</div>
            <div>角色描述: ${description}</div>
            <div>创建时间: ${createTime}</div>

          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    __onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },

    __generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.__generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    __generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.__onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.__generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },

    __generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.__generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
