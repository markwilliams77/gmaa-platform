import { useState, useEffect } from "react";
import DocumentCard from "./DocumentCard";
import { vendorService } from "../../services/vendorService";
import { AlertCircle } from "lucide-react";

interface DocumentsSectionProps {
  verificationStatus?: string;
}

export default function DocumentsSection({
  verificationStatus,
}: DocumentsSectionProps) {
  type UploadedFile = {
    file: {
      name: string;
      size: number;
    };
    previewUrl: string;
    uploadedAt?: string;
    id?: string;
  };

  const [files, setFiles] = useState<Record<string, UploadedFile | null>>({});
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const documents = await vendorService.getVendorDocuments();

        const mapped: Record<string, any> = {};

        documents.forEach((doc: any) => {
          mapped[doc.documentType] = {
            file: {
              name: doc.fileName,
              size: doc.fileSize ?? 0,
            },
            previewUrl: doc.fileUrl,
            uploadedAt: new Date(doc.createdAt).toLocaleString(),
            id: doc.id,
          };
        });

        setFiles(mapped);
      } catch (error) {
        console.error(error);
      }
    };

    loadDocuments();
  }, []);

  const isLocked =
    verificationStatus === "PENDING_REVIEW" ||
    verificationStatus === "APPROVED";
  const documents = [
    {
      id: "COMPANY_REGISTRATION",
      title: "Company Registration / Business License",
      description:
        "Upload your organization's official registration or business license.",
    },
    {
      id: "TAX_REGISTRATION",
      title: "Tax Registration",
      description:
        "Upload your GST, VAT or applicable tax registration certificate.",
    },
    {
      id: "SIGNATORY_ID",
      title: "Authorized Signatory ID",
      description:
        "Upload the government-issued ID of the authorized representative.",
    },
    {
      id: "ADDRESS_PROOF",
      title: "Business Address Proof",
      description:
        "Upload a utility bill, lease agreement or any valid address proof.",
    },
    {
      id: "BANK_VERIFICATION",
      title: "Bank Account Verification",
      description:
        "Upload a cancelled cheque, bank certificate or account verification document.",
    },
  ];

  return (
    <div>
      {isLocked && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />

            <div>
              <p className="font-semibold text-amber-900">
                Organization Verification Under Review
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Your organization verification has been submitted to GMAA for
                review. Your verification documents are currently locked to
                preserve the review process. If any corrections are required,
                GMAA will request a re-upload and unlock the necessary
                documents.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600">
            Verification Documents
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Required Documents
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Upload all mandatory documents to submit your organization for
            verification.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              title={document.title}
              description={document.description}
              uploaded={!!files[document.id]}
              disabled={isLocked}
              fileName={files[document.id]?.file.name}
              fileSize={
                files[document.id]
                  ? `${(files[document.id]!.file.size / 1024 / 1024).toFixed(2)} MB`
                  : undefined
              }
              uploadedAt={files[document.id]?.uploadedAt}
              onUpload={async (file) => {
                try {
                  const uploaded = await vendorService.uploadVendorDocument(
                    file,
                    document.id,
                  );

                  setFiles((prev) => ({
                    ...prev,
                    [document.id]: {
                      id: uploaded.id,
                      file: {
                        name: uploaded.fileName,
                        size: uploaded.fileSize,
                      },
                      previewUrl: uploaded.fileUrl,
                      uploadedAt: new Date(uploaded.createdAt).toLocaleString(),
                    },
                  }));
                } catch (error) {
                  console.error(error);
                  alert("Failed to upload document.");
                }
              }}
              onDelete={async () => {
                try {
                  const uploaded = files[document.id];

                  if (uploaded?.id) {
                    await vendorService.deleteVendorDocument(uploaded.id);
                  }

                  setFiles((prev) => ({
                    ...prev,
                    [document.id]: null,
                  }));
                } catch (error) {
                  console.error(error);
                  alert("Failed to delete document.");
                }
              }}
              onPreview={() => {
                const previewUrl = files[document.id]?.previewUrl;

                if (previewUrl) {
                  window.open(previewUrl, "_blank");
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
