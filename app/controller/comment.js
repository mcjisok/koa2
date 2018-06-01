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
		}
		else{
			// var c;
			// var a = await comment.save((err,comment)=>{
			// 	console.log('aaaaaaaaaaaaaaaaaa')
			// })
			var a = await Push.findOne({_id:pushID}).exec()
			if(a){
				a.comment.push(comment._id)
				console.log(a)
				let updatePush = await a.save()
				var b = await comment.save((err,comment)=>{})
			}
			
		}

	}
}