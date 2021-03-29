$(function () {
    $(document).off('click.bs.dropdown.data-api');

    function dropdownOpen() {

        var $dropdownLi = $('li.dropdown');

        $dropdownLi.mouseover(function () {
            $(this).children(".dropdown-menu").addClass('show');
        }).mouseout(function () {
            $(this).children(".dropdown-menu").removeClass('show');
        });
    }
    dropdownOpen()

    $(window).scroll(function () {
        var h = $(this).scrollTop();
        sessionStorage.setItem('head-height', h);
        headBg(h);
    });


    function headBg(h) {
        if (h > 50) {
            $('.head').addClass('bg');
        } else {
            $('.head').removeClass('bg');
        }
    }
    var height = sessionStorage.getItem('head-height');
    var _h = $(window).scrollTop();

    (_h == 0) ? headBg(_h) : headBg(height);

    var path = location.pathname;

    $(".navbar-nav a").each(function () {
        var href = $(this).attr('href').split('?')[0];
        if (href == path) {
            $(this).parents('li.nav-item').addClass('active');
        }
    });
});