import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Neighborhood = Database["public"]["Tables"]["neighborhoods"]["Row"];
export type WorkPhoto = Database["public"]["Tables"]["work_photos"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];

export type AvailabilityStatus =
  Database["public"]["Enums"]["availability_status"];
export type PriceRange = Database["public"]["Enums"]["price_range"];
export type TierType = Database["public"]["Enums"]["tier_type"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export type ProfileWithRelations = Profile & {
  categories: Category | null;
  profile_neighborhoods: {
    neighborhoods: Neighborhood;
  }[];
  work_photos: WorkPhoto[];
};
