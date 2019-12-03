<?php

namespace App\Http\Controllers;

use App\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    /**
     * Fetch targeted shops from Database 
     * The type of targeted shops is defined in the route URI
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetchAllShops(Request $request)
    {
        global $userId;
        $userId = $request->UID;
        $shops = Shop::orderBy('_id')->paginate(5);

        if($shops->currentPage()>$shops->lastPage()){
         return response(null, 204);
        }
        else{
            $allShops = $shops->reject(function ($shop) {
            global $userId;
            return (is_array($shop->dislikedBy) && in_array($userId, $shop->dislikedBy));
            });
            return response()->json($allShops, 200);
        }
    }


}
