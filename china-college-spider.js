// const express = require('express')
// const app = express()
var fs = require('fs'); // 引入fs模块

// var request = require('superagent')
const request = require("request");

const conn = require('./mysql')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const http=require("http");

const superagent = require('superagent');

// require('events').EventEmitter.defaultMaxListeners = 15;
// // const sqls = require('./sql')
// const sqlObj = new sqls()

let colleges = []

let sql = 'select * from college where uName != "" and site != ""'
conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {

    	// fs.unlinkSync('./data.txt'); // 清空数据
        for (var i = 0; i < results.length; i++) {
            var obj = results[i];

            colleges.push({
            	'序号': i + 1,
            	name: obj['uName'],
            	site: obj['site']
            })
            
            openSite(i)
            // saveData({
            // 	index: i,
            // 	name: obj['uName'],
            // 	site: obj['site']
            // })
            // baiduSearch(firstResult['uName'])
        }
        
        // openSite(0)
        // console.log(colleges)
        // getcollegeListByName(0)
        // updateCollegeName(0)
        
        // console.log(colleges)
        // baiduSearch(2112)

        
    }

})

function saveCollegeSite(data) {
	let sql = 'update college set site = "'+ data.site + '", uName="'+ data.name +'" where uName = "'+ data.oldName +'" '
	conn.query(sql, (err, results) => {})	
}


// 打败百度百科，查找官网
function baiduSearch(index) {
	console.log(index + '开始查找:' + colleges[index]['name'])
	if (index >= colleges.length - 1) {
		console.log('查找结束')
		process.exit();
	}
	let path = 'https://baike.baidu.com/item/' + encodeURI(colleges[index]['name'])
	var options = {uri: path, headers: {}, maxRedirects:10};
	request(options, function (error, response, body) {
         // console.log(error)
         // console.log(response)
         // console.log(body)
	  if (!error && response.statusCode == 200) {
		  const $ = cheerio.load(body, { decodeEntities: false });
		  let site = ''
		  $('.dl-baseinfo dd').each((i, el) => {
		    let link = $(el).find('a').text()
		    if (link.startsWith('http')) {
		    	site = link
		    } 
		  });
		  if (site) {
		  	saveCollegeSite({
		  		name: colleges[index]['name'],
		  		site: site
		  	})
		      // let data = {
	       //        index: index,
	       //        name: colleges[index]['name'],
	       //        site: site
		      // }
		      // openSite(data)
		  } else {
		  	  console.log('没有找到官网：' + colleges[index]['name'])
		  	  saveData({
	              index: index,
	              name: colleges[index]['name'],
	              site: '没有找到官网'
		      })
		  }
		  baiduSearch(index + 1)

	  } else {
	  	console.log('进入else')
	  	console.log(error)
	  }
	})
	.on('error', function(err) {
	    // 链接无限回调会进入error
  	    saveData({
          index: index,
          name: colleges[index]['name'],
          site: '内存溢出'
        })
        baiduSearch(index + 1)
	 })
}

// 打开官网寻找关键字
function openSite(index) {
	// if (index > colleges.length) {
	// 	console.log('done')
	// 	process.exit()
	// }
	console.log(index + '打开' + colleges[index]['name'] + '官网：' + colleges[index]['site'])
	 if (colleges[index]['site']) {
      //   let options = {
      //   	url: colleges[index]['site'],
		    // headers: {
		    //     "content-type": "text/html;charset=utf-8",
		    //     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
		    // },
      //       timeout:5000
      //   }

	    superagent
	        .get(colleges[index].site)
	        .end(function(err, res) {
	            if (err) {
	                // openSite(index + 1)
	            } else {
					let data = {}
					if(res.text.includes('留学生')){
					    Object.assign(data, {'是否有留学生关键字': '是'}, colleges[index])
					} else {
						Object.assign(data, {'是否有留学生关键字': '否'}, colleges[index])
					}
					saveData(data)
					// openSite(index + 1)
	            }
	        })

	} else {
      let res = Object.assign({}, {'是否有留学生关键字': '网站缺失'}, colleges[index])
      saveData(res)
      // openSite(index + 1)

	}
}

function saveData(data){
	// fs.writeFileSync('./data.txt', data, { 'flag': 'a' })
	fs.writeFileSync('./data.txt', JSON.stringify(data) + '\r\n', { 'flag': 'a' }, function(err) {
	    if (err) {
	        throw err;
	        process.exit()
	    } else {
	    	// if (data.index >=  colleges.length - 1) {
	    	// 	console.log('write ok')
	    	// 	process.exit()
	    	// } else {
	    	// 	baiduSearch(data.index + 1)
	    	// }
	    	
	    }
	 
	 
	});	
}

function getcollegeListByName(index) {
	console.log('总共' + colleges.length + '， 当前' + index)
	if (index > colleges.length - 1) {
		console.log('done')
		process.exit()
	}
    let path = 'https://api.eol.cn/gkcx/api/'
	var requestData= {
		keyword: colleges[index]['newName'],
		uri: 'apidata/api/gk/school/lists'
	};
	request({
	    url: path,
	    method: "POST",
	    json: true,
	    headers: {
	        "content-type": "application/json",
	    },
	    body: requestData
	}, function(error, response, body) {
	    if (!error && response.statusCode == 200) {
	       // 通过名字获取到一个学校数组，
	       // 直接取数组中的第一个学校，拿到id，就可以直接请求
	       if (body.data.item.length) {
	       	 getCollegeDetailById(index, body.data.item[0]['school_id'])
	       } else {
	       	 console.log('没有找到官网：' + colleges[index]['name'] )
	         saveCollegeSite({
	       	  site: '',
	       	  name: colleges[index]['name']
	         })
	       	 getcollegeListByName(index + 1)
	       }
	       
	    }
	});
}

function updateCollegeName(index) {
   
}

function getCollegeDetailById(index, school_id) {

    let path = 'https://static-data.eol.cn/www/2.0/school/' + school_id + '/info.json'
	request({
	    url: path,
	    method: "GET",
	    json: true,
	    headers: {
	        "content-type": "application/json",
	    }
	}, function(error, response, body) {
	    if (!error && response.statusCode == 200) {
	       // 通过名字获取到一个学校列表，拿到学校id，就可以直接请求
	       // console.log(body.data)
	       console.log('总共' + colleges.length + '条，第'+ index +':' + body.data.name + '--' + body.data.school_site)
	       saveCollegeSite({
	       	  site: body.data.school_site || body.data.site,
	       	  name: body.data.name,
	       	  oldName: colleges[index]['name']
	       })
	       
	       // saveData({
	       // 	  index: index,
	       // 	  name: body.data.name,
	       // 	  site: body.data.school_site,
	       // })
	       getcollegeListByName(index + 1)
	    } else {
	    	console.log('获取大学详情异常')
	    	getcollegeListByName(index + 1)
	    }
	});	
}

