<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">New User</el-button>

    <el-table :data="usersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="User Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="user.name" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="user.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="User Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import path from 'path'
  import { deepClone } from '@/utils'
  import { getRoutes,addUser, deleteUser, getUsers,updateUser} from '@/api/user'

  const defaultUser = {
    key: '',
    name: '',
    description: '',
    routes: []
  }

  export default {
    data() {
      return {
        user: Object.assign({}, defaultUser),
        routes: [],
        usersList: [],
        dialogVisible: false,
        dialogType: 'new',
        checkStrictly: false,
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
      // Mock: get all routes and users list from server
      this.getRoutes()
      this.getUsers()
    },
    methods: {
      async getRoutes() {
        const res = await getRoutes()
        this.serviceRoutes = res.data
        this.routes = this.generateRoutes(res.data)
      },
      async getUsers() {
        const res = await getUsers()
        this.usersList = res.data
      },

      // Reshape the routes structure so that it looks the same as the sidebar
      __generateRoutes(routes, basePath = '/') {
        const res = []

        for (let route of routes) {
          // skip some route
          if (route.hidden) { continue }

          const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

          if (route.children && onlyOneShowingChild && !route.alwaysShow) {
            route = onlyOneShowingChild
          }
          debugger

          const data = {
            path: path.resolve(basePath, route.path),
            title: route.meta && route.meta.title

          }

          // recursive child routes
          if (route.children) {
            data.children = this.generateRoutes(route.children, data.path)
          }
          res.push(data)
        }
        return res
      },
      __generateArr(routes) {
        let data = []
        routes.forEach(route => {
          data.push(route)
          if (route.children) {
            const temp = this.generateArr(route.children)
            if (temp.length > 0) {
              data = [...data, ...temp]
            }
          }
        })
        return data
      },
      handleAddUser() {
        this.user = Object.assign({}, defaultUser)
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
        this.user = deepClone(scope.row)
        this.$nextTick(() => {
          const routes = this.__generateRoutes(this.user.routes)
          this.$refs.tree.setCheckedNodes(this.__generateArr(routes))
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      },
      handleDelete({ $index, row }) {
        this.$confirm('Confirm to remove the user?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
          .then(async() => {
            await deleteUser(row.key)
            this.usersList.splice($index, 1)
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          })
          .catch(err => { console.error(err) })
      },
      generateTree(routes, basePath = '/', checkedKeys) {
        const res = []

        for (const route of routes) {
          const routePath = path.resolve(basePath, route.path)

          // recursive child routes
          if (route.children) {
            route.children = this.generateTree(route.children, routePath, checkedKeys)
          }

          if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
            res.push(route)
          }
        }
        return res
      },
      async confirmUser() {
        const isEdit = this.dialogType === 'edit'

        const checkedKeys = this.$refs.tree.getCheckedKeys()
        this.user.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

        if (isEdit) {
          await updateUser(this.user.key, this.user)
          for (let index = 0; index < this.usersList.length; index++) {
            if (this.usersList[index].key === this.user.key) {
              this.usersList.splice(index, 1, Object.assign({}, this.user))
              break
            }
          }
        } else {
          const { data } = await addUser(this.user)
          this.user.key = data.key
          this.usersList.push(this.user)
        }

        const { description, key, name } = this.user
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>User Key: ${key}</div>
            <div>User Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
          type: 'success'
        })
      },
      // reference: src/view/layout/components/Sidebar/SidebarItem.vue
      onlyOneShowingChild(children = [], parent) {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.app-container {
  .users-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
