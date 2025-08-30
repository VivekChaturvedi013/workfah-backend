import express from 'express';
import Listings from '../models/Listings';
import User from '../models/User';
import multer from 'multer';
import { authMiddleware } from '../authmidddleware';

const router = express.Router();

// Create a new listing
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { pincode, address, description, availableHours } = req.body;
    const user = (req as any).user;

    console.log('Authenticated user:', user);

    // ✅ Ensure pincode is stored consistently as string (safer for Indian pincodes)
    const newListing = new Listings({
      host: user.userId,         // userId comes from token
      hostEmail: user.email,     // storing host email
      pincode: String(pincode),  // always store as string
      address,
      description,
      availableHours,
      image: req.file?.buffer
    });

    // ✅ Save the listing in DB
    await newListing.save();
    console.log('Saved Listing:', newListing);

    // ✅ Update user role to 'host' if not already
    const dbUser = await User.findById(user.userId);
    if (dbUser && !dbUser.roles.includes("host")) {
      dbUser.roles.push("host");
      await dbUser.save();
    }

    // ✅ Respond with saved listing + updated user roles
    res.status(201).json({
      message: "Listing saved",
      listing: {
        ...newListing.toObject(),
        image: newListing.image
          ? `data:image/png;base64,${newListing.image.toString('base64')}`
          : undefined,
      },
      user: {
        name: dbUser?.name,
        email: dbUser?.email,
        roles: dbUser?.roles,
      },
    });

  } catch (err) {
    console.error("Error saving listing:", err);
    res.status(500).send({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// Get listings by pincode
router.get('/:pincode', async (req, res) => {
  try {
    const listings = await Listings.find({ pincode: req.params.pincode });

    const formatted = listings.map(listing => {
      const obj = listing.toObject();

      const base64Image = obj.image
        ? `data:image/png;base64,${obj.image.toString('base64')}`
        : undefined;

      return {
        ...obj,
        image: base64Image // now it's a base64 string
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    });
  }
});


export default router;
