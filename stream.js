var fs = require("fs");
const rs = fs.createReadStream("../1.jpg");
let content = "";

rs.on("open", () => {
    console.log("start to read");
});

rs.on("data", chunk => {
	console.log('rs on on on ')
	console.log(chunk)
    content += chunk.toString("utf8");
});

rs.on("close", () => {
    console.log("finish read, content is:\n", content);
});

// 借助 stream 的 pipe，一行快速封装一个大文件的拷贝函数：
// function copyBigFile(src, target) {
//     fs.createReadStream(src).pipe(fs.createWriteStream(target));
// }