import { Injectable } from "@angular/core";
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
  constructor() {
    // Fakes shops sent by API backend
    this.shops = [
      {
        _id: "5a0c6711fb3aac66aafe26c4",
        picture: "http://placehold.it/150x150",
        name: "Gushkool",
        email: "leilaware@gushkool.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.81134" },
            { $numberDouble: "33.95564" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26c5",
        picture: "http://placehold.it/150x150",
        name: "Datagene",
        email: "leilaware@datagene.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.83746" },
            { $numberDouble: "33.91183" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26c6",
        picture: "http://placehold.it/150x150",
        name: "Silodyne",
        email: "leilaware@silodyne.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.75175" },
            { $numberDouble: "33.96853" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26c7",
        picture: "http://placehold.it/150x150",
        name: "Canopoly",
        email: "leilaware@canopoly.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.77404" },
            { $numberDouble: "33.80354" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26c8",
        picture: "http://placehold.it/150x150",
        name: "Sonique",
        email: "leilaware@sonique.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.74938" },
            { $numberDouble: "33.83436" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26c9",
        picture: "http://placehold.it/150x150",
        name: "Quiltigen",
        email: "leilaware@quiltigen.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.84286" },
            { $numberDouble: "33.96579" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26ca",
        picture: "http://placehold.it/150x150",
        name: "Infotrips",
        email: "leilaware@infotrips.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.80604" },
            { $numberDouble: "33.94889" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26cb",
        picture: "http://placehold.it/150x150",
        name: "Biflex",
        email: "leilaware@biflex.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.8123" },
            { $numberDouble: "33.86261" }
          ]
        }
      },
      {
        _id: "5a0c6711fb3aac66aafe26cc",
        picture: "http://placehold.it/150x150",
        name: "Permadyne",
        email: "leilaware@permadyne.com",
        city: "Rabat",
        location: {
          type: "Point",
          coordinates: [
            { $numberDouble: "-6.75058" },
            { $numberDouble: "33.81395" }
          ]
        }
      }
    ];
  }
}
