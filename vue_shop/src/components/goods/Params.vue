<template>
    <div>
        <!--      面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--      卡片视图-->
        <el-card>
<!--            警告-->
            <el-alert
                    title="注意：只允许为第三级分类设置相关参数！"
                    type="warning" :closable="false" show-icon>
            </el-alert>
<!--            选择商品分类区域-->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
<!--                    选择商品分类的级联选择框-->
                    <el-cascader
                            v-model="seclectedCateKeys"
                            :options="catelist"
                            :props="{ expandTrigger: 'hover',value:'cat_id', label:'cat_name',
                        children:'children'}"
                            @change="handleChange">

                    </el-cascader>
                </el-col>
            </el-row>
<!--            tab页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
<!--                    动态参数表格-->
                    <el-table :data="manyTableDate" border stripe>
<!--                        展开行-->
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <!--                        循环渲染tag标签-->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>
<!--                                输入文本-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
<!--                                添加按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>


<!--                        索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
<!--                   静态属性表格-->
                    <el-table :data="onlyTableData" border stripe>
                        <!--                        展开行-->
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <!--                        循环渲染tag标签-->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!--                                输入文本-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--                                添加按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!--                        索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>

        </el-card>
<!--        添加参数的对话框-->
        <el-dialog
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
               >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
        </el-dialog>
<!--        修改参数的对话框-->
        <el-dialog
                :title="'修改'+titleText"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data(){
            return{
            //商品分类列表
                catelist:[],
                // 级联选择框双向绑定到的数组
                seclectedCateKeys:[],
                // 被激活的页签的名称
                activeName:'many',
                //动态参数数据
                manyTableDate:[],
                //静态参数数据
                onlyTableData:[],
                //控制添加对话框的显示与隐藏
                addDialogVisible:false,
                //添加表单参数的数据对象
                addForm:{
                    attr_name:''
                },
                //添加表单的验证规则对象
                addFormRules:{
                    attr_name: [{
                     required:true,message:'请输入参数名称',trigger:'blur'
                    }]
                },
                //控制修改对话框的显示与隐藏

                editDialogVisible:false,
                //修改的表单数据对象
                editForm:{},
                //修改表单的验证规则对象
                editFormRules:{
                    attr_name: [{
                        required:true,message:'请输入参数名称',trigger:'blur'
                    }]
                }

            }
        },
        created() {
            this.getCateList()
        },
        methods:{
   //获取所有的商品分类列表
           async getCateList(){
              const {data:res}=await this.$http.get('categories')
               if(res.meta.status!==200){
                   return this.$message.error('获取商品分类失败')
               }
             this.catelist=res.data

           },
          // 级联选择框选中的项变化，会触发这个函数
            handleChange(){
             this.getParmsData()

            },
            // tab页签点击事件的处理函数
            handleTabClick(){
                this.getParmsData()
            },
            // 获取参数列表数据
           async getParmsData(){
               if(this.seclectedCateKeys.length!==3){
                   this.seclectedCateKeys=[]
                   this.manyTableDate=[]
                   this.onlyTableData=[]
                   return
               }
               //根据所选的分类的id，和当前所处的面板，获取对应的参数
               const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
               if(res.meta.status!==200){
                   return this.$message.error('获取参数列表失败')
               }
               res.data.forEach(item=>{
                   //控制文本框的显示与隐藏
                   item.inputVisible=false
                   //文本框中输入的值
                   item.inputValue=''
                  item.attr_vals=item.attr_vals ? item.attr_vals.split(' '):[]


               })

               if(this.activeName==='many'){
                   this.manyTableDate=res.data
               }else {
                   this.onlyTableData=res.data
               }
            },
            //监听添加对话框的关闭事件
            addDialogClosed(){
              this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加参数
            addParams(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return
                    const {data:res}=  await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name, attr_sel:this.activeName})
                    if(res.meta.status!==201){
                        return this.$message.error('添加分类失败')
                    }
                    this.$message.success('添加参数成功')
                    this.addDialogVisible=false
                    this.getParmsData()

            })
        },
            // 点击按钮，展示修改的对话框
            async showEditDialog(attrId){
             this.editDialogVisible=true
               const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,{
                    params:{attr_sel:this.activeName}
                })
                if(res.meta.status!==200){
                    return this.$message.error('获取参数信息失败')
                }
                this.editForm=res.data
            },
            editDialogClosed(){
               this.$refs.editFormRef.resetFields()
            },
            // 点击按钮，修改参数信息
            editParams(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid) return
                    const {data:res}=  await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                        attr_name:this.editForm.attr_name, attr_sel:this.activeName})
                    if(res.meta.status!==200){
                        return this.$message.error('修改参数失败')
                    }
                    this.$message.success('修改参数成功')
                    this.editDialogVisible=false
                    this.getParmsData()

                })
            },
            // 根据id删除对应参数项
           async  removeParams(attrId){
             const confirmResult= await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
               if(confirmResult!=='confirm'){
                   return this.$message.info('已取消删除')
               }
               const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
               if(res.meta.status!==200){

                   return this.$message.error('删除参数信息失败')

               }

               this.$message.success('删除参数成功')
               this.getParmsData()

            },
            // 文本框失去焦点，或按下enter都会触发
           async handleInputConfirm(row){
               if(row.inputValue.trim().length===0){
                   row.inputValue=''
                   row.inputVisible=false
                   return
               }
               // trim是去空格
               row.attr_vals.push(row.inputValue.trim())
                row.inputValue=''
                row.inputVisible=false
                //发起请求保存到数据库
               this.saveAttrVals(row)
            },
            // 封装请求
          async saveAttrVals(row){
                //发起请求保存到数据库
                const {data:res}= await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })
                if(res.meta.status!==200){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
            },
            // 显示输入文本框
            showInput(row){
               row.inputVisible=true
                // 让文本框自动获得焦点
                // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码

                this.$nextTick(()=> {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的参数可选项
            handleClose(i,row){
               row.attr_vals.splice(i,1)
                this.saveAttrVals(row)

            }
        },
        computed:{
            //如果按钮需要被禁用,则返回true，否则返回false
            isBtnDisabled(){
                if(this.seclectedCateKeys.length!==3){
                    return true
                }
                return false
            },
            //选中的三级分类的id
            cateId(){
                if(this.seclectedCateKeys.length===3){
                    return this.seclectedCateKeys[2]
                }
               return null

            },
            //动态计算标题的文本
            titleText(){
            if(this.activeName==='many'){
                return'动态参数'
            }
            return '静态属性'
            }
        }
    }
</script>

<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
    .el-tag{
        margin: 10px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>