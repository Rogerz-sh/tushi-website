$(function () {
    var searchQuery = {};

    $('#sdate, #edate').kendoDatePicker({
        culture: 'zh-CN',
        format: 'yyyy-MM-dd'
    });

    $('#search').click(function () {
        var sdate = $('#sdate').val(),
            edate = $('#edate').val(),
            title = $('#title').val(),
            query = {};
        if (title) query.title = title;
        if (sdate) query.sdate = sdate;
        if (edate) query.edate = edate;
        searchQuery = query;
        ds.read();
    });

    var ds = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.hdtAjax({
                    url: '/manage/json-example-list',
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

    var grid = $('#grid').kendoGrid({
        dataSource: ds,
        scrollable: false,
        pageable: true,
        columns: [
            { field: 'cover', title: '封面', template: '<img src="#:cover#" width="200" style="max-height:100px;">', width: 230 },
            { field: 'title', title: '标题', template: getTitle },
            { field: 'type', title: '类别', width: 100 },
            { field: 'publish_date', title: '显示时间', template: '#:new Date(publish_date).format("yyyy-mm-dd")#', width: 100 },
            { field: 'created_at', title: '发布时间', template: '#:new Date(created_at).format("yyyy-mm-dd hh:MM")#', width: 150 },
            { title: '操作', template: '<a href="/manage/example-modify?id=#:_id#" class="btn btn-xs btn-info"><i class="fa fa-edit"></i> 编辑</a>', width: 80 }
        ]
    }).data('kendoGrid');

    function getTitle(item) {
        return `<a href="/example-detail/${item._id}" target="_blank">${item.title}</a>`
    }
});