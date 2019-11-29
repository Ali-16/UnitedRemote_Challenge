import { Component, OnInit, Input } from "@angular/core";
import { Shop } from "../../shop.model";

@Component({
  selector: "shops-item",
  templateUrl: "./shops-item.component.html",
  styleUrls: ["./shops-item.component.css"]
})

/**
 * The component Reprensents one shop.
 * @input shop : Recieve from Shops-list component shop data
 * @input buttons : Recieve from Shops-list component how to show like-related buttons
 */
export class ShopsItemComponent implements OnInit {
  @Input() shop: Shop;
  @Input() buttons: string;
  constructor() {}

  ngOnInit() {}
}
