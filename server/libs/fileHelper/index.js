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
//怎么暴露
module.exports = {
  getData,
  setData
}