(function () {

  //  获取所有图片
  let imgs = document.querySelectorAll('img');


  window.addEventListener('load', () => {
    //防抖,用在了盖楼层,搜索上面
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

    //图片的懒加载
    function loadImg() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      let h = document.documentElement.clientHeight||document.body.clientHeight;
      imgs.forEach(item => {
        if (offsetDis(item).top  < scrollTop + h + 300) {
          const data_src = item.getAttribute('data-img');
          item.setAttribute('src', data_src);
        }
      })
    }
    
    //先执行一次
    loadImg();
    window.addEventListener('scroll', debounce(loadImg, 100));
    




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
        window.addEventListener('scroll', debounce(scrollBody, 150));



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
    });


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
        //拿到的数据
        this.data = [];

        //正在输入
        this.inputChange();

        //数据的渲染
        this.render();

        //触摸我,我变色,利用事件委托
        this.overHanlder();

        //点击选项,把数据放到输入框
        this.clickHanlder();

      }

      //数据的渲染
      render() {
        let strHTML = ``;
        this.data.forEach((item, index) => {
          strHTML += `<li data-id="${index}">${item}</li>`;
        })
        this.el.children[2].innerHTML = strHTML;
      }

      //正在输入,加了防抖
      inputChange() {
        //网易严选搜索接口
        //http://you.163.com/xhr/search/searchAutoComplete.json?
        //参数
        //__timestamp 毫秒级时间戳：13位数字
        //keywordPrefix 关键字
        let that = this;
        this.ipt.addEventListener('input', debounce(search, 200))
        function search() {
          //拿到内容,发送给搜索接口
          let keywordPrefix = that.ipt.value;
          //获取当前13位时间戳
          let __timestamp = Date.now();
          $.ajax({
            type: "get",
            url: '/search',
            data: {
              __timestamp: __timestamp,
              keywordPrefix: keywordPrefix
            }
          }).then(res => {
            if (!res) { return false; }
            //保存一份数据
            that.data = res.data || [];
            //渲染数据
            that.render();
          });
        }
      }

      //触摸我,我变色
      overHanlder() {
        this.el.children[2].addEventListener('mouseover', (event) => {
          let e = event || window.event;
          let target = e.target || e.srcElement

          if (target.nodeName !== 'LI') {
            return false;
          }
          //自己变色,其他的不变色
          let id = target.getAttribute('data-id');
          //转换数组,排他思想
          Array.prototype.slice.call(this.el.children[2].children).forEach((item, index) => {
            item.style.backgroundColor = index == id ? '#f40' : '#fff';
          });
        });

        //离开就清除
        this.el.children[2].addEventListener('mouseleave', () => {
          this.data = [];
          this.render();
        })
      }

      //点击,删除搜索数据,把输入放到输入框
      clickHanlder() {
        this.el.children[2].addEventListener('click', (event) => {
          let e = event || window.event;
          let target = e.target || e.srcElement
          if (target.nodeName !== 'LI') {
            return false;
          }
          //数据赋值给输入框
          this.ipt.value = target.innerText;
          //清空搜索框数据
          this.el.children[2].innerHTML = '';
        });

      }
    }

    //使用代理,解决了跨域问题
    new searchRet({
      el: '.search-btn'
    })

    // 渲染标题
    class titleList {
      constructor(settings = {}) {
        this.el = document.querySelector(settings.el);

        this.render();

      }

      render() {
        $.ajax({
          url: '/api/getTitle',
          type: 'GET',
        }).done(res => {

          let strHTML = `<li><a href="#" class="current">首页</a></li>`;
          //先解构出总体
          let { data } = res;
          //解构出二级菜单数据
          let twoData = [];
          //遍历拿到第一层数据,添加给标题
          for (let key in data) {
            //遍历拿到第二层数据
            twoData.push(data[key]['list']);
            strHTML += `
              <li><a href="#">${data[key]['title']}</a></li>
            `
          }
          this.el.innerHTML = strHTML;
        });
      }

    }

    new titleList({
      el: '.nav',
    });


    //渲染新品首发
    class newList {
      constructor(settings = {}) {
        this.el = document.querySelector(settings.el);

        this.render();
      }
      //数据渲染
      render() {
        $.ajax({
          url: '/api/getNew',
          type: 'GET'
        }).then(res => {
          let { data } = res;
          let strHTML = ``;
          data.forEach(item => {
            strHTML += `
                <li>
                <div class="hd">
                  <a href="javascript:">
                    <img src="${item.imgs[0]}" alt="">
                    <img src="${item.imgs[1]}" alt="" data-id=${item.id}>
                  </a>
                </div>
                <div class="bd">
                  <div class="prdtTags">
                    <span>${item.tag}</span>
                  </div>
                  <h4 class="name"><a href="javascript:" class="fs-14">${item.name}</a></h4>
                  <div class="price">
                    <span class="price-new">${item.priceNew}</span>
                    <span class="price-old">${item.priceOld}</span>
                  </div>
                </div>
              </li>
            `
          });
          this.el.innerHTML = strHTML;
        })




      }
    }
    new newList({
      el: "#new"
    });

    //新品首发,点击事件,因为我的布局问题,a标签无法包裹住li标签
    class newClick {
      constructor(settings = {}) {
        this.el = document.querySelector(settings.el);

        this.clickHanlder();
      }

      clickHanlder() {
        this.el.addEventListener('click', (event) => {
          let e = event || window.event;
          let target = e.target || e.srcElement;


          if (target.nodeName !== 'IMG') {
            return false;
          }
          //这里因为设计问题,a标签无法包住li,暂时先使用图片进行跳转
          let id = target.getAttribute('data-id');

          location.href = `./detail.html?id=${id}`;

        })
      }
    }

    new newClick({
      el: '#new'
    })


  })
})();