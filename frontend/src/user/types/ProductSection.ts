export interface ProductSectionTypes {
  Heading?: string;
  button?: string;
  product?: {
    id: number;
    image: string;
    title: string;
    starsIcons: string;
    rating: string;
    RealPrice?: string;
    CurrentPrice: string;
    discount?: string;
  }[];
}
