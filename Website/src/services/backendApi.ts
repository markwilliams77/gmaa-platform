/**
 * GMAA Client-Side API Integration Layer
 * Integrates the React frontend with the multi-module Express backend.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = (path: string) => `${API_BASE}${path}`;

export interface Consultation {
  id?: string;

  name: string;
  email: string;
  phone: string;

  category?: string;

  service: string;

  region?: string;

  vendorId?: string;
  vendorName?: string;

  details?: Record<string, string>;

  status?: string;

  createdAt?: string;
}

export interface Tender {
  id?: string;
  service: string;
  region: string;
  budget: string;
  deadline?: string;
  description: string;
  createdAt?: string;
  status?: string;
}

export interface Bid {
  id?: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  proposal: string;
  price: string;
  timeframe: string;
  status?: string;
  createdAt?: string;
}

export interface SupportTicket {
  id?: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  status?: string;
  createdAt?: string;
  lastUpdated?: string;
}

export interface TicketMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt?: string;
}

export interface ChatThread {
  id?: string;
  userId: string;
  userName: string;
  vendorId: string;
  vendorName: string;
  lastMessage?: string;
  lastUpdated?: string;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt?: string;
}

export const backendApi = {
  // User Profile

  async getVendorProfile(vendorId: string) {
    const res = await fetch(`${API_BASE}/registry/vendors/${vendorId}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load vendor profile");
    }

    return data;
  },

  async loginVendor(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/vendor-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Vendor login failed");
    }

    return data;
  },

  async loginAdmin(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    return data;
  },

  async syncProfile(userData: {
    uid: string;
    email: string;
    displayName?: string;
    location?: string;
    role?: string;
    specializations?: string[];
  }): Promise<any> {
    const res = await fetch(api("/users/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Sync profile failed");
    return res.json();
  },

  async fetchVendors(): Promise<any[]> {
    const res = await fetch(api("/users/role/vendors"));
    if (!res.ok) return [];
    return res.json();
  },

  // Consultations / Leads
  async fetchConsultations(): Promise<Consultation[]> {
    const res = await fetch(`${API_BASE}/consultations`);
    if (!res.ok) return [];
    return res.json();
  },

  async submitConsultation(data: Consultation): Promise<Consultation> {
    const res = await fetch(`${API_BASE}/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Consultation submission failed");
    return res.json();
  },

  // Tenders
  async fetchTenders(): Promise<Tender[]> {
    const res = await fetch(api("/tenders"));
    if (!res.ok) return [];
    return res.json();
  },

  async submitTender(
    tenderData: Omit<Tender, "id">,
    vendorEmails: string[],
  ): Promise<any> {
    const res = await fetch(api("/tenders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderData, vendorEmails }),
    });
    if (!res.ok) throw new Error("Tender submission failed");
    return res.json();
  },

  // Bids
  async fetchBids(): Promise<Bid[]> {
    const res = await fetch(api("/bids"));
    if (!res.ok) return [];
    return res.json();
  },

  async submitBid(bidData: Omit<Bid, "id">): Promise<Bid> {
    const res = await fetch(api("/bids"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bidData),
    });
    if (!res.ok) throw new Error("Bid submission failed");
    return res.json();
  },

  // Support Tickets
  async fetchSupportTickets(): Promise<SupportTicket[]> {
    const res = await fetch(api("/support-tickets"));
    if (!res.ok) return [];
    return res.json();
  },

  async submitSupportTicket(
    ticketData: Omit<SupportTicket, "id">,
  ): Promise<SupportTicket> {
    const res = await fetch(api("/support-tickets"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });
    if (!res.ok) throw new Error("Ticket submission failed");
    return res.json();
  },

  async fetchTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const res = await fetch(`/api/support-tickets/${ticketId}/messages`);
    if (!res.ok) return [];
    return res.json();
  },

  async submitTicketMessage(
    ticketId: string,
    messageData: {
      senderId: string;
      senderName: string;
      text: string;
      status?: string;
    },
  ): Promise<TicketMessage> {
    const res = await fetch(`/api/support-tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });
    if (!res.ok) throw new Error("Message submission failed");
    return res.json();
  },

  // Conversations / Chat overlay
  async fetchChats(): Promise<ChatThread[]> {
    const res = await fetch(api("/chats"));
    if (!res.ok) return [];
    return res.json();
  },

  async initiateChat(chatData: Omit<ChatThread, "id">): Promise<ChatThread> {
    const res = await fetch(api("/chats"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatData),
    });
    if (!res.ok) throw new Error("Chat initiation failed");
    return res.json();
  },

  async fetchChatMessages(chatId: string): Promise<ChatMessage[]> {
    const res = await fetch(`/api/chats/${chatId}/messages`);
    if (!res.ok) return [];
    return res.json();
  },

  async submitChatMessage(
    chatId: string,
    msgData: { senderId: string; senderName: string; text: string },
  ): Promise<ChatMessage> {
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });
    if (!res.ok) throw new Error("Chat message submission failed");
    return res.json();
  },

  async sendOtp(phone: string, mode: "login" | "signup", email?: string) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        mode,
        email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }

    return data;
  },

  async createVendorOnboarding(data: any) {
    const res = await fetch(`${API_BASE}/vendors/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(
        responseData.message || "Failed to create vendor onboarding",
      );
    }

    return responseData;
  },

  async createVendorOrder(vendorId: string) {
    const res = await fetch(
      `${API_BASE}/vendors/${vendorId}/payments/razorpay/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create payment order");
    }

    return data;
  },

  async verifyVendorPayment(
    vendorId: string,
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) {
    const res = await fetch(
      `${API_BASE}/vendors/${vendorId}/payments/razorpay/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

    return data;
  },

  async createVendorLogin(vendorId: string, password: string) {
    const res = await fetch(
      `${API_BASE}/vendors/${vendorId}/login-info-public`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create vendor login");
    }

    return data;
  },

  async verifyOtp(phone: string, code: string) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        code,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to verify OTP");
    }

    return data;
  },
};
