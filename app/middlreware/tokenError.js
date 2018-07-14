
const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const util = require('util');
const verify = util.promisify(jwt.verify);

/**
 * 判断token是否可用
 */
module.exports = function () {
  return async function (ctx, next) {
    try {
      const token = ctx.header.authorization;                                //1、获取token
      console.log(token)
      if(token === undefined){
        console.log(ctx.request.url)
        await next();

      }
      // if(ctx.request.url === '/api/login' || ctx.request.url === '/m'){                         //2、判断是否是前台注册页或登录页api，如果是，就跳过jwt验证
      //   await next();
      // }      
      
      else if (token) {
        try {
          // 解密payload，获取用户名和ID
          let payload = await verify(token.split(' ')[1], 'test');  //3、解析token
          console.log('token解析之后的数据为：',payload)
          ctx.user = {
            name: payload.name,
            id: payload.id
          };
          // ctx.status = 401
          await next();
        } catch (err) {
          console.log('发生错误 token verify fail: ', err);
          console.log(ctx.request)          
          ctx.status = 400;
          ctx.body = {
            success: 0,
            message: 'token失效'
          };
        }
      }
    } catch (err) {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          success: 0,
          message: '认证失败'
        };
      } else {
        err.status = 404;
        ctx.body = {
          success: 0,
          message: '404'
        };
      }
    }
  }
}