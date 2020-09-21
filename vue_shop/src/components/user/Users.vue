<template>
  <div>
<!--      面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图-->
      <el-card class="box-card">
          <el-row :gutter="20">
              <el-col :span="10">
                  <el-input placeholder="请输入用户名称进行搜索" v-model="queryInfo.query" clearable @clear="getUserList">
                   <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
          </el-row>
<!--          添加用户对话框-->
          <el-dialog
                  title="请添加用户"
                  :visible.sync="addDialogVisible"
                  width="50%" @close="addDialogClose">
<!--              内容主体-->
              <el-form  ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px" >
                  <el-form-item  label="用户名" prop="username">
                      <el-input placeholder="请输入3-10个字符长度的名称" v-model="addForm.username"></el-input>
                  </el-form-item>
                  <el-form-item  label="密码" prop="password">
                      <el-input placeholder="请输入6-15个字符的密码" v-model="addForm.password"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱"  prop="email">
                  <el-input placeholder="请输入您要添加的邮箱地址" v-model="addForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                      <el-input placeholder="请输入您要添加的电话号码" v-model="addForm.mobile"></el-input>
                  </el-form-item>

              </el-form>
<!--              底部区域-->
              <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addUser">确 定</el-button>
              </span>
          </el-dialog>
<!--          修改用户对话框-->
          <el-dialog
                  title="修改用户"
                  :visible.sync="editDialogVisible"
                  width="50%"
                  @close="editDialogClose"
                  >
              <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                  <el-form-item label="用户名" >
                      <el-input v-model="editForm.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                      <el-input v-model="editForm.email" ></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                      <el-input v-model="editForm.mobile" ></el-input>
                  </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
           <el-button @click="editDialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="editUserInfo">确 定</el-button>
             </span>
          </el-dialog>
<!--          分配角色对话框-->
          <!--        分配权限的对话框-->
          <el-dialog
                  title="分配角色"
                  :visible.sync="setRoleDialogVisible"
                  width="50%" @close="setRoleDialogClosed">
              <div>
                  <p>当前的用户：{{userInfo.username}}</p>
                  <p>当前的角色：{{userInfo.role_name}}</p>
                  <p>分配新角色：
                      <el-select v-model="selectedRoleId" placeholder="请选择">
                          <el-option
                                  v-for="item in rolesList"
                                  :key="item.id"
                                  :label="item.roleName"
                                  :value="item.id">
                          </el-option>
                      </el-select>
                  </p>
              </div>
              <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
              </span>
          </el-dialog>
<!--     用户列表区域-->
          <el-table :data="userlist" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
              <el-table-column label="电话" prop="mobile"></el-table-column>
              <el-table-column label="角色" prop="role_name"></el-table-column>
              <el-table-column label="状态" >
                  <template v-slot="scope">
                      <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                  <template v-slot="scope">
<!--                      修改-->
                      <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" @click="showEitDialog(scope.row.id)" size="mini"></el-button>
                      </el-tooltip>

<!--                      删除-->
                      <el-tooltip  effect="dark" content="删除角色" placement="top" :enterable="false">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                      </el-tooltip>

<!--                      分配角色-->
                      <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)" ></el-button>
                      </el-tooltip>

                  </template>
              </el-table-column>
          </el-table>
