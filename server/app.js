//框架
const express = require('express');
//跨域解决方案
const cors = require("cors");
const proxy = require('http-proxy-middleware');//服务器代理中间件 解决跨域

//格式化日期
const dd = require('silly-datetime');
//数据库工具
const db = require('./libs/DBHelper');
//文件读取工具
const file = require('./libs/fileHelper');
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

//获取首页的title
app.get('/api/getTitle', async (reuqest, response) => {

  let data = (await file.getData("./data/title.json") || '[]');

  response.json({
    msg: "查询成功",
    data: JSON.parse(data),
    code: 200
  })

});

//获取首页的新品
app.get('/api/getNew', async (reuqest, response) => {
  let data = (await file.getData("./data/new.json") || '[]');
  response.json({
    msg: "查询成功",
    data: JSON.parse(data),
    code: 200
  })
});
//商品查询接口
app.get('/api/prodList/:id', async (reuqest, response) => {
  //拿到所有数据
  var dataList = JSON.parse((await file.getData("./data/new.json")) || '[]');
  //拿到商品的id去查询
  let id = reuqest.params.id;
  //找到数据
  let data = dataList.find(item => item.id === id)

  if (data != null) {
    response.json({
      msg: "查询成功",
      data: data,
      code: 200
    });
  } else {
    response.json({
      msg: "查询失败,没有这个产品",
      data: [],
      code: -200
    });
  }
});


//get --> query
//post --> body
// /:id --> params.id

//加入购物车
app.post("/api/addCart", async (request, response) => {
  let { pId, uId, img, pName, pYh, pGg, pPrice, pCount } = request.body;

  // console.log(pId, uId, img, pName, pYh, pGg, pPrice, pCount);

  let sql = "SELECT * FROM `carts` WHERE `uId` = ? AND `pId` = ? AND `cStatus` = 1";
  let params = [uId, pId];
  //如果查询到数据,就是已经购买
  let isAddCart = (await db.exec(sql, params)).length >= 1;


  if (isAddCart) {
    //如果数据库中有数据,那么改变数量和价格.
    let sqlUpdate = " UPDATE `carts` SET `pCount` = ?+`pCount` , `pPriceCount` = `pCount`* `pPrice` WHERE `uId` = ? AND `pId` = ? AND `cStatus` = 1";
    let params = [pCount, uId, pId];
    let isUpdate = (await db.exec(sqlUpdate, params)).affectedRows >= 1;

    response.json({
      msg: isUpdate ? '加入购物车成功u' : '加入购物车失败u',
    })



  } else {
    //判断如果数据库中没有数据,那么就是新增.
    let sqlInsert = "INSERT INTO `carts` (`pId`,`uId`,`pImg`,`pName`,`pYh`,`pGg`,`pPrice`,`pPriceCount`,`pCount`)  VALUES (?,?,?,?,?,?,?,?,?)";
    let params = [pId, uId, img, pName, pYh, pGg, pPrice, pCount * pPrice, pCount];

    let isInsert = (await db.exec(sqlInsert, params)).affectedRows >= 1;
    response.json({
      msg: isInsert ? '加入购物车成功i' : '加入购物车失败i',
    })
  }






});


//查询接口
app.get("/api/getCart/:id", async (request, response) => {
  let sql = "SELECT * FROM  `carts` WHERE `cStatus` = 1 AND `uId` = ?"
  let id = request.params.id;

  //查询返回的是一个数组
  //更新,删除,修改返回的是受影响的行数
  let data = (await db.exec(sql, id)) || '[]';

  response.json({
    msg: data.length >= 1 ? '查询成功' : '空数据',
    data: data,
    code: 200
  });

});

//修改接口
app.post("/api/modify", async (request, response) => {
  let sql = "UPDATE `carts` SET `pCount`=?, `pPriceCount` = `pCount`* `pPrice` WHERE `cId` = ?"
  let params = [
    request.body.pCount,
    request.body.cId
  ]

  let isModify = (await db.exec(sql, params)).affectedRows >= 1;
  response.json({
    msg: isModify ? '修改成功' : '修改失败'
  });

})

//删除接口
app.post("/api/delCart", async (request, response) => {
  let sql = "UPDATE `carts` SET `cStatus` = 0  WHERE `cId` = ?";
  let cId = request.body.cId;

  let isUpdate = (await db.exec(sql, cId)).affectedRows >= 1;

  response.json({
    msg: isUpdate ? '删除成功' : '删除失败'
  });

})

app.listen(8080, () => {
  console.log('8080服务器启动成功');
});
