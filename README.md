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

​轮播图按钮问题

​js控制 根据devicePixelRatio获取缩放比例 然后动态设置style
