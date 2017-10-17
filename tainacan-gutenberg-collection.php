<?php

class TAINACAN_GUTENBERG__Collection{
  const LOCALHOST = 'http://localhost/';

  function __construct(){
    require_once('tainacan-gutenberg-api-const.php');
  }

  public function get_collection(){

    $TG__APIConst = new TAINACAN_GUTENBERG__APIConst();

    $collection = $_POST['collectionName'];
    $sourceURL = $_POST['sourceURL'];

    if(empty($sourceURL)){
      $has = $TG__APIConst->hasDefaultTainacanURL();
      $sourceURL = $has ? $has : LOCALHOST;
    }

    $URL = $sourceURL . TAINACAN_GUTENBERG__Blocks::TAINACAN_API_URL . 'collections?filter[title]=';
    
    $response =  wp_remote_get($URL . $collection);
    
    echo json_encode($response['body']);
    die;
  }

  public function get_collections(){
    
  }

  public function get_collection_items(){

  }
}

?>