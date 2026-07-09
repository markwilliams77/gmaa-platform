import { Request, Response } from "express";
import { VENDOR_CATEGORIES } from "../constants/vendorCategories";

export const getVendorCategories = (
  req: Request,
  res: Response,
) => {
  return res.json({
    version: 1,
    lastUpdated: "2026-07-08",
    categories: VENDOR_CATEGORIES,
  });
};