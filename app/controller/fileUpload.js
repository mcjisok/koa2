const path =require('path')
const fs = require('fs')
const Image = require('../models/image')

module.exports = {
    uploadPushImg:async(ctx,next) =>{
        console.log('查看请求数据',ctx.request)
        const file = ctx.request.body.files.file;
        const filePath = file.path;
        const uid = ctx.header.userid;
        // const originalFilename = file.originalFilename
        // console.log(file)
        // console.log(ctx.request.body.files)
        let url;
        let create;
        let imgname;
        let timestamp;
        let up = await new Promise((resolve,reject)=>{
            if (file){
                fs.readFile(filePath, function (err, data) {
                    console.log('读取文件成功')
                    timestamp = Date.now(),
                        type = file.type.split('/')[1],
                        poster = timestamp + '.' + type,
                        newPath = path.join(__dirname, '../../', 'public/pushUpload/' + poster)
                    fs.writeFile(newPath, data, function (err) {
                        console.log('写入文件成功')
                        url = '/pushUpload/' + poster
                        imgname = poster
                        resolve()
                        // return url
                        //next()
                    })
                })
            }
            else{
                reject('上传出错')
            }
        })
        
        //1、判断以当前用户id为名称相册是否已创建
        let album = await Image.find({imageGroupName:uid})
        console.log('相册是否已创建',album)
        //2、如果未创建，则先创建相册再保存图片到该相册
        if(album.length===0){
            let data = {
                imageGroupName:uid,
                albumOwner:uid
            }
            let newAlbum = new Image(data)
            create = await newAlbum.save()
            console.log('新建的相册信息为？',create)
            let newAlbumID = {_id:create._id}

            let save = await Image.update(newAlbumID,{$push:{
                imageList:{
                    imageName:imgname,
                    path:url,
                    uid:timestamp
                }
            }})

            console.log('保存图片到相册的信息为',save)
            if(save.ok === 1){
                ctx.response.body = url
            }
        }
        //3、如果已创建，则直接保存到该相册
        else{
            console.log('相册已创建，直接保存即可')
            let albumID ={_id:album[0]._id};
            console.log('相册ID为？',albumID)
            let save = await Image.update(albumID,{$push:{
                imageList:{
                    imageName:imgname,
                    path:url,
                    uid:timestamp
                }
            }})

            console.log('保存图片到相册的信息为',save)
            if(save.ok === 1){
                ctx.response.body = url
            }
        }
        
        // console.log(url)
        // console.log('userid为',uid)
        // // ctx.response.body = {status:200}
        // // .then(res =>{
        // //     console.log(res)
        // //     ctx.response.body = res
        // // }).catch(err=>{
        // //     console.log(err)
        // // })
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
                    if(fs.existsSync('public/groupImgUpload') === false){
                        fs.mkdirSync('public/groupImgUpload')
                    }
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
        
        let timestamp = (new Date()).getTime(); //生成时间戳 存为uid

        let b = await Image.update(id,{$push:{
            imageList:{imageName:imgname,
            path:imgurl,
            uid:timestamp}
        }})
        console.log(b)
        let success = Promise.all([a,b])
        .then(()=>{
            ctx.response.body = { code:200,msg:'上传成功' }
        })
        .catch(e=>{
            ctx.response.body = { code:400, msg:'上传失败',err:e}
        })
    },
}