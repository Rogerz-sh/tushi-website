(function ($) {
  var MODEL_CLASS = { 'lg': 'modal-lg', 'sm': 'modal-sm' }, ID_PREFIX = 'hdt_modal_'
  var TEMPLATE = '<div class="modal" tabindex="-1" role="dialog" data-backdrop="static">\
    <div class="modal-dialog" role="document">\
      <div class="modal-content">\
        <div class="modal-header">\
          <button type="button" class="close dlg-btn-close-icon"><span>&times;</span></button>\
          <h5 class="modal-title bold"></h5>\
        </div>\
        <div class="modal-body">\
        </div>\
        <div class="modal-footer">\
        </div>\
      </div>\
    </div>\
  </div>';

  var BUTTONS = {
    'ok': '<button type="button" class="btn btn-success btn-sm dlg-btn-ok">确定</button>',
    'cancel': '<button type="button" class="btn btn-default btn-sm dlg-btn-cancel">取消</button>',
    'close': '<button type="button" class="btn btn-danger btn-sm dlg-btn-cancel">关闭</button>',
    'back': '<button type="button" class="btn btn-default btn-sm dlg-btn-ok">返回</button>',
  }

  var Dialog = function (option) {
    this.option = $.extend({}, option);
    this.dom = $(TEMPLATE);
    this.init();
  }

  Dialog.prototype.init = function () {
    var self = this, option = self.option, dom = self.dom;
    var header = dom.find('.modal-header'),
        closeIcon = header.find('.dlg-btn-close-icon'),
        title = dom.find('.modal-title'),
        content = dom.find('.modal-body'),
        footer = dom.find('.modal-footer');

    //set modal size
    if (option.size) {
      dom.addClass(MODEL_CLASS[option.size]);
    }

    if (option.style) {
        dom.find('.modal-dialog').css(option.style);
    }

    if (option.center) {
      self.dom.find('.modal-dialog').addClass('screen-center');
    }

    //set title
    if (!option.title) {
      header.hide();
    } else {
      title.html(option.title);
    }

    //set footer
    if (!option.footer) {
      footer.hide();
    } else {
      if (option.footer.buttons) {
        _.each(option.footer.buttons, function (btn) {
          var button = $(BUTTONS[btn.name] || btn.template);
          if (!button) return;
          footer.append(button);
          if (btn.handler && _.isFunction(btn.handler)) button.bind('click', $.proxy(btn.handler, self));
        });
      } else {
        if (option.footer.template) {
          footer.html(option.footer.template);
        }
      }
    }

    //set content
    if (option.content) content.html(option.content);

    //set event
    if (option.onShown && _.isFunction(option.onShown)) dom.bind('shown.bs.modal', $.proxy(option.onShown, self));
    if (option.onHidden && _.isFunction(option.onHidden)) dom.bind('hidden.bs.modal', $.proxy(option.onHidden, self));
    if (option.destroy) dom.bind('hidden.bs.modal', $.proxy(self.destroy, self));
    dom.delegate('button.dlg-btn-close-icon', 'click', function () {
      self.hide();
    })
    $('body').append(dom);
    if (option.onLoaded && _.isFunction(option.onLoaded)) $.proxy(option.onLoaded, self)();
  }

  Dialog.prototype.show = function (callback) {
    var self = this, dom = self.dom;
    dom.modal('show').addClass('animated bounceInDown fast');
    dom.one('animationend', function () {
      dom.removeClass('animated bounceInDown fast');
    });
    if (typeof callback === 'function') {
        callback.call(self);
    }
  }

  Dialog.prototype.hide = function (callback) {
    var self = this, dom = self.dom;
    dom.addClass('animated bounceOutUp faster');
    dom.one('animationend', function () {
      dom.removeClass('animated bounceOutUp faster').modal('hide');
    });
    if (typeof callback === 'function') {
        callback.call(self);
    }
  }

  Dialog.prototype.destroy = function () {
    var self = this, dom = self.dom;
    dom.remove();
  }

  Dialog.create = function (option) {
    return new Dialog(option);
  }

  $.hdtMsg = {
    alert: function (msg, callback) {
      var title = '提示', message = msg;
      if (_.isArray(msg)) {
        title = msg[0];
        message = msg[1];
      }
      var option = {
        title: title,
        size: 'sm',
        destroy: true,
        content: message,
        footer: {
          buttons: [
            {
              name: 'ok',
              handler: function () {
                this.hide();
                if (_.isFunction(callback)) callback();
              }
            }
          ]
        }
      };
      Dialog.create(option).show();
    },
    confirm: function (msg, callback) {
      var title = '提示', message = msg;
      if (_.isArray(msg)) {
        title = msg[0];
        message = msg[1];
      }
      var option = {
        title: title,
        size: 'sm',
        destroy: true,
        content: message,
        footer: {
          buttons: [
            {
              name: 'ok',
              handler: function () {
                this.hide();
                if (_.isFunction(callback)) callback(true);
              }
            },
            {
              name: 'cancel',
              handler: function () {
                this.hide();
                if (_.isFunction(callback)) callback(false);
              }
            }
          ]
        }
      };
      Dialog.create(option).show();
    },
    prompt: function () {
      var p = 0, msg = arguments[p++], val = '', callback = null;
      if (arguments[p] && !_.isFunction(arguments[p])) {
        val = arguments[p++];
      }
      callback = arguments[p];
      var title = '提示', message = msg;
      if (_.isArray(msg)) {
        title = msg[0];
        message = msg[1];
      }
      var option = {
        title: title,
        size: 'sm',
        destroy: true,
        content: '<div class="row">\
                      <div class="col-sm-12"><p>{0}</p></div>\
                      <div class="col-sm-12"><input type="text" class="form-control" value="{1}"></div>\
                    </div>'.format(message, val),
        footer: {
          buttons: [
            {
              name: 'ok',
              handler: function () {
                var value = this.dom.find('input:text').val();
                this.hide();
                if (_.isFunction(callback)) callback(true, value);
              }
            },
            {
              name: 'cancel',
              handler: function () {
                var value = this.dom.find('input:text').val();
                this.hide();
                if (_.isFunction(callback)) callback(false, value);
              }
            }
          ]
        }
      };
      Dialog.create(option).show();
    },
    dialog: function (option) {
      return Dialog.create(option);
    }
  };
})(jQuery)