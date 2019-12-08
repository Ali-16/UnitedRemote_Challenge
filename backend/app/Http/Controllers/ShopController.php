<?php

namespace App\Http\Controllers;

use App\Shop;
use App\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Gate;


class ShopController extends Controller
{
    /**
     * Retrieves All shops from Database, except liked by authenticated user ones 
     *
     * @return \Illuminate\Http\Response
     */
    public function fetchAllShops()
    {
        global $userId;
        $userId = auth()->user()->_id;
        $shops = Shop::orderBy('_id')->paginate(10);

        if ($shops->currentPage() > $shops->lastPage()) {
            return response(null, 204);
        } else {
            $filteredShops = $shops->reject(function ($shop) {
                global $userId;
                return (is_array($shop->likedBy) && in_array($userId, $shop->likedBy));
            });
            return response()->json($filteredShops, 200);
        }
    }

    /**
     * Retrieves All shops from Database, except disliked by the authenticated user ones
     * Returns chunck of Shops ordered by their distance from a given point
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetchNearbyShops(Request $request)
    {
        global $userId;
        $userId = auth()->user()->_id;
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
     * Retrieves, from Database, shops that was liked by the authenticated user
     * 
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response $filteredShops
     */
    public function fetchPreferedShops()
    {
        global $userId;
        $userId = auth()->user()->_id;
        $shops = Shop::orderBy('_id')->paginate(10);

        if ($shops->currentPage() > $shops->lastPage()) {
            return response(null, 204);
        } else {
            $filteredShops = $shops->filter(function ($shop) {
                global $userId;
                if (!is_array($shop->likedBy)) {
                    return false;
                } elseif (!in_array($userId, $shop->likedBy)) {
                    return false;
                } else {
                    return true;
                }
            });
            return response()->json($filteredShops, 200);
        }
    }

    /**
     * Add a liker user to the shop
     *
     * @param  \Illuminate\Http\Request  $request
     * @param string $shopId
     * @return \Illuminate\Http\Response $shop
     */
    public function addLiker(Request $request, string $shopId)
    {
        $userId = $request->input('userId');
        $user = User::findOrFail($userId);
        Gate::authorize('update-shop-likeliness', $userId);
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
     * remove liker user from a shop
     * Update a defined shop by remove userId from its likedBy property
     *
     * @param \Illuminate\Http\Request $request
     * @param string $shopId
     * @return \Illuminate\Http\Response
     */
    public function removeLiker(Request $request, $shopId)
    {
        $userId = $request->input('userId');
        $user = User::findOrFail($userId);
        Gate::authorize('update-shop-likeliness', $userId);
        $shop = Shop::findOrFail($shopId);

        if (is_array($shop->likedBy)) {
            $likes = $shop->likedBy;
            $likeKey = array_search($userId, $likes);
            if ($likeKey !== false) {
                unset($likes[$likeKey]);
                $shop->likedBy = array_values($likes);
                $shop->save();
            }
        }
        return response()->json($shop, 200);
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
        $user = User::findOrFail($userId);
        Gate::authorize('update-shop-likeliness', $userId);
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
        $user = User::findOrFail($userId);
        Gate::authorize('update-shop-likeliness', $userId);
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
