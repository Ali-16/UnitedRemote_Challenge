import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ShopsService } from "../shops.service";
import { Shop } from "../shop.model";

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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._shops = this.shopsService.shops;
    this.guessShopsTargeted();
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
}
