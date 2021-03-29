$(function () {
    var query = $.queryString.parse(location.search), article_id = query.id;

    var publish_date = $('#publish_date').kendoDatePicker({
        culture: 'zh-CN',
        value: new Date(),
        format: 'yyyy-MM-dd'
    }).data('kendoDatePicker')

    var editor = $("#content").kendoEditor({
        tools: [
            "bold",
            "italic",
            "underline",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "insertUnorderedList",
            "createLink",
            "unlink",
            "insertImage",
            "viewHtml",
            "formatting",
            "fontName",
            "fontSize",
            "foreColor",
            "backColor",
        ],
    }).data("kendoEditor");

    $('#cover_file').change(function () {
        var file = this.files[0];
        var img_url = $.createObjectURL(file);
        $('#cover_ctn').html(`<img src="${img_url}" width="500" />`);
        $('#cover').val(img_url).data('file', file);
    });

    $('#images').click(function () {
        $.hdtMsg.dialog({
            title: `上传图片`,
            destroy: true,
            size: 'lg',
            content: `<div id="picList"></div><div id="picPager"></div>`,
            footer: null,
            onLoaded: function () {
                var dom = this.dom, imgQuery = {};

                var ds = new kendo.data.DataSource({
                    transport: {
                        read: function (options) {
                            $.hdtAjax({
                                url: '/manage/json-picture-list',
                                type: 'GET',
                                dataType: 'json',
                                data: Object.assign({ query: imgQuery }, options.data),
                                success: function (res) {
                                    if (res.code == 200) {
                                        options.success(res.result);
                                    }
                                }
                            });
                        }
                    },
                    schema: {
                        model: {
                            id: '_id'
                        },
                        total: 'total',
                        data: 'result'
                    },
                    pageSize: 8,
                    serverPaging: true
                });

                $("#picPager").kendoPager({
                    dataSource: ds
                });

                $("#picList").kendoListView({
                    dataSource: ds,
                    template: kendo.template($("#template").html())
                });
            }
        }).show()
    })

    var form = $('form').hdtForm({
        controls: [
            {
                name: 'title',
                target: '#title',
                type: 'input',
                msgBox: 'div.col-xs-9',
                rules: [
                    { rule: 'required', errMsg: '标题不能为空' }
                ]
            },
            {
                name: 'subtitle',
                target: '#subtitle',
                type: 'input',
                msgBox: 'div.col-xs-9'
            },
            {
                name: 'cover',
                target: '#cover',
                type: 'input',
                msgBox: 'div.col-xs-9',
                rules: [
                    { rule: 'required', errMsg: '请上传封面图片' }
                ]
            },
            {
                name: 'publish_date',
                target: '#publish_date',
                type: 'input',
                msgBox: 'div.col-xs-9',
                rules: [
                    { rule: 'required', errMsg: '请选择发布日期' }
                ]
            },
            {
                name: 'content',
                target: '#content',
                type: 'other',
                val: function () {
                    return editor.value();
                },
                msgBox: 'div.col-xs-9',
                rules: [
                    { rule: 'required', errMsg: '新闻内容不能为空' }
                ]
            },
        ]
    });

    $('#save').click(function () {
        if (form.validate()) {
            var data = form.getFormData(), file = $('#cover').data('file');
            console.log(data);
            data.publish_date = new Date(`${data.publish_date} 00:00:00`).getTime();
            $.fileHelper.uploadFile(file).then(result => {
                if (result) data.cover = result.replace(/\\/g, '/');
                $.hdtAjax({
                    url: '/manage/save-article',
                    type: 'POST',
                    dataType: 'json',
                    data: { id: article_id, article: JSON.stringify(data) },
                    success: function (res) {
                        if (res.code == 200) {
                            $.hdtMsg.alert('保存成功', function () {
                                location.href = '/manage/news'
                            });
                        } else {
                            $.hdtMsg.alert(res.msg);
                        }
                    }
                });
            }).catch(err => {
                console.log('图片上传失败')
            })
        }

    })

    $('#quit').click(function () {
        history.go(-1);
    })

    if (article_id) {
        $.hdtAjax({
            url: '/manage/json-news-detail',
            type: 'GET',
            dataType: 'json',
            data: { id: article_id },
            success: function (res) {
                if (res.code == 200) {
                    var article = res.result;
                    $('#title').val(article.title);
                    $('#subtitle').val(article.subtitle);
                    if (article.cover) {
                        $('#cover_ctn').html(`<img src="${article.cover}" width="500" />`);
                        $('#cover').val(article.cover)
                    }
                    if (publish_date) {
                        publish_date.value(new Date(article.publish_date))
                    } else {
                        $('#publish_date').val(new Date(article.publish_date).format())
                    }
                    if (editor) {
                        editor.value(article.content);
                    } else {
                        $('#content').val(article.content);
                    }
                } else {
                    $.hdtMsg.alert('未找到相应内容', function () {
                        history.go(-1);
                    })
                }
            }
        })
    }
});