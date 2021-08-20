//这个类,不会实例化 ,不会被new
class Utils {
  static getStyle(obj, attr) {
          if (obj.currentStyle) { //ie 6 7 8
              return obj.currentStyle[attr];
          }
          //google  ,  null可以 :before,:after
          return window.getComputedStyle(obj, null)[attr];
      }
      //获取不可见区域的高度
  static getScroll() {
          return {
              left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
              top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
          }
      }
      //缓冲动画
  static animate(oEle, json, callback) {
      //新的位置=当前位置+步长 ( 目标-当前)/10;
      clearInterval(oEle.timer);
      oEle.timer = setInterval(() => {
          let flag = true; //希望动画完成
          for (let attr in json) {
              let target = 0; //目标值
              let current = 0; //当前值
              if (Object.is(attr, "opacity")) {
                  target = parseFloat(json[attr]) * 100;
                  current = parseFloat(Utils.getStyle(oEle, attr)) * 100;
              } else {
                  target = parseInt(json[attr]);
                  current = parseInt(Utils.getStyle(oEle, attr));
              }
              //步长
              let steps = (target - current) / 10;
              //取整
              steps = steps >= 0 ? Math.ceil(steps) : Math.floor(steps);
              //新的位置=当前位置+步长   (zIndex, opacity,不同的情况带单位)
              if (attr === "opacity") { //源头放大了100被,现在就缩小100
                  oEle.style[attr] = (current + steps) / 100;
              } else if (attr === "zIndex") {
                  //直接到目标值位置,不需要参与动画
                  oEle.style.zIndex = target;
              } else {
                  oEle.style[attr] = (current + steps) + 'px';
              }

              if (target != current) {
                  flag = false;
              }
          }
          if (flag) {
              clearInterval(oEle.timer);
              if (typeof(callback) == "function") {
                  callback();
              }
          }
      }, 30)
  }
}