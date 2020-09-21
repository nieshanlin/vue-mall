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
  <el-row :gutter="20">
      <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1) | getGoodsList"></el-button>
          </el-input>
      </el-col>
      <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
      </el-col>
  </el-row>
<!--    table表格-->
    <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"  width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"  width="140px">
            <template v-slot="scope">
                {{scope.row.add_time*1000 | dataFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作"  width="190px">
            <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</el-card>
<!--        分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 5, 7, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "List",
        data(){
            return{
               // 查询参数对象
               queryInfo:{
                   query:'',
                   pagenum:1,
                   pagesize:10
               },
                //商品列表
               goodslist:[],
                // 总数据条数
                total:0
            }
        },
        created() {
            this.getGoodsList()
        },
        methods:{
           async getGoodsList(){
          const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
           if(res.meta.status!==200){
               return this.$message.error('获取商品失败')
           }
           this.$message.success('获取商品列表成功')
               this.goodslist=res.data.goods
               this.total=res.data.total
           },
            handleSizeChange(newsize){
this.queryInfo.pagesize=newsize
                this.getGoodsList()
            },
            handleCurrentChange(newPage){
               this.queryInfo.pagenum=newPage
           this.getGoodsList()
            },
           async removeById(id){
              const confirmResult=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
               if(confirmResult!=='confirm'){
                   return this.$message.info('已经取消删除')
               }
              const {data:res}=await this.$http.delete(`goods/${id}`)
               if(res.meta.status!==200){
                   return this.$message.error('删除商品失败')
               }
               this.$message.success('删除商品成功')
               this.getGoodsList()
            },
            goAddpage(){
               this.$router.push('/goods/add')
            }

        }
    }
</script>

<style scoped>

</style>