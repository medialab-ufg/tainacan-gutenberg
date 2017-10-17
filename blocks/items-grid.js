(function (blocks, element) {
    var el = element.createElement;
    var source = blocks.source;
    var children = source.children;
    var response = '';
    var contentTemp = [];

    function showCollectionOption(){
        jQuery.ajax({
            url: gutenbergTainacanBlocks.ajaxurl,
            type: 'GET',
            dataType: 'json',
            data: {
                action: 'get_collections'
            }
        });
    }
  
    blocks.registerBlockType('tainacan/items-grid', {
      title: 'Tainacan Itens',
  
      icon: 'format-image',
  
      category: 'widgets',
  
      attributes: {
        content: {
          type: 'array',
          source: children('html')
        },
      },
  
      keywords: ['tainacan', 'collections', 'collections-list'],
  
      edit: function (props) {
        var content = props.attributes.content;
        var alignment = props.attributes.alignment;
        var focus = props.focus;
        var formEdit = [];
  
        formEdit.push(
            el('div', {className: 'col-xs-12'},
                el('form', {className:  'form-inline'}, 
                    el('div', {className: 'form-group'},
                        el('input', {
                            className: 'form-control', 
                            placeholder: 'Source URL', 
                            type: 'url'
                        }),
                    ),
                    el('button', {
                        className: 'btn btn-default btn-sm',
                        type: 'submit'
                    }, 'Show')
                ),
                el('form', {className: ''},
                    el('div', {className: 'form-group'},
                        el('select', {className: 'form-control'},
                            el('option', null, 'Collection 1'),
                        ),
                    ),
                )
            )
        );

        return [
          el('html', null, 
            el('div', {className: 'container-fluid '+ props.className},
              el('div', {className: 'row'},
                el('div', {className: 'col-xs-12'},  [contentTemp , formEdit])
              )
            )
          )
        ];
      },
  
      save: function (props) {
        var content = props.attributes.content;

        return content;
      }
    });
  })(
    window.wp.blocks,
    window.wp.element
  );