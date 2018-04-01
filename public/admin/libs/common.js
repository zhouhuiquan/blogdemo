
NProgress.start();

NProgress.done();

$('.navs ul').prev('a').on('click', function () {
	$(this).next().slideToggle();
});

// 退出登录
$('.logout').on('click', function () {

    $.ajax({
        url: '/logout',
        type: 'get',
        success: function (info) {
            console.log(info);
            if(info.code == 10000) {
                location.href = '/';
            }
        }
    })
})