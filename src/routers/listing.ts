import express from 'express';
import Listings from '../models/Listings';
import multer from 'multer';

const router = express.Router();

// Create a new listing
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { pincode, address, description, availableHours } = req.body;

    const newListing = new Listings({
      pincode,
      address,
      description,
      availableHours,
      image: req.file?.buffer // Store as binary
    });
    console.log(req.body, 'req.body');
    await newListing.save();
    res.status(201).send({ message: "Listing saved" });
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
