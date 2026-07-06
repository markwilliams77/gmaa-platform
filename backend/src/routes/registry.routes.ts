import express from "express";
import { getVendorDetails } from "../controllers/registry/productDetailsPage.controllers";
import { getDirectoryVendors } from "../controllers/registry/productListing.controllers";

const router = express.Router();

router.get("/vendors", getDirectoryVendors);
router.get("/vendors/:id", getVendorDetails);

export default router;
