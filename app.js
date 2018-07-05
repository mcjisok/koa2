const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const json = require('koa-json')
const router = require('./router/router')
const cors = require('koa2-cors');




// 解析上传文件 可以填充到ctx.request
const koaBody = require('koa-body');
// 连接mongodb
const mongoose = require('mongoose');
const DBURL = 'mongodb://localhost/vue';
mongoose.connect(DBURL,function (err) {
  if(err){
    console.log(err)
  }
  else{
    console.log('数据库连接成功')
  }
});


// app.use(bodyParser({
//   enableTypes: ['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(cors())

// koabody和中间件bodyParser 冲突重复，只选用一个即可
app.use(koaBody({
  multipart: true,
  json:true,
  text:true,
  form:true,
  formidable: {
    maxFileSize: 300 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}));

router(app)



app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})