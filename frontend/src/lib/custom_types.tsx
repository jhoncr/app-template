import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  role: string;
}

export interface AccessMap {
  [uid: string]: User;
}

export interface Item {
  id: string;
  title: string;
  item_type: string;
  access: AccessMap;
  pending_access: {
    [email: string]: string;
  };
}

// create an entry type that is used when reading from the database, it has the createdBy field and createdAt field
export interface DBentry {
  createdBy: string;
  createdAt: Timestamp;
  date: Timestamp;
  id: string;
  // optional fields
  [key: string]: any;
}

export interface DBentryMap {
  [id: string]: DBentry;
}

export interface Material {
  id?: string; // optional id
  name: string;
  description: string;
  pricePerSqMeter: number;
  type: "granite" | "flooring";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Quote {
  id?: string; // Optional id when creating new quotes
  clientId: string; // ID of the client making the quote request.
  quoteNumber?: string; // custom quote number
  items: QuoteItem[];
  laborCostType: "percentage" | "fixed"; // "per square meter" or "percentage"
  laborCostValue: number; // value for the calculation
  shippingCost: number;
  status: "pending" | "sent" | "accepted";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  notes?: string; // extra notes for the quote
  totalAmount?: number; // total quote value
}

export interface QuoteItem {
  materialId: string;
  quantity: number; // square meters
  priceAdjustment?: number;
  notes?: string;
  picture?: string;
}
