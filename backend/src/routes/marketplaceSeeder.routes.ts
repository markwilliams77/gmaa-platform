import { Router } from "express";
import {
  seedMarketplace,
  clearMarketplace,
} from "../controllers/marketplaceSeeder.controller";

const router = Router();

router.post("/seed", seedMarketplace);
router.delete("/clear", clearMarketplace);

export default router;