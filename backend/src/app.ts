import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./configs/db";
import authRoutes from "./routes/auth.routes";
import registryRoutes from "./routes/registry.routes";
import vendorRoutes from "./routes/vendors.routes";
import leadRoutes from "./routes/leads.routes";
import leadNotesRoutes from "./routes/leadNotes.routes";
import vendorDashboardRoutes from "./routes/vendorDashboard.routes";
import tenderRoutes from "./routes/tenders.routes";
import adminRoutes from "./routes/admin.routes";
import documentRoutes from "./routes/documents.routes";
import supportRoutes from "./routes/support.routes";
import consultationRoutes from "./routes/consultation.routes";
import vendorDocumentsRoutes from "./routes/vendorDocuments.routes";
import adminVerificationRoutes from "./routes/adminVerification.routes";
import websitePublishingRoutes from "./routes/websitePublishing.routes";
import uploadsRoutes from "./routes/uploads.routes";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import marketplaceSeederRoutes from "./routes/marketplaceSeeder.routes";
import vendorCategoriesRoutes from "./routes/vendorCategories.routes";


const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(compression());

const allowedOrigins = [
  "https://medalliance-frontend.vercel.app",
  "https://global-maa-backend-app-vwh5.vercel.app",
  "https://gmaa-platform-ews5.vercel.app",
  "https://gmaa-platform-12sm.vercel.app",
  "https://globalmaa.com",
  "https://www.globalmaa.com",
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3001",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

// 🔥 must-have
app.options("/{*splat}", cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/registry", registryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/leads", leadNotesRoutes);
app.use("/api/vendor", vendorDashboardRoutes);
app.use("/api/tenders", tenderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/vendor-documents", vendorDocumentsRoutes);
app.use("/api/admin/verifications", adminVerificationRoutes);
app.use("/api/admin/website-publishing", websitePublishingRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/marketplace", marketplaceSeederRoutes);
app.use("/api/vendor-categories", vendorCategoriesRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
app.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      message: "Server is running & DB connected",
    });
  } catch (error) {
    res.status(500).json({
      message: "DB connection failed",
      error,
    });
  }
});

app.get("/check", (req, res) => {
  res.json({ route: "working" });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
);
export default app;
