import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Params, Router } from "@angular/router";

import { ShopsService } from "../shops.service";
import { Shop } from "../shop.model";
import { GeoLocationService } from "../geo-location.service";
import { TokenService } from 'src/app/shared/token.service';

@Component({
  selector: "app-shops-list",
  templateUrl: "./shops-list.component.html",
  styleUrls: ["./shops-list.component.css"]
})
/**
 * Main component of shops
 * Get/sets shops data from/to shops Service
 * Manage display of shops (ifinite scrolling)
 */
export class ShopsListComponent implements OnInit {
  private userId: string;
  public shops: Shop[] = [];
  private targetedShops: string;
  private currentPage: number = 1;
  private moreToFetch: boolean = false;
  private isScrolling: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: GeoLocationService,
    private shopsService: ShopsService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.userId = this.tokenService.getUserId();
    this.guesstargetedShops();
    this.onFetchShops(this.userId, this.targetedShops, this.currentPage);
    if (this.targetedShops === 'nearby') {
      this.getLocation();
    }
  }

  /**
   * Calls shopService to fetch wanted shops, 
   * by giving authenticated userId, targetedShops and page number for backend API
   * @param userId
   * @param target
   * @param page
    */
  onFetchShops(userId: string, target: string, page: number) {
    console.log('onFetchShops()');
    this.shopsService.fetchShops(userId, target, page).subscribe(
      responseData => {
        this.handleFetchResponse(responseData);
        this.spinner.hide();
      },
      responseError => {
        console.log(responseError);
        this.spinner.hide();
      }
    );
  }

  /** 
   * Handles Shops-related response sent by backend API,
   * Is awared of whether is more shops to fetch
   * @param data : Shop[]
   */
  private handleFetchResponse(data: Shop[]) {
    console.log('handleFetchResponse()');
    let loadedShops = data;
    this.moreToFetch = (loadedShops !== null) ? true : false;
    if (this.moreToFetch) {
      this.shops = this.shops.concat(loadedShops);
      this.isScrolling = false;
    }

    if (loadedShops.length < 10) {
      console.log('loadedshops.length = ', loadedShops.length)
      this.onScroll();
    }

  }

  /**
   * Triggered when the user scrolls Down
   * Increments the page number to send in http request to backend,
   * shows Spinner, then use shopService to fetch new shops
    */
  private onScroll() {
    console.log(' onScroll!! ');
    if (!this.isScrolling && this.moreToFetch) {
      this.currentPage++;
      console.log(' page ', this.currentPage);
      this.spinner.show();
      this.isScrolling = true;
      this.onFetchShops(this.userId, this.targetedShops, this.currentPage);
    }
  }

  /**
   * Guess the type of shops targeted in function of current Url
   * Subscribes to activated route observable
   */
  private guesstargetedShops() {
    this.route.params.subscribe((params: Params) => {
      if (['all', 'prefered', 'nearby'].includes(params['target'])) {
        this.targetedShops = params["target"];
        this.shops = [];
        this.currentPage = 1;
        this.onFetchShops(this.userId, this.targetedShops, this.currentPage);
      }
      else {
        this.router.navigateByUrl('/shops/all');
      }
    });
  }

  /**
   * Triggered by shop-item @output addLiker, call the service relevant method.
   * Removes the shop from current shops View.
   * @param shop Shop relevant to the event
   * @param userId current User Id
   */
  onAddShopLiker(shop: Shop, userId: string) {
    this.shopsService.addShopLiker(shop, this.userId).subscribe(
      responseData => {
        this.handleLikeResponse(responseData);
      }
    );
    if (this.targetedShops === 'all') {
      this.shops.splice(this.shops.indexOf(shop), 1);
    }
  }

  /**
   * Triggered by shop-item @output addDisiker, call the service relevant method.
   * Removes the shop from current shops View, if Relevant.
   * @param shop Shop relevant to the event
   * @param userId current User Id
   */
  onAddShopDisliker(shop: Shop) {
    this.shopsService.addShopDisliker(shop, this.userId).subscribe(
      responseData => {
        this.handleDislikeResponse(responseData);
      }
    );
    if (this.targetedShops === 'nearby') {
      this.shops.splice(this.shops.indexOf(shop), 1);
    }
  }

  private handleDislikeResponse(data) {
    console.log(data);
  }

  private handleLikeResponse(data) {
    console.log(data);
  }

  /**
   * Triggered by shop-item @output removeLiker, call the service relevant method.
   * Removes the shop from current prefered shops View.
   * @param shop Shop relevant to the event
   * @param userId current User Id
   */
  onRemoveShopLiker(shop: Shop, userId: string) {
    this.shopsService.removeShopLiker(shop, userId);
    this.shops.splice(this.shops.indexOf(shop), 1);
  }

  /**
   * use location service to location of the current user
   * if he permits geolocation, alert user on it.
   */
  private getLocation() {
    this.route.params.subscribe((params: Params) => {
      this.locationService.getPosition()
        .catch(error => {
          alert(error.message);
        })
        .then(position => {
          alert(`Positon: ${position.lng} , ${position.lat}`);
        });
    });
  }
}
