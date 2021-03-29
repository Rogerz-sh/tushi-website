Vue.component('help-block', {
    props: ['value', 'validate'],
    data: function () {
        return {
            v: this.value,
            validArr: this.validate || [],
            msg: '',
            _dirty: false
        }    
    },
    computed: {
        dirty: function () {
            if (this._dirty) {
                return true;
            } else {
                this._dirty = this.v !== this.value;
                return this._dirty;
            }
        },
        invalid: function () {
            var result = true, self = this;
            self.validArr.forEach(function (v) {
                if (!result) return;
                if (!v.reg.test(self.value)) {
                    result = false;
                    self.msg = v.msg;
                }
            });
            return !result;
        }
    },
    template: '<span class="help-block red" v-show="dirty && invalid" v-text="msg"></span>'
});