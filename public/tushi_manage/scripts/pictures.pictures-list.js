$(function () {
    var searchQuery = {};

    $('#sdate, #edate').kendoDatePicker({
        culture: 'zh-CN',
        format: 'yyyy-MM-dd'
    });

    $('#search').click(function () {
        var sdate = $('#sdate').val(),
            edate = $('#edate').val(),
            query = {};
        if (sdate) query.sdate = sdate;
        if (edate) query.edate = edate;
        searchQuery = query;
        ds.read();
    });

    var ds = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.hdtAjax({
                    url: '/manage/json-picture-list',
                    type: 'GET',
                    dataType: 'json',
                    data: Object.assign({ query: searchQuery }, options.data),
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
        pageSize: 10,
        serverPaging: true
    });

    $("#pager").kendoPager({
        dataSource: ds
    });

    $("#listView").kendoListView({
        dataSource: ds,
        template: kendo.template($("#template").html())
    });

    $('#listView').delegate('._del', 'click', function () {
        var id = $(this).data('id');
        $.hdtMsg.confirm(['删除图片', '确认要删除吗？'], function (isOk) {
            if (!isOk) return;
            $.hdtAjax({
                url: '/manage/remove-picture',
                type: 'POST',
                dataType: 'json',
                data: { id: id },
                success: function (res) {
                    if (res.code == 200) {
                        ds.read();
                    } else {
                        $.hdtMsg.alert('删除失败');
                    }
                }
            });
        });
    })

    // var grid = $('#grid').kendoGrid({
    //     dataSource: ds,
    //     scrollable: false,
    //     pageable: true,
    //     columns: [
    //         { field: 'filepath', title: '图片', template: getImage },
    //         { field: 'filepath', title: '图片地址', template: getUrl},
    //         { field: 'created_at', title: '上传时间', template: '#:new Date(created_at).format("yyyy-mm-dd hh:MM")#', width:120 }
    //     ]
    // }).data('kendoGrid');

    // function getImage(item) {
    //     return `${item.title}`
    // }

    // function getUrl(item) {

    // }

    $('#add').click(function () {
        $.hdtMsg.dialog({
            title: `上传图片`,
            destroy: true,
            // size: 'sm',
            content: `<form class="form">
                        <div class="form-group">
                            <label class="control-label">选择图片：</label>
                            <div class="relative">
                                <label class="btn btn-default btn-xs">
                                    <span>上传图片</span>
                                    <input type="file" class="hidden" id="file"/>
                                    <input type="hidden" id="filename"/>
                                    <input type="hidden" id="filepath"/>
                                </label>
                                <div id="imgCtn" class="margin-top-10"></div>
                            </div>
                        </div>
                      </form>`,
            footer: {
                buttons: [
                    {
                        name: 'ok',
                        handler: function () {
                            var self = this, dom = self.dom;
                            var form = $('form', dom).data('hdtForm');
                            if (form.validate()) {
                                var pic = form.getFormData(), file = $('#filepath', dom).data('file');
                                console.log(pic);
                                $.fileHelper.uploadFile(file).then(result => {
                                    if (result) pic.filepath = result;
                                    $.hdtAjax({
                                        url: '/manage/save-picture',
                                        type: 'POST',
                                        dataType: 'json',
                                        data: { pic: JSON.stringify(pic) },
                                        success: function (res) {
                                            if (res.code == 200) {
                                                ds.read();
                                                self.hide();
                                            } else {
                                                $.hdtMsg.alert(res.msg);
                                            }
                                        }
                                    });
                                }).catch(err => {
                                    $.hdtMsg.alert('文件上传出错')
                                })
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

                $('#file', dom).change(function () {
                    var file = this.files[0], ctn = $(this).parent().next(), img_url = $.createObjectURL(file);
                    ctn.html(`<img src="${img_url}" style="width:100px;height:100px;" />`);
                    $('#filepath', dom).val(img_url).data('file', file);
                    $('#filename', dom).val(file.name);
                    $(this).val(null);
                })

                var form = $('form', dom).hdtForm({
                    controls: [                        
                        {
                            name: 'filename',
                            target: '#filename',
                            type: 'input',
                            msgBox: 'div.form-group'
                        },
                        {
                            name: 'filepath',
                            target: '#filepath',
                            type: 'input',
                            msgBox: 'div.form-group',
                            rules: [
                                { rule: 'required', errMsg: '请上传图片' }
                            ]
                        }
                    ]
                });
                $('form', dom).data('hdtForm', form);
            }
        }).show();
    })
});