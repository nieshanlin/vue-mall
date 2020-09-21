<template>

    <el-container class="home-container">
<!--        头部-->
        <el-header>
            <div>
                <img src="" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
<!--        页面主体-->
        <el-container>
<!--            侧边栏-->
            <el-aside width="200px">
                <el-menu

                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF" :unique-opened="true" router :default-active="$route.path">
<!--                    router开启子路由跳转-->
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <template slot="title">
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
<!--                    '/'+subItem.path拼接路由-->
                    <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                                  >
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>

            </el-menu>
            </el-aside>
<!--            右侧主体-->
            <el-main>
<!--                子窗口-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data(){
            return {
                // 左侧菜单数据
                menulist:[],
                //选项图标
                iconsObj:{
                    '125':'iconfont el-icon-user-solid',
                    '103':'iconfont el-icon-s-tools',
                    '101':'iconfont el-icon-s-goods',
                    '102':'iconfont el-icon-s-order',
                    '145':'iconfont el-icon-s-platform',
                },

            }
        },
        name: "Home",
        created() {
             this.getMenuList()

        },
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push("/login")
            },
            //获取菜单
           async getMenuList(){
                // 解构赋值
              const {data:res} =await this.$http.get('menus')

               if(res.meta.status!==200){
                   return this.$message.error(res.meta.msg)
               }
               this.menulist=res.data
            },


        }
    }
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left:0;
    align-items: center;
    color: white;
    font-size: 20px;
>div{
   display: flex;
    align-items: center;
    span{
        margin-left: 15px;
    }
}

}
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
    .iconfont{
        margin-right: 10px;
    }
</style>