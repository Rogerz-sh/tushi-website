$(function () {
    new Swiper('.focus-container', {
        //direction: 'vertical', // 垂直切换选项
        loop: true, // 循环模式选项
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        // 如果需要前进后退按钮
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // }
    })
    var win_width = document.body.offsetWidth;
    new Swiper('.news-swiper', {
        slidesPerView: win_width < 767 ? 2 : 3,
        loop: true, // 循环模式选项
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        // 如果需要前进后退按钮
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // }
    })
    if (win_width < 767) {
        new Swiper('.example-swiper', {
            slidesPerView: 2,
            loop: true, // 循环模式选项
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
    
            // 如果需要前进后退按钮
            // navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev',
            // }
        })
    }
})