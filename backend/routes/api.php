<?php

Route::group([
    'middleware' => 'api'
], function () {

    /** 
     * Routes for authentication features
     */
    Route::post('signin', 'Auth\AuthController@signIn');
    Route::post('signup', 'Auth\AuthController@signUp');
    Route::post('logout', 'Auth\AuthController@logout');
    Route::get('refresh', 'Auth\AuthController@refresh');
    Route::post('me', 'Auth\AuthController@me');
});

Route::group([
    'middleware' => 'jwt.verify'
], function () {
    /** 
     * Routes for Shops stuff
     */
    Route::get('shops/all', 'ShopController@fetchAllShops');
    Route::get('shops/nearby', 'ShopController@fetchNearbyShops');
    Route::get('shops/prefered', 'ShopController@fetchPreferedShops');
    Route::patch('shops/{shop}/disliker', 'ShopController@addDisliker');
    Route::patch('shops/{shop}/liker', 'ShopController@addLiker');
    Route::patch('shops/{shop}/removeliker', 'ShopController@removeLiker');
});
