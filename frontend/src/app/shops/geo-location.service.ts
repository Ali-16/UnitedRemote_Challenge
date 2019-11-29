import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GeoLocationService {
  constructor() {}

  /**
   * Use browser Web Api to get geo-location of current user
   */
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        location => {
          resolve({
            lng: location.coords.longitude,
            lat: location.coords.latitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
