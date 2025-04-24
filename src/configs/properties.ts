export enum PropertyType {
  TOWNHOUSE = "TOWNHOUSE",
  DUPLEX = "DUPLEX",
}

export type Plan = {
  name: string;
  price: number;
  interior_sqft: number;
  exterior_sqft?: number;
};

export type Property = {
  name: string;
  type: PropertyType;
  is_new?: boolean;
  parking_cost?: number;
  strata_cost?: number; // per sqft
  plans?: Plan[];
  link?: string;
} & Partial<Omit<Plan, "name">>;

export const properties: Property[] = [
  {
    name: "1 - 1260 Kaslo Street",
    type: PropertyType.DUPLEX,
    price: 1580000,
    interior_sqft: 1550,
    parking_cost: 0,
    strata_cost: 0,
    is_new: true,
    link: "https://www.rew.ca/properties/1-1260-kaslo-street-vancouver-bc",
  },
];
