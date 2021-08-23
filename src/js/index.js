(function () {

  window.addEventListener('load', () => {
    //防抖,用在了盖楼成上面
    function debounce(fn, delay) {
      let timer = null;
      return function () {
        let that = this;
        let args = arguments;

        if (timer) clearInterval(timer);
        timer = setTimeout(function () {
          fn.apply(that, args);
        }, delay);
      }
    }


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

        this.timer = setInterval(() => {
          this.indexTemp++;
          if (this.indexTemp >= 4) {
            this.indexTemp = 0;
          }
          this.autoPlay();
        }, 1000);


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
          this.indexTemp--;
          if (this.indexTemp < 0) {
            this.indexTemp = 3;
          }
          this.autoPlay();
        });
        this.next.addEventListener('click', () => {
          this.indexTemp++;
          if (this.indexTemp >= 4) {
            this.indexTemp = 0;
          }
          this.autoPlay();
        });
      }

      //自动轮播,用定时器
      autoPlay() {
        [... (this.pageC)].forEach((item, index) => {
          item.style.backgroundColor = index === this.indexTemp ? '#CC9756' : '#fff'
          Utils.animate(this.imgs[index].children[0], { opacity: index === this.indexTemp ? 1 : 0 })
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
        let that = this;
        Array.prototype.slice.call(this.pageC).forEach(function (item, index) {
          item.onclick = () => {
            that.indexTemp = index;
            that.autoPlay();
          }
        });
      }
    }

    //透明轮播图,实例化,调用
    new swiperBaner({
      el: '.swiper-container',
    });


    //盖楼层
    class Floor {
      constructor(settings = {}) {
        //楼层的box
        this.fl = document.querySelector(settings.fl);
        // 1,2,3,4,5楼
        this.one = document.querySelector(settings.one);
        this.two = document.querySelector(settings.two);
        this.three = document.querySelector(settings.three);
        this.fore = document.querySelector(settings.fore);
        this.five = document.querySelector(settings.five);
        //楼层做成一个对象
        this.obj = {
          one: this.one,
          two: this.two,
          three: this.three,
          fore: this.fore,
          five: this.five
        }
        //默认在-1层等待
        this.index = -1;
        //保存 楼层的offsetTop
        this.arr = [];

        //1.获得每层楼距离页面顶部的距离
        this.init();
        //2.监听页面滚动,指定楼层进行变色
        this.scrollBody();
        //3.监听点击,点击的楼层进变色
        this.clickHandler();
      }

      // 初始化,获得楼层offsetTop
      init() {
        //1. 获得每层楼距离页面顶部的距离，并将它们放入一个数组中。
        for (let item in this.obj) {
          //每个div距离页面顶部的距离。
          this.arr.push(this.obj[item].offsetTop);
        }
        //这里是css属性中设置了marginTop或者bottom,这里把他加上去
        this.arr[0] -= 30;
        this.arr[2] -= 60;
        this.arr[3] -= 60;
        //给楼层添加自定义属性
        Array.from(this.fl.children[0].children).forEach((item, index) => {
          item.children[0].setAttribute('index', index);
        })
      }

      //2. 监听滚动条滚过的距离，根据距离去判断滚到了那一层楼。
      scrollBody() {
        window.addEventListener('scroll', debounce(scrollBody, 200));
        let that = this;
        function scrollBody() {
          //滚动条滚动的距离 不可视区域高度
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          //获取当前楼层
          for (let i = 0; i < that.arr.length; i++) {
            //获取当前楼层和下一楼层的offsetTop
            let now = that.arr[i];
            let next = that.arr[i + 1];

            //如果小于1楼,那么就是在首页.
            if (scrollTop < that.arr[0]) {
              that.index = -1;
            }

            //获取到当前是在第几楼
            if (scrollTop >= now && scrollTop < next) {
              that.index = i;
            } else if (scrollTop >= that.arr[that.arr.length - 1]) {
              that.index = that.arr.length - 1;
            }
          }
          [... (that.fl.children[0].children)].forEach((item, index) => {
            item.children[0].style.backgroundColor = index == that.index ? '#b4a078' : '#fff';
          });
        }
      }


      //点击切换楼层
      clickHandler() {
        this.fl.addEventListener('click', (event) => {
          let e = event || window.event;
          let target = e.target || e.srcElement
          //事件冒泡
          if (target.nodeName !== 'A') {
            return;
          }
          //拿到之前设置好的自定义属性
          let tempIndex = target.getAttribute('index');
          //如果是最后一个楼层,那么就代表返回顶部
          if (tempIndex == 5) {
            $("html,body").stop().animate({
              scrollTop: 0
            });

            return;
          }
          //去到该楼层
          $("html,body").stop().animate({
            //这里增加一点距离,是为了解决bug,最好不要动+20,否则有一个小bug
            scrollTop: this.arr[tempIndex] + 20
          });
        });
      }
    }
    //盖楼层实例化调用
    new Floor({
      fl: '.fixed',
      one: '.m-newProducts',
      two: '.m-indexPopularItem',
      three: '.m-indexCate',
      fore: '.m-bao',
      five: '.g-row',
    })
  })


  //固定导航栏
  class tabTools {
    constructor(settings = {}) {
      this.el = document.querySelector(settings.el);
      this.tab = this.el.children[2];
      //吸顶效果
      this.scrollBody();
    }
    scrollBody() {
      let tabTop = this.tab.offsetTop;
      window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollTop > tabTop) {
          this.tab.style.position = 'fixed';
          this.tab.style.top = '0px';
          this.tab.style.left = '50%';
          this.tab.style.transform = 'translateX(-50%)';
        } else {
          this.tab.style.position = 'static';
          this.tab.style.left = '0';
          this.tab.style.transform = 'translateX(0)';
        }
      })
    }
  }
  new tabTools({
    el: '#header'
  });


  //滚动轮播
  class swiperBanner {
    constructor(settings = {}) {
      this.el = document.querySelector(settings.el);
      //ul list
      this.oList = this.el.children[0];
      //prev next
      this.prev = this.el.nextElementSibling;
      this.next = this.prev.nextElementSibling;
      //当前是第几张图
      this.indexTemp = 0;
      //位置,宽度为364(包含了padding)
      this.pos = 0;
      //节流阀
      this.flag = true;
      this.clickHandler(() => { this.flag = true });
    }
    //大家都在说 轮播图
    clickHandler(fn) {
      this.prev.addEventListener('click', () => {
        //控制图片下标,防止超出
        if (!(this.indexTemp <= 0)) {
          //节流阀
          if (this.flag) {
            this.indexTemp--;
            this.pos -= 364;
            this.flag = false;
            Utils.animate(this.oList, { left: -this.pos }, () => {
              if (typeof fn === 'function') {
                fn();
              }
            });
          }
        }
      })
      this.next.addEventListener('click', () => {
        //控制图片下标,防止超出
        if (!(this.indexTemp >= this.el.children[0].children.length - 3)) {
          //节流阀
          if (this.flag) {
            this.indexTemp++;
            this.pos += 364;
            this.flag = false;
            Utils.animate(this.oList, { left: -this.pos }, () => {
              if (typeof fn === 'function') {
                fn();
              }
            });
          }
        }
      })
    }
  }
  //大家都在说轮播图
  new swiperBanner({
    el: '.carouselImgCon'
  })


  //AJAX拿搜索数据,返回给前端,展示搜索栏
  class searchRet {
    constructor(settings = {}) {
      //拿到大盒子
      this.el = document.querySelector(settings.el);
      //拿到输入框 实时监听里面的输入内容
      this.ipt = this.el.children[0].children[0];
      // this.inputChange();
    }

    inputChange() {
      //网易严选搜索接口
      //http://you.163.com/xhr/search/searchAutoComplete.json?
      //参数
      //__timestamp 毫秒级时间戳：13位数字
      //keywordPrefix 关键字

      this.ipt.addEventListener('input', () => {
        //拿到内容,发送给搜索接口
        let keywordPrefix = this.ipt.value;
        //获取当前13位时间戳
        let __timestamp = Date.now();
        let url = `http://you.163.com/xhr/search/searchAutoComplete.json?__timestamp=1629273744842&keywordPrefix=q`
        $.ajax({
          type: "get",
          url: url,
          success: function (data) {
            console.log(data);
          },
          error: function (err) {
            console.log(err);
          }
        });
      })
    }
  }

  new searchRet({
    el: '.search-btn'
  })

})();