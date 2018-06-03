const router = require('koa-router')()
const HomeController = require('../app/controller/home')
const USER = require('../app/controller/user')
const UPLOAD = require('../app/controller/fileUpload')
const PUSH = require('../app/controller/push')
const COMMENT = require('../app/controller/comment')

module.exports = (app) => {
  router.get('/m',HomeController.mobile)

  router.get( '/', HomeController.index )
  
  router.get('/home', HomeController.home)
  
  router.get('/home/:id/:name', HomeController.homeParams)
  
  router.get('/user', HomeController.login)
  
  router.post('/user/register', HomeController.register)
  
  router.get('/ajaxtest',async(ctx,next) =>{
    ctx.response.body = { title:'1'}
  })

  // 用户注册、登录等路由
  router.post('/register', USER.register)
  router.post('/login', USER.login)
  // 保存用户资料
  router.post('/saveUserInfo',USER.saveUserInfo)
  

  //用户上传照片api
  router.post('/uploadPushImg', UPLOAD.uploadPushImg)
  // 上传头像
  router.post('/uploadUserInfoImg', UPLOAD.uploadUserInfoImg)
  


  // 用户发布新动态消息
  router.post('/savePush', PUSH.savePush)

  // 获取最新动态
  router.post('/getPushList',PUSH.getPushList)

  // 用户获取草稿箱中的pushlist
  router.post('/getDraftsList',PUSH.getDraftsList)

  // 用户删除push 已发布的和草稿箱中的公用一个借口
  router.post('/delPush',PUSH.delPush)

  // 评论 回复
  router.post('/saveComment',COMMENT.saveComment)

  
  app.use(router.routes())
    .use(router.allowedMethods())
}