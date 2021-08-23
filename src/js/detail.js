(function () {

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


  //假设数据是从后端请求过来的
  let dataImgs = {
    bigImgs: [
      "images/b1.png",
      "images/b2.png",
      "images/b3.png",
      "images/b4.png",
      "images/b5.png",
    ],
    middleImgs: [
      "images/m1.png",
      "images/m2.png",
      "images/m3.png",
      "images/m4.png",
      "images/m5.png",
    ],
    smallImgs: [
      "images/s1.png",
      "images/s2.png",
      "images/s3.png",
      "images/s4.png",
      "images/s5.png",
    ],
  }

  class Zoom {
    constructor(settings = {}) {
      //整个放大镜
      this.el = document.querySelector(settings.el);

      //放大镜大图
      this.bigImg = this.el.children[0];
      //放大镜中图
      this.midImg = this.el.children[1];
      //放大镜mask 遮罩层
      this.midMask = this.midImg.children[1];
      //小图片list列表
      this.samllImg = this.el.children[2];

      //图片数据
      this.data = dataImgs;

      //动态加载 小图list,大图,中图,并且默认显示第一张.
      this.render();
      //鼠标在mid中移动
      this.mouseHanlder();
      //点击小图,切换中图大图
      this.clickHandler();
    }

    //动态加载图片到网页,中图和大图默认显示第一张.
    render() {
      let { bigImgs, middleImgs, smallImgs } = this.data;
      let strHtml = ``;
      smallImgs.forEach((item, index) => {
        strHtml += `<li><img src="${item}" alt="" data-index="${index}"></li>`
      })
      //把小图添加到ul标签中
      this.samllImg.children[0].innerHTML = strHtml;
      //显示第一张中图和第一张大图
      this.midImg.children[0].src = middleImgs[0];
      this.bigImg.children[0].src = bigImgs[0];
    }

    //放大镜具体实现
    mouseHanlder() {
      //光标移入midImg
      this.midImg.addEventListener('mouseenter', () => {
        //让mask, 和大图 显示
        this.midMask.style.display = 'block';
        this.bigImg.style.display = 'block';

        //光标在midImg中移动
        this.midImg.addEventListener('mousemove', (event) => {
          let e = event || window.event;
          //改变遮罩层的大小,让遮罩层也要成比例关系
          //公式 
          //模态框W = (中图W/大图W)*大区域W  W代表宽度
          //模态框H = (中图H/大图H)*大区域H  H代表高度
          //这一步可以提前计算好,然后在css中固定大小

          //公式: 鼠标距离盒子左边距离 =  页面到鼠标的距离 - 盒子距离页面左边的距离
          let msX = e.pageX - offsetDis(this.midImg).left - this.midMask.offsetWidth / 2;
          let msY = e.pageY - offsetDis(this.midImg).top - this.midMask.offsetHeight / 2;

          //不能让mask超出
          if (msX < 0) {
            msX = 0;
          } else if (msX >= this.midImg.offsetWidth - this.midMask.offsetWidth) {
            msX = this.midImg.offsetWidth - this.midMask.offsetWidth;
          }

          if (msY < 0) {
            msY = 0;
          } else if (msY >= this.midImg.offsetHeight - this.midMask.offsetHeight) {
            msY = this.midImg.offsetHeight - this.midMask.offsetHeight;
          }

          //mask跟随光标移动
          this.midMask.style.left = msX + 'px';
          this.midMask.style.top = msY + 'px';

          //大图进行移动
          //移动的比例公式 
          // scaleW = 大图W / 中图W W代表宽度
          // scaleH = 大图H / 中图H H代表高度
          let scaleW = this.bigImg.children[0].offsetWidth / this.midImg.children[0].offsetWidth;
          let scaleH = this.bigImg.children[0].offsetHeight / this.midImg.children[0].offsetHeight;

          this.bigImg.children[0].style.left = -scaleW * msX + 'px';
          this.bigImg.children[0].style.top = -scaleH * msY + 'px';

          //光标离开midImg
          this.midImg.addEventListener('mouseleave', () => {
            //让mask, 和大图 隐藏
            this.midMask.style.display = 'none';
            this.bigImg.style.display = 'none';
          });
        });
      });
    }
    //点击换图
    clickHandler() {
      let { bigImgs, middleImgs, smallImgs } = this.data;
      
      this.samllImg.addEventListener('click', (event) => {
        let e = event || window.event;
        let target = e.target || e.srcElement;

        if (target.nodeName !== 'IMG') {
          return false;
        }
        let indexTemp = target.getAttribute('data-index');
        
        Array.prototype.slice.call(this.samllImg.children[0].children).forEach((item, index) => {
          item.style.border = index == indexTemp ? '1px solid red' : 'none';
          this.midImg.children[0].src = middleImgs[indexTemp];
          this.bigImg.children[0].src = bigImgs[indexTemp];
        })

      })

    }


  }


  new Zoom({
    el: '#zoom'
  })

})();