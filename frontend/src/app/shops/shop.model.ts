export interface Shop {
  _id: string;
  picture: string;
  name: string;
  email: string;
  city: string;
  location: object;
  likedBy?: string[];
  dislikedBy?: { [id: string]: Date }[];
}
