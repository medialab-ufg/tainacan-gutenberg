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
      source: children( 'p' )
    }
},

edit: function( props ) {

  var response = {
    label: '',
    coverImageSource: '',
    permalink: ''
  };

  jQuery.ajax({
    url: gutenbergTainacanBlocks.ajaxurl,
    type: 'POST',
    dataType: 'json',
    data: {
      operation: 'get_collections_json',
      data: {
        collection_id: 1
      }
    },
    async: false
  }).done(function(res){
    console.info(res)
    prepareResponse(res);

  }).fail(function(res) {
    console.info(res);
  });

  function prepareResponse(res){
      response = {
        label: res[0].label,
        coverImageSource: '#',
        permalink: res[0].permalink
      };
  }

  console.info(response);

  return [ 
    el(
      'div', 
      { className: props.className + ' img-thumbnail' }, 
      el('a', {href: response.permalink}, 
        el('img', {src: response.coverImageSource, style: {maxWidth: '100%'}, className: 'img-responsive', alt: response.label})
      )
    )
  ];
},

save: function( props ) {
  var content = props.attributes.content;

  return el( 'div', { className: props.className }, content );
},
} );