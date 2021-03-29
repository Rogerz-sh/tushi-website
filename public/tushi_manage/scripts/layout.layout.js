$(function () {
    var title = $('title').text().trim();
    $('a:contains("' + title + '")').closest('li').addClass('active');
    $('a:contains("' + title + '")').closest('li.dropdown').addClass('active');

    $.session = {
        accountId: $('meta[name="accountId"]').attr('content'),
        accountName: $('meta[name="accountName"]').attr('content'),
        accountNickname: $('meta[name="accountNickname"]').attr('content'),
        accountIsLeader: $('meta[name="accountIsLeader"]').attr('content'),
        accountShop: $('meta[name="accountShop"]').attr('content'),
    }

    $('#editPassword').click(function () {
        $.hdtMsg.dialog({
            title: '修改密码',
            size: 'sm',
            destroy: true,
            content: `<form>
                <div class="form-group">
                    <label class="control-label">原密码：</label>
                    <div>
                        <input type="password" class="form-control input-sm" id="p_old" placeholder="请输入原密码">
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">新密码：</label>
                    <div>
                        <input type="password" class="form-control input-sm" id="p_new1" placeholder="请输入新密码">
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">确认密码：</label>
                    <div>
                        <input type="password" class="form-control input-sm" id="p_new2" placeholder="请输入确认密码">
                    </div>
                </div>
            </form>`,
            footer: {
                buttons: [
                    {
                        name: 'ok',
                        handler: function () {
                            var self = this, dom = self.dom, form = $('form', dom).data('form');
                            if (form.validate()) {
                                var data = form.getFormData();
                                $.hdtAjax({
                                    url: '/common/edit-account-password',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: { password_old: data.p_old, password_new: data.p_new1 },
                                    success: function (res) {
                                        if (res.code == 200) {
                                            $.hdtMsg.alert('修改成功')
                                            self.hide();
                                        } else {
                                            $.hdtMsg.alert(res.msg)
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        name: 'cancel',
                        handler: function () {
                            this.hide();
                        }
                    }
                ]
            },
            onLoaded: function () {
                var dom = this.dom;
                var form = $('form', dom).hdtForm({
                    controls: [
                        {
                            name: 'p_old',
                            target: '#p_old',
                            type: 'input',
                            rules: [
                                { rule: 'required', errMsg: '原密码不能为空' }
                            ]
                        },
                        {
                            name: 'p_new1',
                            target: '#p_new1',
                            type: 'input',
                            rules: [
                                { rule: 'required', errMsg: '新密码不能为空' },
                                { rule: 'regexp', check: /^[a-zA-Z0-9_]{6,20}$/, errMsg: '密码为6-20个字符，由字母、数字或下划线组成' }
                            ]
                        },
                        {
                            name: 'p_new2',
                            target: '#p_new2',
                            type: 'input',
                            rules: [
                                { rule: 'required', errMsg: '确认密码不能为空' },
                                { rule: 'regexp', check: /^[a-zA-Z0-9_]{6,20}$/, errMsg: '密码为6-20个字符，由字母、数字或下划线组成' },
                                {
                                    rule: 'other',
                                    check: function () {
                                        return $('#p_new1', dom).val() == $('#p_new2', dom).val();
                                    },
                                    errMsg: '确认密码必须与新密码相同'
                                }
                            ]
                        },
                    ]
                });
                $('form', dom).data('form', form);
            }
        }).show();
    });

    $('body').delegate('img', 'click', function () {
        var url = $(this).attr('src');
        if (url.indexOf('hdt-share-app.oss-cn-shanghai.aliyuncs.com') < 0 || $(this).closest('.modal-body').length > 0) return;
        $.hdtMsg.dialog({
            title: '查看图片',
            content: `<div style="display:flex;width:100%;align-items:center;justify-content:center;">
                        <div><img src="${url}" style="max-width:650px"></div>
                      </div>`,
            footer: null,
            onLoaded: function () {
                var dom = this.dom;
                dom.find('.modal-body').css({
                    'padding': '0',
                    'max-height': '700px',
                    'overflow-y': 'auto'
                })
                dom.find('.modal-dialog').css({
                    'width': '700px',
                    'padding': '0'
                })
            }
        }).show();
    })
});

$.formater = {
    showAvatar: function (user, size) {
        var img_url = user.avatar, nickname = user.nickname || '', size = size || 30;
        if (!img_url) {
            img_url = '/images/default.png';
        }
        return '<div class="flex">\
                    <img src="{0}" style="width:{2}px;height:{2}px;margin-right:5px;" onerror="javascript:aa_ImageOnError(this)" />\
                    <span class="flex-1 text-ellipsis pointer" style="width:50px;line-height:{2}px;" title="{1}"><span>{1}</span></span>\
                </div>'.format(img_url, nickname, size);
    },
    showItemImgAndId: function (item) {
        var str = [];
        str.push(`<div class="text-center"><img src="${item.medias.pictures[0].url}" width="100" height="100"/></div>`)
        if (item.spuid) {
            str.push(`<div class="text-center">(${item.spuid})</div>`);
        }
        return str.join('');
    },
    showItemCategory: function (item) {
        var str = [];
        if (item.category) {
            var arr = item.category.split('|');
            arr = arr.splice(1, 6);
            str = [arr[1], arr[3], arr[5]]
        }
        str = str.join('>');
        return `<div class="text-ellipsis" style="width:80px;" title="${str}"><span>${str}</span></div>`;
    },
    showItemSkuNum: function (item) {
        var num = 0;
        if (item.has_specs == '1') {
            num = item.specs_data.details.length;
        } else {
            num = 1;
        }
        return `<a class="_sku text-info bold" data-id="${item._id}">${num}</a>`
    },
    showItemPrice: function (item) {
        if (item.prices.high > item.prices.low) {
            var prices = [];
            prices.push(`${kendo.toString(item.prices.low, 'n2')}`)
            prices.push('~')
            prices.push(`${kendo.toString(item.prices.high, 'n2')}`)
            return prices.join('<br>');
        } else {
            return kendo.toString(item.prices.low, 'n2')
        }
    },
    showItemOnlinePrice: function (item) {
        if (item.online_prices.high > item.online_prices.low) {
            var online_prices = [];
            online_prices.push(`<del>${kendo.toString(item.online_prices.s_low, 'n2')}</del>`)
            online_prices.push(`${kendo.toString(item.online_prices.low, 'n2')}`)
            online_prices.push('~')
            online_prices.push(`<del>${kendo.toString(item.online_prices.s_high, 'n2')}</del>`)
            online_prices.push(`${kendo.toString(item.online_prices.high, 'n2')}`)
            return online_prices.join('<br>');
        } else {
            return `<del>${kendo.toString(item.online_prices.s_low, 'n2')}</del><br>${kendo.toString(item.online_prices.low, 'n2')}`
        }
    },
    showItemStock: function (item) {
        var status = '';
        if (item.stock == 0) {
            status = '<div class="text-danger">售罄</div>'
        } else {
            if (item.has_specs == '1') {
                var zero = false;
                item.specs_data.details.forEach(d => {
                    if (d.stock == 0) zero = true;
                });
                if (zero) status = '<div class="text-danger">部分售罄</div>'
            }
        }
        return `<div class="text-info bold _sku" data-id="${item._id}">${item.stock}</div>${status}`;
    },
    showItemStatus: function (item) {
        var status = {
            'keep': '<span class="tag is-light">已撤消</span>',
            'audit': '<span class="tag is-warning">审核中</span>',
            'refuse': '<span class="tag is-danger">审核拒绝</span>',
            'online': '<span class="tag is-success">已上架</span>',
            'offline': '<span class="tag is-danger">已下架</span>',
        };
        if (item.status == 'online') {
            return item.online_status == '1' ? status['online'] : status['offline']
        } else {
            return status[item.status];
        }
    },
    showItemOnlineStatus: function (item) {
        if (item.online_status == '1') {
            return '<i class="fa fa-2x fa-check-circle has-text-success"></i>'
        } else {
            return '<i class="fa fa-2x fa-times-circle has-text-danger"></i>';
        }
    }
}

$.compute = {    
    rebate: function (price, o_price) {
        var rebateA = o_price * 0.88 - price * 0.935, rebateB = o_price * 0.2, check = (o_price - price) / price, r_price = 0;
        if (check < 0.0625) {
            r_price = 0;
        } else {
            r_price = Math.min(rebateA, rebateB);
        }
        return r_price.toFixed(2) - 0;
    },
    old_rebate: function (price, o_price) {
        var earn = o_price - price, earn_rate = earn / o_price, r_price = 0;
        if (earn_rate < 0.13) {
            r_price = earn * 0.83;
        } else if (earn_rate > 0.13) {
            r_price = o_price * 0.465 - price * 0.415;
        } else {
            r_price = o_price * 0.1;
        }
        return r_price.toFixed(2) - 0;
    },
    o_price: function (price, s_price) {
        var o_price = s_price * 0.605 + price * 0.42;
        return o_price.toFixed(2) - 0;
    }
}

window.aa_ImageOnError = function (obj) {
    obj.src = '/images/default.png';
}