<?php 

class TAINACAN_GUTENBERG__APIConst {
  const LOCALHOST = 'http://localhost/';

  public function hasDefaultTainacanURL(){      
      $defaultURL = get_option('default_repository_url')['default-url-g'];

      $TAINACAN_URL = isset($defaultURL) ? $defaultURL : self::LOCALHOST;

      return $TAINACAN_URL;
  }
}

?>