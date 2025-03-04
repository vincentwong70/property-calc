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
    name: "Samer by Domus",
    type: PropertyType.TOWNHOUSE,
    price: 1328000,
    parking_cost: 35000,
    strata_cost: 0.39,
    is_new: true,
    plans: [
      {
        name: "C1",
        price: 1328000,
        interior_sqft: 1522,
      },
    ],
  },
  {
    name: "5 - 856 Orwell Street",
    type: PropertyType.TOWNHOUSE,
    price: 1619900,
    interior_sqft: 1469,
    parking_cost: 0,
    strata_cost: 0.33,
    is_new: false,
    link: "https://www.rew.ca/properties/5-856-orwell-street-north-vancouver-bc",
  },
  {
    name: "5 - 856 Orwell Street (Negotiated Price)",
    type: PropertyType.TOWNHOUSE,
    price: 1500000,
    interior_sqft: 1469,
    parking_cost: 0,
    strata_cost: 0.33,
    is_new: false,
    link: "https://www.rew.ca/properties/5-856-orwell-street-north-vancouver-bc",
  },
  {
    name: "1 - 2727 Parker Street",
    type: PropertyType.DUPLEX,
    price: 1188888,
    interior_sqft: 1436,
    is_new: true,
    link: "https://www.rew.ca/properties/1-2727-parker-street-vancouver-bc?property_click=map#",
  },
];
