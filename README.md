# 项目名称
  HTML+CSS+JavaScript+Layui+Jquery+MySQL+Node.js仿网易严选

# 安装步骤
## 必备环境
  * MySQL(导入数据库)
  * NODE
1.git clone https://github.com/YangJiang1/you.163.com.git
2.在server目录下 npm install
3.修改 ./server/libs/DBHelper/index.js 中数据库密码
4.node app.js

## 遇到的一些问题

```html
// 解决轮播图的滚动条
overflow:hidden;
// 图片在任何分辨率下都居中
position: absolute;
left: 50%;
transform: translateX(-50%);
```

```txt
图片hover问题
准备两张图片,一张默认隐藏,一张显示,当hover的时候显示第二张隐藏第一张.
```

```html
//动画
transition: 1s ease-out; //这个没记起来
transform:  scale(1.1); 
```

```html
//解决图片放大超出
display: block;
width: 353px;
height: 353px;
overflow: hidden;
```

```html
//多行省略号显示
.name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```txt
网易严选搜索接口
http://you.163.com/xhr/search/searchAutoComplete.json?
参数
__timestamp 毫秒级时间戳：13位数字
keywordPrefix 关键字
```

```txt
mouseover和mouseout在父元素和其子元素都可以触发，当鼠标穿过一个元素时，触发次数得依子元素数量而言。
mouseenter和mouseleave只在父元素触发，当鼠标穿过一个元素时，只会触发一次。
mouseover和mouseout比mouseenter和mouseleave先触发
因此一般mouseover和mouseout一起使用，mouseenter和mouseleave一起使用.
```

## 复习
### this指向问题
```javascript
//箭头函数
[... (this.pageC)].forEach(item => {
  console.log(this);
})
//匿名function函数
Array.from(this.pageC).forEach(function (item) {
  console.log(this);
})
//这里我使用的是class语法,我以为function的this指向window,其实不然
//ES6里面 class默认开启严格模式 ,function 里面的this 是undefined!
//总结:ES6里面 class默认开启严格模式
```
### 转数组的方式
```javascript
[... (this.pageC)];
Array.form(this.pageC);
Array.prototype.slice.call(this.paceC);
```
### 数据库连接工具代码
```javascript
//mysql
const mysql = require('mysql');

//创建连接池
let pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'sunshine1',
  database: 'you163'
});

const exec = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    //创建连接对象
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log('数据库连接失败:' + err.message);
        reject(err.message);
        //reject后面的代码应该还会执行,我们这里return 一下
        return;
      }
      //如果数据库连接成功,那么执行sql语句
      connection.query(sql, params, function (err, result) {
        if (err) {
          console.log('sql语句错误:' + err.message);
          reject(err.message);
          //reject后面的代码应该还会执行,我们这里return 一下
          return;
        }
        //返回正确的结果
        resolve(result);
        //释放连接
        connection.release();
      })
    });
  });
}
//暴露出去
module.exports = {
  exec
}

```

### 文件读取写入工具类代码
```javascript
//1.引入fs模块
const fs = require("fs");
const getData = (path) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, function (err, data) {
      if (!err) {
        resolve(data.toString())
      } else {
        reject(err.message);
      }
    })
  })
}
const setData = (path, data) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, data, function (err) {
      if (!err) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  })
}
//暴露
module.exports = {
  getData,
  setData
}
```
### 获取自身到body的距离
```javascript
    //获取自身到body的距离函数
    function offsetDis(obj) {
      let left = 0;
      let top = 0;

      while (obj) {
        left += obj.offsetLeft;
        top += obj.offsetTop;
        obj = obj.offsetParent;
      }
      return { left, top };
    }
```

### 图片的懒加载
```javascript
  //图片的懒加载
  //获取所有图片
  let imgs = document.querySelectorAll('img');
    function loadImg() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      let h = document.documentElement.clientHeight||document.body.clientHeight;
      imgs.forEach(item => {
        if (offsetDis(item).top < scrollTop + h - 200) {
          const data_src = item.getAttribute('data-img');
          item.setAttribute('src', data_src);
        }
      })
    }
      //思路:
      //1.获取不可见区域的最大高度
      //2.获取浏览器的高度
      //3.不可见区域的高度+浏览器的高度=可视区的最大高度
      //4.获取每一张图片到顶部body的距离, 进行比较 ,如果小于 就把图片自定义属性赋值给src
      
      //这里有一个疑问
      //imgs.getBoundingClientRect().top();  getBoundingClientRect()方法用来获取页面中某个元素的左、上、右、下分别相对浏览器视窗的位置，返回的是一个矩形对象，包括四个属性，分别是left 、top、right、bottom。分别表示元素各边与页面上边和左边的距离。
      //和  offsetDis(item).top 的区别是什么? 能混着用吗
      
      
      //window.innerHeight(返回包含滚动条的窗口内容区域(viewport)的高度) 和 
      // document.documentElement.clientHeight||document.body.clientHeight + window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0; 的区别是什么?
```

### 防抖
```javascript
  //防抖,用在了盖楼层,搜索上面
  function debounce(fn, delay) {
    let timer = null;
    return function () {
      let that = this;
      let args = arguments;

      if (timer) clearInterval(timer);
      timer = setTimeout(function () {
        fn.apply(that, args);
      }, delay);
    }
```

### 数据传输以及接收的方式

```javascript
  
  //发送 location.href = `./detail.html?id=${id}`;
  //截取 let pId = location.search.split('?')[1].split("=")[1];

  //get请求 
  //get请求通过 request.query.name (前端发送过来数据的key名称,必须是name)
  
  //post请求
  //前端发送data: $("form").serialize();

  //server.use(express.urlencoded({ extended: false })); //post能够快速使用 body
  //server.use(express.json()); //post能够快速使用 body
  //以上2句话要一起搭配使用 
  //request.body;//需要配置针对于 post请求的设置

  //api/getCart/:id
  //接收 let id = request.params.id;

```

### 安装的记录包
```
一 .安装的记录包  package.json
创建一个 `package.json`文件
npm init -y  -y 的含义：yes的意思，在init的时候省去了敲回车的步骤，生成的默认的package.json

二. 在第三方的模块 
npm install  express  --save-dev 等价于
npm install  express  -D

三. 使用第三方的模块
const express = require("express");

```

### 配置服务器代理解决跨域
```javascript
//前端发请求
url: '/search'

//后端node配置
const proxy = require('http-proxy-middleware');//服务器代理中间件 解决跨域

//服务器代理
server.use('/search', proxy.createProxyMiddleware({
    // 服务器api地址目录 
    target: 'https://you.163.com/xhr/search/searchAutoComplete.json',
    changeOrigin: true,
    pathRewrite: {
        "^/search": ""
    }
}));

```
### 放大镜
```txt
  mask  遮罩层公式 (可以提前算好,直接给css设置,也可以通过js动态设置)
     maskW = (中图W/大图W)*大区域W  W代表宽度
     maskH = (中图H/大图H)*大区域H  H代表高度
      
  mask 跟随鼠标
    鼠标距离盒子左边距离 =  页面到鼠标的距离 - 盒子距离页面左边的距离

  控制mask 不让他出去 公式
    if (msX <= 0) {
        msX = 0;
    } else if (msX >= 盒子的宽度 - mask的宽度) {
        msX = 盒子的宽度 - mask的宽度;
    }
    if (msY <= 0) {
      msY = 0;
    } else if (msY >= 盒子的高度 - mask的高度) {
        msY = 盒子的高度 - mask的高度;
    }
  
  中图和大图进行移动 比例公式 
    图片比例 = 大图/中图

```