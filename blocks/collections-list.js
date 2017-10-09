var el = wp.element.createElement,
registerBlockType = wp.blocks.registerBlockType,
children = wp.blocks.source.children;

registerBlockType( 'tainacan/collections-list', {
  title: 'Tainacan Coleções',

  icon: 'images-alt',

  category: 'widgets',

  attributes: {
    content: {
      type: 'array',
      source: children('div', 'img')
    }
  },
  edit: function( props ) {

    var response = {
      label: '',
      coverImageSource: '',
      permalink: ''
    };
  //236 17
    jQuery.ajax({
      url: gutenbergTainacanBlocks.ajaxurl,
      type: 'POST',
      dataType: 'json',
      data: {
        action: 'get_collections',
        collectionsID: [17]
      },
      async: false,
      crossDomain: true,
      cache: false,
    }).done(function(res){
      res = JSON.parse(res[0]);
      console.info(res);
      
      prepareResponse(res);

    }).fail(function(res) {
      console.warn('FAIL! '+ res);
    });

    function prepareResponse(res){
        response = {
          caption: res.collection.post_title,
          coverImageSource: res.collection.thumbnail ? res.collection.thumbnail : '#',
          permalink: res.collection.guid
        };
    }


    var collectionsList = [
      el('div', {className: 'container-fluid'}, 
        el('div', {className: 'row block-center'},
          el(
            'div', { className: props.className + ' thumbnail col-xs-3' }, 
            el('a', {href: response.permalink, target: '_blank'}, 
              el('img', {src: response.coverImageSource, style: {width: '100%'}, className: 'img-responsive img-thumbnail', alt: response.caption}),
              el('figcaption', {className: 'figure-caption text-center text-muted'}, response.caption)
            )
          ),
          el(
            'div', { className: props.className + ' thumbnail col-xs-3 col-xs-offset-1' }, 
            el('a', {href: response.permalink, target: '_blank'}, 
              el('img', {src: response.coverImageSource, style: {width: '100%'}, className: 'img-responsive img-thumbnail', alt: response.caption}),
              el('figcaption', {className: 'figure-caption text-center text-muted'}, response.caption)
            )
          ),
          el(
            'div', { className: props.className + ' thumbnail col-xs-3 col-xs-offset-1' }, 
            el('a', {href: response.permalink, target: '_blank'}, 
              el('img', {src: response.coverImageSource, style: {width: '100%'}, className: 'img-responsive img-thumbnail', alt: response.caption}),
              el('figcaption', {className: 'figure-caption text-center text-muted'}, response.caption)
            )
          )
      )
    )
    ];

    console.info(collectionsList);
    return [collectionsList];
  },

  save: function( props ) {
    var content = props.attributes.content;
    console.info(content);
    return el('div', {className: props.className}, content + 'Hello!');
  },
});