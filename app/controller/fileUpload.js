const path =require('path')
const fs = require('fs')
const Image = require('../models/image')

module.exports = {
    uploadPushImg:async(ctx,next) =>{
        // console.log('111111111111')
        const file = ctx.request.body.files.file
        const filePath = file.path
        // const originalFilename = file.originalFilename
        // console.log(file)
        // console.log(ctx.request.body.files)
        await new Promise((resolve,reject)=>{
            if (file){
                fs.readFile(filePath, function (err, data) {
                    console.log('读取文件成功')
                    const timestamp = Date.now(),
                        type = file.type.split('/')[1],
                        poster = timestamp + '.' + type,
                        newPath = path.join(__dirname, '../../', 'public/pushUpload/' + poster)
                    fs.writeFile(newPath, data, function (err) {
                        console.log('写入文件成功')
                        const url = '/pushUpload/' + poster                       
                        resolve(url)
                        //next()
                    })
                })
            }
            else{
                reject('上传出错')
            }
        })
        .then(res =>{
            console.log(res)
            ctx.response.body = res
        }).catch(err=>{
            console.log(err)
        })
    },

    uploadUserInfoImg:async(ctx)=>{
        const file = ctx.request.body.files.file
        const filePath = file.path
        await new Promise((resolve,reject)=>{
            if (file){
                fs.readFile(filePath, function (err, data) {
                    console.log('读取文件成功')
                    const timestamp = Date.now(),
                        type = file.type.split('/')[1],
                        poster = timestamp + '.' + type,
                        newPath = path.join(__dirname, '../../', 'public/userInfoUpload/' + poster)
                    fs.writeFile(newPath, data, function (err) {
                        console.log('写入文件成功')
                        const url = '/userInfoUpload/' + poster                       
                        resolve(url)
                        //next()
                    })
                })
            }
            else{
                reject('上传出错')
            }
        })
        .then(res =>{
            console.log(res)
            ctx.response.body = res
        }).catch(err=>{
            console.log(err)
        })
    },

    // 上传分组封面图片
    uploadGroupImg:async(ctx,next)=>{
        const file = ctx.request.body.files.file
        const filePath = file.path
        await new Promise((resolve,reject)=>{
            if (file){
                fs.readFile(filePath, function (err, data) {
                    console.log('读取文件成功')
                    const timestamp = Date.now(),
                        type = file.type.split('/')[1],
                        poster = timestamp + '.' + type,
                        newPath = path.join(__dirname, '../../', 'public/groupImgUpload/' + poster)
                    fs.writeFile(newPath, data, function (err) {
                        console.log('写入文件成功')
                        const url = '/groupImgUpload/' + poster                       
                        resolve(url)
                        //next()
                    })
                })
            }
            else{
                reject('上传出错')
            }
        })
        .then(res =>{
            console.log(res)
            ctx.response.body = res
        }).catch(err=>{
            console.log(err)
        })
    },


    //上传相册照片
    uploadPhoto:async(ctx,next)=>{
        const file = ctx.request.body.files.file
        const filePath = file.path
        // console.log(file,filePath)
        const id = ctx.request.body.fields
        let imgurl;
        let imgname;
        let a = await new Promise((resolve,reject)=>{
            if (file){
                fs.readFile(filePath, function (err, data) {
                    console.log('读取文件成功')
                    const timestamp = Date.now(),
                        type = file.type.split('/')[1],
                        poster = timestamp + '.' + type,
                        newPath = path.join(__dirname, '../../', 'public/photoGroup/' + id._id + '/' + poster)
                    console.log('文件夹是否存在？？？？？',fs.existsSync(newPath))
                    if(fs.existsSync('public/photoGroup/'+id._id) === false){
                        fs.mkdirSync('public/photoGroup/'+id._id)
                    }
                    fs.writeFile(newPath, data, function (err) {
                        console.log('写入文件成功')
                        const url = '/photoGroup/' + id._id + '/' + poster
                        // 保存url到相册
                        imgurl = url
                        imgname = poster
                        resolve(url)
                        //next()
                    })
                })
            }
            else{
                reject('上传出错')
            }
        })

        let b = await Image.update(id,{$push:{
            imageList:{imageName:imgname,
            path:imgurl}
        }})
        console.log(b)
        let success = Promise.all([a,b])
        .then(()=>{
            ctx.response.body = { code:200,msg:'上传成功' }
        })
        .catch(e=>{
            ctx.response.body = { code:400, msg:'上传失败',err:e}
        })
    }
}