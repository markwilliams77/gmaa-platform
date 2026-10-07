import crypto from "crypto";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "../configs/db";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import vendorLoginService from "../services/vendorLogin.service";
import { generateBusinessNumber } from "../utils/businessNumberGenerator";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const validOrgTypes = new Set([
  "Hospital",
  "Diagnostic Center",
  "Specialty Clinic",
]);
const validPlans = new Set(["Standard", "Pro", "Premium"]);
const validDocumentTypes = new Set([
  "business_license",
  "moh_accreditation",
  "tax_identification",
]);
const planAmountsInPaise: Record<string, number> = {
  Standard: 5000000,
  Pro: 15000000,
  Premium: 20000000,
};

const immutableOnboardingStatuses = new Set(["PAYMENT_SUCCESS", "CANCELLED"]);

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const s3Bucket = process.env.BUCKET_NAME;
const razorpayKeyId = process.env.RAZOR_PAY_KEY_ID;
const razorpayKeySecret = process.env.RAZOR_PAY_KEY_SECRET;

const isValidEmail = (value: unknown) =>
  typeof value === "string" && /^\S+@\S+\.\S+$/.test(value);

const isValidContactNumber = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const parsed = parsePhoneNumberFromString(value);

  return parsed?.isValid() ?? false;
};

const getVendorId = (params: Record<string, unknown>) => {
  const vendorId = params.vendorId;
  if (!vendorId) {
    return null;
  }
  return Array.isArray(vendorId) ? vendorId[0] : vendorId;
};

const ensureRazorpayClient = () => {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay keys are required in environment variables");
  }

  return new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
};

const hasAllRequiredDocuments = (documents: Record<string, any>) => {
  return [...validDocumentTypes].every((type) => Boolean(documents[type]));
};

export const createVendorOnboarding = async (req: Request, res: Response) => {
  try {
    const {
      orgName,
      address,

      country,
      state,
      city,

      email,
      contactPerson,
      contactNumber,

      mainCategory,
      subCategory,
      specialties,

      plan,
      consentAccepted,
    } = req.body;

    if (consentAccepted !== true) {
      return res.status(400).json({ message: "Consent is required" });
    }

    if (!orgName || typeof orgName !== "string") {
      return res.status(400).json({ message: "orgName is required" });
    }
    if (!address || typeof address !== "string") {
      return res.status(400).json({ message: "address is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!contactPerson || typeof contactPerson !== "string") {
      return res.status(400).json({ message: "contactPerson is required" });
    }
    if (!isValidContactNumber(contactNumber)) {
      return res.status(400).json({
        message: "Please enter a valid contact number.",
      });
    }
    if (!mainCategory || typeof mainCategory !== "string") {
      return res.status(400).json({ message: "mainCategory is required" });
    }
    if (!subCategory || typeof subCategory !== "string") {
      return res.status(400).json({ message: "subCategory is required" });
    }
    if (!Array.isArray(specialties) || specialties.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one specialty is recommended" });
    }
    if (!validPlans.has(plan)) {
      return res
        .status(400)
        .json({ message: "plan must be Standard, Pro or Premium" });
    }

    const existingOnboarding = await prisma.vendorOnboarding.findUnique({
      where: { email },
    });
    if (existingOnboarding) {
      return res.status(409).json({
        message: "Existing onboarding draft found for this email",
        vendorId: existingOnboarding.id,
        onboarding: existingOnboarding,
      });
    }

    const onboarding = await prisma.vendorOnboarding.create({
      data: {
        orgName,
        address,

        country,
        state,
        city,
        email,
        contactPerson,
        contactNumber,
        mainCategory,
        subCategory,
        specialties,
        plan,
        consentAcceptedAt: new Date(),
        consentPolicyVersion: "v1",
        status: "PAYMENT_PENDING",
      },
    });

    return res.status(201).json(onboarding);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "A vendor onboarding draft already exists for this email",
      });
    }
    console.error("createVendorOnboarding error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create onboarding draft" });
  }
};

