import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  listingId: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected" | "cancelled";
  date: string;   // "2025-08-25"
  from: string;   // "10:00"
  to: string;     // "15:00"
  guestEmail: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listings", required: true },
    guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guestEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    date: { type: String, required: true },
    from: { type: String, required: false },
    to: { type: String, required: false },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
