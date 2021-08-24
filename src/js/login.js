(function () {
  window.addEventListener('load', () => {



    init();
    /**
     * 这是一个发送ajax的函数
     * 功能1:
     *  获取到用户手机号的输入,以及密码的输入.
     *  通过正则表达式,实时判断是否输入合法
     * 功能2:
     *  获取用户是要进行登录操作还是注册操作
     *  根据相应的操作,进行响应的url的拼接
     *  
     */
    function init() {
      //账号输入框,密码输入框
      let phoneIpt = document.querySelector('#phone');
      let pwdIpt = document.querySelector('#pwd');

      //错误提示标签
      let phoneMsg = document.querySelector('.phoneMsg');
      let pwdMsg = document.querySelector('.pwdMsg');

      //标题上的span, 确定是登录 还是 注册(这里拿的父级,用事件委托来做)
      let clickHanlder = document.querySelector('.login-header');
      //提交按钮
      let btnSubmit = document.querySelector('#submit');

      //假设用户名密码全部验证失败
      let isPhone = false;
      let isPwd = false;

      //默认url是登录,后续点击谁,url就改成谁
      let url = '/user/login';

      //账号输入 , 检测是否合法
      phoneIpt.oninput = function () {
        let msg = "手机号不合法";
        let reg = /^[1][3-9]\d{9}$/;
        let val = phoneIpt.value.trim();
        isPhone = validata(msg, reg, val, phoneMsg);
      }

      //密码输入 , 检测是否合法
      pwdIpt.oninput = function () {
        let msg = "密码长度在8到16位"
        let reg = /^.{8,16}$/i;
        let val = pwdIpt.value.trim();
        isPwd = validata(msg, reg, val, pwdMsg);
      }

      //事件委托,来解决,点击切换
      clickHanlder.addEventListener('click', (event) => {
        let target = event.target;
        if (target.nodeName !== 'SPAN') {
          return false;
        }
        //拿到当前点击的span的id名字
        let id = target.getAttribute('id');
        //点击更换btn上的文字
        btnSubmit.innerText = target.innerText;
        //顺带修改路径
        url = `/user/${id}`;

        //修改标题,排他思想
        let spanList = clickHanlder.querySelectorAll('span');
        Array.prototype.slice.call(spanList).forEach(function (item, index) {
          //如果点击的id 等于 循环列表中的id 那么就改变样式 并且显示该表单, 排他思想
          item.style.fontWeight = item.id === id ? 'bold' : 'normal';
        });
      })



      //ajax 提交表单
      $('form').submit(function () {
        //如果校验不通过,那么不允许提交表单,直接弹窗告知
        //这里的逻辑我刚开始写错了,写成了 && .
        if (!(isPhone) || !(isPwd)) {
          layer.msg('小伙子别玩火,请合法输入', { icon: 2, time: 1000, shade: 0.4 });
          return false;
        }

        $.ajax({
          url: url,
          type: 'POST',
          data: $('form').serialize(),
        }).done(function (res) {
          //代表注册,或者登录,是成功的一个状态
          if (res.data && res.code === 200) {
            //如果是登录
            if (res.data !== 'new') {
              //登录的数据存放到sessionStorage中
              sessionStorage.setItem('User', JSON.stringify(res.data[0]));
              //弹窗,跳转到首页
              layer.msg(res.msg, { icon: 1, time: 2000, shade: 0.4 }, function () {
                location.replace('index.html');
              });
            } else {
              //否则是注册,注册跳登录页
              layer.msg(res.msg, { icon: 1, time: 2000, shade: 0.4 }, function () {
                location.replace('login.html');
              });
            }
          } else {
            //这里代表登录失败或者注册失败
            //弹窗,错误信息
            layer.msg(res.msg, { icon: 2, time: 1000, shade: 0.4 });
          }
        });
        //处理表单的默认行为
        return false;
      });
    }

    /**
     * @param {正则错误提示信息} msg 
     * @param {正则表达式} reg 
     * @param {用户输入的值} val 
     * @param {在哪个标签进行提示} tag
     */
    function validata(msg, reg, val, tag) {
      if (reg.test(val)) {
        tag.innerText = '输入合法';
        return true;
      }
      tag.innerText = msg;
      return false;
    }

  });
})();