(function () {
  let user = JSON.parse(sessionStorage.getItem('User'));
  let isLogin = document.querySelector('#isLogin');
  if (!user) {

    isLogin.innerHTML = `<a  href="./login.html">登录/注册</a>`;
  } else {
    isLogin.innerHTML = `<a  href="javascript:">尊敬的VIP:${user.id}</a>`;
  }
})();