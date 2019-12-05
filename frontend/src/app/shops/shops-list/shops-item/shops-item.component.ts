import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
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
  @Output() addLiker = new EventEmitter();
  @Output() addDisliker = new EventEmitter();
  @Output() removeLiker = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  /**
   * Triggered when user click on the "Like button".
   * Emits an event to Shops-list component to trigger the "onAddShopLiker()" method
   */
  onAddLiker() {
    this.addLiker.emit();
  }

  /**
   * Triggered when user click on the "dislike button".
   * Emits an event to Shops-list component to trigger the "onAddShopDisLiker()" method
   */
  onAddDisliker() {
    this.addDisliker.emit();
  }
  /**
   * Triggered when user click on the "Remove button".
   * Emits an event to Shops-list component to trigger the "onRemoveShopLiker()" method
   */
  onRemoveLiker() {
    this.removeLiker.emit();
  }
}
