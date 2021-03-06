const router = require('koa-router')()
const HomeController = require('../app/controller/home')
const USER = require('../app/controller/user')
const UPLOAD = require('../app/controller/fileUpload')
const PUSH = require('../app/controller/push')
const COMMENT = require('../app/controller/comment')
const GROUP = require('../app/controller/group')
const TAG = require('../app/controller/tag')
const SUBTAG = require('../app/controller/subtag')
const IMAGE = require('../app/controller/image')
const SEARCH =require('../app/controller/search')

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
  router.get('/verification',USER.verification)  //获取验证码

  // 保存用户资料
  router.post('/saveUserInfo',USER.saveUserInfo)
  

  //用户上传照片api
  router.post('/uploadPushImg',UPLOAD.uploadPushImg)
  // 上传头像
  router.post('/uploadUserInfoImg', UPLOAD.uploadUserInfoImg)
  // 上传分组封面照片
  router.post('/uploadGroupImg',UPLOAD.uploadGroupImg)
  


  // 发不动动态消息页面获取所有一级标签和二级标签
  router.get('/getAllTagList',TAG.getAllTagList)

  // 用户发布新动态消息
  router.post('/savePush', PUSH.savePush)

  // 获取最新动态
  router.post('/getPushList',PUSH.getPushList)

  // 用户获取草稿箱中的pushlist
  router.post('/getDraftsList',PUSH.getDraftsList)

  // 用户删除push 已发布的和草稿箱中的公用一个借口 管理后台删除push也用同一接口
  router.post('/delPush',PUSH.delPush)

  // 评论 回复
  router.post('/saveComment',COMMENT.saveComment)

  //提交分组申请
  router.post('/saveGroup',GROUP.saveGroup)

  // 用户获取用户所加入的所有分组列表
  router.post('/getMyGroupList',GROUP.getMyGroup)

  // 用户获取热门分组列表
  router.get('/getHotGroupList',GROUP.getHotGroup)

  // 用户获取分组详情
  router.post('/getGroupDetail',GROUP.getGroupDetail)
  // 用户获取指定分组push列表
  router.post('/getGroupPushList',GROUP.getGroupPushList)

  //个人中心=》我的相册 获取图片列表
  router.post('/getPhotoListInWeb',IMAGE.getPhotoListInWeb)
  
  router.post('/test1',async(ctx,next)=>{
    console.log(ctx.request.body)
  })




  

  // 管理后台api
  // 用户管理板块
  router.get('/userlist',USER.getUserList)

  // 获取push列表
  router.get('/pushlist',PUSH.getPushAllList)

  // 获取push详情列表(移动端前台和PC端管理后台均使用该接口)
  router.post('/getPushDetail',PUSH.getPushDetail)
  
  //根据id删除用户
  router.post('/delUser',USER.delUser)

  // 获取标签数据
  router.get('/getTagList', TAG.getTagList)
  //保存一级标签
  router.post('/saveTag',TAG.saveTag) 
  // 删除一级标签
  router.post('/delTag',TAG.delTag)


  // 获取分组数据
  router.get('/getGroupList',GROUP.getGroupList)
 
  // 修改分组审核状态state
  router.post('/changeGroupState',GROUP.changeGroupState)

  // 删除分组
  router.post('/delGroup',GROUP.delGroup)


  // 相册管理
  // 新建相册
  router.post('/savePhotoGroup',IMAGE.savePhotoGroup)
  // 获取所有相册列表
  router.get('/getPhotoGroupList',IMAGE.getPhotoGroupList)
  // 在相册中上传照片
  router.post('/uploadPhoto',UPLOAD.uploadPhoto)
  // 获取指定相册中的所有照片
  router.post('/getPhotoList',IMAGE.getPhotoList)



  // 搜索 查询
  router.get('/getHotSearchList',SEARCH.getHotSearchList)
  //根据搜索类型和内容 查询详细列表
  router.get('/getSearchResult',SEARCH.getSearchResult)



  //小程序接口
  // 查询用户是否首次使用该网站小程序
  router.post('/wechat/wechatUser',USER.wechatUser)

  // 为首次登陆的小程序用户生成用户ID并保存到数据库
  router.post('/wechat/createWechatUser',USER.createWechatUser)


  // 后台管理系统主页
  router.get('/manager',HomeController.manager)

  app.use(router.routes())
    .use(router.allowedMethods())
}