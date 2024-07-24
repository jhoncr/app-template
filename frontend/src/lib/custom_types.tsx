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
  createdAt: Timestamp
  date: Timestamp;
  id: string;
  // optional fields
  [key: string]: any;
};

export interface DBentryMap {
  [id: string]: DBentry;
}





