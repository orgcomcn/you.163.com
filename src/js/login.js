(function() {
  window.addEventListener('load',()=>{

      let login_register = document.querySelector('#login_register');
      let form = login_register.querySelectorAll('form');

      let login = document.querySelector('#login');
      let reg = document.querySelector('#reg');

      form[0].style.display = 'block';
      form[1].style.display = 'none';
      login.style.fontWeight = 'bold';
      reg.style.fontWeight = 'normal';

      login.addEventListener('click',()=>{
        form[0].style.display = 'block';
        form[1].style.display = 'none';
        login.style.fontWeight = 'bold';
        reg.style.fontWeight = 'normal';
      })

     reg.addEventListener('click',()=>{
        form[1].style.display = 'block';
        form[0].style.display = 'none';
        reg.style.fontWeight = 'bold';
        login.style.fontWeight = 'normal';
      })

  });
})();