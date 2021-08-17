首页 index.html(我在远程修改代码,制造一个冲突)

​	头部是公共的 对应css为 common.css

​	中间的轮播图 css 和jss 是首页里面的内容 这里采用原生js来做

​	解决轮播图的滚动条,和图片在任何分辨率下都居中

```html
解决轮播图的滚动条
overflow:hidden;
图片在任何分辨率下都居中
position: absolute;
left: 50%;
transform: translateX(-50%);
```

​	轮播图按钮问题

​	js控制 根据devicePixelRatio获取缩放比例 然后动态设置style



人气推荐

居家生活

大家都在说

底部
