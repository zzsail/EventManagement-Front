<template>

  <div class="login-container">
    <el-container class="login-inline">
      <el-aside class="login-aside" width="500px" />
      <el-container>
        <el-header class="login-header" height="100px">
          <transition name="el-fade-in-linear" :duration="{enter:1200,leave:300}">
            <div v-if="loginFlag" style="float: right; margin-top: 5px;">
              还没有账户？<el-button ref="registerBtn" type="text" @click="handleSwitch">去注册</el-button>
            </div>
            <div v-if="registerFlag" style="float:  left; margin-top: 5px;">
              <el-button type="text" @click="handleReturn">
                <svg-icon icon-class="return" class-name="icon-large" />
              </el-button>
            </div>
          </transition>
        </el-header>
        <el-main class="login-main">
          <transition name="el-fade-in-linear" :duration="{enter:1200,leave:300}">
            <el-form v-if="loginFlag" ref="loginForm" status-icon :model="loginForm" :rules="loginRules" class="form" auto-complete="on" label-position="left">
              <div class="title-container">
                <h3 class="title">登录到您的账户</h3>
              </div>
              <el-divider />
              <el-form-item prop="username">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入登录密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>

              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
            </el-form>
            <el-form v-if="registerFlag" ref="registerForm" status-icon :model="registerForm" :rules="registerRules" class="form">
              <div class="title-container">
                <h3 class="title">注册您的新账户</h3>
              </div>
              <el-divider />
              <el-form-item prop="username">
                <el-input
                  ref="username"
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                />
              </el-form-item>
              <el-form-item prop="email">
                <el-input
                  ref="email"
                  v-model="registerForm.email"
                  placeholder="请输入邮箱地址"
                  name="email"
                  tabindex="2"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="registerForm.password"
                  :type="passwordType"
                  placeholder="请输入登录密码"
                  name="password"
                  tabindex="3"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
              <el-form-item prop="pwdValidate">
                <el-input
                  :key="passwordType"
                  ref="pwdValidate"
                  v-model="registerForm.pwdValidate"
                  :type="passwordType"
                  placeholder="再次输入密码"
                  name="pwdValidate"
                  tabindex="4"
                  @keyup.enter.native="handleRegister"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>

              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
            </el-form>
            <el-form v-if="infoFlag" ref="infoForm" status-icon :model="infoForm" :inline="true" :rules="infoRules" class="form">
              <div class="title-container">
                <h3 class="title">完善您的信息</h3>
              </div>
              <el-form-item prop="age">
                <el-input
                  v-model="infoForm.age"
                  placeholder="请输入年龄"
                  name="age"
                  tabindex="1"
                />
              </el-form-item>
              <el-form-item prop="gender">
                <el-select v-model="infoForm.gender" placeholder="请选择性别">
                  <el-option value="未知" />
                  <el-option value="男" />
                  <el-option value="女" />
                </el-select>
              </el-form-item>
              <el-button plain style="width:91%;  margin-bottom:30px; float: left;" @click.native.prevent="handleSkip">跳过</el-button>
              <el-button :loading="loading" type="primary" style="width:91%; margin-left: 1px; float: left;" @click.native.prevent="handleOk"> 确定</el-button>
            </el-form>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import { checkUsername } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 3) {
        callback(new Error('用户名长度至少为3位'))
      } else if (value.length > 12) {
        callback(new Error('用户名长度至多为12位'))
      } else if (!/[^\d]/g.test(value)) {
        callback(new Error('用户名不能为纯数字'))
      } else if (!this.isUsername(value)) {
        callback(new Error('用户名仅可包含中文、字母、数字以及下划线'))
      } else {
        this.checkUsername(value).then(res => {
          if (res) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
      } else {
        callback()
      }
    }
    const validatePwdValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'))
      } else if (!this.isEmail(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        this.checkEmail(value).then(res => {
          if (res) {
            callback(new Error('邮箱已被注册'))
          } else {
            callback()
          }
        })
      }
    }
    const validateAge = (rule, value, callback) => {
      if (!value) {
        callback(new Error('年龄不能为空'))
      } else if (value < 0 || value > 256) {
        callback(new Error('请输入正确的年龄'))
      } else {
        callback()
      }
    }
    const validateGender = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择性别'))
      } else {
        callback()
      }
    }
    return {
      genders: ['不详', '男', '女'],
      loginForm: {
        username: '吴亦凡',
        password: '123123'
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        pwdValidate: ''
      },
      infoForm: {
        username: '',
        age: '',
        gender: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        pwdValidate: [{ required: true, trigger: 'blur', validator: validatePwdValidate }]
      },
      infoRules: {
        age: [{ required: true, trigger: 'blur', validator: validateAge }],
        gender: [{ required: true, trigger: 'blur', validator: validateGender }]
      },
      loginFlag: true,
      registerFlag: false,
      infoFlag: false,
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 检查邮箱是否存在
    checkEmail(email) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('user/checkEmail', email)
          .then(response => {
            console.log(response)
            resolve(response)
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      })
    },
    // 检查用户名是否存在
    checkUsername(username) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('user/checkUsername', username)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      })
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 校验用户名
    isUsername(username) {
      return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(username)
    },
    // 校验邮箱
    isEmail(email) {
      return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)
    },
    // 跳过
    handleSkip() {
      this.infoFlag = !this.infoFlag
      setTimeout(() => { this.loginFlag = !this.loginFlag }, 350)
    },
    // 确定
    handleOk() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/improveInfo', this.infoForm).then(() => {
            this.loading = false
            this.infoFlag = !this.infoFlag
            setTimeout(() => { this.loginFlag = !this.loginFlag }, 350)
            this.resetForm('infoForm')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('信息完善错误!!')
          return false
        }
      })
    },
    // 注册
    handleRegister() {
      // 请求后端用户数据
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.infoForm.username = this.registerForm.username
          this.$store.dispatch('user/register', this.registerForm).then(() => {
            setTimeout(() => { this.loading = false }, 350)
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.registerFlag = !this.registerFlag
            setTimeout(() => { this.infoFlag = !this.infoFlag }, 350)
            this.resetForm('registerForm')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('注册错误!!')
          return false
        }
      })
    },
    // 返回登录页面
    handleReturn() {
      if (this.loginFlag) {
        this.loginFlag = !this.loginFlag
        setTimeout(() => { this.registerFlag = !this.registerFlag }, 350)
      } else {
        this.registerFlag = !this.registerFlag
        setTimeout(() => { this.loginFlag = !this.loginFlag }, 350)
      }
      this.resetForm('registerForm')
    },
    // 注册与登录表单的切换
    handleSwitch() {
      if (this.loginFlag) {
        this.loginFlag = !this.loginFlag
        setTimeout(() => { this.registerFlag = !this.registerFlag }, 350)
      } else {
        this.registerFlag = !this.registerFlag
        setTimeout(() => { this.loginFlag = !this.loginFlag }, 350)
      }
      this.resetForm('loginForm')

      // 点击后取消注册的焦点
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            this.$message({
              message: '登录成功',
              type: 'success'
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$dark_gray:#000000;
$cursor: #000000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $dark_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #efefef;
    border-radius: 6px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#8c8c8c;
$loginBg:#ffffff;
$dark_gray:#000000;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  height: 100%;
  // background-color: $bg;
  background-image: url(../../assets/login/loginBg.png);
  background-size: cover;
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .login-input {
    width: 100px;
  }
  .title-container {
    position: relative;
    // border-bottom: $bg solid 1px;
    .title {
      font-size: 26px;
      color: $dark_gray;
      text-align: left;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.login-inline {
  width: 80%;
  height: 80%;
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  .login-aside {
    background-image: url('../../assets/login/inlineBg.jpg');
    background-size: cover;
  }
  .login-header {
    background-color: $loginBg;
  }
  .login-main {
    background-color: $loginBg;
  }
}

.form {
  width: 400px;
  max-width: 65%;
  margin: auto;
}

.icon-large {
  width: 30px;
  height: 30px;
}
</style>
