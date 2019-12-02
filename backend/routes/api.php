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
    Route::post('refresh', 'Auth\AuthController@refresh');
    Route::post('me', 'Auth\AuthController@me');

    /** 
     * Routes for Shops stuff
     */
    Route::get('shops/all', 'ShopController@fetchAllShops');
});
