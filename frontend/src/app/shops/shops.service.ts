import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import * as moment from "moment";
import { Observable, throwError } from 'rxjs';

import { Shop } from "./shop.model";
import * as globals from "src/app/shared/globals";
import { TokenService } from 'src/app/shared/token.service';
import { GeoLocationService } from "./geo-location.service";

@Injectable({
  providedIn: "root"
})

/**
 * The servcie communicates with Backend API
 * Is responsible of getting and editting shop data from/to Backend
 */
export class ShopsService {
  public shops: Shop[];
  private longitude: string;
  public latitude: string;
  private apiUrl: string = globals.apiURL;
  constructor(private http: HttpClient,
    private tokenService: TokenService,
    private locationService: GeoLocationService) {
  }

  /** 
   * generated HttpParamas for fetch request
   * 
   * @param targetedShops
   * @param page
   * @return HttpParams
   */
  private generateFetchParams(targetedShops: string, page: number) {
    if (targetedShops == 'nearby') {
      this.setLocation();
      return new HttpParams()
        .set('page', page.toString())
        .set('longitude', this.longitude)
        .set('latitude', this.latitude);
    }
    else {
      return new HttpParams()
        .set('page', page.toString())
    }
  }

  /** 
   * Send Http Request to API backend to fetch Shops, handle response with handlefetchedshops method
   * Needs type of targeted shops, and page to declare to API paginator
   * 
   * @param targetedShops
   * @param page
   * @return httpResponse
   */
  fetchShops(targetedShops: string, page: number) {
    const params = this.generateFetchParams(targetedShops, page);
    return this.http
      .get(`${this.apiUrl}/shops/${targetedShops}`,
        { params: params, observe: 'response' })
      .pipe(
        map(this.handlefetchedshops)
      );
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
      return response.body;
    }
    return response.body;
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }

  /**
   * Sends an Http PATCH request to Backend API.
   * Adds the current userId JSON in the relevant shop "DislikedBy property"
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  addShopLiker(shop: Shop, userId: string) {
    return this.http
      .patch(`${this.apiUrl}/shops/${shop._id}/liker`, { 'userId': userId });
  }

  /**
   * Sends an Http PATCH request to Backend API.
   * Adds the current {user Id , date} JSON in the relevant shop "DislikedBy array property"
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  addShopDisliker(shop: Shop, userId: string) {
    const disliketime = moment();
    console.log(disliketime);

    return this.http
      .patch(`${this.apiUrl}/shops/${shop._id}/disliker`, { 'userId': userId });

  }

  /**
   * Sends an Http PUT request to Backend API.
   * removes the current user Id from the relevant shop "LikedBy property"
   * @param shop
   * @param userId current user Id
   * @return shop
   */
  removeShopLiker(shop: Shop, userId: string) {
    console.log('UserId: ', userId);
    console.log('Shop: ', shop);
    return this.http
      .patch(`${this.apiUrl}/shops/${shop._id}/removeliker`, { 'userId': userId });
  }

  /**
   * Set Geo Coordinates properties, from locationService
   */
  private setLocation() {
    this.locationService.getPosition()
      .catch(error => {
        alert(error.message);
      })
      .then(position => {
        this.longitude = position.lng;
        this.latitude = position.lat;
      });
  }
}
