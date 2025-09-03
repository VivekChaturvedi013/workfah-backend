import express, { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { authMiddleware } from "../authmidddleware";
import Listings from "../models/Listings";
import { Buffer } from "buffer";  // make sure this is imported at top



const router = express.Router();

// // 📌 Guest creates booking request
// router.post("/request", authMiddleware, async (req: Request, res: Response) => {
//   try {
//     const { listingId, date, from, to } = req.body;
//     const guestId = (req as any).user.userId;

//     const booking = new Booking({ listingId, guestId, date, from, to });
//     await booking.save();

//     res.status(201).send({ message: "Booking request created", booking });
//   } catch (err) {
//     res.status(500).send({ message: "Error creating booking", error: err });
//   }
// });

// 📌 Guest: My bookings
router.get("/my-bookings", authMiddleware, async (req: Request, res: Response) => {
  try {
    const guestId = (req as any).user.userId;
    const bookings = await Booking.find({ guestId }).populate("listingId");
    res.send(bookings);
  } catch (err) {
    res.status(500).send({ message: "Error fetching bookings", error: err });
  }
});

router.get("/requests", authMiddleware, async (req: Request, res: Response) => {
  try {
    const hostId = (req as any).user.userId;

    const bookings = await Booking.find()
      .populate({
        path: "listingId",
        match: { host: hostId }, // ✅ correct field
      })
      .populate("guestId");

    // filter out null listings (not owned by this host)
    const filtered = bookings.filter((b) => b.listingId);
    const response = filtered.map((b) => {
      const listingDoc = (b.listingId as any).toObject();
      console.log("Original listing image line 57:", listingDoc.image);
      if (listingDoc?.image && listingDoc.image.buffer) {
        // MongoDB Binary case
        const base64 = listingDoc.image.toString("base64");
        listingDoc.image = `data:image/png;base64,${base64}`;
      } else if (listingDoc?.image?.data) {
        // Mongoose { data, contentType } case
        const base64 = Buffer.from(listingDoc.image.data).toString("base64");
        listingDoc.image = `data:${listingDoc.image.contentType};base64,${base64}`;
      } else if (typeof listingDoc.image === "string") {
        // Already base64 string
        listingDoc.image = `data:image/png;base64,${listingDoc.image}`;
      }

      console.log(
        "Transformed listing image line 58:",
        typeof listingDoc.image === "string"
          ? listingDoc.image.substring(0, 100)
          : listingDoc.image
      );
      return {
        _id: b._id,
        date: b.date,
        listingId: listingDoc,
        guestId: b.guestId,
        status: b.status,
      };
    });

    res.send(response);
  } catch (err) {
    console.error("Error in /requests:", err); // ✅ will log actual error now
    res.status(500).send({ message: "Error fetching requests", error: err });
  }
});


// 📌 Host approves booking
router.put("/:id/approve", authMiddleware, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.send({ message: "Booking approved", booking });
  } catch (err) {
    res.status(500).send({ message: "Error approving booking", error: err });
  }
});

// 📌 Host rejects booking
router.put("/:id/reject", authMiddleware, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.send({ message: "Booking rejected", booking });
  } catch (err) {
    res.status(500).send({ message: "Error rejecting booking", error: err });
  }
});

router.post("/request", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { listingId, date, from, to } = req.body;
    const guestId = (req as any).user.userId;
    const guestEmail = (req as any).user.email;

    const booking = new Booking({
      listingId,
      guestId,
      guestEmail,
      date,
      from,
      to,
      status: "pending"
    });
    await booking.save();

    console.log("New booking request:", booking);

    res.status(201).send({ message: "Booking request created", booking });
  } catch (err) {
    res.status(500).send({ message: "Error creating booking", error: err });
  }
});

// 📌 Get all listings created by the logged-in host
router.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    const hostId = (req as any).user.userId;

    const listings = await Listings.find({ host: hostId });

    const formatted = listings.map(listing => {
      const obj = listing.toObject();
      console.log("hostid, listings", hostId, listings);
      const base64Image = obj.image
        ? `data:image/png;base64,${obj.image.toString('base64')}`
        : undefined;

      return {
        ...obj,
        image: base64Image
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
