import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import crypto from 'crypto';
import axios from "axios";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// ==================== Utility Functions ====================

// Simple JWT creation (without external library for now)
function generateJWT(payload: any, secret: string = process.env.JWT_SECRET || 'gmaa-secret-key'): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

// Verify JWT
function verifyJWT(token: string, secret: string = process.env.JWT_SECRET || 'gmaa-secret-key'): any {
  const [headerB64, bodyB64, signatureB64] = token.split('.');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${bodyB64}`)
    .digest('base64url');
  
  if (signature !== signatureB64) {
    throw new Error('Invalid token signature');
  }
  
  return JSON.parse(Buffer.from(bodyB64, 'base64url').toString());
}

// Generate random credentials
function generateCredentials() {
  const username = `${['sleepy', 'happy', 'toothless', 'zealous', 'bold', 'swift', 'keen', 'quiet'][Math.floor(Math.random() * 8)]}-${['night', 'shadow', 'flame', 'stone', 'wind', 'star'][Math.floor(Math.random() * 6)]}-${Math.floor(Math.random() * 1000)}`;
  const password = crypto.randomBytes(16).toString('hex').toUpperCase().substring(0, 16) + crypto.randomBytes(4).toString('hex').substring(0, 2).toUpperCase() + '^' + crypto.randomBytes(1).toString('hex').toUpperCase() + 'bx';
  const email = `admin-${Date.now()}@gmaa.local`;
  
  return { username, password, email };
}

// Middleware: Check auth token
function authMiddleware(req: Request, res: Response, next: Function) 

{
  next();
}

// ==================== Mock Data Storage ====================
let admins: { [key: string]: { email: string; password: string; username: string } } = {};
let tenders: any[] = [];
let bids: any[] = [];
let vendors: any[] = [
  {
    id: 'V-001',
    name: 'Apollo Integrated',
    email: 'vendor-relations@med-global.com',
    location: 'India',
    specialty: 'Cardiology',
    status: 'active',
  },
  {
    id: 'V-002',
    name: 'Bumrungrad Global',
    email: 'clinical-operations@health-net.int',
    location: 'Thailand',
    specialty: 'Orthopaedics',
    status: 'active',
  },
];
let supportTickets: any[] = [];
let consultations: any[] = [];
let leads: any[] = [];
let vendorOnboardings: any[] = [
  {
    id: 'VO-001',
    orgName: 'MediCare Solutions Inc.',
    email: 'admin@medicaresol.com',
    contactPerson: 'Dr. Rajesh Kumar',
    contactNumber: '+91-9876543210',
    orgType: 'Hospital Chain',
    plan: 'Enterprise',
    specialties: ['Cardiology', 'Orthopedics', 'Neurology'],
    createdAt: '2026-05-20T10:30:00.000Z',
    status: 'UNDER_REVIEW',
    paymentStatus: 'COMPLETED',
    documents: {
      business_license: {
        fileKey: 'vendor-onboarding/VO-001/business_license/license.pdf',
        fileName: 'MediCare_Business_License.pdf',
        contentType: 'application/pdf',
        fileSize: 245678,
        uploadedAt: '2026-05-20T10:30:00.000Z',
      },
      moh_accreditation: {
        fileKey: 'vendor-onboarding/VO-001/moh_accreditation/moh_cert.pdf',
        fileName: 'MOH_Accreditation_Certificate.pdf',
        contentType: 'application/pdf',
        fileSize: 523456,
        uploadedAt: '2026-05-20T10:31:00.000Z',
      },
      tax_identification: {
        fileKey: 'vendor-onboarding/VO-001/tax_identification/tax_id.pdf',
        fileName: 'Tax_ID_Proof.pdf',
        contentType: 'application/pdf',
        fileSize: 189234,
        uploadedAt: '2026-05-20T10:32:00.000Z',
      },
    },
  },
  {
    id: 'VO-002',
    orgName: 'Asia Pacific Medical Devices',
    email: 'registration@apmd.co.th',
    contactPerson: 'Somchai Prasad',
    contactNumber: '+66-8-9876-5432',
    orgType: 'Medical Device Supplier',
    plan: 'Professional',
    specialties: ['Surgical Equipment', 'Diagnostic Tools'],
    createdAt: '2026-05-25T14:15:00.000Z',
    status: 'UNDER_REVIEW',
    paymentStatus: 'COMPLETED',
    documents: {
      business_license: {
        fileKey: 'vendor-onboarding/VO-002/business_license/apmd_license.pdf',
        fileName: 'APMD_Business_License_2026.pdf',
        contentType: 'application/pdf',
        fileSize: 312567,
        uploadedAt: '2026-05-25T14:15:00.000Z',
      },
      tax_identification: {
        fileKey: 'vendor-onboarding/VO-002/tax_identification/thai_tax.pdf',
        fileName: 'Thailand_Tax_ID.pdf',
        contentType: 'application/pdf',
        fileSize: 156789,
        uploadedAt: '2026-05-25T14:16:00.000Z',
      },
    },
  },
  {
    id: 'VO-003',
    orgName: 'Global Health Partners Ltd.',
    email: 'compliance@globalhealthpartners.sg',
    contactPerson: 'Michelle Wong',
    contactNumber: '+65-6789-0123',
    orgType: 'Healthcare Consulting',
    plan: 'Standard',
    specialties: ['Medical Training', 'Staff Augmentation'],
    createdAt: '2026-06-01T09:45:00.000Z',
    status: 'UNDER_REVIEW',
    paymentStatus: 'COMPLETED',
    documents: {
      business_license: {
        fileKey: 'vendor-onboarding/VO-003/business_license/ghp_license.pdf',
        fileName: 'GHP_Singapore_License.pdf',
        contentType: 'application/pdf',
        fileSize: 267890,
        uploadedAt: '2026-06-01T09:45:00.000Z',
      },
      moh_accreditation: {
        fileKey: 'vendor-onboarding/VO-003/moh_accreditation/moh_sg.pdf',
        fileName: 'Singapore_MOH_Approval.pdf',
        contentType: 'application/pdf',
        fileSize: 445123,
        uploadedAt: '2026-06-01T09:46:00.000Z',
      },
      tax_identification: {
        fileKey: 'vendor-onboarding/VO-003/tax_identification/sgp_tax.pdf',
        fileName: 'Singapore_UEN.pdf',
        contentType: 'application/pdf',
        fileSize: 123456,
        uploadedAt: '2026-06-01T09:47:00.000Z',
      },
    },
  },
];

function seedDefaultAdmin() {
  const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL;
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  const defaultUsername = process.env.ADMIN_DEFAULT_USERNAME || defaultEmail?.split('@')[0] || 'admin';

  if (defaultEmail && defaultPassword) {
    admins[defaultEmail] = {
      email: defaultEmail,
      password: defaultPassword,
      username: defaultUsername,
    };
    console.log(`[Auth] Default admin seeded: ${defaultEmail}`);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  seedDefaultAdmin();

  app.use(express.json());

  // ==================== AUTH ENDPOINTS ====================

  // Generate admin credentials
  app.post('/auth/admin/generate', (req: Request, res: Response) => {
    const { secret } = req.body;
    
    if (secret !== process.env.ADMIN_GENERATION_SECRET) {
      return res.status(403).json({ success: false, error: 'Invalid generation secret' });
    }
    
    const credentials = generateCredentials();
    admins[credentials.email] = credentials;
    
    console.log(`[Auth] New admin credentials generated: ${credentials.email}`);
    
    res.status(200).json({
      success: true,
      credentials,
    });
  });

  // Login
  app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      '${import.meta.env.VITE_API_BASE_URL}/auth/login',
      req.body
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Backend login error:', error.response?.data);

    return res.status(error.response?.status || 500).json(
      error.response?.data || {
        success: false,
        error: 'Backend unavailable',
      }
    );
  }
});
  // ==================== TENDERS ENDPOINTS ====================

  app.get('/tenders', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      '`${import.meta.env.VITE_API_BASE_URL}/tenders',
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Tenders error:', error.response?.data);

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: 'Backend unavailable',
      }
    );
  }
});

  app.post('/tenders', authMiddleware, async (req: Request, res: Response) => {
    const { tenderData, vendorEmails, broadcast } = req.body;
    
    const tenderId = `T-${String(tenders.length + 1).padStart(3, '0')}`;
    const tender = {
      id: tenderId,
      ...tenderData,
      bids: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
      awardedBidId: null,
      awardedVendorId: null,
    };
    
    tenders.push(tender);
    
    if (broadcast && vendorEmails && vendorEmails.length > 0) {
      const isSimulation = !process.env.RESEND_API_KEY || process.env.ENABLE_MAIL_LIVE !== 'true';
      
      if (!isSimulation) {
        await resend.emails.send({
          from: 'GMAA Alliance <notifications@gmaa.alliance>',
          to: vendorEmails,
          subject: `New Opportunity: ${tenderData.service} Tender`,
          html: `
            <div style="font-family: sans-serif; color: #0A111F;">
              <h2 style="color: #FF3B30;">New Medical Tender Opportunity</h2>
              <p>A new tender has been posted for <strong>${tenderData.service}</strong>.</p>
              <div style="padding: 20px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                <p><strong>Service:</strong> ${tenderData.service}</p>
                <p><strong>Region:</strong> ${tenderData.region}</p>
                <p><strong>Budget:</strong> ${tenderData.budget}</p>
                <p><strong>Deadline:</strong> ${tenderData.deadline}</p>
              </div>
            </div>
          `,
        });
      } else {
        vendorEmails.forEach((email: string) => {
          console.log(`[SIMULATED] Email sent to ${email}`);
        });
      }
    }
    
    res.status(201).json({ success: true, tenderId, broadcast: !!broadcast, message: 'Tender created' });
  });

  app.put('/tenders/:tenderId', authMiddleware, (req: Request, res: Response) => {
    const { tenderId } = req.params;
    const updates = req.body;
    
    const tender = tenders.find(t => t.id === tenderId);
    if (!tender) {
      return res.status(404).json({ success: false, error: 'Tender not found' });
    }
    
    Object.assign(tender, updates);
    
    res.status(200).json({ success: true, tenderId });
  });

  // ==================== BIDS ENDPOINTS ====================

  app.get('/bids', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      '`${import.meta.env.VITE_API_BASE_URL}/bids',
      {
        headers: {
          Authorization: req.headers.authorization,
        },
        params: req.query,
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Bids error:', error.response?.data);

    return res.status(
      error.response?.status || 500
    ).json(
      error.response?.data || {
        error: 'Backend unavailable',
      }
    );
  }
});

  app.put('/bids/:bidId', authMiddleware, (req: Request, res: Response) => {
    const { bidId } = req.params;
    const updates = req.body;
    
    const bid = bids.find(b => b.id === bidId);
    if (!bid) {
      return res.status(404).json({ success: false, error: 'Bid not found' });
    }
    
    Object.assign(bid, updates);
    
    res.status(200).json({ success: true, bidId });
  });

  // ==================== VENDORS ENDPOINTS ====================

  app.get('/vendors', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ success: true, vendors });
  });

  // ==================== VENDOR ONBOARDING ENDPOINTS ====================

  app.get('/admin/vendor-onboardings', authMiddleware, (req: Request, res: Response) => {
    const { status, paymentStatus, completedOnly } = req.query;
    
    let filtered = vendorOnboardings;
    
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    
    if (paymentStatus) {
      filtered = filtered.filter(o => o.paymentStatus === paymentStatus);
    }
    
    if (completedOnly === 'true') {
      filtered = filtered.filter(o => o.paymentStatus === 'COMPLETED');
    }
    
    res.status(200).json({ 
      success: true, 
      vendorOnboardings: filtered 
    });
  });

  app.get('/admin/vendor-onboardings/:vendorId', authMiddleware, (req: Request, res: Response) => {
    const { vendorId } = req.params;
    
    const onboarding = vendorOnboardings.find(o => o.id === vendorId);
    if (!onboarding) {
      return res.status(404).json({ success: false, error: 'Vendor onboarding not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      vendorOnboarding: onboarding 
    });
  });

  app.get('/admin/vendor-onboardings/:vendorId/documents/:documentType', authMiddleware, (req: Request, res: Response) => {
    const { vendorId, documentType } = req.params;
    
    const onboarding = vendorOnboardings.find(o => o.id === vendorId);
    if (!onboarding) {
      return res.status(404).json({ success: false, error: 'Vendor onboarding not found' });
    }
    
    const doc = onboarding.documents?.[documentType as keyof typeof onboarding.documents];
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    
    // Generate a mock signed S3 URL
    const mockSignedUrl = `https://gmaa-bucket.s3.amazonaws.com/${doc.fileKey}?X-Amz-Signature=mock-sig-${Date.now()}`;
    
    res.status(200).json({
      success: true,
      document: {
        documentType,
        fileName: doc.fileName,
        contentType: doc.contentType,
        fileSize: doc.fileSize,
        uploadedAt: doc.uploadedAt,
        fileKey: doc.fileKey,
        downloadUrl: mockSignedUrl,
        expiresIn: 300,
      },
    });
  });

  app.post('/admin/vendor-onboardings/:vendorId/approve', authMiddleware, (req: Request, res: Response) => {
    const { vendorId } = req.params;
    const { status = 'ACTIVE' } = req.body;
    
    const onboarding = vendorOnboardings.find(o => o.id === vendorId);
    if (!onboarding) {
      return res.status(404).json({ success: false, error: 'Vendor onboarding not found' });
    }
    
    onboarding.status = status;
    
    const credentials = {
      username: `vendor-${vendorId}-${Date.now()}`,
      password: `Pass${Math.random().toString(36).substring(2, 15).toUpperCase()}123!`,
    };
    
    res.status(200).json({
      success: true,
      vendorOnboarding: onboarding,
      vendor: {
        id: vendorId,
        name: onboarding.orgName,
        email: onboarding.email,
        location: 'Global',
        specialty: onboarding.specialties?.join(', ') || 'General',
        status: 'active',
      },
      credentials,
      message: `Vendor ${status === 'ACTIVE' ? 'approved and activated' : 'approval pending activation'}`,
    });
  });

  app.post('/admin/vendor-onboardings/:vendorId/reject', authMiddleware, (req: Request, res: Response) => {
    const { vendorId } = req.params;
    
    const onboarding = vendorOnboardings.find(o => o.id === vendorId);
    if (!onboarding) {
      return res.status(404).json({ success: false, error: 'Vendor onboarding not found' });
    }
    
    onboarding.status = 'REJECTED';
    
    res.status(200).json({
      success: true,
      vendorOnboarding: onboarding,
      message: 'Vendor onboarding rejected',
    });
  });

  // ==================== SUPPORT TICKETS ENDPOINTS ====================

  app.get('/support-tickets', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ success: true, tickets: supportTickets });
  });

  app.post('/support-tickets/:ticketId/messages', authMiddleware, (req: Request, res: Response) => {
    const { ticketId } = req.params;
    const { text, sender, senderName } = req.body;
    
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    
    const messageId = `M-${Date.now()}`;
    ticket.lastMessage = text;
    ticket.lastUpdated = new Date().toISOString();
    
    res.status(201).json({ success: true, messageId });
  });

  // ==================== CONSULTATIONS ENDPOINTS ====================

  app.get('/consultations', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ success: true, consultations });
  });

  app.put('/consultations/:consultationId', authMiddleware, (req: Request, res: Response) => {
    const { consultationId } = req.params;
    const updates = req.body;
    
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) {
      return res.status(404).json({ success: false, error: 'Consultation not found' });
    }
    
    Object.assign(consultation, updates);
    
    res.status(200).json({ success: true, consultationId });
  });

  // ==================== LEADS ENDPOINTS ====================

  app.post('/leads/:leadId/messages', authMiddleware, (req: Request, res: Response) => {
    const { leadId } = req.params;
    const { text, sender, senderName } = req.body;
    
    const messageId = `M-${Date.now()}`;
    
    res.status(201).json({ success: true, messageId });
  });

  // ==================== SYSTEM ENDPOINTS ====================

  app.post('/system/seed', authMiddleware, (req: Request, res: Response) => {
    // Seed demo data
    tenders = [
      {
        id: 'T-001',
        service: 'Robotic Knee Replacement',
        category: 'Orthopaedics',
        region: 'Southeast Asia',
        budget: 'USD 360,000',
        description: 'Advanced robotic knee replacement system',
        requirements: [],
        bids: 2,
        status: 'open',
        createdAt: new Date().toISOString(),
        awardedBidId: null,
        awardedVendorId: null,
      },
      {
        id: 'T-002',
        service: 'Cardiology Equipment',
        category: 'Cardiology',
        region: 'South Asia',
        budget: 'USD 500,000',
        description: 'Advanced cardiology diagnostic equipment',
        requirements: [],
        bids: 1,
        status: 'open',
        createdAt: new Date().toISOString(),
        awardedBidId: null,
        awardedVendorId: null,
      },
    ];
    
    bids = [
      {
        id: 'B-001',
        tenderId: 'T-001',
        vendorId: 'V-001',
        vendorName: 'Apollo Integrated',
        amount: 'USD 320,000',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'B-002',
        tenderId: 'T-001',
        vendorId: 'V-002',
        vendorName: 'Bumrungrad Global',
        amount: 'USD 340,000',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];

    supportTickets = [
      {
        id: 'ST-1001',
        subject: 'Vendor enrollment issue',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        lastMessage: 'Please provide required documents.',
      },
    ];

    consultations = [
      {
        id: 'C-2345',
        name: 'Dr. Jane Doe',
        email: 'jane.doe@hospital.org',
        phone: '+1-555-0100',
        request: 'Need supplier for cardiology equipment',
        status: 'processing',
        remarks: 'Escalated to procurement team',
        createdAt: new Date().toISOString(),
      },
    ];
    
    res.status(200).json({ success: true, message: 'Demo data seeded' });
  });

  app.post('/system/purge', authMiddleware, (req: Request, res: Response) => {
    tenders = [];
    bids = [];
    supportTickets = [];
    consultations = [];
    leads = [];
    // Reset vendor onboardings to initial seed data
    vendorOnboardings = [
      {
        id: 'VO-001',
        orgName: 'MediCare Solutions Inc.',
        email: 'admin@medicaresol.com',
        contactPerson: 'Dr. Rajesh Kumar',
        contactNumber: '+91-9876543210',
        orgType: 'Hospital Chain',
        plan: 'Enterprise',
        specialties: ['Cardiology', 'Orthopedics', 'Neurology'],
        createdAt: '2026-05-20T10:30:00.000Z',
        status: 'UNDER_REVIEW',
        paymentStatus: 'COMPLETED',
        documents: {
          business_license: {
            fileKey: 'vendor-onboarding/VO-001/business_license/license.pdf',
            fileName: 'MediCare_Business_License.pdf',
            contentType: 'application/pdf',
            fileSize: 245678,
            uploadedAt: '2026-05-20T10:30:00.000Z',
          },
          moh_accreditation: {
            fileKey: 'vendor-onboarding/VO-001/moh_accreditation/moh_cert.pdf',
            fileName: 'MOH_Accreditation_Certificate.pdf',
            contentType: 'application/pdf',
            fileSize: 523456,
            uploadedAt: '2026-05-20T10:31:00.000Z',
          },
          tax_identification: {
            fileKey: 'vendor-onboarding/VO-001/tax_identification/tax_id.pdf',
            fileName: 'Tax_ID_Proof.pdf',
            contentType: 'application/pdf',
            fileSize: 189234,
            uploadedAt: '2026-05-20T10:32:00.000Z',
          },
        },
      },
      {
        id: 'VO-002',
        orgName: 'Asia Pacific Medical Devices',
        email: 'registration@apmd.co.th',
        contactPerson: 'Somchai Prasad',
        contactNumber: '+66-8-9876-5432',
        orgType: 'Medical Device Supplier',
        plan: 'Professional',
        specialties: ['Surgical Equipment', 'Diagnostic Tools'],
        createdAt: '2026-05-25T14:15:00.000Z',
        status: 'UNDER_REVIEW',
        paymentStatus: 'COMPLETED',
        documents: {
          business_license: {
            fileKey: 'vendor-onboarding/VO-002/business_license/apmd_license.pdf',
            fileName: 'APMD_Business_License_2026.pdf',
            contentType: 'application/pdf',
            fileSize: 312567,
            uploadedAt: '2026-05-25T14:15:00.000Z',
          },
          tax_identification: {
            fileKey: 'vendor-onboarding/VO-002/tax_identification/thai_tax.pdf',
            fileName: 'Thailand_Tax_ID.pdf',
            contentType: 'application/pdf',
            fileSize: 156789,
            uploadedAt: '2026-05-25T14:16:00.000Z',
          },
        },
      },
      {
        id: 'VO-003',
        orgName: 'Global Health Partners Ltd.',
        email: 'compliance@globalhealthpartners.sg',
        contactPerson: 'Michelle Wong',
        contactNumber: '+65-6789-0123',
        orgType: 'Healthcare Consulting',
        plan: 'Standard',
        specialties: ['Medical Training', 'Staff Augmentation'],
        createdAt: '2026-06-01T09:45:00.000Z',
        status: 'UNDER_REVIEW',
        paymentStatus: 'COMPLETED',
        documents: {
          business_license: {
            fileKey: 'vendor-onboarding/VO-003/business_license/ghp_license.pdf',
            fileName: 'GHP_Singapore_License.pdf',
            contentType: 'application/pdf',
            fileSize: 267890,
            uploadedAt: '2026-06-01T09:45:00.000Z',
          },
          moh_accreditation: {
            fileKey: 'vendor-onboarding/VO-003/moh_accreditation/moh_sg.pdf',
            fileName: 'Singapore_MOH_Approval.pdf',
            contentType: 'application/pdf',
            fileSize: 445123,
            uploadedAt: '2026-06-01T09:46:00.000Z',
          },
          tax_identification: {
            fileKey: 'vendor-onboarding/VO-003/tax_identification/sgp_tax.pdf',
            fileName: 'Singapore_UEN.pdf',
            contentType: 'application/pdf',
            fileSize: 123456,
            uploadedAt: '2026-06-01T09:47:00.000Z',
          },
        },
      },
    ];
    
    res.status(200).json({ success: true, message: 'Demo data cleared' });
  });

  // ==================== VITE & STATIC FILES ====================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    console.log(`[Info] Set ADMIN_GENERATION_SECRET in .env to enable credential generation`);
    console.log(`[Info] Set JWT_SECRET in .env for token signing (default: gmaa-secret-key)`);
  });
}

startServer();
