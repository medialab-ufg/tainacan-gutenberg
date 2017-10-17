<?php

class TAINACAN_GUTENBERG__Blocks{
  private $PLUGINS_URL = '';
  
  const TAINACAN_API_URL = 'wp-json/tainacan/v1/';

  function __construct(){
    if(is_plugin_active('gutenberg/gutenberg.php')){
      require_once('tainacan-gutenberg-collection.php');
      
      $collection = new TAINACAN_GUTENBERG__Collection();
      
      $this->PLUGINS_URL = plugins_url();

      add_action( 'admin_enqueue_scripts', array(&$this, 'enqueue_tainacan_gutenberg_assets'));
      add_action( 'enqueue_block_assets', array(&$this, 'enqueue_blocks_js'));
      add_action( 'enqueue_block_assets', array(&$this, 'enqueue_blocks_css'));

      add_action( 'wp_ajax_get_collection', array($collection, 'get_collection'));
    }
    else{
      die('É necessário ter o plugin Gutenberg instalado e ativado');
    }   
  }

  function enqueue_tainacan_gutenberg_assets(){
    wp_enqueue_script('jQuery', $this->PLUGINS_URL . '/tainacan-gutenberg/assets/js/jquery/jquery-3.2.1.min.js', null, '3.2.1', true);        
    wp_enqueue_script('bootstrap-js', $this->PLUGINS_URL . '/tainacan-gutenberg/assets/js/bootstrap/bootstrap.min.js', 'jQuery', '3.3.7', true); 

    wp_enqueue_style( 'bootstrap-css', $this->PLUGINS_URL . '/tainacan-gutenberg/assets/css/bootstrap/bootstrap.min.css');
  }

  function enqueue_blocks_js() {    
    // Adiciona script do bloco lista de coleções
    wp_enqueue_script(
      'collections-list',
      $this->PLUGINS_URL . '/tainacan-gutenberg/blocks/collections-list.js',
      array('wp-blocks', 'wp-element')
    );

    // Adiciona script do bloco de grade de itens
    wp_enqueue_script(
      'items-grid',
      $this->PLUGINS_URL . '/tainacan-gutenberg/blocks/items-grid.js',
      array('wp-blocks', 'wp-element')
    );

    $this->localize_ajax();
  }

  function enqueue_blocks_css(){
    // Adiciona folha de estilos dos blocos do tainacan
    wp_enqueue_style(
      'tainacan-blocks',
      $this->PLUGINS_URL . '/tainacan-gutenberg/assets/css/tainacan-blocks.css',
      array('wp-edit-blocks')
      //,filemtime($this->$PLUGINS_URL . '/tainacan-gutenberg/assets/css/tainacan-blocks.css')
    );
  }

  function localize_ajax(){
    wp_localize_script('collections-list', 'gutenbergTainacanBlocks', array( 
      'ajaxurl' => admin_url('admin-ajax.php'),
    ));
  }
}
?>