export const getVendorOnboarding = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }

    return res.json(vendor);
  } catch (error) {
    console.error("getVendorOnboarding error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch onboarding draft" });
  }
};

export const findVendorOnboardingByEmail = async (
  req: Request,
  res: Response,
) => {
  try {
    const email = req.query.email;
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "A valid email query param is required" });
    }

    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { email },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "No onboarding draft found for this email" });
    }

    return res.json(vendor);
  } catch (error) {
    console.error("findVendorOnboardingByEmail error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch onboarding draft by email" });
  }
};

export const updateVendorOnboarding = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const updates: Record<string, any> = {};
    const allowedFields = [
      "orgName",
      "address",
      "country",
      "state",
      "city",
      "email",
      "contactPerson",
      "contactNumber",
      "mainCategory",
      "subCategory",
      "specialties",
      "plan",
    ];

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.email && !isValidEmail(updates.email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (updates.contactNumber && !isValidContactNumber(updates.contactNumber)) {
      return res
        .status(400)
        .json({ message: "Valid 10-digit contactNumber is required" });
    }
    if (
      updates.specialties &&
      (!Array.isArray(updates.specialties) || updates.specialties.length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "At least one specialty is recommended" });
    }
    if (updates.plan && !validPlans.has(updates.plan)) {
      return res
        .status(400)
        .json({ message: "plan must be Standard, Pro or Premium" });
    }

    if (updates.email) {
      const duplicateEmail = await prisma.vendorOnboarding.findUnique({
        where: { email: updates.email },
      });
      if (duplicateEmail && duplicateEmail.id !== vendorId) {
        return res.status(409).json({
          message: "This email is already linked to another onboarding draft",
        });
      }
    }

    const currentVendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!currentVendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }
    if (immutableOnboardingStatuses.has(currentVendor.status)) {
      return res.status(409).json({
        message:
          "Onboarding is already under review or completed and cannot be updated",
      });
    }

    const vendor = await prisma.vendorOnboarding.update({
      where: { id: vendorId },
      data: updates,
    });

    return res.json(vendor);
  } catch (error: any) {
    console.error("updateVendorOnboarding error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update onboarding details" });
  }
};

export const presignVendorDocument = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const { documentType, fileName, contentType, fileSize } = req.body;

    if (!validDocumentTypes.has(documentType)) {
      return res.status(400).json({ message: "Invalid documentType" });
    }
    if (!fileName || typeof fileName !== "string") {
      return res.status(400).json({ message: "fileName is required" });
    }
    if (!contentType || typeof contentType !== "string") {
      return res.status(400).json({ message: "contentType is required" });
    }
    if (typeof fileSize !== "number" || fileSize <= 0) {
      return res
        .status(400)
        .json({ message: "fileSize must be a positive number" });
    }
    if (!s3Bucket) {
      return res.status(500).json({ message: "S3 bucket is not configured" });
    }

    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileKey = `vendor-onboarding/${vendorId}/${documentType}/${Date.now()}_${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: fileKey,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    const publicUrl = `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return res.json({ uploadUrl, fileKey, publicUrl });
  } catch (error) {
    console.error("presignVendorDocument error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate presigned URL" });
  }
};

