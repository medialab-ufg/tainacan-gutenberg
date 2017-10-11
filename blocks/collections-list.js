(function (blocks, element) {
  var el = element.createElement;
  var source = blocks.source;
  var response = '';
  var content = [];

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
      cache: false,
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
    //console.warn(collection);
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
      collectionName: {
        type: 'string'
      },
      sourceURL: {
        type: 'string'
      },
    },

    edit: function (props) {
      var collectionName = props.attributes.collectionName;
      var sourceURL = props.attributes.sourceURL;
      var alignment = props.attributes.alignment;
      var focus = props.focus;
      var children;

      function setCollection(event) {   
        event.preventDefault();
        
        var collection = event.target[0].value;
        var sourceURL = event.target[1].value;

        console.warn(collection);
        console.warn(sourceURL);

        props.setAttributes({ collectionName: collection, sourceURL: sourceURL });
      }

      children = [];
      if (collectionName) {
        content.push(TainacanCollection({ collectionName: collectionName, sourceURL: sourceURL }));
      }

      children.push(
        el('div', {className: 'container-fluid '+ props.className},
          el('div', {className: 'row'},
            el('div', {className: 'col-xs-12'},
              el(
                'div', { className: ' thumbnail col-xs-12 col-xs-offset-0' },
                el('form', { className: '', onSubmit: setCollection, method: 'post', id: 'tb-form' },
                  el('div', { className: 'form-group' },
                    el('input', { className: 'form-control', id: 'tb-input-collection-name', type: 'text', required: true, placeholder: 'Collection name' }),
                    el('input', { className: 'form-control', id: 'tb-input-collection-url', type: 'url', required: false, placeholder: 'Source URL' })
                  ),
                  el('button', { className: 'btn btn-success btn-sm center-block btn-block', style: { height: '100%' }, type: 'submit' }, 'Add collection'),
                ),
              ),
            )
          )
        )
      );

      return [
        el('div', {className: 'container-fluid '},
          el('div', {className: 'row'},
            el('div', {className: 'col-xs-12'}, content)
          )
        ), children
      ];
    },

    save: function (props) {
      return TainacanCollection({ collectionName: props.attributes.collectionName, sourceURL: props.attributes.sourceURL });
    }
  });
})(
  window.wp.blocks,
  window.wp.element
  );