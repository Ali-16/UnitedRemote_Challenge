import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  /** 
   * Send Http Request to API backend to fetch Shops, handle response with handlefetchedshops method
   * Needs type of targeted shops, ID of authenticated user, and page to declare to API paginator
   * @param userId
   * @param targetedShops
   * @param page
   * @return httpResponse
   */
  fetchShops(userId: string, targetedShops: string, page: number) {
    return this.http
      .get(`${this.apiUrl}/shops/${targetedShops}?page=${page}&UID=${userId}`,
        { observe: 'response' })
      .pipe(
        map(response => this.handlefetchedshops(response)
        ));
  }

  /** 
   * Checks if there is no more shops to fetch, 
   * Converts response data from JSON to array
   * @param httpResponse
   * @return shopsArray 
   */
  private handlefetchedshops(response) {
    if (response.status == 204) {
      return response.body;
    }
    else {
      const shopsArray: Shop[] = [];
      for (let shopIndex in response.body) {
        shopsArray.push(response.body[shopIndex]);
      }
      return shopsArray;
    }

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
