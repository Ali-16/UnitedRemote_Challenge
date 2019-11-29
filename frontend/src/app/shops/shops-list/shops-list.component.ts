import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ShopsService } from "../shops.service";
import { Shop } from "../shop.model";
import { GeoLocationService } from "../geo-location.service";

@Component({
  selector: "app-shops-list",
  templateUrl: "./shops-list.component.html",
  styleUrls: ["./shops-list.component.css"]
})
/**
 * Main component of shops, get/set shops data from/to shops Service
 */
export class ShopsListComponent implements OnInit {
  public _shops: Shop[];
  private _shopsTargeted: string;

  set shopsTargeted(type: string) {
    this._shopsTargeted = type;
  }
  set shops(shops: Shop[]) {
    this._shops = shops;
  }
  get shops() {
    return this._shops;
  }

  constructor(
    private shopsService: ShopsService,
    private route: ActivatedRoute,
    private locationService: GeoLocationService
  ) {}

  ngOnInit() {
    this._shops = this.shopsService.shops;
    this.guessShopsTargeted();
    this.getLocation();
  }

  /**
   * Guess the type of shops targeted in function of current Url
   * Subscribes to activated route observable
   */
  guessShopsTargeted() {
    this.route.params.subscribe((params: Params) => {
      this._shopsTargeted = params["target"];
    });
  }

  /**
   * use location service to location of the current user
   * if he permits geolocation, alert user on it.
   */
  private getLocation() {
    this.route.params.subscribe((params: Params) => {
      if (params["target"] === "nearby") {
        this.locationService
          .getPosition()
          .catch(error => {
            alert(error.message);
          })
          .then(position => {
            alert(`Positon: ${position.lng} , ${position.lat}`);
          });
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
    if (this._shopsTargeted === "nearby") {
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
}
