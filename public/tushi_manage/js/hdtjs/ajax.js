﻿(function ($) {
    var _ajaxCount = 0, isLoading = false;
    var cookie = $.cookie || function () { };
    function _ajaxLoadingStart() {
        if (_ajaxCount == 0 && !isLoading) {
            $(".loading-container").removeClass("loading-inactive");
            isLoading = true;
        }
        _ajaxCount++;
    }

    function _ajaxLoadingEnd() {
        _ajaxCount--;
        if (_ajaxCount == 0 && isLoading) {
            $(".loading-container").addClass("loading-inactive");
            isLoading = false;
        }
    }

    function encodeData(data, func) {
        if (_.isObject(data) && !_.isArray(data)) {
            return _.mapObject(data, function (v) {
                return encodeData(v, func);
            });
        }
        if (_.isArray(data)) {
            return _.map(data, function (v) {
                return encodeData(v, func);
            });
        }
        return _.isString(data) ? hdtEncode(data, func) : data;
    }

    function hdtEncode(str, func) {
        var f = func || 'escape';
        var rtnStr = window[f](str);
        if (f === 'escape') {
            rtnStr = rtnStr.replace(/\+/g, '%2B');
            rtnStr = rtnStr.replace(/\&/g, '%26');
        }
        return rtnStr;
    }

    $.hdtAjax = function () {

        var $this = this, option = arguments[0], opt = $.extend({}, option);
        if ('data' in option && option.encode !== false) {
            option.data = encodeData(option.data);
        }

        var _doSuccess = function () {
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            args[0] = encodeData(args[0], 'unescape');
            if ('success' in opt) opt.success.apply(this, args);
        }
        option.success = _doSuccess;

        var _doError = function () {
            console.log('Request the url "%s", Error Code: %s', opt.url, arguments[0].status);
            if ('error' in opt) opt.error.apply(this, arguments);
        }
        option.error = _doError;

        var _doBeforeSend = function () {
            if (!option.hideLoading) _ajaxLoadingStart();
            this.hdtAjaxTime = (new Date).getTime();
            if ('beforeSend' in opt) opt.beforeSend.apply(this, arguments);
        }
        option.beforeSend = _doBeforeSend;

        var _doComplete = function () {
            console.log('Request the url "%s" cost: %sms.', opt.url, (new Date).getTime() - this.hdtAjaxTime);
            delete this.hdtAjaxTime;
            var error = cookie('error');
            if (error) {
                if (error === 'noright' || error === 'timeout' || error === 'shotoff') {
                    location.href = "/User/Login";
                    return;
                }
            }
            if ('complete' in opt) opt.complete.apply(this, arguments);
            if (!option.hideLoading) _ajaxLoadingEnd();
        }
        option.complete = _doComplete;

        option.cache = option.cache || false;

        $.ajax.apply(this, [option]);
    }

    $.hdtAjax.get = function () {
        if (arguments.length < 2) return;
        var url, data, success, error, p = 0;
        url = arguments[p++];
        if (typeof arguments[p] === 'object') {
            data = arguments[p++];
        }
        success = arguments[p++];
        error = arguments[p++];

        var option = {};
        option.url = url;
        option.type = 'GET';
        option.cache = false;
        if (data) option.data = data;
        if (success && typeof success === 'function') option.success = success;
        if (error && typeof error === 'function') option.error = error;

        $.hdtAjax(option);
    }

    $.hdtAjax.post = function () {
        if (arguments.length < 2) return;
        var url, data, success, error, p = 0;
        url = arguments[p++];
        if (typeof arguments[p] === 'object') {
            data = arguments[p++];
        }
        success = arguments[p++];
        error = arguments[p++];

        var option = {};
        option.url = url;
        option.type = 'POST';
        option.cache = false;
        if (data) option.data = data;
        if (success && typeof success === 'function') option.success = success;
        if (error && typeof error === 'function') option.error = error;

        $.hdtAjax(option);
    }

    $.queryString = {
        parse: function (searchStr) {
            var query = {};
            if (searchStr.indexOf('?') == 0) {
                searchStr = searchStr.substr(1);
            }
            var arr = searchStr.split('&');
            arr.forEach(function (q) {
                var p = q.split('=');
                query[p[0]] = p[1] === undefined ? '' : p[1];
            });
            return query;
        },
        stringify: function (paramsObj) {
            var query = []
            for (var n in paramsObj) {
                query.push(n + '=' + paramsObj[n].toString());
            }
            return query.join('&');
        }
    }
})(jQuery)