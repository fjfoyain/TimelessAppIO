import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { UserRole, UserStatus } from "@/types";

interface CreateUserProfileData {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function createUserProfile(
  data: CreateUserProfileData
): Promise<void> {
  await setDoc(doc(db, "users", data.uid), {
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: "",
    status: UserStatus.PENDING,
    createdAt: serverTimestamp(),
  });
}

export async function createArtistProfile(
  uid: string,
  data: {
    stageName: string;
    genre: string;
    bio: string;
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
  }
): Promise<void> {
  await setDoc(doc(db, "artists", uid), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function createClientProfile(
  uid: string,
  data: {
    clientType: "individual" | "organization";
    fullName?: string;
    company?: string;
    role?: string;
    interest: string;
    budget: string;
    phone?: string;
  }
): Promise<void> {
  const profileData: Record<string, unknown> = {
    userId: uid,
    clientType: data.clientType,
    interest: data.interest,
    budget: data.budget,
    createdAt: serverTimestamp(),
  };
  if (data.fullName) profileData.fullName = data.fullName;
  if (data.company) profileData.company = data.company;
  if (data.role) profileData.role = data.role;
  if (data.phone) profileData.phone = data.phone;

  await setDoc(doc(db, "clients", uid), profileData);
}

export async function createTalentProfile(
  uid: string,
  data: {
    fullName: string;
    category: string;
    experience: string;
    baseRate: number;
    ratePer: string;
    portfolioLink?: string;
  }
): Promise<void> {
  await setDoc(doc(db, "talents", uid), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function createVenueProfile(
  uid: string,
  data: {
    venueName: string;
    location: string;
    capacity: number;
    eventTypes: string[];
    equipment?: string;
    websiteLink?: string;
  }
): Promise<void> {
  await setDoc(doc(db, "venues", uid), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
  });
}
