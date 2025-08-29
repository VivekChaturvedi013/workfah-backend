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
    const newListing = new Listings({
      host: (req as any).user.userId, // ✅ userId comes from token
      hostEmail: user.email,   // 🔥 storing host email
      pincode,
      address,
      description,
      availableHours,
      image: req.file?.buffer
    });

    console.log('New Listing:', newListing); // 🔥 log the new listing object
    
    const dbUser = await User.findById(user.userId);
    if (dbUser && !dbUser.roles.includes("host")) {
      dbUser.roles.push("host");
      await dbUser.save();
    }

    // Return the updated user object (or just roles)
    res.status(201).json({
      message: "Listing saved",
      listing: newListing,
      user: {
        name: user.name,
        email: user.email,
        roles: dbUser?.roles,
      },
    });
  } catch (err) {
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
