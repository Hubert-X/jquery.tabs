$(function () {
    var bootstrapTabs = $('#right-content-1').bootstrapTabs({
        debug: true,
        position: 'top'
    });
    bootstrapTabs.bootstrapTabs('addTab');


    var iframeHeight = $('#right-content-1 .tab-content').height() - 10;
    $('#left-silder .nav-pills a[data-link]').each(function () {
        $(this).on('click', function () {
            var $this = $(this);
            var id = bootstrapTabs.bootstrapTabs('addTab', {
                id: $this.attr('href').substr(1),
                title: $this.attr('href').substr(1),
                content: '<iframe src="' + $(this).data('link') + ' " width="100%" height="' + iframeHeight + '" frameborder="0" marginheight="0" marginwidth="0"></iframe>',
                close: true
            });
            return false;
        })

    })
    var bootstrapTabs2 = $('#right-content-2').bootstrapTabs({
        position: 'bottom'
    });

    var _content = $('<div><a id="addTab" href="#">Add Tab</a>&nbsp;&nbsp;<a id="getTabs" href="#">Get Tabs</a></div>');
    var index = 0;
    _content.on('click', '#addTab',function () {
        bootstrapTabs2.bootstrapTabs('addTab', {
            id: 'tab_0' + ++index,
            title: '标签_' + index,
            content: new Date(),
            close: index%2
        });
        return false;
    }).on('click','#getTabs',function(){
        var items = bootstrapTabs2.bootstrapTabs('getTabs');
        alert(JSON.stringify(items));
    })


    bootstrapTabs.bootstrapTabs('addTab', {
        title: 'AddTab',
        content: _content
    });
})
