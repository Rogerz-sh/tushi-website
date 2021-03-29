(function ($) {
    $.fn.levelSelect = function (options) {
        var $container = $(this), data = options.data || [], selected = options.selected, model = options.model || { id: 'id', name: 'name' };
        var HTML_TEMP = `<div class="flex">
                            <div class="flex-1 padding-5 border-right" style="height:300px;overflow-y:scroll;">
                                <ul class="list-group" id="category_ctn_1">
                                </ul>
                            </div>
                            <div class="flex-1 padding-5 border-right" style="height:300px;overflow-y:scroll;">
                                <ul class="list-group" id="category_ctn_2">
                                </ul>
                            </div>
                            <div class="flex-1 padding-5" style="height:300px;overflow-y:scroll;">
                                <ul class="list-group" id="category_ctn_3">
                                </ul>
                            </div>
                        </div>`;
        var $html = $(HTML_TEMP);
        var $ctn1 = $html.find('#category_ctn_1'), $ctn2 = $html.find('#category_ctn_2'), $ctn3 = $html.find('#category_ctn_3'), li = [];
        data.forEach(v => {
            var $li = $(`<li class="list-group-item pointer" data-id="${v[model.id]}">${v[model.name]}</li>`);
            $li.data('items', v.items);
            li.push($li);
        });
        $ctn1.empty().append(li);
        $ctn1.delegate('li', 'click', function () {
            var items = $(this).data('items'), li = [];
            $(this).siblings().removeClass('active').end().addClass('active');
            items.forEach(v => {
                var $li = $(`<li class="list-group-item pointer" data-id="${v[model.id]}">${v[model.name]}</li>`);
                $li.data('items', v.items);
                li.push($li);
            });
            $ctn2.empty().append(li);
            $ctn3.empty();
        });
        $ctn2.delegate('li', 'click', function () {
            var items = $(this).data('items'), li = [];
            $(this).siblings().removeClass('active').end().addClass('active');
            items.forEach(v => {
                var $li = $(`<li class="list-group-item pointer" data-id="${v[model.id]}">${v[model.name]}</li>`);
                $li.data('items', v.items);
                li.push($li);
            });
            $ctn3.empty().append(li);
        });
        $ctn3.delegate('li', 'click', function () {
            $(this).siblings().removeClass('active').end().addClass('active');
        });
        if (selected) {
            $ctn1.find(`li[data-id="${selected.level1[model.id]}"]`).trigger('click');
            $ctn2.find(`li[data-id="${selected.level2[model.id]}"]`).trigger('click');
            $ctn3.find(`li[data-id="${selected.level3[model.id]}"]`).trigger('click');
        }
        $container.append($html);

        var funcs = {
            getData: function () {
                var $act1 = $ctn1.find('li.active'), $act2 = $ctn2.find('li.active'), $act3 = $ctn3.find('li.active');
                if ($act1.length == 0 || $act2.length == 0 || $act3.length == 0) {
                    return null;
                } else {
                    var selected = { level1: {}, level2: {}, level3: {} };
                    selected.level1[model.id] = $act1.data('id');
                    selected.level1[model.name] = $act1.text().trim();
                    selected.level2[model.id] = $act2.data('id');
                    selected.level2[model.name] = $act2.text().trim();
                    selected.level3[model.id] = $act3.data('id');
                    selected.level3[model.name] = $act3.text().trim();
                    return selected;
                }
            }
        }
        $container.data('levelSelect', funcs);
    }
})(jQuery)