//框架
const express = require('express');
//跨域解决方案
const cors = require("cors");
//格式化日期
const dd = require('silly-datetime');
//数据库工具
const db = require('./libs/DBHelper');

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

//用户的登录接口
app.post('/user/login', async function (request, response) {
  //1.接受前端的数据 (用户名和密码)
  let { login_iphone, login_pwd } = request.body;
  let params = [login_iphone, login_pwd];
  //准备sql 语句
  let sql = "SELECT COUNT(phone) FROM `user` WHERE `phone` = ? AND `pwd` = ? AND `status` = 1";

  let result = await db.exec(sql, params);
  

});

//用户的注册接口
app.post('/user/regedit', async function (request, response) {

  //拿到前端发过来的数据
  let { reg_iphone, reg_pwd } = request.body;
  //注册用户: 用户手机号/用户密码/默认启用状态1/格式化注册日期
  let params = [reg_iphone, reg_pwd, 1, dd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')];
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
      code: 200
    });
  } catch (e) {
    //返回数据给前端
    response.json({
      msg: '注册失败',
      code: -200,
      err: e
    });
  }
});


app.listen(8080, () => {
  console.log('8080服务器启动成功');
});
