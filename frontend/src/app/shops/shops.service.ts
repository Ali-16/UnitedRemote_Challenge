import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Shop } from "./shop.model";

@Injectable({
  providedIn: "root"
})

/**
 * The servcie communicates with Backend API
 * Is responsible of getting and editting shop data from/to Backend
 */
export class ShopsService {
  public shops: Shop[];
  private apiUrl: string = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {
  }

  fetchAllShops(shopsTargeted,page) {
    shopsTargeted = "all";
    return this.http
      .get(`${this.apiUrl}/shops/${shopsTargeted}?page=${page}`);
  }

  fetchPreferedShops(userId: string) {
    // Implement the logic Here
    return this.shops;
  }

  fetchNearbyShops(userId: string, currentLocation: any) {
    // Implement the logic Here
    return this.shops;
  }

  /**
   * Sends an Http PUT request to Backend API.
   * Adds the current user Id in the relevant shop "LikedBy property"
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  addShopLiker(shop: Shop, userId: string) {
    // Implement the logic Here
    return shop;
  }

  /**
   * Sends an Http PUT request to Backend API.
   * Adds the current {user Id , date} JS Object in the relevant shop "DislikedBy property"
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  addShopDisliker(shop: Shop, userId: string) {
    // Implement the logic Here
    const timestamp = new Date().getTime();
    return shop;
  }

  /**
   * Sends an Http PUT request to Backend API.
   * removes the current user Id from the relevant shop "LikedBy property"
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  removeShopLiker(shop: Shop, userId: string) {
    // Implement the logic Here
    return shop;
  }

  /**
   * Sends an Http PUT request to Backend API.
   * Removes the {user Id , date} JS Object from the relevant shop "DislikedBy property", after two hours from specified date
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  removeShopDisliker(shop: Shop, userId: string) {
    // Implement the logic Here
    return shop;
  }
}
