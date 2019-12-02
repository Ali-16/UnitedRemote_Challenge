import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Params, Router } from "@angular/router";

import { ShopsService } from "../shops.service";
import { Shop } from "../shop.model";
import { GeoLocationService } from "../geo-location.service";

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
  public shops: Shop[] = [];
  private targetedShops: string;
  private currentPage: number = 1;
  private emptyShop: boolean = false;
  private isScrolling: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: GeoLocationService,
    private shopsService: ShopsService,
  ) { }

  ngOnInit() {
    this.guesstargetedShops();
    this.fetchShops(this.targetedShops, this.currentPage);
    if (this.targetedShops === 'nearby') {
      this.getLocation();
    }
  }

  /**
   * Calls shopService to fetch wanted shops, 
   * by giving targetedShops and page number for backend API
   * @param  target
   * @param  page
    */
  fetchShops(target: string, page: number) {
    this.shopsService.fetchAllShops(target, page).subscribe(
      responseData => {
        this.handleResponse(responseData);
        this.spinner.hide();
      },
      responseError => {
        console.log(responseError);
        this.spinner.hide();
      }
    );
  }

  /** 
   * Handles Shops-related response sent by backend API
   */
  handleResponse(data) {
    let loadedShops = data['data'];
    this.emptyShop = (loadedShops.length === 0) ? true : false;
    this.shops = this.shops.concat(loadedShops);
    this.isScrolling = false;
  }

  /**
   * Triggered when the user scrolls Down
   * Increments the page number to send in http request to backend,
   * shows Spinner, and use shopService to fetch new shops
    */
  onScroll() {
    if (!this.isScrolling && !this.emptyShop) {
      this.currentPage++;
      this.spinner.show();
      this.isScrolling = true;
      this.fetchShops(this.targetedShops, this.currentPage);
    }
  }

  /**
   * Guess the type of shops targeted in function of current Url
   * Subscribes to activated route observable
   */
  guesstargetedShops() {
    this.route.params.subscribe((params: Params) => {
      if (['all', 'prefered', 'nearby'].includes(params['target'])) {
        this.targetedShops = params["target"];
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
    this.shopsService.addShopLiker(shop, userId);
    this.shops.splice(this.shops.indexOf(shop), 1);
  }

  /**
   * Triggered by shop-item @output addDisiker, call the service relevant method.
   * Removes the shop from current shops View, if Relevant.
   * @param shop Shop relevant to the event
   * @param userId current User Id
   */
  onAddShopDisliker(shop: Shop, userId: string) {
    this.shopsService.addShopDisliker(shop, userId);
    if (this.targetedShops === "nearby") {
      this.shops.splice(this.shops.indexOf(shop), 1);
    }
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