export const completeVendorDocument = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const { documentType, fileKey, fileName, contentType, fileSize } = req.body;

    if (!validDocumentTypes.has(documentType)) {
      return res.status(400).json({ message: "Invalid documentType" });
    }
    if (!fileKey || !fileName || !contentType || typeof fileSize !== "number") {
      return res.status(400).json({
        message:
          "documentType, fileKey, fileName, contentType and fileSize are required",
      });
    }

    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }

    const existingDocuments = (vendor.documents as Record<string, any>) ?? {};
    const updatedDocuments = {
      ...existingDocuments,
      [documentType]: {
        fileKey,
        fileName,
        contentType,
        fileSize,
        uploadedAt: new Date().toISOString(),
      },
    };

    const updatedVendor = await prisma.vendorOnboarding.update({
      where: { id: vendorId },
      data: {
        documents: updatedDocuments,
      },
    });

    return res.json(updatedVendor);
  } catch (error) {
    console.error("completeVendorDocument error:", error);
    return res
      .status(500)
      .json({ message: "Failed to complete document upload" });
  }
};

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }

    const plan = vendor.plan;
    const amount = planAmountsInPaise[plan];
    if (!amount) {
      return res
        .status(400)
        .json({ message: "Invalid onboarding plan for payment" });
    }

    if (vendor.paymentOrderId && vendor.paymentStatus === "PENDING") {
      return res.json({
        orderId: vendor.paymentOrderId,
        amount: planAmountsInPaise[vendor.plan] ?? amount,
        currency: "INR",
        razorpayKeyId,
        onboardingStatus: vendor.status,
      });
    }

    if (vendor.paymentStatus === "COMPLETED") {
      return res.status(409).json({
        message: "Payment is already completed for this onboarding",
        orderId: vendor.paymentOrderId,
        amount: planAmountsInPaise[vendor.plan] ?? amount,
        currency: "INR",
        razorpayKeyId,
        onboardingStatus: vendor.status,
      });
    }

    const razorpay = ensureRazorpayClient();
    const safeVendorId = vendorId.toString().slice(0, 20);
    const receipt = `vend-${safeVendorId}-${Date.now().toString().slice(-8)}`;
    const order = await new Promise<any>((resolve, reject) => {
      razorpay.orders.create(
        {
          amount,
          currency: "INR",
          receipt,
          payment_capture: true,
        },
        (error: any, result: any) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
    });

    const updatedVendor = await prisma.vendorOnboarding.update({
      where: { id: vendorId },
      data: {
        paymentOrderId: order.id,
        paymentStatus: "PENDING",
        razorpayOrderId: order.id,
        status: vendor.status === "DRAFT" ? "PAYMENT_PENDING" : vendor.status,
      },
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId,
      onboardingStatus: vendor.status,
    });
  } catch (error: any) {
    console.error("createRazorpayOrder error:", error);
    const razorpayMessage =
      error?.error?.description ||
      error?.message ||
      "Failed to create Razorpay order";
    return res.status(500).json({ message: razorpayMessage });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message:
          "razorpay_order_id, razorpay_payment_id and razorpay_signature are required",
      });
    }

    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }
    if (
      !vendor.razorpayOrderId ||
      vendor.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({ message: "Order ID mismatch" });
    }
    if (!razorpayKeySecret) {
      return res
        .status(500)
        .json({ message: "Razorpay secret is not configured" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature),
      )
    ) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    const nextStatus = "PAYMENT_SUCCESS";

    const updatedVendor = await prisma.vendorOnboarding.update({
      where: { id: vendorId },
      data: {
        paymentStatus: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: nextStatus,
      },
    });

    return res.json({
      verified: true,
      status: "PAYMENT_SUCCESS",
      paymentStatus: "COMPLETED",
      nextStep: "LOGIN_AND_UPLOAD_DOCUMENTS",
    });
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    return res
      .status(500)
      .json({ message: "Failed to verify Razorpay payment" });
  }
};

export const submitVendorOnboarding = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }

    const documents = (vendor.documents as Record<string, any>) ?? {};
    const hasAllDocs = [...validDocumentTypes].every((type) =>
      Boolean(documents[type]),
    );
    if (!hasAllDocs) {
    return res.status(400).json({ message: "All required documents must be uploaded before submission" });
    }
    //if (vendor.paymentStatus !== "COMPLETED") {
    //  return res.status(400).json({ message: "Payment must be completed before submission" });
    //}

    const user = await prisma.user.findUnique({
      where: {
        email: vendor.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Vendor user not found",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verificationStatus: "DRAFT",
      },
    });

    const updatedVendor = await prisma.vendorOnboarding.update({
      where: {
        id: vendorId,
      },
      data: {
        documents,
      },
    });

    return res.json(updatedVendor);
  } catch (error) {
    console.error("submitVendorOnboarding error:", error);
    return res
      .status(500)
      .json({ message: "Failed to submit vendor onboarding" });
  }
};

