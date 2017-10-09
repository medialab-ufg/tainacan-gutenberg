<?php

class TAINACAN_GUTENBERG__Collection{
  public function get_collections(){
    $collections = $_POST['collectionsID'];

    $URL = 'http://localhost/wordpress/' . TAINACAN_GUTENBERG__Blocks::TAINACAN_API_URL . 'collections/';
    
    $collectionsResponse = [];
    foreach($collections as $index => $collection){
      $body =  wp_remote_get($URL . $collection)['body'];
      
      array_push($collectionsResponse, $body);
    }

    echo json_encode($collectionsResponse);
    die;
  }
}

?>