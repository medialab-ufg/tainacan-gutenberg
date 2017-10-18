<?php

class TAINACAN_GUTENBERG__Collection{
  
  private $TG__APIConst = '';

  function __construct(){
    require_once('tainacan-gutenberg-api-const.php');
    $this->TG__APIConst = new TAINACAN_GUTENBERG__APIConst();
  }

  public function get_collection(){
    $collection = $_POST['collectionName'];
    $sourceURL = $_POST['sourceURL'];

    if(empty($sourceURL)){
      $sourceURL =  $this->TG__APIConst->hasDefaultTainacanURL();
    }

    $URL = $sourceURL . TAINACAN_GUTENBERG__Blocks::TAINACAN_API_URL . 'collections?filter[title]=';
    
    $response =  wp_remote_get($URL . $collection);
    
    echo json_encode($response['body']);
    die;
  }

  public function get_collections(){
    $sourceURL = $_POST['sourceURL'];

    if(empty($sourceURL)){
      $sourceURL =  $this->TG__APIConst->hasDefaultTainacanURL();
    }

    $URL = $sourceURL . TAINACAN_GUTENBERG__Blocks::TAINACAN_API_URL . 'collections';

    $response = wp_remote_get($URL);

    echo json_encode($response['body']);
    die;
  }

  public function get_collection_items(){
    $collectionID = $_POST['collectionID'];
    $sourceURL = $_POST['sourceURL'];

    $URL = $sourceURL . TAINACAN_GUTENBERG__Blocks::TAINACAN_API_URL . 'collections/' . $collectionID . '/items';

    $response = wp_remote_get($URL);

    echo json_encode($response['body']);
    die;
  }
}

?>