export const getVendorStatus = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }
    const vendor = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        plan: true,
        orgName: true,
      },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor onboarding draft not found" });
    }

    return res.json(vendor);
  } catch (error) {
    console.error("getVendorStatus error:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve vendor onboarding status" });
  }
};

export const approveVendor = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);

    if (!vendorId) {
      return res.status(400).json({
        message: "vendorId is required",
      });
    }

    const onboarding = await prisma.vendorOnboarding.findUnique({
      where: { id: vendorId },
      include: {
        vendorLoginInfo: true,
      },
    });

    if (!onboarding) {
      return res.status(404).json({
        message: "Vendor onboarding not found",
      });
    }

    if (!onboarding.vendorLoginInfo) {
      return res.status(400).json({
        message: "Vendor login information missing",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: onboarding.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Vendor user account not found",
      });
    }

    if (user.vendorStatus !== "UNDER_REVIEW") {
      return res.status(400).json({
        message: "Vendor must be UNDER_REVIEW",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        vendorStatus: "ACTIVE",
      },
    });

    const vendor = await prisma.vendor.update({
      where: {
        userId: user.id,
      },
      data: {
        verificationStatus: "APPROVED",
        verificationReviewedAt: new Date(),
        verificationReviewedBy: (req as any).user.id,
        verificationRemarks: null,
      },
    });

    return res.json({
      message: "Vendor approved successfully",
      vendor,
    });
  } catch (error) {
    console.error("approveVendor error:", error);

    return res.status(500).json({
      message: "Failed to approve vendor",
    });
  }
};

export const createVendorLogin = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);

    if (!vendorId) {
      return res.status(400).json({
        message: "vendorId is required",
      });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "password is required",
      });
    }

    const onboarding = await prisma.vendorOnboarding.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!onboarding) {
      return res.status(404).json({
        message: "Vendor onboarding not found",
      });
    }
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        onboarding: {
          id: vendorId,
        },
      },
    });

    if (existingVendor) {
      return res.status(400).json({
        message: "Vendor login has already been created for this onboarding.",
      });
    }
    const username = `GMAA-${vendorId.slice(0, 6).toUpperCase()}`;

    const passwordHash = await bcrypt.hash(password, 10);

    await vendorLoginService.insertVendorLogin({
      id: randomUUID(),
      vendorOnboardingId: vendorId,
      email: onboarding.email,
      username,
      passwordHash,
    });

    const existingUser = await prisma.user.findUnique({
      where: {
        email: onboarding.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user account already exists for this vendor.",
      });
    }

    const user = await prisma.user.create({
      data: {
        email: onboarding.email,
        password: passwordHash,
        role: "VENDOR",
      },
    });

    const vendorNumber = await generateBusinessNumber(
      "VND",
      prisma.vendor,
      "vendorNumber",
    );

    const vendor = await prisma.vendor.create({
      data: {
        vendorNumber,
        userId: user.id,
        companyName: onboarding.orgName,
        country: onboarding.country!,
        state: onboarding.state!,
        city: onboarding.city!,
        mainCategory: onboarding.mainCategory,
        subCategory: onboarding.subCategory,
        specialty: onboarding.specialties[0] || null,
        verificationStatus: "DRAFT",
      },
    });

    await prisma.vendorOnboarding.update({
      where: {
        id: vendorId,
      },
      data: {
        vendorId: vendor.id,
      },
    });

    return res.json({
      message: "Vendor login created",
      username,
      onboardingStatus: onboarding.status,
    });
  } catch (error) {
    console.error("createVendorLogin error:", error);

    return res.status(500).json({
      message: "Failed to create vendor login",
    });
  }
};

