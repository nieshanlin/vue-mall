<template>
    <div class="login_container">
     <div class="login_box">
    <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
    </div>
<!--         登录表单-->
         <el-form ref="loginFormRef" :rules="loginFormRules"  :model="loginForm" label-width="0px" class="login_form">
<!--             用户名-->
             <el-form-item prop="username">
                 <el-input v-model="loginForm.username" prefix-icon="el-icon-user" ></el-input>
             </el-form-item>
<!--             密码-->
             <el-form-item prop="password">
                 <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
             </el-form-item>
<!--             按钮-->
             <el-form-item class="bths">
                 <el-button type="primary" @click="login">登录</el-button>
                 <el-button type="info" @click="resetLoginForm">重置</el-button>
             </el-form-item>
         </el-form>
     </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data(){
            return{
                //这是登录表单的数据绑定
                loginForm:{
                 username:'admin',
                  password:'123456'
                },
                loginFormRules:{
                    username:[
                        { required: true, message: '请输入用户', trigger: 'blur' },
                        { min: 3, max: 10, message: '输入长度在 3 到 10 个字符', trigger: 'blur' }
                        ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 10, message: '输入长度在 6到 10 个字符', trigger: 'blur' }
                        ]
                }
            }

        },
        methods:{
            //重置表单
            resetLoginForm(){
               this.$refs.loginFormRef.resetFields();
            },
            login(){
                this.$refs.loginFormRef.validate(async (valid)=>{
                    if (!valid) return
                 const {data:res} =await this.$http.post('login',this.loginForm);
                 if(res.meta.status!==200)
                     return this.$message.error('登录失败，请检查账号密码是否正确')
                 this.$message.success('登录成功')
                    // 1.将登录成功之后的token,保存到客户端的sessionStorage 中
                    // 1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
                    // 1.2 token只应在当前网站打开期间生效，所以将token 保存在sessionStorage 中
                    // 2.通过编程式导航跳转到后台主页，路由地址是/home
                   window.sessionStorage.setItem("token",res.data.token)
                    this.$router.push("/home")
                })
            }
        }

    }
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar_box{
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            height: 130px;
            width: 130px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }

    }
.bths{
    display: flex;
    justify-content: flex-end;
}
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>