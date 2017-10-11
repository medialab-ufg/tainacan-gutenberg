<?php 

class TAINACAN_GUTENBERG__APIConst {

  public function hasDefaultTainacanURL(){      
      $defaultURL = get_option('default_repository_url')['default-url-g'];

      $TAINACAN_URL = isset($defaultURL) ? $defaultURL : false;

      return $TAINACAN_URL;
  }
}

?>