// pages/common/Comment/commentComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pushID: {
      type: String,
    },
    fromID: {
      type: String
    },
    comment: {
      type: Array,
    },
    maxCommentReply: {
      // 最多显示多少条评论 以及从后台每次获取的评论条数
      type: Number,
      default: 3
    },
    pushIndex: {
      type: Number,
    },
    api:{
      type:String,      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isInputOnFocus: false,
    inputAnimationData: {},
    btnAnimationData: {},

    commentID: '',
    commentContent: '',

    replyFromID: '',
    replyToId: '',
    replyContent: '',
    
  },
  attached:function(){
    // console.log(this.properties)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onFocus: function (e) {
      this.setData({
        isInputOnFocus: true
      })
      console.log(this.data.isInputOnFocus)
      console.log('获得焦点')
      console.log(e)
      // var animation = wx.createAnimation({
      //   duration: 1000,
      //   timingFunction: "ease",
      //   delay: 0
      // })
      // this.animation = animation
      // this.animation.opacity(0.5).width("400rpx").step();
      // this.setData({
      //   inputAnimationData: this.animation.export()
      // })

    },
    _onBlur: function () {
      this.setData({
        isInputOnFocus: false
      })
    },

    // 监听评论框中评论内容变化
    _changeComment:function(event){
      this.setData({
        commentContent: event.detail.value
      })
      console.log(this.data.commentContent)
    },

    _saveComment:function(){
      let that = this;
      if(that.data.commentContent !== ''){
        
      }
    }
  }
})
