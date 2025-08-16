import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  pincode: String,
  address: String,
  description: String,
  availableHours: String,
  image: Buffer, // or String (if storing base64 or URL)
}, { timestamps: true });

const Listings = mongoose.model('Listings', listingSchema);
export default Listings;