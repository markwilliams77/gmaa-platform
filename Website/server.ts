import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// --- IN-MEMORY DATABASE STORAGE ---
const db = {
  consultations: [
    {
      id: "c-1",
      name: "Emma Watson",
      service: "Diagnostic Intelligence",
      email: "emma@watson.org",
      phone: "+44 7911 123456",
      region: "Switzerland",
      vendorId: "profile-singapore-gamma",
      vendorName: "Gamma Logistics",
      status: "new",
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
    }
  ] as any[],
  
  tenders: [
    {
      id: "t-1",
      service: "Neonatal Medevac transport",
      region: "Southeast Asia",
      budget: "$45,000 - $60,000",
      deadline: "72 Hours",
      description: "Immediate emergency transfer request for 2-week infant requires incubator, specialized pediatric critical care team, custom airspace approval.",
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      status: "active"
    },
    {
      id: "t-2",
      service: "Specialized Orthopaedic Surgery",
      region: "Europe",
      budget: "$25,000",
      deadline: "10 Days",
      description: "Joint replacement surgery in highly rated European accreditation clinics. Accommodations and private nurse concierge must be bundled.",
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      status: "active"
    }
  ] as any[],
  
  bids: [
    {
      id: "b-1",
      tenderId: "t-1",
      vendorId: "profile-radha-hospital-in",
      vendorName: "Radhakrishnan Hospital",
      proposal: "Full clinical crew with Neonatologist on board. Brand new Learjet 45 configured as flying NICU ready in 6 hours. JCI-approved processes.",
      price: "$48,500",
      timeframe: "Ready for departure in 6 hours",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
    }
  ] as any[],
  
  users: [
    {
      uid: "profile-radha-hospital-in",
      email: "radha@hospital.in",
      displayName: "Radhakrishnan Hospital",
      location: "India",
      role: "vendor",
      specializations: ["Orthopaedics", "Cardiology", "Paediatric Evac"],
      createdAt: new Date().toISOString()
    },
    {
      uid: "profile-admin-globalmaa-com",
      email: "admin@globalmaa.com",
      displayName: "GMAA Institutional Admin",
      location: "London HQ",
      role: "admin",
      createdAt: new Date().toISOString()
    }
  ] as any[],
  
  support_tickets: [
    {
      id: "tk-1",
      vendorId: "profile-radha-hospital-in",
      vendorName: "Radhakrishnan Hospital",
      title: "Unable to update profile logo",
      description: "When dragging our clinic icon, the system does not persist changes. Please help.",
      status: "open",
      createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString()
    }
  ] as any[],
  
  ticket_messages: {
    "tk-1": [
      {
        id: "msg-1",
        senderId: "profile-radha-hospital-in",
        senderName: "Radhakrishnan Hospital",
        text: "When dragging our clinic icon, the system does not persist changes. Please help.",
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString()
      },
      {
        id: "msg-2",
        senderId: "system",
        senderName: "MedAlliance Support",
        text: "Hello, our tech team is checking the image upload endpoint. We will update you in an hour.",
        createdAt: new Date(Date.now() - 6 * 3600000).toISOString()
      }
    ]
  } as Record<string, any[]>,
  
  chats: [
    {
      id: "ch-1",
      userId: "guest-user-1",
      userName: "Emma Watson",
      vendorId: "profile-radha-hospital-in",
      vendorName: "Radhakrishnan Hospital",
      lastMessage: "Thank you for the quick quote guidelines.",
      lastUpdated: new Date().toISOString()
    }
  ] as any[],
  
  chat_messages: {
    "ch-1": [
      {
        id: "m-1",
        senderId: "guest-user-1",
        senderName: "Emma Watson",
        text: "Hello, do you support emergency pediatric flights from Europe to India?",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "m-2",
        senderId: "profile-radha-hospital-in",
        senderName: "Radhakrishnan Hospital",
        text: "Yes, we are EURAMI accredited and fully equipped for neonatal and pediatric airborne transfers.",
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: "m-3",
        senderId: "guest-user-1",
        senderName: "Emma Watson",
        text: "Thank you for the quick quote guidelines.",
        createdAt: new Date().toISOString()
      }
    ]
  } as Record<string, any[]>
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // --- HEALTH CHECK ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // --- PROFILE SYNCHRONIZATION ---
  app.post("/api/users/sync", (req, res) => {
    const { uid, email, displayName, location, role, specializations } = req.body;
    if (!uid || !email) {
      res.status(400).json({ error: "Missing uid or email" });
      return;
    }
    
    let user = db.users.find(u => u.uid === uid);
    if (!user) {
      user = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        location: location || "Unknown",
        role: role || (email === 'admin@globalmaa.com' ? 'admin' : 'vendor'),
        specializations: specializations || [],
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
    } else {
      user.displayName = displayName || user.displayName;
      user.location = location || user.location;
      user.role = role || user.role;
      user.specializations = specializations || user.specializations;
    }
    res.json(user);
  });

  app.get("/api/users/:uid", (req, res) => {
    const user = db.users.find(u => u.uid === req.params.uid);
    if (!user) {
      res.status(404).json({ error: "User profile not found" });
    } else {
      res.json(user);
    }
  });

  app.get("/api/users/role/vendors", (req, res) => {
    const vendors = db.users.filter(u => u.role === "vendor");
    res.json(vendors);
  });

  // --- CONSULTATIONS & LEADS ---
  app.get("/api/consultations", (req, res) => {
    res.json(db.consultations);
  });

  app.post("/api/consultations", (req, res) => {
    const consultation = {
      id: "c-" + Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'new'
    };
    db.consultations.unshift(consultation);
    res.status(201).json(consultation);
  });

  app.put("/api/consultations/:id", (req, res) => {
    const { id } = req.params;
    const index = db.consultations.findIndex(c => c.id === id);
    if (index !== -1) {
      db.consultations[index] = { ...db.consultations[index], ...req.body };
      res.json(db.consultations[index]);
    } else {
      res.status(404).json({ error: "Consultation not found" });
    }
  });

  // --- TENDERS ---
  app.get("/api/tenders", (req, res) => {
    res.json(db.tenders);
  });

  app.post("/api/tenders", async (req, res) => {
    const { tenderData, vendorEmails } = req.body;
    if (!tenderData) {
      res.status(400).json({ error: "Missing tenderData" });
      return;
    }

    const newTender = {
      id: "t-" + Math.random().toString(36).substr(2, 9),
      service: tenderData.service,
      region: tenderData.region,
      budget: tenderData.budget,
      deadline: tenderData.deadline || "72 Hours",
      description: tenderData.description,
      createdAt: new Date().toISOString(),
      status: "active"
    };

    db.tenders.unshift(newTender);

    try {
      const isSimulation = !process.env.RESEND_API_KEY || process.env.ENABLE_MAIL_LIVE !== 'true';
      const emails = vendorEmails || [];
      
      console.log(`[Tender Engine] Saving and broadcasting tender: ${newTender.service}`);
      
      if (!isSimulation && emails.length > 0) {
        await resend.emails.send({
          from: 'GMAA Alliance <notifications@gmaa.alliance>',
          to: emails,
          subject: `New Opportunity: ${newTender.service} Tender`,
          html: `
            <div style="font-family: sans-serif; color: #0A111F;">
              <h2 style="color: #FF3B30;">New Medical Tender Opportunity</h2>
              <p>A new tender has been posted in your region for <strong>${newTender.service}</strong>.</p>
              <div style="padding: 20px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                <p><strong>Region:</strong> ${newTender.region}</p>
                <p><strong>Budget:</strong> ${newTender.budget}</p>
                <p><strong>Deadline:</strong> ${newTender.deadline}</p>
                <p><strong>Details:</strong> ${newTender.description}</p>
              </div>
              <p style="margin-top: 20px;">Please log in to the GMAA Vendor Portal to submit your bid.</p>
            </div>
          `
        });
      } else {
        console.warn(`[Simulation] Checking logs for simulated emails to: ${emails.join(", ")}`);
      }

      res.status(200).json({ 
        success: true, 
        tender: newTender,
        message: isSimulation ? "Tender posted (Simulation Mode: Check server logs for broadcast details)" : "Tender posted and broadcast initiated.",
        simulated: isSimulation 
      });
    } catch (error) {
      console.error("Broadcast failed but tender saved:", error);
      res.status(200).json({ success: true, tender: newTender, warning: "Email broadcast failed" });
    }
  });

  // --- BIDS ---
  app.get("/api/bids", (req, res) => {
    res.json(db.bids);
  });

  app.post("/api/bids", (req, res) => {
    const bid = {
      id: "b-" + Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'pending'
    };
    db.bids.unshift(bid);
    res.status(201).json(bid);
  });

  app.put("/api/bids/:id", (req, res) => {
    const { id } = req.params;
    const index = db.bids.findIndex(b => b.id === id);
    if (index !== -1) {
      db.bids[index] = { ...db.bids[index], ...req.body };
      res.json(db.bids[index]);
    } else {
      res.status(404).json({ error: "Bid not found" });
    }
  });

  // --- SUPPORT TICKETS & MESSAGES ---
  app.get("/api/support-tickets", (req, res) => {
    res.json(db.support_tickets);
  });

  app.post("/api/support-tickets", (req, res) => {
    const ticket = {
      id: "tk-" + Math.random().toString(36).substr(2, 9),
      ...req.body,
      status: "open",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    db.support_tickets.unshift(ticket);
    db.ticket_messages[ticket.id] = [
      {
        id: "msg-" + Math.random().toString(36).substr(2, 9),
        senderId: ticket.vendorId || "system",
        senderName: ticket.vendorName || "User",
        text: ticket.description,
        createdAt: ticket.createdAt
      }
    ];
    res.status(201).json(ticket);
  });

  app.get("/api/support-tickets/:ticketId/messages", (req, res) => {
    const messages = db.ticket_messages[req.params.ticketId] || [];
    res.json(messages);
  });

  app.post("/api/support-tickets/:ticketId/messages", (req, res) => {
    const { ticketId } = req.params;
    const message = {
      id: "msg-" + Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    if (!db.ticket_messages[ticketId]) {
      db.ticket_messages[ticketId] = [];
    }
    db.ticket_messages[ticketId].push(message);

    // update ticket lastUpdated
    const ticket = db.support_tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.lastUpdated = new Date().toISOString();
      if (req.body.status) {
        ticket.status = req.body.status;
      }
    }
    res.status(201).json(message);
  });

  // --- REPUTABLE LIVE CHAT OVERLAY ---
  app.get("/api/chats", (req, res) => {
    res.json(db.chats);
  });

  app.post("/api/chats", (req, res) => {
    const { userId, userName, vendorId, vendorName, lastMessage } = req.body;
    let chat = db.chats.find(c => (c.userId === userId && c.vendorId === vendorId));
    if (!chat) {
      chat = {
        id: "ch-" + Math.random().toString(36).substr(2, 9),
        userId,
        userName,
        vendorId,
        vendorName,
        lastMessage: lastMessage || "Joined dialogue on medical logistics",
        lastUpdated: new Date().toISOString()
      };
      db.chats.unshift(chat);
      db.chat_messages[chat.id] = [];
    } else {
      if (lastMessage) {
        chat.lastMessage = lastMessage;
        chat.lastUpdated = new Date().toISOString();
      }
    }
    res.json(chat);
  });

  app.get("/api/chats/:chatId/messages", (req, res) => {
    const messages = db.chat_messages[req.params.chatId] || [];
    res.json(messages);
  });

  app.post("/api/chats/:chatId/messages", (req, res) => {
    const { chatId } = req.params;
    const message = {
      id: "m-" + Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    if (!db.chat_messages[chatId]) {
      db.chat_messages[chatId] = [];
    }
    db.chat_messages[chatId].push(message);

    const chat = db.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = message.text;
      chat.lastUpdated = new Date().toISOString();
    }
    res.status(201).json(message);
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

