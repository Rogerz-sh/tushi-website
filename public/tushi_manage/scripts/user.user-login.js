$(function () {
    var app = new Vue({
        el: '#ctn',
        data: {
            name: '',
            password: '',
            remember: false,
            validating: false
        },
        methods: {
            login: function () {
                var self = this;
                $.hdtAjax({
                    url: '/manage/user-login',
                    type: 'POST',
                    dataType: 'json',
                    data: { username: self.name, password: self.password },
                    success: function (res) {
                        if (res.code == 200) {
                            if (self.remember) {
                                $.cookie('name', $('#name').val(), { path: '/', expires: 30 });
                                $.cookie('remember', '1', { path: '/', expires: 30 });
                            } else {
                                $.removeCookie('name', { path: '/' });
                                $.removeCookie('remember', { path: '/' });
                            }
                            location.href = res.result;
                        } else {
                            $.hdtMsg.alert(res.msg);
                        }
                    }
                });
            }
        },
        created: function () {
            var self = this;
            self.name = $.cookie('name') || '';
            self.remember = !!$.cookie('remember');
        }
    });
});