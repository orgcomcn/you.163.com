//mysql
const mysql = require('mysql');

//创建连接池
let pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'sunshine1',
  database: 'you163'
})

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