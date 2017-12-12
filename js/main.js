/**
 * Modal
 * @param {*} attrs 
 */
function AppModal(attrs) {
  this.val = '';
  this.attrs = {
    required: '',
    maxlength: 8,
    minlength: 4
  };
  this.listeners = {
    valid: [],
    invalid: []
  };
}

// イベント登録
AppModal.prototype.on = function(event, func) {
  this.listeners[event].push(func);
}

// イベント発火
AppModal.prototype.trigger = function(event) {
  this.listeners[event].forEach(function(target) {
    target();
  });
}

// 値セット
AppModal.prototype.set = function(val) {
  if (this.val === val) return;
  this.val = val;
  this.validate();
}

// 必須チェック
AppModal.prototype.required = function() {
  return this.val !== '';
}

// 最大文字数チェック
AppModal.prototype.maxlength = function(num) {
  return num >= this.val.length;
}

// 最小文字数チェック
AppModal.prototype.minlength = function(num) {
  return num <= this.val.length;
}

// バリデート
AppModal.prototype.validate = function() {
  var val;
  this.errors = [];

  for (var key in this.attrs) {
    val = this.attrs[key];
    if (!this[key](val)) this.errors.push(key);
  }

  this.trigger(!this.errors.length ? 'valid' : 'invalid');
}


/**
 * View
 * @param {*} el 
 */
function AppView(el) {
  this.initialize(el);
  this.handleEvents();
}

// 初期化
AppView.prototype.initialize = function(el) {
  this.$el = $(el);
  this.$list = this.$el.next().children();

  var obj = this.$el.data();

  if (this.$el.prop('required')) {
    obj['required'] = '';
  }

  this.modal = new AppModal(obj);
}

// イベント登録
AppView.prototype.handleEvents = function(e) {
  var self = this;

  this.$el.on('keyup', function(e) {
    self.onKeyup(e);
  });

  this.modal.on('valid', function() {
    self.onValid();
  });

  this.modal.on('invalid', function() {
    self.onInValid();
  });
}

// キー入力イベント
AppView.prototype.onKeyup = function(e) {
  var $target = $(e.currentTarget);
  this.modal.set($target.val());
}

// 有効
AppView.prototype.onValid = function() {
  this.$el.removeClass('error');
  this.$el.addClass('clear');
  this.$list.hide();
}

// 無効
AppView.prototype.onInValid = function() {
  var self = this;
  this.$el.addClass('error');
  this.$el.removeClass('clear');
  this.$list.hide();

  $.each(this.modal.errors, function(index, val) {
    self.$list.filter('[data-error=\"' + val + '\"]').show();
  });
}


/**
 * メイン
 */
window.addEventListener('load', function() {
  var elInput = document.querySelectorAll('input');
  [].slice.call(elInput, 0).forEach(function(e) {
    new AppView(e);
  });
});