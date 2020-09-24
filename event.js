　　// 引入 events 模块
    var events = require('events');
    var EventEmitter=new events.EventEmitter(); /*实例化事件对象*/

    EventEmitter.on('toparent',function(){//订阅消息
     console.log('接收到了消息');
    })

    setTimeout(function(){
         console.log('广播');
         EventEmitter.emit('toparent'); /*发布消息*/
    },1000)