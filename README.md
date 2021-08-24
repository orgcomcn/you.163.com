# 项目名称
  HTML+CSS+JavaScript+Node.js+MySQL仿网易严选

## 补充说明
  文档后续再进行README.md的补充,这里主要用来记录零碎的笔记和知识点.

首页 index.html(我在远程修改代码,制造一个冲突)

## 巩固到的知识点
首页 index.html
​头部是公共的 对应css为 common.css

​中间的轮播图 css 和jss 是首页里面的内容 这里采用原生js来做

​	解决轮播图的滚动条,和图片在任何分辨率下都居中

```html
解决轮播图的滚动条
overflow:hidden;
图片在任何分辨率下都居中
position: absolute;
left: 50%;
transform: translateX(-50%);
```

图片hover问题
准备两张图片,一张默认隐藏,一张显示,当hover的时候显示第二张隐藏第一张.

动画
transition: 1s ease-out; //这个没记起来
transform:  scale(1.1); 

解决图片放大超出
display: block;
width: 353px;
height: 353px;
overflow: hidden;

// 2行省略号显示
.name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

```txt
网易严选搜索接口
http://you.163.com/xhr/search/searchAutoComplete.json?
参数
__timestamp 毫秒级时间戳：13位数字
keywordPrefix 关键字
```

input 框和文本对齐问题
https://www.cnblogs.com/lst619247/p/8057192.html

​轮播图按钮问题

​js控制 根据devicePixelRatio获取缩放比例 然后动态设置style


登录注册正则,二级菜单

差点忘记

  mouseover和mouseout在父元素和其子元素都可以触发，当鼠标穿过一个元素时，触发次数得依子元素数量而言。
  mouseenter和mouseleave只在父元素触发，当鼠标穿过一个元素时，只会触发一次。
  mouseover和mouseout比mouseenter和mouseleave先触发
  因此一般mouseover和mouseout一起使用，mouseenter和mouseleave一起使用.

# js遇到的问题 以及 复习
## this指向问题
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
````
## 转数组的方式
```javascript
[... (this.pageC)];
Array.form(this.pageC);
Array.prototype.slice.call(this.paceC);
```

