(function (blocks, element) {
  var el = element.createElement;
  var source = blocks.source;
  var children = source.children;
  var response = '';
  var contentTemp = [];

  function fetchCollection(collectionName = '', sourceURL = '') {
    console.info(collectionName + ' ' + sourceURL);
    jQuery.ajax({
      url: gutenbergTainacanBlocks.ajaxurl,
      type: 'POST',
      dataType: 'json',
      data: {
        action: 'get_collections',
        collectionName: collectionName,
        sourceURL: sourceURL,
      },
      async: false,
      crossDomain: true,
    }).done(function (resp) {
      response = JSON.parse(resp);
      console.info(response);
    }).fail(function (xhr, status, error) {
      console.error(error);
    });
  }

  function TainacanCollection(obj) {
    if(!obj.collectionName) { return null; }

    var collectionName = obj.collectionName;
    var sourceURL = obj.sourceURL;
    
    fetchCollection(collectionName, sourceURL);
    var collection = response;
    if(!collection) { return null; };

    var permalink = collection[0].guid;
    var coverImageSource = collection[0].thumbnail ? collection[0].thumbnail : location.origin + window.userSettings.url + 'wp-content/plugins/tainacan-gutenberg/assets/images/default-cover-image.png';
    var caption = collection[0].post_title;

    return el('div', { className: 'thumbnail col-xs-3 col-xs-offset-1' },
              el('a', { href: permalink, target: '_blank' },
                el('img', { src: coverImageSource, className: 'img-responsive img-thumbnail', style: {width: '100%'}, alt: caption }),
                el('figcaption', { className: 'figure-caption text-center text-muted'}, caption )
              ),
            );
  }

  blocks.registerBlockType('tainacan/collections-list', {
    title: 'Tainacan Coleções',

    icon: 'format-image',

    category: 'widgets',

    attributes: {
      content: {
        type: 'array',
        source: children('html')
      },
      collectionName: {
        type: 'string'
      },
      sourceURL: {
        type: 'string'
      }
    },

    keywords: ['tainacan', 'collections', 'collections-list'],

    edit: function (props) {
      var content = props.attributes.content;
      var alignment = props.attributes.alignment;
      var focus = props.focus;
      var formEdit = [];

      function setCollection(event) {   
        var collection = event.target[0].value;
        var srcURL = event.target[1].value;

        console.info({__html: collection})

        if (collection) {
          contentTemp.push(TainacanCollection({ collectionName: collection, sourceURL: srcURL }));
         
          props.setAttributes({ content: contentTemp, collectionName: collection, sourceURL: srcURL });
        }

        event.preventDefault();
      }

      formEdit.push(
        el('div', { className: 'thumbnail col-xs-3 col-xs-offset-1' },
          el('button', { 
            className: 'btn btn-default btn-sm', 
            style: { height: '140px', width: '100%' },
            'data-toggle': 'modal',
            'data-target': '#tb-modal-add-collection'
          },
          'Add collection'),
        ),
        el('div', {className: 'modal fade', id: 'tb-modal-add-collection', role: 'dialog'},
          el('div', {className: 'modal-dialog modal-sm'}, 
            el('div', {className: 'modal-content'}, 
              el('div', {className: 'modal-header'},
                el('button', {className: 'close', 'data-dismiss': 'modal'}, 'x'),
                el('h4', {className: 'modal-title'}, 'Add Collection')
              ),
              el('div', {className: 'modal-body'},
                el('form', { className: '', onSubmit: setCollection, method: 'post', id: 'tb-form' },
                  el('div', { className: 'form-group' },
                    el('input', { className: 'form-control', id: 'tb-input-collection-name', type: 'text', required: true, placeholder: 'Collection name' }),
                    el('input', { className: 'form-control', id: 'tb-input-collection-url', type: 'url', required: false, placeholder: 'Source URL' })
                  ),
                  el('button', { className: 'btn btn-info btn-sm center-block btn-block', style: { height: '100%' }, type: 'submit' }, 'Add collection'),
                ),
              ),
              el('div', {className: 'modal-footer'},
                el('button', {className: 'btn  btn-default', 'data-dismiss': 'modal'}, 'Close')
              )
            )
          )
        )
      );

      return [
        el('html', null, 
          el('div', {className: 'container-fluid '},
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