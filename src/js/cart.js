(function () {
  window.addEventListener('load', () => {

    //我们的用户,登录后,存进了session
    let userInfo = sessionStorage.getItem('User');

    //如果拿到的是空数据(没有用户登录) 那么不处理,并且终止程序
    if (!userInfo) {
      layer.msg('小子,请问你登录了吗?', { icon: 2, time: 1000, shade: 0.4 }, function () {
        location.replace('./login.html');
      });
      return false;
    }

    //渲染购物车的数据,以及购物车的功能
    class renderCart {
      constructor(settings = {}) {
        //大盒子
        this.el = document.querySelector(settings.el);
        //渲染数据的区域
        this.ulList = this.el.querySelector('.c-detail ul');

        //提交按钮
        this.submitBnt = this.el.querySelector('.submit');

        //全选按钮
        this.allBtn = null;

        //点击按钮 sub ++  / sup --
        this.subBtn = null;
        this.supBtn = null;
        //删除按钮
        this.delBtn = null;

        //渲染购物车数据
        this.render();

      }

      //渲染数据
      render() {
        let userId = JSON.parse(userInfo).id;
        $.ajax({
          url: `/api/getCart/${userId}`,
          type: 'GET',
        }).then(res => {
          //拿到id,到数据库中去查询,该用户的订单信息
          let { data } = res;
          let strHTML = `
          <li>
          <div class="w1">
            <input type="checkbox" class="all">
            <span>全选</span>
          </div>
          <div class="w2">
            商品信息
          </div>
          <div class="w3">
            单价
          </div>
          <div class="w4">
            数量
          </div>
          <div class="w5">
            小计
          </div>
          <div class="w6">
            操作
          </div>
        </li>
      `;
          //遍历用户在数据库中的数据
          data.forEach(item => {
            strHTML += `
            <li data-cid="${item.cId}">
            <div class="w1">
              <input type="checkbox" class="box">
            </div>
            <div class="w2">
              <div class="pic">
                <a href="#">
                  <img src="${item.pImg}" alt="">
                </a>
              </div>
              <div class="nameCon">
                <div class="promotionBar">
                  <span>特价抢购中</span>
                  <span>距优惠结束</span>
                  <span>${item.pYh}</span>
                </div>
                <a href="#">软萌柔弹，日式蓬软太鼓抱枕</a>
                <span>${item.pGg}</span>
              </div>
            </div>
            <div class="w3">
              <span>¥${parseFloat(item.pPrice).toFixed(2)}</span>
            </div>
            <div class="w4">
              <span class="sup">-</span>
              <input type="text" value="${item.pCount}">
              <span class="sub">+</span>
            </div>
            <div class="w5">
              <span class="price">¥${parseFloat(item.pPriceCount).toFixed(2)}</span>
            </div>
            <div class="w6">
              <a href="javascript:" class="del">删除</a>
            </div>
          </li>
            `
          });
          //渲染页面
          this.ulList.innerHTML = strHTML;

          //点击按钮 sub ++  / sup --
          this.subBtn = this.el.querySelector('.sub');
          this.supBtn = this.el.querySelector('.sup');
          //删除按钮
          this.delBtn = this.el.querySelector('.del');
          //全选按钮
          this.allBtn = this.el.querySelector('.all');
          //商品合计
          this.total = this.el.querySelector('#zje');
          //打折
          this.dz = this.el.querySelector('.dz');
          //应付金额
          this.price = this.el.querySelector('.yfje');

          //处理点击-- ++ 事件
          this.clickHandler();

        });
      }

      //点击处理
      clickHandler() {
        let that = this;
        //这里我们使用事件委托,主要是用来实现购物车的 ++ -- 全选 删除 下单 功能
        this.el.addEventListener('click', (event) => {
          let e = event || window.event;
          let target = e.target || e.srcElement;
          //如果不是我们这些功能 我们直接终止
          if (target.className !== 'sup' && target.className !== 'sub' && target.className !== 'del' && target.className !== 'box' && target.className !== 'all' && target.className !== 'submit') {
            return false;
          }

          //加
          if (target.className === 'sub') {
            //页面上的数据也要变化
            //拿到总金额
            target.previousElementSibling.value++;
            //修改页面上的数据
            let totalPrice = target.parentNode.nextElementSibling.children[0];
            totalPrice.innerText = `¥${(parseFloat(target.previousElementSibling.value) * parseFloat(target.parentNode.previousElementSibling.children[0].innerText.slice(1))).toFixed(2)}`

            $.ajax({
              url: '/api/modify',
              data: {
                pCount: parseInt(target.previousElementSibling.value),
                cId: parseInt(target.parentNode.parentNode.getAttribute('data-cid'))
              },
              type: 'POST',
            }).then(function (res) {
              layer.msg(res.msg);
            });


            //这是所有选中的input 不包括全选按钮 在这里动态计算金额
            let price = [0];
            target.parentNode.parentNode.parentNode.querySelectorAll('.box:checked').forEach(item => {
              price.push(parseFloat(item.parentNode.parentNode.querySelector('.price').innerText.slice(1)));
            })

            let count = 0;
            price.forEach(item => {
              count += parseFloat(item);
            })
            //合计
            this.total.innerText = `¥${count.toFixed(2)}`;
            //打折
            this.dz.innerText = `- ${(count.toFixed(2) - count.toFixed(2) * 0.95).toFixed(2)}`;
            //总额
            this.price.innerText = ` ${(count * 0.95).toFixed(2)}`;

          }
          //减
          if (target.className === 'sup') {
            if (target.nextElementSibling.value <= 1) {
              layer.msg('最少购买一件哦,小兄弟!');
              return false;
            }

            target.nextElementSibling.value--;

            let totalPrice = target.parentNode.nextElementSibling.children[0];
            totalPrice.innerText = `¥${(parseFloat(target.nextElementSibling.value) * parseFloat(target.parentNode.previousElementSibling.children[0].innerText.slice(1))).toFixed(2)}`

            $.ajax({
              url: '/api/modify',
              data: {
                pCount: parseInt(target.nextElementSibling.value),
                cId: parseInt(target.parentNode.parentNode.getAttribute('data-cid'))
              },
              type: 'POST',
            }).then(function (res) {
              layer.msg(res.msg);
            });
            //这是所有选中的input 不包括全选按钮 在这里动态计算金额
            let price = [0];
            target.parentNode.parentNode.parentNode.querySelectorAll('.box:checked').forEach(item => {
              price.push(parseFloat(item.parentNode.parentNode.querySelector('.price').innerText.slice(1)));
            })

            let count = 0;
            price.forEach(item => {
              count += parseFloat(item);
            })
            //合计
            this.total.innerText = `¥${count.toFixed(2)}`;
            //打折
            this.dz.innerText = `- ${(count.toFixed(2) - count.toFixed(2) * 0.95).toFixed(2)}`;
            //总额
            this.price.innerText = ` ${(count * 0.95).toFixed(2)}`;
          }

          //删除
          if (target.className === 'del') {

            layer.confirm('您确定删除吗,哥哥.', {
              btn: ['确定', '取消'] //按钮
            }, function () {
              $.ajax({
                url: '/api/delCart',
                type: 'POST',
                data: {
                  cId: parseInt(target.parentNode.parentNode.getAttribute('data-cid'))
                }
              }).then(function (res) {
                layer.msg(res.msg);
                //计算金额
                that.totalPrice();
              });
              target.parentNode.parentNode.remove();
            }, function () {
              layer.msg('我不删除了...哥哥');
            });

          }

          //全选
          if (target.className === 'all') {
            //点击全选,拿到li下面的input check全部打钩
            let listList = this.el.querySelectorAll('li:nth-child(n+2) .box');

            //全选
            listList.forEach(item => {
              item.checked = this.allBtn.checked;
            });
            //计算金额
            that.totalPrice();

            if (!target.checked) {
              //合计
              this.total.innerText = `¥0`;
              //打折
              this.dz.innerText = `- ¥0`;
              //总额
              this.price.innerText = `¥0`;
            }

          }

          //单击选中
          if (target.className === 'box') {
            //拿到所有 商品数据li
            let length = target.parentNode.parentNode.parentNode.children.length - 1;

            //这是全选按钮,打钩的条件
            if (target.parentNode.parentNode.parentNode.querySelectorAll('.box:checked').length === length) {
              this.allBtn.checked = true;
            } else {
              this.allBtn.checked = false;
            }
            //这是所有选中的input 不包括全选按钮 在这里动态计算金额
            let price = [0];
            target.parentNode.parentNode.parentNode.querySelectorAll('.box:checked').forEach(item => {
              price.push(parseFloat(item.parentNode.parentNode.querySelector('.price').innerText.slice(1)));
            })
            let count = 0;
            price.forEach(item => {
              count += parseFloat(item);
            })
            //合计
            this.total.innerText = `¥${count.toFixed(2)}`;
            //打折
            this.dz.innerText = `- ${(count.toFixed(2) - count.toFixed(2) * 0.95).toFixed(2)}`;
            //总额
            this.price.innerText = ` ${(count * 0.95).toFixed(2)}`;
          }

          //提交
          if (target.className === 'submit') {
            //拿到 打钩钩的box  如果>0 那么就证明选中了商品
            let isSubmit = this.el.querySelectorAll('.box:checked').length > 0

            if (!isSubmit) {
              layer.msg('沙雕...你什么都没有选中..买个鸡儿?');
              return false;
            }
            layer.confirm('哥哥,你确定要付款吗,确定口袋里面的钱够吗?', {
              btn: ['老子有钱', '对不起,下个月在下单'] //按钮
            }, function () {
              layer.msg('恭喜老板,假装你购买成功了!');
            }, function () {
              layer.msg('努力打工...下个月给妹妹买');
            });
          }
        });
      }
      //计算总金额
      totalPrice() {
        //全选,拿到总金额
        let totalPrice = this.el.querySelectorAll('li:nth-child(n+2) .price');

        //装成数组
        let count = [];
        totalPrice.forEach(item => {
          count.push(parseFloat(item.innerText.slice(1)).toFixed(2));
        })

        //统计出总金额 , 打95折
        let price = 0;
        count.forEach(item => {
          price += parseFloat(item);
        })
        //合计
        this.total.innerText = `¥${price.toFixed(2)}`;
        //打折
        this.dz.innerText = `- ${(price.toFixed(2) - price.toFixed(2) * 0.95).toFixed(2)}`;
        //总额
        this.price.innerText = ` ${(price * 0.95).toFixed(2)}`;
      }
    }
    //实例化
    new renderCart({
      el: '.m-cart'
    });

  });
})();