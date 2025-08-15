"use server";

import { signIn } from "@/app/_lib/auth";
import { signOut } from "@/app/_lib/auth";
import { auth } from "@/app/_lib/auth";
import { supabase } from "./supabase";
//import { revalidate } from "../cabin/page";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
//import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";
import { isPagesAPIRouteMatch } from "next/dist/server/future/route-matches/pages-api-route-match";
export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("you must be logged in to update your profile");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Invalid national ID format");
  }
  const updatedData = {
    nationality,
    countryFlag,
    nationalID,
  };
  const { data, error } = await supabase
    .from("guests")
    .update(updatedData)
    .eq("id", session.user.guestId);
  if (error) {
    //console.error("Supabase update error:", error);
    throw new Error(`Guest could not be updated: ${error.message}`);
  }
  revalidatePath("/account/profile");
  return { success: true, data };
}
export async function deleteReservation(bookingId: string) {
  const session = await auth();
  if (!session)
    throw new Error("You must be logged in to delete a reservation");
  // Check if the booking belongs to the logged-in user
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You cannot delete this reservation");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", bookingId);

  if (error) {
    throw new Error(`Reservation could not be deleted: ${error.message}`);
  }

  revalidatePath("/account/reservations");
  return { success: true };
}

export async function updateBooking(formData: FormData) {
  const bookingId = Number(formData.get("bookingId"));
  const session = await auth();
  if (!session)
    throw new Error("You must be logged in to update a reservation");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You cannot delete this reservation");
  const updatedData = {
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations")?.slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error(`Reservation could not be updated: ${error.message}`);
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
  return { success: true };
}
export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to book a cabin");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000) || "",
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  revalidatePath("/cabins/${bookingData.cabinId}");
  redirect("/cabin/thankyou");
}
