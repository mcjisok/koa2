const Comment = require('../models/comment')
const Push = require('../models/push')

module.exports = {
	saveComment:async(ctx,next)=>{
		console.log(ctx.request.body)
		let _comment =ctx.request.body
		let pushID = _comment.push
		let comment = new Comment(_comment)

		// console.log(comment)

		if(_comment.cid){
			console.log('这是回复的')
			// Comment.findById(_comment.cid,function(err,comment){
			// 	var reply = {
			// 		from:_comment.from,
			// 		to:_comment.to,
			// 		content:_comment.content
			// 	}

			// 	comment.reply.push(reply)
			// 	console.log('reply里面的数据为：' + comment)
			// 	comment.save(function(err,comment){
			// 		if(err){
			// 			console.log(err)
			// 		}

			// 		// res.redirect('/movie/' + productId)
			// 	})
			// })

			let oldComment = await Comment.findOne({_id:_comment.cid}).exec()
			console.log(oldComment)
			let reply = {
				from:_comment.from,
				to:_comment.to,
				content:_comment.content
			}
			oldComment.reply.unshift(reply)
			let docs = await oldComment.save()
			// let newReply = await Comment.findOne({_id:_comment.cid})
			// 				.populate({path:'from',select:'name _id userInfoPhoto'})
			// 				.populate({path:'reply.from reply.to',select:'name _id userInfoPhoto'})
			// console.log('coscscscscs')
			// console.log(newReply)

			let c = await Push.findOne({_id:pushID})
					.populate({ path: 'userID', select: 'username name userInfoPhoto' })
					.populate({ 
						path: 'comment',
						populate:[
							{path:'from',select:['name','_id','userInfoPhoto']},
							{path:'reply.from',select:['name','_id','userInfoPhoto']},
							{path:'reply.to',select:['name','_id','userInfoPhoto']}
						]
					})  
					.slice('comment', 3)     
					.exec()
					
			let success = Promise.all([oldComment,docs,c])
			.then(res=>{
				ctx.response.body = {code:200,data:c}				
			})
			

		}
		else{
			// var c;
			// var a = await comment.save((err,comment)=>{
			// 	console.log('aaaaaaaaaaaaaaaaaa')
			// })
			var a = await Push.findOne({_id:pushID}).exec()
			if(a){
				a.comment.unshift(comment._id)
				console.log(a)
				let updatePush = await a.save()

				let saveComment = await comment.save()

				// let newComment = await Comment.findOne({_id:comment._id})
				// 				.populate({ path:'from' , select:'name _id userInfoPhoto'})
				// 				.exec()

				let c = await Push.findOne({_id:pushID})
						.populate({ path: 'userID', select: 'username name userInfoPhoto' })
						.populate({ 
							path: 'comment',
							populate:[
								{path:'from',select:['name','_id','userInfoPhoto']},
								{path:'reply.from',select:['name','_id','userInfoPhoto']},
								{path:'reply.to',select:['name','_id','userInfoPhoto']}
							]
						})  
						.slice('comment', 3)     
						.exec()

				let success = Promise.all([updatePush, saveComment,c])
				.then(function (results) {
				    console.log(results);  // [1, 2, 3]
					ctx.response.body = {code:200,data:c}//,data1:updatePush,test:c

				});
			}			
		}
	}
}