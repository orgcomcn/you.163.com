(function () {
  window.addEventListener('load', () => {

    //登录页面初始化,默认加载登录表单,隐藏注册表单
    init();


    //登录页面初始化,默认加载登录表单,隐藏注册表单
    function init() {
      //拿到登录,注册的 大box,包含了登录和注册表单
      let login_register = document.querySelector('#login_register');
      // form[0] 代表登录表单
      // form[1] 代表注册表单
      let form = login_register.querySelectorAll('form');

      //login 点击的话表示 当前是 登录表单
      let login = document.querySelector('#login');
      // reg  点击的话 表示当前是注册表单
      let reg = document.querySelector('#reg');

      //默认展示登录表单,隐藏注册表单
      form[0].style.display = 'block';
      form[1].style.display = 'none';
      login.style.fontWeight = 'bold';
      reg.style.fontWeight = 'normal';
      
      
      //因为第一次展示的是登录页面,那么我们要先拿到登录的按钮
      let login_btn = document.querySelector('#submitLogin');
      //默认是用户登录表单
      login_btn.addEventListener('click', ()=>{
        //这里还要做正则表达式验证
        form[0].submit();
      })


      //这里是用户登录
      login.addEventListener('click', () => {
        //如果点击登录表单,那么隐藏注册表单
        form[0].style.display = 'block';
        form[1].style.display = 'none';
        login.style.fontWeight = 'bold';
        reg.style.fontWeight = 'normal';

        let login_btn = document.querySelector('#submitLogin');
        login_btn.addEventListener('click', ()=>{
          //这里还要做正则表达式验证
          form[0].submit();
        })


      });


      //这里是用户注册
      reg.addEventListener('click', () => {
        //如果点击注册表单,那么隐藏注册表单
        form[1].style.display = 'block';
        form[0].style.display = 'none';
        reg.style.fontWeight = 'bold';
        login.style.fontWeight = 'normal';

        let login_reg = document.querySelector('#submitReg');
        login_reg.addEventListener('click', ()=>{
          //这里还要做正则表达式验证
          form[1].submit();
        })

      });

    }








  });
})();