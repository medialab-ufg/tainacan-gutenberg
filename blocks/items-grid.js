(function (blocks, element) {
    var el = element.createElement;
    var source = blocks.source;
    var children = source.children;
    var response = '';
    var contentTemp = [];
    var optionsCollections = [];
    var optionsItems = [];
    var collections = '';
    var items = '';
    var sourceURL = '';

    function showRefreshAnimation(show){
        var modalBody = jQuery('#tb-item-modal-body');

        if(show){
            modalBody.children().filter('form').hide();
            jQuery('#tb-refresh-modal-item').show();
        }
        else{
            jQuery('#tb-refresh-modal-item').hide();
            modalBody.children().filter('form').show();
        }
    }

    function showCollectionOption(event) {

        if(event.target){
            sourceURL = event.target.value;
        }

        showRefreshAnimation(true);

        jQuery.ajax({
            url: gutenbergTainacanBlocks.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'get_collections',
                sourceURL: sourceURL,
            },
            async: false,
        }).done(function(resp){
            collections = JSON.parse(resp);
            optionsCollections = [];

            for(var i = 0, len = collections.length; i < len; i++){
                optionsCollections.push(el('option', null, collections[i].post_title));
            }
            showRefreshAnimation(false);
        }).always(function(){
            showRefreshAnimation(false);
        });
    }

    jQuery(document).ready(showCollectionOption);

    function showItemOption(event){
        event.preventDefault();

        var collectionSelected = event.target.value;
        var collectionID = '';

        for(var i = 0, len = collections.length; i < len; i++){
            if(collections[i].post_title == collectionSelected){
                collectionID = collections[i].ID;
                break;
            }
        }

        showRefreshAnimation(true);
        jQuery.ajax({
            url: gutenbergTainacanBlocks.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'get_collection_items',
                collectionID: collectionID,
                sourceURL: sourceURL,
            },
            async: false,
        }).done(function(resp){
            items = JSON.parse(resp);
            optionsItems = [];

            for(var i = 0, len = items.items.length; i < len; i++){
                optionsItems.push(el('option', null, items.items[i].item.post_title));
            }
            showRefreshAnimation(false);
        }).always(function(){
            showRefreshAnimation(false);
        });
    }

    function TainacanItem(item){
        return el('div', {className: 'col-xs-5 thumbnail col-xs-offset-1'},
            el('div', {className: 'col-xs-4'},
                el('a', {
                    href: item.guid, 
                    target: '_blank'
                }, 
                    el('img', {
                        className: 'img-thumbnail', 
                        src: item.thumbnail,
                        alt: item.post_title
                    }),
                ),
            ),
            el('div', {className: 'col-xs-8'},
                el('dl', {},
                    el('dt',  {
                        className: '', 
                        style: {'font-size': '85%'}
                    }, 
                    el('a', {
                        className: 'text-muted',
                        href: item.guid, 
                        target: '_blank'
                    }, item.post_title),
                    ),
                    el('dd', null, 
                        el('details', {
                            className: 'text-muted text-justify', 
                            style: {'font-size': '85%'}
                        }, 
                            el('small', null, item.post_content),
                        ),
                    ),
                ),
            ),
        );
    }

    function verifyKey(event){
        if(event.keyCode == 13 || event.which == 13){
            showCollectionOption(event);
        }
    }

    blocks.registerBlockType('tainacan/items-grid', {
        title: 'Tainacan Itens',

        icon: 'format-image',

        category: 'widgets',

        attributes: {
            content: {
                type: 'array',
                source: children('div')
            },
            item: {
                type: 'object',
            }
        },

        keywords: ['tainacan', 'item', 'item-list'],

        edit: function (props) {
            var content = props.attributes.content;
            var itemA = props.attributes.item;
            var alignment = props.attributes.alignment;
            var focus = props.focus;
            var formEdit = [];

            function atachItem(event){
                event.preventDefault();

                var item;
        
                for(var i = 0, len = items.items.length; i < len; i++){
                    if(items.items[i].item.post_title == event.target[2].value){
                        item = items.items[i].item;
                        break;
                    }
                }

                if(content){
                    contentTemp = content;
                }

                showRefreshAnimation(true);
                contentTemp.push(TainacanItem(item));
                showRefreshAnimation(false);

                props.setAttributes({ content: contentTemp, item: item });
            }

            formEdit.push(
                content,
                el('div', { className: 'thumbnail col-xs-5 col-xs-offset-1' },
                    el('button', {
                        className: 'btn btn-default btn-sm',
                        style: { height: '140px', width: '100%' },
                        'data-toggle': 'modal',
                        'data-target': '#tb-modal-add-item', 
                    },
                        'Add item'),
                ),
                el('div', {
                    className: 'modal fade',
                    id: 'tb-modal-add-item',
                    role: 'dialog'
                },
                    el('div', { className: 'modal-dialog modal-sm' },
                        el('div', { className: 'modal-content' },
                            el('div', { className: 'modal-header' },
                                el('button', {
                                    className: 'close',
                                    'data-dismiss': 'modal'
                                }, '\u00D7'),
                                el('h4', { className: 'modal-title' }, 'Add Item')
                            ),
                            el('div', { className: 'modal-body', id: "tb-item-modal-body" },
                                el('div', {className: 'text-center'},
                                    el('i', {
                                            className: 'fa fa-spinner fa-pulse fa-5x fa-fw', 
                                            style: {
                                                display: 'none'
                                            }, 
                                            id: 'tb-refresh-modal-item'
                                        }
                                    )
                                ),
                                el('form', {
                                    className: '',
                                    onSubmit: atachItem,
                                    method: 'post',
                                    id: 'tb-form'
                                },
                                    el('div', {className: 'form-group'},
                                        el('input', {
                                            className: 'form-control',
                                            id: 'tb-input-item-url',
                                            type: 'url', required: false,
                                            placeholder: 'Repository URL',
                                            onKeyPress: verifyKey,
                                            onLoad: showCollectionOption,
                                            'data-toggle': 'tooltip',
                                            'data-placement': 'top',
                                            'title': 'After insert URL, press enter!',
                                        }),
                                    ),
                                    el('div', { className: 'form-group' },
                                        el('label', {className: ''}, 'Select collection:'),
                                        el('select', {
                                            className: 'form-control',
                                            onChange: showItemOption,
                                            onLoad: showItemOption,
                                        },
                                            el('option', null, '-'),
                                            optionsCollections
                                        ),
                                    ),
                                    el('div', {className: 'form-group'},
                                        el('label', {className: ''}, 'Select item:'),
                                        el('select', {
                                            className: 'form-control',
                                        },
                                            el('option', null, '-'),
                                            optionsItems
                                        ),
                                    ),
                                    el('button', {
                                        className: 'btn btn-info btn-sm center-block btn-block',
                                        style: { height: '100%' },
                                        type: 'submit'
                                    }, 'Add item'),
                                ),
                            ),
                            el('div', { className: 'modal-footer' },
                                el('button', {
                                    className: 'btn  btn-default',
                                    'data-dismiss': 'modal'
                                }, 'Close')
                            )
                        )
                    )
                )
            );

            return [
                el('html', null,
                    el('div', { className: 'container-fluid ' + props.className },
                        el('div', { className: 'row' },
                            el('div', { className: 'col-xs-12' }, formEdit)
                        )
                    )
                )
            ];
        },

        save: function (props) {
            var content = props.attributes.content;

            return el('div', {className: 'row'}, content);
        }
    });
})(
    window.wp.blocks,
    window.wp.element
);