import { Router } from "express";
import { getVendorCategories } from "../controllers/vendorCategories.controller";

const router = Router();

router.get("/", getVendorCategories);

export default router;