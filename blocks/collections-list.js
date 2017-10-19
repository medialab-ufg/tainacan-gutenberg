(function (blocks, element) {
  var el = element.createElement;
  var source = blocks.source;
  var InspectorControls = blocks.InspectorControls;
  var children = source.children;
  var response = '';
  var contentTemp = [];

  function showRefreshAnimation(show){
    var modalBody = jQuery('#tb-collection-modal-body');

    if(show){
        modalBody.children().filter('form').hide();
        jQuery('#tb-refresh-modal-collection').show();
    }
    else{
        jQuery('#tb-refresh-modal-collection').hide();
        modalBody.children().filter('form').show();
    }
  }

  function fetchCollection(collectionName = '', sourceURL = '') {

    showRefreshAnimation(true);
    jQuery.ajax({
      url: gutenbergTainacanBlocks.ajaxurl,
      type: 'POST',
      dataType: 'json',
      data: {
        action: 'get_collection',
        collectionName: collectionName,
        sourceURL: sourceURL,
      },
      async: false,
      crossDomain: true,
    }).done(function (resp) {
      try {
        response = JSON.parse(resp);        
      } catch (error) {
        console.error(error);

        response = '';
        return;
      }

      if (response.data && response.data.status == '404') {
        alert(response.message);

        response = '';
        return;
      }
      showRefreshAnimation(false);

    }).fail(function (xhr, status, error) {
      console.error(error);
      showRefreshAnimation(false);
    });
  }

  function TainacanCollection(obj) {
    if (!obj.collectionName) { return null; }

    var collectionName = obj.collectionName;
    var sourceURL = obj.sourceURL;

    fetchCollection(collectionName, sourceURL);
    var collection = response;
    if (!collection) { return null; };

    var permalink = collection[0].guid;
    var coverImageSource = collection[0].thumbnail ? collection[0].thumbnail : location.origin + window.userSettings.url + 'wp-content/plugins/tainacan-gutenberg/assets/images/default-cover-image.png';
    var caption = collection[0].post_title;

    return el('div', { className: 'thumbnail col-xs-3 col-xs-offset-1' },
      el('a', { href: permalink, target: '_blank' },
        el('img', {
          src: coverImageSource,
          className: 'img-responsive img-thumbnail',
          style: { width: '100%' },
          alt: caption
        }),
        el('figcaption', { className: 'figure-caption text-center text-muted' }, caption)
      ),
    );
  }

  function showControlRemoveCollections(){
    return el('div', null, 
      el('h3', null, 'Remove collections:'),
      el('ul', {className: 'unstyled-list'}, null),
    );
  }

  blocks.registerBlockType('tainacan/collections-list', {
    title: 'Tainacan Coleções',

    icon: 'format-image',

    category: 'widgets',

    attributes: {
      collectionName: {
        type: 'string'
      },
      sourceURL: {
        type: 'string'
      },
      content: {
        type: 'array',
        source: children('div')
      }
    },

    keywords: ['tainacan', 'collections', 'collections-list'],

    edit: function (props) {
      var content = props.attributes.content;
      var alignment = props.attributes.alignment;
      var focus = props.focus;
      var formEdit;

      function setCollection(event) {
        event.preventDefault();

        var collection = event.target[0].value;
        var srcURL = event.target[1].value;

        if(content){
          contentTemp = content;
        }

        if (collection) {
          contentTemp.push(TainacanCollection({ collectionName: collection, sourceURL: srcURL }));
          
          props.setAttributes({ collectionName: collection, sourceURL: srcURL, content: contentTemp});
        }
      }

      //el('button', {className: 'close'}, 
      //el('span', null, '\u00D7'),
      //),

      formEdit = [];
      formEdit.push(
        content,
        el('div', { className: 'thumbnail col-xs-3 col-xs-offset-1' },
          el('button', {
            className: 'btn btn-default btn-sm',
            style: { height: '140px', width: '100%' },
            'data-toggle': 'modal',
            'data-target': '#tb-modal-add-collection'
          },
            'Add collection'),
        ),
        el('div', {
          className: 'modal fade',
          id: 'tb-modal-add-collection',
          role: 'dialog'
        },
          el('div', { className: 'modal-dialog modal-sm' },
            el('div', { className: 'modal-content' },
              el('div', { className: 'modal-header' },
                el('button', {
                  className: 'close',
                  'data-dismiss': 'modal'
                }, '\u00D7'),
                el('h4', { className: 'modal-title' }, 'Add Collection')
              ),
              el('div', { className: 'modal-body', id: 'tb-collection-modal-body' },
                el('div', {className: 'text-center'},
                    el('i', {
                            className: 'fa fa-spinner fa-pulse fa-5x fa-fw', 
                            style: {
                                display: 'none'
                            }, 
                            id: 'tb-refresh-modal-collection',
                        }
                    )
                ),
                el('form', {
                  className: '',
                  onSubmit: setCollection,
                  method: 'post',
                  id: 'tb-form'
                },
                  el('div', { className: 'form-group' },
                    el('input', {
                      className: 'form-control',
                      id: 'tb-input-collection-name',
                      type: 'text', required: true,
                      placeholder: 'Collection name'
                    }),
                  ),
                  el('div', { className: 'form-group' },
                    el('input', {
                      className: 'form-control',
                      id: 'tb-input-collection-url',
                      type: 'url', required: false,
                      placeholder: 'Repository URL'
                    })
                  ),
                  el('button', {
                      className: 'btn btn-info btn-sm center-block btn-block',
                      style: { height: '100%' },
                      type: 'submit'
                    }, 
                    'Add collection'
                  ),
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
        !! focus && el(
          InspectorControls,
          { key: 'controls' },
          showControlRemoveCollections()
        ),
        el('html', null,
          el('div', { className: 'container-fluid ' },
            el('div', { className: 'row' },
              el('div', { className: 'col-xs-12' }, formEdit),
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