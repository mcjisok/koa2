const Comment = require('../models/comment')
const Push = require('../models/push')

module.exports = {
	saveComment:async(ctx,next)=>{
		console.log(ctx.request.body)
		let _comment =ctx.request.body
		let pushID = _comment.push
		let comment = new Comment(_comment)

		let maxCommentReply = Number(_comment.maxCommentReply)
		// console.log(comment)

		if(_comment.cid){
			// console.log('这是回复的')
			let oldComment = await Comment.findOne({_id:_comment.cid}).exec()
			console.log(oldComment)
			let reply = {
				from:_comment.from,
				to:_comment.to,
				content:_comment.content
			}
			oldComment.reply.unshift(reply)
			let docs = await oldComment.save()

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
					.slice('comment', 3)     //slice maxCommentReply 参数必须为number类型，否则会报错
					.exec()
			let success = Promise.all([oldComment,docs,c])
			.then(res=>{
				console.log('即将更新的数据为',c)

				ctx.response.body = {code:200,data:c}				
			})
			

		}
		else{
			var a = await Push.findOne({_id:pushID}).exec()
			if(a){
				a.comment.unshift(comment._id)
				console.log(comment._id)
				console.log(a)
				let updatePush = await a.save()

				let saveComment = await comment.save()
				console.log('保存评论',saveComment)

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