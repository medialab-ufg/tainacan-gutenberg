<?php 

class TAINACAN_GUTENBERG__OptionsPage{

  function __construct(){
    add_action( 'admin_menu', array( &$this, 'addMenuOption'));
    add_action( 'admin_init', array( &$this, 'initPage' ) );
  }

  function createConfigurationPage(){ 
    $this->options = get_option('Tainacan Gutenberg');
?>
      <div class="wrap">
      <h1> Tainacan Gutenberg Configurations </h1>
        <form action="options.php" method="post">
          <?php
            settings_fields('tainacan_gutenberg_configurations');
            do_settings_sections('tainacan_gutenberg_configurations');
            submit_button();
          ?>
        </form>
      </div>

<?php
  }
    
  function addMenuOption(){
    add_options_page(
      'Tainacan Gutenberg', 
      'Tainacan Gutenberg', 
      'manage_options', 
      'tainacan-gutenberg', 
      array(&$this, 'createConfigurationPage')
    );
  }

  function initPage(){
    register_setting( 'tainacan_gutenberg_configurations', 'default_repository_url', array(&$this, 'sanitize'));
    add_settings_section('configurations-tainacan-g', '', array(&$this, 'printURLInfo'), 'tainacan_gutenberg_configurations');
    add_settings_field( 'default-url-g ', 'URL do repositório padrão:', array(&$this, 'durlg_callback'), 'tainacan_gutenberg_configurations', 'configurations-tainacan-g');
  }

  function durlg_callback(){
    $defaultURL = get_option('default_repository_url')['default-url-g'];
    
    printf('<input type="url" id="default-url-g" name="default_repository_url[default-url-g]" value="%s" />',
      isset( $defaultURL ) ? $defaultURL : ''
    );
  }

  function printURLinfo(){
    print('Digite abaixo a URL do Tainacan Repositório padrão, para busca de conteúdo (por exemplo: http://www.example.com/ - não esqueça da / no fim): ');
  }

  function sanitize( $input ){
      $new_input = array();
      if( isset( $input['default-url-g'] ) ){
          $new_input['default-url-g'] = sanitize_text_field( $input['default-url-g'] );
      }

      

      return $new_input;
  }
}
?>
