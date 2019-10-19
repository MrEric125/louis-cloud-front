<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.enName" placeholder="英文角色名" style="width: 200px;" class="filter-item" @change="handleFilter" />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"

      @sort-change="sortChange"
    >
      <!--      :class-name="getSortClass('id')"-->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"  >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="中文角色" prop="zhName" sortable="custom" width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.zhName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文角色" prop="enName" sortable="custom" width="150px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.enName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色描述"  prop="description" sortable="custom" min-width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
          <!--          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" sortable="custom" width="150px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item v-show="false" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="中文角色" prop="zhName">
          <el-input v-model="temp.zhName" />
        </el-form-item>
        <el-form-item label="英文角色">
          <el-input v-model="temp.enName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="temp.description" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getRoles,addRole,updateRole, deleteRole} from '@/api/role'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'Menu',
    components: { Pagination },

    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        currentPage:1,
        pageSize:10,
        listLoading: false,
        //查询条件
        listQuery: {
          page: 1,
          limit: 10,
          enName: undefined,
          zhName: undefined,
          createTime: undefined,
          description:undefined,
          sort: 'id',
          sortCondition:'desc'
        },
        temp: {
          id: undefined,
          enName: 1,
          zhName: '',
          createTime: new Date(),
          description: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },

        rules: {
          createTime: [{ type: 'date', required: true, message: 'createTime is required', trigger: 'change' }],
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getRoles(this.listQuery).then(response=>{
          this.list=response.data.list
          this.total=response.data.total
        })

      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      sortChange(data) {
        const { prop, order } = data
        this.listQuery.sort = prop == null ? 'id' : prop;
        this.listQuery.sortCondition = order==='ascending'?'asc':'desc';
        this.handleFilter()
      },

      resetTempRole() {
        this.temp = {
          id: undefined,
          zhName: "",
          enName: '',
          createTime: new Date(),
          description: '',
          status: 'published',

        }
      },
      handleCreate() {
        this.resetTempRole()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //  todo mock a id
            this.temp.id = parseInt(Math.random() * 100) + 1024
            addRole(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.createTime = new Date(this.temp.createTime)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.createTime = +new Date(tempData.createTime)
            updateRole(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },

      handleDelete(row) {
        const index = this.list.indexOf(row)
        this.$confirm("确认删除？",'Warning',{
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(async ()=>{
          await deleteRole(row).then(response=>{
            if ('success'===response.data){
              this.list.splice(index,1)
              this.$message({
                type: 'success',
                message: 'Delete success!'
              })
            }
          })
        }).catch(err => { console.error(err) })
      },



    }
  }
</script>
