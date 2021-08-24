//框架
const express = require('express');
//跨域解决方案
const cors = require("cors");
const proxy = require('http-proxy-middleware');//服务器代理中间件 解决跨域

//格式化日期
const dd = require('silly-datetime');
//数据库工具
const db = require('./libs/DBHelper');
//cmd5加密
const md5 = require('md5');

//创建对象
let app = express();

//配置静态资源,这样就可以直接访问我们的html页面了
app.use(express.static("./../src"));

//配置中间件,如果你不够强大,就找别人来帮忙
//post能够快速使用 body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//配置跨域
app.use(cors());
//服务器代理
app.use('/search', proxy.createProxyMiddleware({
    // 服务器api地址目录 
    target: 'https://you.163.com/xhr/search/searchAutoComplete.json',
    changeOrigin: true,
    pathRewrite: {
        "^/search": ""
    }
}));


//用户的登录接口
app.post('/user/login', async function (request, response) {
  //1.接受前端的数据 (用户名和密码)
  let { phone, pwd } = request.body;
  let params = [phone, md5(md5(pwd) + "jiayan")];
  //准备sql 语句 查询不能把密码查询出来了
  let sql = "SELECT `id`,`phone`,`status` FROM `user` WHERE `phone` = ? AND `pwd` = ? AND `status` = 1";

  try {
    //除了查询返回的是数组, 
    //删除,修改,增加,都是返回受影响的行数
    let result = await db.exec(sql, params);
    if (result && result.length >= 1) {
      response.json({
        msg: '登录成功',
        data: result,
        code: 200
      });
    } else {
      response.json({
        msg: '登录失败,用户名或密码错误,或账户被禁用',
        code: 200
      });
    }
  } catch (e) {
    response.json({
      msg: '程序内部错误',
      data: e,
      code: -200
    });
  }
});

//用户的注册接口
app.post('/user/regedit', async function (request, response) {
  //拿到前端发过来的数据
  let { phone, pwd } = request.body;
  //注册用户: 用户手机号/用户密码/默认启用状态1/格式化注册日期  md5的二次加密
  let params = [phone, md5(md5(pwd) + "jiayan"), 1, dd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')];
  //准备sql语句
  let sql = "INSERT	 INTO `user`  (`phone` , `pwd`, `status`, `date`) VALUES (?,?,?,?)";

  //为了避免程序有错误,我们使用try-catch
  try {
    //除了查询返回的是数组, 
    //删除,修改,增加,都是返回受影响的行数
    let result = await db.exec(sql, params);
    let isReg = result && result.affectedRows;
    //返回数据给前端
    response.json({
      msg: isReg ? '注册成功' : '注册失败',
      //这里放data 是为了ajax的判断,后续新增的
      data: 'new',
      code: 200
    });
  } catch (e) {
    //返回数据给前端 , -200代表其他错误
    response.json({
      msg: '注册失败,用户名密码可能已经存在!',
      code: -200,
      err: e
    });
  }
});

//商品查询接口
//商品搜索接口

app.listen(8080, () => {
  console.log('8080服务器启动成功');
});
