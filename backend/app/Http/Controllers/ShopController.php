<?php

namespace App\Http\Controllers;

use App\Shop;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;

class ShopController extends Controller
{
    /**
     * Fetch All shops from Database, except liked by the current user ones 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetchAllShops(Request $request)
    {
        global $userId;
        $userId = $request->UID;
        $shops = Shop::orderBy('_id')->paginate(10);

        if ($shops->currentPage() > $shops->lastPage()) {
            return response(null, 204);
        } else {
            $filteredShops = $shops->reject(function ($shop) {
                global $userId;
                return (is_array($shop->likedBy) && in_array($userId, $shop->likedBy));
            });
            // return response()->json(in_array($userId, $shop->likedBy), 200);
            return response()->json($filteredShops, 200);
        }
    }

    /**
     * Add a liker user to the shop
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addLiker(Request $request, $shopId)
    {
        $userId = $request->input('userId');
        $shop = Shop::findOrFail($shopId);

        if (is_array($shop->likedBy)) {
            $likes = $shop->likedBy;
            if (!in_array($userId, $likes)) $likes[] = $userId;
        } else {
            $likes[] = $userId;
        }

        $shop->likedBy = $likes;
        $shop->save();

        return response()->json($shop, 200);
    }

    /**
     * Fetch All shops from Database, except disliked by the current user ones
     * Returns chunck of Shops ordered by their distance from a given point
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetchNearbyShops(Request $request)
    {
        global $userId;
        $userId = $request->UID;
        $latitude = (float) $request->latitude;
        $longitude = (float) $request->longitude;

        $center = $this->createPoint($longitude, $latitude);
        $shops = $this->retrieveShopsNearPoint_Query($center)->paginate(10);

        $data = Shop::hydrate($shops->items());

        if ($shops->currentPage() > $shops->lastPage()) {
            return response(null, 204);
        } else {
            $filteredShops = collect($data)->reject(function ($shop) {
                global $userId;
                return $this->isShopDisliked($shop, $userId);
            });
            return response()->json($filteredShops, 200);
        }
    }

    /**
     * Checks whether a given shop is disliked by a given user
     * 
     * @param Shop $shop
     * @param $userId
     * 
     * @return boolean
     */
    public function isShopDisliked(Shop $shop, $userId)
    {
        if (isset($shop->dislikedBy[$userId])) {
            $dislikeStart = new Carbon(($shop->dislikedBy[$userId])['date']);
            $dislikeEnd = $dislikeStart->addMinutes(120);
            if (isset($shop->dislikedBy[$userId])) {
                if (Carbon::now() > $dislikeEnd) {
                    $this->removeDisliker($userId, $shop);
                    return false;
                } else return true;
            }
        }
    }

    /**
     * Add a disliker user to the shop
     * Update a defined shop by adding userId to its dislikedBy property
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addDisliker(Request $request, string $shopId)
    {
        $userId = $request->input('userId');
        $shop = Shop::findOrFail($shopId);

        $dislikes = $shop->dislikedBy;
        $dislikes[$userId] = Carbon::now();
        $shop->dislikedBy = $dislikes;
        $shop->save();

        return response()->json($shop, 200);
    }

    /** 
     * 
     */
    public function removeDisliker(string $userId, Shop $shop)
    {
        $dislikes = $shop->dislikedBy;
        if (isset($dislikes[$userId])) unset($dislikes[$userId]);

        $shop->dislikedBy = $dislikes;
        $shop->save();

        return response()->json($shop, 200);
    }

    /**
     * Returns a querry builder that fetches shops ordered by distance from a given point
     * @param $center
     * 
     * @return $queryBuilder
     */
    public function retrieveShopsNearPoint_Query($center)
    {
        $queryBuilder = DB::collection('shops');
        return $queryBuilder->whereRaw(
            [
                'location' => [
                    '$near' => [
                        '$geometry' => $center,
                    ]
                ]
            ]
        );
    }

    /**
     * Creates a  point from Geo Coordinates
     * 
     * @param $longitude
     * @param $latitude
     * 
     * @return point
     */
    public function createPoint(float $longitude, float $latitude)
    {
        return array(
            'type' => "Point",
            'coordinates' => array($longitude, $latitude)
        );
    }
}
