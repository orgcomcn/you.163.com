(function () {
  window.addEventListener('load', () => {
    // 透明轮播图
    class swiperBaner {
      constructor(settings = {}) {
        this.settings = Object.assign({}, settings);
        //轮播图盒子
        this.el = document.querySelector(this.settings.el);
        //所有的图片
        this.imgs = this.el.children[0].children;
        //上一张,下一张
        this.prev = this.el.children[1].children[0];
        this.next = this.el.children[1].children[1];
        //分页器
        this.pageC = this.el.children[2].children;
        //当前是第几张图片
        this.indexTemp = 0;
        //第一次要先运行一次init();
        this.init();

        //节流阀
        this.flag = true;

        this.timer = setInterval(() => {
          this.indexTemp++;
          if (this.indexTemp >= 4) {
            this.indexTemp = 0;
          }
          this.autoPlay();
        }, 1000)
        //点击轮播
        this.clickHandler();
        //鼠标移入移出
        this.mouseHanlder();
        //上一张,下一张
      }

      //透明轮播,初始化,让第一张图片显示,分页器第一个也变色
      //因为我们是使用的定位,最后一张图片,默认压在最上面
      init() {
        Array.from(this.pageC).forEach((item, index) => {
          item.style.backgroundColor = index === this.indexTemp ? '#CC9756' : '#fff';
          this.imgs[index].children[0].style.opacity = index === this.indexTemp ? 1 : 0;
        })

        //初始化的时候,初始化点击事件
        this.prev.addEventListener('click', () => {
          //节流阀
          if (this.flag) {
            this.flag = false;
            this.indexTemp--;
            if (this.indexTemp < 0) {
              this.indexTemp = 3;
            }
            this.autoPlay(() => { this.flag = true; });
          }
        });

        this.next.addEventListener('click', () => {
          //节流阀,如果为true 才能继续执行
          if (this.flag) {
            //进来就改成false, 动画走完了,通过回调函数,改成true
            this.flag = false;
            this.indexTemp++;
            if (this.indexTemp >= 4) {
              this.indexTemp = 0;
            }
            this.autoPlay(() => { this.flag = true; });
          }
        });
      }

      //自动轮播,用定时器
      autoPlay(fn) {
        [... (this.pageC)].forEach((item, index) => {
          item.style.backgroundColor = index === this.indexTemp ? '#CC9756' : '#fff'
          Utils.animate(this.imgs[index].children[0], { opacity: index === this.indexTemp ? 1 : 0 }, () => {
            //动画走完了,回调函数,改成true;
            if (typeof fn === 'function') {
              fn();
            }
          })
        })
      }

      //mouseenter 停止轮播 mouseleave 开始轮播
      mouseHanlder() {
        //这里为了练习,特意使用两种方式
        let that = this;
        //鼠标进入,清除定时器
        this.el.addEventListener("mouseenter", () => {
          clearInterval(this.timer);
        });

        //鼠标离开,还原定时器
        this.el.addEventListener("mouseleave", function () {
          that.timer = setInterval(() => {
            that.indexTemp++;
            if (that.indexTemp >= 4) {
              that.indexTemp = 0;
            }
            that.autoPlay();
          }, 2000);
        });
      }

      //点击轮播
      clickHandler() {
        clearInterval(this.timer);
        let that = this;
        Array.prototype.slice.call(this.pageC).forEach(function (item, index) {
          item.onclick = () => {
            that.indexTemp = index;
            that.autoPlay();
          }
        });
      }
    }

    //实例化,调用
    new swiperBaner({
      el: '.swiper-container',
    });

  })

})();