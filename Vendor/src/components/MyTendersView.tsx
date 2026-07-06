import React, { useEffect, useState } from "react";
import { vendorService } from "../services/vendorService";

interface Props {
  tenders: any[];
}

export default function MyTendersView({ tenders }: Props) {
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditingBid, setIsEditingBid] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const selectedTender = tenders.find((t) => t.id === selectedTenderId);

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || tender.serviceCategory === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || tender.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    "All",
    ...new Set(tenders.map((t) => t.serviceCategory).filter(Boolean)),
  ];

  useEffect(() => {
    const loadDocuments = async () => {
      if (!selectedTender?.threadId) {
        setDocuments([]);
        return;
      }

      try {
        const docs = await vendorService.getWorkspaceDocuments(
          selectedTender.threadId,
        );

        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents", error);
      }
    };

    loadDocuments();
  }, [selectedTender]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedTender?.threadId) {
        setMessages([]);
        return;
      }

      try {
        const data = await vendorService.getMessages(selectedTender.threadId);

        console.log("SUPPORT MESSAGES", data);

        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadMessages();
  }, [selectedTender]);

  const handleSendMessage = async () => {
    if (!selectedTender?.threadId || !newMessage.trim()) {
      return;
    }

    try {
      await vendorService.sendMessage(selectedTender.threadId, newMessage);

      const data = await vendorService.getMessages(selectedTender.threadId);

      setMessages(data);

      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    if (!selectedTender?.threadId) {
      return;
    }

    try {
      setUploading(true);

      const uploadData = await vendorService.getUploadUrl(
        selectedTender.threadId,
        file.name,
        file.type,
      );

      await fetch(uploadData.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      await vendorService.createWorkspaceDocument({
        threadId: selectedTender.threadId,
        fileName: file.name,
        fileUrl: uploadData.fileUrl,
        s3Key: uploadData.s3Key,
      });

      const docs = await vendorService.getWorkspaceDocuments(
        selectedTender.threadId,
      );

      console.log("DOCS", docs);

      setDocuments(docs);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await vendorService.deleteWorkspaceDocument(documentId);

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error(error);
    }
  };

  const getDeadlineLabel = (deadline?: string) => {
    if (!deadline) return "-";

    const now = new Date();
    const end = new Date(deadline);

    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Closed";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    }

    return `${hours}h left`;
  };

  if (selectedTender) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedTenderId(null)}
          className="rounded-lg border px-3 py-2"
        >
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">{selectedTender.title}</h2>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-slate-500">Category</p>

                <p className="font-medium">
                  {selectedTender.serviceCategory || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Region</p>

                <p className="font-medium">{selectedTender.region}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-xs text-slate-500 uppercase">Status</p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    selectedTender.vendorStatus === "Awarded"
                      ? "bg-emerald-50 text-emerald-600"
                      : selectedTender.vendorStatus === "Open for Bidding"
                        ? "bg-cyan-50 text-cyan-600"
                        : selectedTender.vendorStatus === "Open for Re-bidding"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedTender.vendorStatus}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-xs text-slate-500 uppercase">Round</p>

                <p className="mt-2 text-lg font-bold">
                  {selectedTender.currentRound}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-xs text-slate-500 uppercase">Position</p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    selectedTender.myPosition === "L1"
                      ? "bg-emerald-50 text-emerald-600"
                      : selectedTender.myPosition === "L2"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {selectedTender.myPosition}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-xs text-slate-500 uppercase">Bid Count</p>

                <p className="mt-2 text-lg font-bold">
                  {selectedTender.myBidCount}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Tender Context & Scope
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                {selectedTender.description}
              </p>
            </div>

            <div className="mt-8 border-t pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
                Tender Documents
              </p>

              <div className="mb-5 rounded-xl border-2 border-dashed border-slate-300 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      Upload Supporting Documents
                    </p>

                    <p className="text-sm text-slate-500">
                      Share quotations, reports, certifications, or supporting
                      files.
                    </p>
                  </div>

                  <label className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition">
                    {uploading ? "Uploading..." : "Upload Document"}

                    <input
                      type="file"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          handleDocumentUpload(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                {documents.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No documents available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                            📄
                          </div>

                          <div>
                            <p className="font-medium text-sm truncate max-w-[500px] text-slate-900">
                              {doc.fileName}
                            </p>

                            <p className="text-xs text-slate-500">
                              Uploaded by {doc.uploadedByRole || "Vendor"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                          >
                            Open
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-bold mb-4">My Bid</h3>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white border border-slate-200 p-4">
                    <p className="text-xs uppercase text-slate-500">
                      Bid Amount
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {selectedTender.myLatestBid?.amount}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white border border-slate-200 p-4">
                    <p className="text-xs uppercase text-slate-500">
                      Tender Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        selectedTender.myLatestBid?.status === "AWARDED"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {selectedTender.vendorStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-white border border-slate-200 p-4">
                  <p className="text-xs uppercase text-slate-500 mb-2">
                    Proposal
                  </p>

                  <p className="text-sm text-slate-700 leading-6">
                    {selectedTender.myLatestBid?.proposal}
                  </p>

                  {selectedTender.canSubmitBid && (
                    <>
                      <button
                        onClick={() => {
                          setBidPrice(
                            selectedTender.myLatestBid?.amount?.toString() ??
                              "",
                          );

                          setBidProposal(
                            selectedTender.myLatestBid?.proposal ?? "",
                          );

                          setIsEditingBid(true);
                        }}
                        className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        {selectedTender.currentRound > 1
                          ? "Update Bid"
                          : "Submit Bid"}
                      </button>

                      {isEditingBid && (
                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                          <h4 className="text-sm font-bold text-slate-900">
                            Update Your Bid
                          </h4>

                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Revised Bid Amount
                            </label>

                            <input
                              type="number"
                              value={bidPrice}
                              onChange={(e) => setBidPrice(e.target.value)}
                              className="w-full rounded-xl border border-slate-300 px-4 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Updated Proposal
                            </label>

                            <textarea
                              rows={4}
                              value={bidProposal}
                              onChange={(e) => setBidProposal(e.target.value)}
                              className="w-full rounded-xl border border-slate-300 px-4 py-2"
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => setIsEditingBid(false)}
                              className="rounded-xl px-4 py-2 text-slate-600"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              disabled={isSubmittingBid}
                              onClick={async () => {
                                if (!selectedTender) return;

                                try {
                                  setIsSubmittingBid(true);

                                  await vendorService.submitBid(
                                    selectedTender.id,
                                    Number(bidPrice),
                                    bidProposal,
                                  );

                                  setIsEditingBid(false);

                                  // or whatever function you use to refresh My Tenders

                                  alert("Bid updated successfully.");
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to update bid.");
                                } finally {
                                  setIsSubmittingBid(false);
                                }
                              }}
                              className="rounded-xl bg-slate-900 px-5 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                              {isSubmittingBid
                                ? "Updating..."
                                : "Submit Updated Bid"}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-bold mb-4">Bid History</h3>

              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                {selectedTender.bidHistory?.map((bid: any) => (
                  <div key={bid.id} className="relative pl-8 pb-6">
                    <div className="absolute left-0 top-1">
                      <div className="h-3 w-3 rounded-full bg-cyan-500" />
                      <div className="absolute left-[5px] top-3 h-full w-px bg-slate-200" />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-slate-900">
                            {bid.amount}
                          </p>

                          <p className="text-xs text-slate-500">Bid Amount</p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            bid.status === "AWARDED"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {bid.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-700">
                        {bid.proposal}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(bid.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Tender Ranking
                </h4>

                <span className="text-3xs font-semibold text-slate-400">
                  Current Round
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl border border-cyan-300 bg-cyan-50/10 flex items-center justify-between">
                  <div>
                    <p className="text-2xs font-bold text-cyan-700">
                      Your Position
                    </p>

                    <p className="text-3xs text-slate-400 mt-1">
                      Current tender evaluation
                    </p>
                  </div>

                  <span className="text-xs font-bold text-cyan-600">
                    {selectedTender.myPosition}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-2xs font-semibold">Current Round</p>

                  <p className="text-3xs text-slate-500 mt-1">
                    {selectedTender.currentRound}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-2xs font-semibold">Total Bids Submitted</p>

                  <p className="text-3xs text-slate-500 mt-1">
                    {selectedTender.myBidCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  GMAA Support
                </h4>

                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 min-h-[180px]">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No support messages yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message: any) => {
                      const isVendor = message.sender?.role === "VENDOR";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isVendor ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 ${
                              isVendor
                                ? "bg-slate-900 text-white"
                                : "bg-white border border-slate-200"
                            }`}
                          >
                            <p className="text-xs font-semibold mb-1">
                              {message.sender?.role}
                            </p>

                            <p className="text-sm">{message.content}</p>

                            <p
                              className={`text-xs mt-2 ${
                                isVendor ? "text-slate-300" : "text-slate-400"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask GMAA for support regarding this tender..."
                className="mt-4 w-full rounded-xl border p-3 text-sm"
              />

              <button
                onClick={handleSendMessage}
                className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-white"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Tenders</h2>

        <p className="text-slate-500">
          Tenders where you have actively participated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <input
          type="text"
          placeholder="Search my tenders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="All">All Statuses</option>

          <option value="AWARDED">Awarded</option>

          <option value="BROADCASTED">Active</option>

          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="text-left p-4">Tender ID</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Deadline</th>
              <th className="text-left p-4">Round</th>
              <th className="text-left p-4">Position</th>
              <th className="text-left p-4">Bid Count</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTenders.map((tender) => (
              <tr
                key={tender.tenderNumber}
                className="group hover:bg-slate-50 transition-colors border-t"
              >
                <td className="p-4">
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">
                    {tender.tenderNumber}
                  </span>
                </td>
                <td className="p-4 font-medium text-slate-900">
                  {tender.title}
                </td>

                <td className="p-4">{getDeadlineLabel(tender.deadline)}</td>

                <td className="p-4">{tender.currentRound}</td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      tender.myPosition === "L1"
                        ? "bg-emerald-50 text-emerald-600"
                        : tender.myPosition === "L2"
                          ? "bg-amber-50 text-amber-600"
                          : tender.myPosition === "L3"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tender.myPosition}
                  </span>
                </td>

                <td className="p-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {tender.myBidCount}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      tender.vendorStatus === "Awarded"
                        ? "bg-emerald-50 text-emerald-600"
                        : tender.vendorStatus === "Open for Bidding"
                          ? "bg-cyan-50 text-cyan-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tender.vendorStatus}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("BUTTON CLICKED", tender.id);

                      setSelectedTenderId(tender.id);
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-1 text-xs text-white"
                  >
                    Open Workspace
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
