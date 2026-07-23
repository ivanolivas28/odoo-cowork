import mongoose, { Schema, type InferSchemaType } from "mongoose";

/**
 * One document per person who logs in with Google. Holds their identity plus
 * the Google OAuth tokens the app uses to write Sheets into *their* Drive.
 * Per-user Odoo credentials live in the Connection model (added in phase 2).
 */
const userSchema = new Schema(
  {
    // Google's stable user id (the OAuth "sub" claim).
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    image: { type: String },

    // Google OAuth tokens for the Sheets scope (used to write to the user's Drive).
    googleRefreshToken: { type: String },
    googleAccessToken: { type: String },
    googleTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
