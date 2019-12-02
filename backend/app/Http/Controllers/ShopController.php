<?php

namespace App\Http\Controllers;

use App\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function fetchAllShops()
    {
        $shops = Shop::orderBy('_id')->paginate(10);
        return response()->json($shops, 200);
    }
}
