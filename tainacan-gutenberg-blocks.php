<?php

class TAINACAN_GUTENBERG__Blocks{
  private $PLUGINS_URL;
  private $TAINACAN_API_URL;

  function __construct(){
    if(is_plugin_active('gutenberg/gutenberg.php')){
      $this->$PLUGINS_URL = plugins_url();

      add_action( 'admin_enqueue_scripts', array(&$this, 'enqueue_tainacan_gutenberg_assets'));
      add_action( 'enqueue_block_editor_assets', array(&$this, 'enqueue_blocks_js'));
      add_action( 'enqueue_block_editor_assets', array(&$this, 'enqueue_blocks_css'));
    }
    else{
      die('É necessário ter o plugin Gutenberg instalado e ativado');
    }   
  }

  function enqueue_tainacan_gutenberg_assets(){
    wp_enqueue_script('bootstrapJS', $this->$PLUGINS_URL . '/tainacan-gutenberg/assets/js/bootstrap/bootstrap.min.js', "3.3.7", true); 
    wp_enqueue_script('jQuery', $this->$PLUGINS_URL . '/tainacan-gutenberg/assets/js/jquery/jquery-3.2.1.min.js', "3.2.1", true);    

    wp_enqueue_style( 'bootstrapCSS', $this->$PLUGINS_URL . '/tainacan-gutenberg/assets/css/bootstrap/bootstrap.min.css');
  }

  function enqueue_blocks_js() {    
    // Adiciona script do bloco lista de coleções
    wp_enqueue_script(
      'collections-list',
      $this->$PLUGINS_URL . '/tainacan-gutenberg/blocks/collections-list.js',
      array( 'wp-blocks', 'wp-element' )
    ); 
    wp_localize_script('collections-list', 'gutenbergTainacanBlocks', array( 
      'ajaxurl' => '',
    ));

  }

  function enqueue_blocks_css(){
    // Adiciona folha de estilos dos blocos do tainacan
    wp_enqueue_style(
      'tainacan-blocks',
      $this->$PLUGINS_URL . '/tainacan-gutenberg/assets/css/tainacan-blocks.css',
      array( 'wp-edit-blocks' ),
      filemtime($this->$PLUGINS_URL . '/tainacan-gutenberg/assets/css/tainacan-blocks.css')
    );
  }
}
?>