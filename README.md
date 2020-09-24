# node-api
用node来开发后端API接口

## 像php一样在命令行运行一个脚本文件
node xxx.js

## 利用pm2管理本地的node应用（假如本地有三个node应用）
```
// 进入目录cas-admin，可以给应用自定义一个名字来管理
// 后面同理
cd cas-admin的目录

pm2 start app.js --name="cas-admin"   

cd cas-server的目录

pm2 start app.js --name="cas-server"   

cd anaweb的目录

pm2 start app.js --name="anaweb"   
```

## 服务器端启动引用失败
要注意端口，有的端口本地可用，但是服务器端不能用

## nginx反向代理nodejs应用
```
// 在vhost新建一个子域名，然后proxy_pass代理到nodejs启动的地方
server {
    listen 80;
    server_name  api.xxx.com;
    index index.html index.htm index.php default.html default.htm default.php;
    location /{
        proxy_set_header X_Real_IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
    }
}
```