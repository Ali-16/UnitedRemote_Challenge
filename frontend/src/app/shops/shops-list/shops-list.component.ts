import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';

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
        this.onFetchShops(this.targetedShops, this.currentPage);

      }
      else {
        this.router.navigateByUrl('/notfound');
      }
    });
  }

  /**
   * Calls shopService to fetch wanted shops, 
   * by giving targetedShops and page number for backend API
   * @param target
   * @param page
    */
  private onFetchShops(target: string, page: number) {
    this.shopsService.fetchShops(target, page).subscribe(
      responseData => {
        this.handleFetchResponse(responseData);
      },
      responseError => {
        this.handleFetchError(responseError)
      }
    );
  }

  /** 
   * Handles Shops-related response sent by backend API,
   * Is awared of whether is more shops to fetch
   * @param data : Shop[]
   */
  private handleFetchResponse(data: Shop[]) {
    this.spinner.hide();
    let loadedShops = data;
    this.moreToFetch = (loadedShops !== null) ? true : false;
    if (this.moreToFetch) {
      this.shops = this.shops.concat(loadedShops);
      if (loadedShops.length < 10) {
        this.onScroll();
      }
      this.isScrolling = false;
    }
  }

  private handleFetchError(error: HttpErrorResponse) {
    console.log(error);
    this.spinner.hide();
  }

  /**
   * Triggered when the user scrolls Down
   * Increments the page number to send in http request to backend,
   * shows Spinner, then use shopService to fetch new shops
    */
  private onScroll() {
    if (!this.isScrolling && this.moreToFetch) {
      this.currentPage++;
      this.spinner.show();
      this.isScrolling = true;
      this.onFetchShops(this.targetedShops, this.currentPage);
    }
  }

  /**
   * Triggered by shop-item @output addLiker, call the service relevant method.
   * Removes the shop from current shops View.
   * @param shop Shop relevant to the event
   * @param userId current User Id
   */
  private onAddShopLiker(shop: Shop) {
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
  private onAddShopDisliker(shop: Shop) {
    this.shopsService.addShopDisliker(shop, this.userId).subscribe(
      responseData => {
        this.handleDislikeResponse(responseData);
      }
    );
    if (this.targetedShops === 'nearby') {
      this.shops.splice(this.shops.indexOf(shop), 1);
    }
  }

  private handleLikeResponse(Data) {
    // console.log(Data);
  }

  /**
   * Triggered by shop-item @output removeLiker, call the service relevant method.
   * Removes the shop from current prefered shops View.
   * @param shop Shop relevant to the event
   * @param userId current User Id
   */
  private onRemoveShopLiker(shop: Shop, userId: string) {
    this.shopsService.removeShopLiker(shop, this.userId).subscribe(
      responseData => {
        this.handleLikeResponse(responseData);
      }
    );
    if (this.targetedShops === 'prefered') {
      this.shops.splice(this.shops.indexOf(shop), 1);
    }
  }

  private handleDislikeResponse(Data) {
    // console.log(Data);
  }
}