<!--          分页-->
          <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryInfo.pagenum"
                  :page-sizes="[1, 5, 7, 10]"
                  :page-size="queryInfo.pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
      </el-card>
  </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            // 邮箱验证规则
            let checkEmail=(rule,value,callback)=>{
               const regEmail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
           if (regEmail.test(value)){
               return callback
           }
                callback(new Error('请输入合法的邮箱'))
            }
            //手机号验证规则
            let checkMobile=(rule,value,callback)=>{
                const regMobile=/^1\d{10}$/
            if (regMobile.test(value)){
                return callback
            }
                callback(new Error('请输入合法的手机号'))
            }
            return{
                //获取用户列表参数
                queryInfo:{
                    query:'',
                    // 当前页数
                    pagenum:1,
                    // 当前页面展示多少条数据
                    pagesize:5
                },
                userlist:[],
                total:0,
                // 控制用户对话框的显示与隐藏
                addDialogVisible:false,
                // 添加用户的表单数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''

                },
                // 添加用户的表单数据的验证规则
                addFormRules:{
                    username:[{
                        required:true,
                        message:'请输入用户名',
                        trigger:'blur'
                    },
                        {
                          min:3,
                          max:10,
                          message: '用户名称长度在3到10个字符之间',
                          trigger: 'blur'
                        }
                        ],
                    password:[{
                        required:true,
                        message:'请输入密码',
                        trigger:'blur'
                    },
                        {
                            min:6,
                            max:15,
                            message: '密码长度在6到15个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    email:[{
                        required:true,
                        message:'请输入邮箱',
                        trigger:'blur'
                    },{
                        validator:checkEmail,trigger:'blur'
                    }],
                    mobile:[{
                        required:true,
                        message:'请输入手机号',
                        trigger:'blur'
                     }, {
                            validator:checkMobile,trigger:'blur'
                        }],
                },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible:false,
                // 查询到的用户对象信息
                editForm:{},
                // 修改表单的验证规则
                editFormRules:{
                   email:[{
                       required:true,
                       message:'请输入用户邮箱',
                       trigger:'blur'
                            },
                        {
                           validator:checkEmail, trigger:'blur'
                       }
                   ],
                    mobile:[{
                        required:true,
                        message:'请输入用户手机号',
                        trigger:'blur'
                    },{
                        validator:checkMobile, trigger:'blur'
                    }]
                },
                // 控制分配角色对话框的显示与隐藏
                setRoleDialogVisible:false,
                //需要被分配角色的用户信息
                userInfo:{},
                //所有角色的数据列表
                rolesList:[],
                //下拉菜单中选中的角色id值
                selectedRoleId:''
            }
        },
        created() {
            this.getUserList()
        },
        methods:{
            async getUserList(){
           const {data:res} = await this.$http.get('users',{params:this.queryInfo})
               if (res.meta.status!==200){
                   return this.$message.error('获取用户列表失败')
               }
               this.userlist=res.data.users
               this.total=res.data.total

            },
            // 监听分页事件
            handleSizeChange(newSize){
               this.queryInfo.pagesize=newSize
                this.getUserList()
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage){
               this.queryInfo.pagenum=newPage
                this.getUserList()
            },
            // 监听switch开关状态的改变
            async userStateChanged(userinfo){
        const {data:res}=  await  this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
               if (res.meta.status!==200){
                   userinfo.mg_state=!userinfo.mg_state
                   return this.$message.error('更新用户状态失败')
               }
               this.$message.success('更新用户状态成功')
            },
            //监听对话框的取消事件
            addDialogClose(){
               this.$refs.addFormRef.resetFields()
            },
            //确定点击添加新用户
            async addUser(){
             // this.$refs.addFormRef.validate((valid)=>{

             //   //      if (!valid) return
             //   //      //验证通过添加真正的预校验
             //
             //    })
               //此处未添加表单预验证，不知道为啥他一直未返回true
                const {data:res}  =await this.$http.post('users',this.addForm)
                 if(res.meta.status!==201){
                     return this.$message.error('添加用户失败！')

                 }
                     this.$message.success('添加用户成功')
                     // 关闭对话框
                     this.addDialogVisible=false
                     //重新获取用户数据
                     this.getUserList()
            },
            //展示编辑用户的对话框
           async showEitDialog(id){

this.editDialogVisible=true
             const {data:res}= await this.$http.get('users/'+id)
           if (res.meta.status!==200){
               return this.$message.error('查询用户信息失败')
           }
           this.editForm=res.data
            },
            //监听修改用户对话框的关闭事件
            editDialogClose(){
              this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
           async editUserInfo(){
                // this.$refs.editFormRef.validate(valid=>{

                // })
              const {data:res}=await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
            if(res.meta.status!==200){
                return this.$message.error('更新用户数据失败')
            }
            //关闭对话框
               this.editDialogVisible=false
               //刷新数据列表
               this.getUserList()
               //提示修改数据成功
               this.$message.success('更新用户数据成功')
            },
            //根据id删除用户信息
           async removeUserById(id){
              const confirmResult= await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).catch(err=>{
                        return err
              })
               //如果用户确认删除，则返回值为字符串confirm
               //如果用户取消了删除，则返回值为字符串cancel

              if (confirmResult!=='confirm'){
                  return this.$message.info('已取消删除')
              }
            const{data:res}= await this.$http.delete('users/'+id)
               if (res.meta.status!==200){
                   return this.$message.error('删除用户失败！')
               }
               this.$message.success('删除用户成功！')
               this.getUserList()
           },
            // 展示分配角色对话框
            async setRole(userInfo){
                this.userInfo=userInfo
                //展示对话框之前，获取角色的列表
               const {data:res}=await this.$http.get('roles')
                if(res.meta.status!==200){
                    return this.$message.error('获取角色列表失败')
                }
                this.rolesList=res.data
                this.setRoleDialogVisible=true
            },
            //点击按钮，分配角色
           async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选择要分配的角色')
            }
          const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
           if(res.meta.status!==200){
               return this.$message.error('更新角色失败')
           }
          this.$message.success('更新角色成功')
               this.getUserList()
               this.setRoleDialogVisible=false
            },
            //监听分配角色对话框的关闭事件
            setRoleDialogClosed(){
                this.selectedRoleId=''
                this.userInfo={}
            }

        }
    }
</script>

<style scoped>

</style>