export enum PropertyType {
  TOWNHOUSE = "TOWNHOUSE",
  DUPLLEX = "DUPLEX",
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
} & Partial<Omit<Plan, "name">>;

export const properties: Property[] = [
  {
    name: "Moonlight Sonata",
    type: PropertyType.TOWNHOUSE,
    parking_cost: 35000,
    strata_cost: 0.51,
    is_new: true,
    plans: [
      {
        name: "D7",
        price: 1330000,
        interior_sqft: 1349,
        exterior_sqft: 280,
      },
    ],
  },
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
      {
        name: "B2E",
        price: 1229000,
        interior_sqft: 1246,
      },
    ],
  },
  {
    name: "Dwell by Anthem",
    type: PropertyType.TOWNHOUSE,
    parking_cost: 35000,
    strata_cost: 0.37,
    is_new: true,
    plans: [
      {
        name: "D2",
        price: 1299000,
        interior_sqft: 1385,
      },
    ],
  },
  {
    name: "1515 Rupert",
    type: PropertyType.TOWNHOUSE,
    parking_cost: 40000,
    strata_cost: 0.37,
    is_new: true,
    plans: [
      {
        name: "H2",
        price: 1499000,
        interior_sqft: 1330,
      },
      {
        name: "A1",
        price: 1359000,
        interior_sqft: 1263,
      },
    ],
  },
  {
    name: "3225 E 29th Ave",
    type: PropertyType.DUPLLEX,
    price: 1499000,
    interior_sqft: 1304,
  },
];
