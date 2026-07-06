import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import { 
    getWebsitePublishingVendors,
    getWebsiteProfile,updateWebsiteProfile,
    getWebsiteServices,createWebsiteService,
    updateWebsiteService,
    deleteWebsiteService,
    getWebsiteGallery,
    createWebsiteGalleryImage,
    updateWebsiteGalleryImage,
    deleteWebsiteGalleryImage,
    getWebsiteAccreditations,
    createWebsiteAccreditation,
    updateWebsiteAccreditation,
    deleteWebsiteAccreditation,
    getWebsiteTestimonials,
    createWebsiteTestimonial,
    updateWebsiteTestimonial,
    deleteWebsiteTestimonial,
 } from "../controllers/websitePublishing.controller";

const router = Router();

router.get("/vendors",authMiddleware,allowRoles(Role.ADMIN),getWebsitePublishingVendors);
router.get("/vendors/:vendorId",authMiddleware,allowRoles(Role.ADMIN),getWebsiteProfile);
router.patch("/vendors/:vendorId",authMiddleware,allowRoles(Role.ADMIN),updateWebsiteProfile);
router.get("/vendors/:vendorId/services",authMiddleware,allowRoles(Role.ADMIN),getWebsiteServices);
router.post("/vendors/:vendorId/services",authMiddleware,allowRoles(Role.ADMIN),createWebsiteService);
router.patch("/services/:serviceId",authMiddleware,allowRoles(Role.ADMIN),updateWebsiteService);
router.delete("/services/:serviceId",authMiddleware,allowRoles(Role.ADMIN),deleteWebsiteService);
router.get("/vendors/:vendorId/gallery",authMiddleware,allowRoles(Role.ADMIN),getWebsiteGallery);
router.post("/vendors/:vendorId/gallery",authMiddleware,allowRoles(Role.ADMIN),createWebsiteGalleryImage);
router.patch("/gallery/:galleryId",authMiddleware,allowRoles(Role.ADMIN),updateWebsiteGalleryImage);
router.delete("/gallery/:galleryId",authMiddleware,allowRoles(Role.ADMIN),deleteWebsiteGalleryImage);
router.get("/vendors/:vendorId/accreditations",authMiddleware,allowRoles(Role.ADMIN),getWebsiteAccreditations);
router.post("/vendors/:vendorId/accreditations",authMiddleware,allowRoles(Role.ADMIN),createWebsiteAccreditation);
router.patch("/accreditations/:accreditationId",authMiddleware,allowRoles(Role.ADMIN),updateWebsiteAccreditation);
router.delete("/accreditations/:accreditationId",authMiddleware,allowRoles(Role.ADMIN),deleteWebsiteAccreditation);
router.get("/vendors/:vendorId/testimonials",authMiddleware,allowRoles(Role.ADMIN),getWebsiteTestimonials);
router.post("/vendors/:vendorId/testimonials",authMiddleware,allowRoles(Role.ADMIN),createWebsiteTestimonial);
router.patch("/testimonials/:testimonialId",authMiddleware,allowRoles(Role.ADMIN),updateWebsiteTestimonial);
router.delete("/testimonials/:testimonialId",authMiddleware,allowRoles(Role.ADMIN),deleteWebsiteTestimonial);

export default router;