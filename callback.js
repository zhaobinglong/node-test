var fs=require('fs');
function getMime(callback){ //callback为回调函数
  fs.readFile('test.json',function(err,data){
    callback(data); //相当于将function(result)传入函数内
  })
}

getMime(function(result){ //function(result)为回调函数
  console.log(result.toString());
})