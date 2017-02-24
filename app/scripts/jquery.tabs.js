

; (function ($, window, undefined) {

    function BootStrapTabs(element, option) {
        this.element = element;
        this.options = $.extend({}, $.fn.bootstrapTabs.defaults, option)
        this._defaults = $.fn.bootstrapTabs.defaults;
        this.init();
    }

    BootStrapTabs.prototype.init = function (element, options) {
        var _this = this,
            $element = $(_this.element);

        $element.append('<div class="tab-nav">' +
            '<a href="#" class="left"  aria-label="left"><span aria-hidden="true"><</span></a>' +
            '<ul class="nav nav-tabs" role="tablist"></ul>' +
            '<a class="right"  aria-label="right"><span aria-hidden="true">></span></a>' +
            '</div>').addClass('jquery-tabs').children('.tab-nav').addClass('tab-nav-' + _this.options.position);
        if (this.options.position === 'bottom') {
            $element.prepend('<div class="tab-content"></div>');
        }
        else {
            $element.append('<div class="tab-content"></div>');
        }
        _this.tabContainer = $element.find('.tab-nav');
        _this.contentContainer = $element.find('.tab-content');
        _this.leftBtn = $element.find('.left');
        _this.rightBtn = $element.find('.right');
        _this.activeTab;
        _this.previousTabs = [];

        _this.contentContainer.height(function () {
            var _id = _this.addTab({ id: 'calcHeight',title:'<span>&nbsp;</span>',content:'<span>&nbsp;</span>' });
            var _height = $element.height() - _this.tabContainer.outerHeight(true);
            _this.closeTab(_id);
            return _height;
        });
        _this.leftBtn.on('click', function () {
            _this._left();
            return false;
        });

        _this.rightBtn.on('click', function () {
            _this._right();
            return false;
        });

        $(window).on('resize', $.proxy(_this._resizeTab, _this));
    }

    BootStrapTabs.prototype.addTab = function (args, callback) {
        var _this = this,
            _tabContainer = _this.tabContainer,
            _contentContainer = _this.contentContainer,
            _tabTemplate = $('<li role="presentation"><a href="#target_xx" id="tab_xx" role="tab" data-toggle="tab" aria-controls="target_xx" aria-expanded="true"></a></li>'),
            _contentTemplate = $('<div  id="target_xx" role="tabpanel" class="tab-pane fade in"></div>'),
            _closeTemplate = $(' <button type="button" class="close"  aria-label="Close"><span aria-hidden="true">&times;</span></button>');

        var _args = $.extend({}, {
            id: $('li[role="presentation"]', _tabContainer).length + 1,
            title: 'default',
            content: '<h3>this is default tab content!</h3>',
            close: false,
        }, args);

        var _target = $('li a#tab_' + _args.id, _tabContainer);
        if (_target.length) {
            _target.tab('show');
        }
        else {
            var _aTarget = _tabTemplate.find('a').attr({
                'href': '#' + 'target_' + _args.id,
                'id': 'tab_' + _args.id,
                'aria-controls': 'target_' + _args.id
            }).html(_args.title);

            _aTarget.on('shown.bs.tab', function (e) {
                _this.activeTab = $(e.target).attr('aria-controls');
                var _previousTab = $(e.relatedTarget).attr('aria-controls');
                _this.previousTabs = $.grep(_this.previousTabs, function (value) {
                    return value != _previousTab && value != _this.activeTab;
                });
                _previousTab && _this.previousTabs.unshift(_previousTab);

                var currentLi = $('a[aria-controls="' + _this.activeTab + '"]').parent();
                var currentPosition = currentLi.position();
                if (currentPosition.left + currentLi.width() > _tabContainer.width()) {
                    var _subDiffer = currentPosition.left + currentLi.width() - _tabContainer.width();
                    currentLi.prevAll('li:visible').each(function () {
                        if ($(this).position().left < _subDiffer)
                            $(this).css({ display: 'none' });
                    })

                }

                if (currentLi.is(':hidden')) {
                    currentLi.nextAll('li:hidden').css({ display: 'inline-block' });
                    currentLi.css({ display: 'inline-block' });
                }
            });

            if (_args.close) {
                _closeTemplate.prependTo(_tabTemplate).on('click', function () {
                    _this.closeTab(_args.id);
                    return false;
                });
            }
            _tabTemplate.appendTo(_tabContainer.children('ul'));
            _contentTemplate.attr('id', 'target_' + _args.id).html(_args.content).appendTo(_contentContainer);
            _aTarget.tab('show');
        }

        if (callback && typeof callback === 'function') {
            callback.call();
        }
        this._resizeTab();
        return _args.id;
    }

    BootStrapTabs.prototype.closeTab = function (id) {
        var _this = this,
            _tabContainer = _this.tabContainer,
            _contentContainer = _this.contentContainer;

        var _closeTab = $('li a#tab_' + id, _this.element);
        var _targetId = _closeTab.attr('aria-controls');
        _closeTab.parent().remove();
        $('#' + _targetId, _this.element).remove();
        if ($('li[role="presentation"]:hidden', _tabContainer).length && !$('li[role="presentation"]:visible', _tabContainer).length) {
            $.each($('li[role="presentation"]').get().reverse(), function () {
                if (_tabContainer.children('ul').width() + $(this).width() < _tabContainer.width())
                    $(this).show();
                else
                    return false;
            });
        }

        if (_this.activeTab == _closeTab.attr('aria-controls')) { //判断当前tab页是否是带关闭按钮的tab页，如果是，则显示上次打开的tab页           
            $('li a[href="#' + _this.previousTabs[0] + '"]', this.element).tab('show'); //显示tab页
        }
        _this.previousTabs = $.grep(_this.previousTabs, function (value) {
            return value != _closeTab.attr('aria-controls');
        });

        this._resizeTab();
    }

    BootStrapTabs.prototype._resizeTab = function () {
        var _this = this,
            _tabContainer = _this.tabContainer,
            _contentContainer = _this.contentContainer,
            _leftBtn = _this.leftBtn,
            _rightBtn = _this.rightBtn;

        if (_tabContainer.width() + 3 < _tabContainer.children('ul').width()) {
            _rightBtn.css({ display: 'block' });
        }
        else {
            _rightBtn.css({ display: 'none' });
        }
        if ($('li[role="presentation"]:hidden', _tabContainer).length) {
            _leftBtn.css({ display: 'block' });
        }
        else {
            _leftBtn.css({ display: 'none' });
        }

        if (!$('li[role="presentation"]', _tabContainer).length) {
            _tabContainer.hide();
        }
        else {
            _tabContainer.show();
        }
    }

    BootStrapTabs.prototype._left = function () {
        var _this = this,
            _tabContainer = _this.tabContainer;
        $('li[role="presentation"]:hidden', _tabContainer).last().css({ display: 'inline-block' });
        this._resizeTab();
    }

    BootStrapTabs.prototype._right = function () {
        var _this = this,
            _tabContainer = _this.tabContainer;
        $('li[role="presentation"]:visible', _tabContainer).first().css({ display: 'none' });
        this._resizeTab();
    }


    $.fn.bootstrapTabs = function () {
        var args, option, ret, slice = [].slice, options;
        option = arguments[0];
        args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        ret = this;
        this.each(function () {
            var $this, data;
            $this = $(this);
            data = $this.data('bootStrapTabs');
            try {
                if (!data) {
                    $this.data('bootStrapTabs', data = new BootStrapTabs(this, option));
                }
                if (typeof option === 'string') {
                    return ret = data[option].apply(data, args);
                }
            }
            catch (e) {
                data.options.debug && console.error(e);
            }
        });
        return ret;
    }
    $.fn.bootstrapTabs.Constructor = BootStrapTabs;
    $.fn.bootstrapTabs.defaults = {
        debug: false,
        position: 'top'
    }

})(window.jQuery, window, undefined)