export const createVendorLoginPublic = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);

    if (!vendorId) {
      return res.status(400).json({
        message: "vendorId is required",
      });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "password is required",
      });
    }

    const onboarding = await prisma.vendorOnboarding.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!onboarding) {
      return res.status(404).json({
        message: "Vendor onboarding not found",
      });
    }
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        onboarding: {
          id: vendorId,
        },
      },
    });

    if (existingVendor) {
      return res.status(400).json({
        message: "Vendor login has already been created for this onboarding.",
      });
    }
    const username = `GMAA-${vendorId.slice(0, 6).toUpperCase()}`;

    const passwordHash = await bcrypt.hash(password, 10);

    await vendorLoginService.insertVendorLogin({
      id: randomUUID(),
      vendorOnboardingId: vendorId,
      email: onboarding.email,
      username,
      passwordHash,
    });

    const existingUser = await prisma.user.findUnique({
      where: {
        email: onboarding.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user account already exists for this vendor.",
      });
    }

    const user = await prisma.user.create({
      data: {
        email: onboarding.email,
        password: passwordHash,
        role: "VENDOR",
      },
    });

    const vendorNumber = await generateBusinessNumber(
      "VND",
      prisma.vendor,
      "vendorNumber",
    );

    const vendor = await prisma.vendor.create({
      data: {
        vendorNumber,
        userId: user.id,
        companyName: onboarding.orgName,
        country: onboarding.country!,
        state: onboarding.state!,
        city: onboarding.city!,
        mainCategory: onboarding.mainCategory,
        subCategory: onboarding.subCategory,
        specialty: onboarding.specialties[0] || null,
        verificationStatus: "DRAFT",
      },
    });

    await prisma.vendorOnboarding.update({
      where: {
        id: vendorId,
      },
      data: {
        vendorId: vendor.id,
      },
    });

    return res.json({
      message: "Vendor login created",
      username,
      onboardingStatus: onboarding.status,
    });
  } catch (error) {
    console.error("createVendorLogin error:", error);

    return res.status(500).json({
      message: "Failed to create vendor login",
    });
  }
};

export const listVendorOnboardings = async (req: Request, res: Response) => {
  try {
    const vendorOnboardings = await prisma.vendorOnboarding.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      vendorOnboardings,
    });
  } catch (error) {
    console.error("listVendorOnboardings error:", error);

    return res.status(500).json({
      message: "Failed to fetch vendor onboardings",
    });
  }
};

export const getAdminVendorOnboarding = async (req: Request, res: Response) => {
  try {
    const vendorId = String(req.params.id);

    if (!vendorId) {
      return res.status(400).json({
        message: "vendorId is required",
      });
    }

    const onboarding = await prisma.vendorOnboarding.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        vendorLoginInfo: true,
        vendor: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (!onboarding) {
      return res.status(404).json({
        message: "Vendor onboarding not found",
      });
    }

    return res.json({
      vendorOnboarding: onboarding,
    });
  } catch (error) {
    console.error("getAdminVendorOnboarding error:", error);

    return res.status(500).json({
      message: "Failed to fetch onboarding",
    });
  }
};

export const updateVendorStatus = async (req: Request, res: Response) => {
  try {
    const vendorId = getVendorId(req.params);

    if (!vendorId) {
      return res.status(400).json({
        message: "vendorId is required",
      });
    }
    const { vendorStatus } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        user: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    await prisma.user.update({
      where: {
        id: vendor.userId,
      },
      data: {
        vendorStatus,
      },
    });

    return res.json({
      message: "Vendor status updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update vendor status.",
    });
  }
};

export const getAdminVendors = async (req: Request, res: Response) => {
  const vendors = await prisma.vendor.findMany({
    include: {
      user: {
        select: {
          email: true,
          vendorStatus: true,
        },
      },
    },
    orderBy: {
      companyName: "asc",
    },
  });

  return res.json({
    data: vendors.map((vendor) => ({
      id: vendor.id,
      vendorNumber: vendor.vendorNumber,
      name: vendor.companyName,
      email: vendor.user.email,
      specialty: vendor.specialty,
      location: `${vendor.city}, ${vendor.country}`,
      country: vendor.country,
      state: vendor.state,
      city: vendor.city,
      category: vendor.mainCategory,
      status: vendor.user.vendorStatus,
    })),
  });
};
