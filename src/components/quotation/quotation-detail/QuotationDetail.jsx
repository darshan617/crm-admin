"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/quotation/quotation-detail/QuotationDetail.module.css";
import tizzyLogo from "@/assets/images/logo.png";
import Image from "next/image";
import { LuDownload, LuPhone } from "react-icons/lu";
import { RiGlobalLine, RiHistoryLine } from "react-icons/ri";
import { CiMail } from "react-icons/ci";
import { MdOutlineEmail, MdOutlineTurnRight } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { useGetQuotationDetailQuery } from "@/redux/apis/quotationApi";

const SAMPLE_QUOTATIONS = [
  {
    id: 46,
    number: "TCCPLQ00043A-B",
    date: "13 October 2026",
    customerStatus: "Not shared",
    invoice: "—",
    closed: false,
    toName: "John Doe",
    greeting: "Mr. John Doe",
    toCompany: "Example Corp",
    addressLine1: "1090C, Municipal no 1197/1090C, 15th Main, Mumbai",
    addressLine2: "Mumbai, Maharashtra 400001 India",
    requirement: "Google Workspace",
    items: [
      {
        sku: "business-plus",
        description: "Google Workspace Business Plus (Yearly)",
        pricePerUnit: "₹ 20,400.00",
        licenses: 50,
        total: "₹ 1,020,000.00",
      },
    ],
    totalLicenses: 50,
    subTotal: "₹ 1,020,000.00",
    discountLabel: "Discount 10.92%",
    discountAmount: "₹ 111,384.00",
    gstLabel: "GST (18%)",
    gstAmount: "₹ 163,550.88",
    grandTotal: "₹ 1,072,166.88",
    validTill: "28 October 2026",
    licenseTerm: "Yearly",
    email: "johnn@example.com",
    actions: ["discount", "download", "edit", "send", "history"],
  },
  {
    id: 45,
    number: "TCCPLQ00043A-A",
    date: "13 October 2026",
    customerStatus: "Approved",
    invoice: "Approved",
    closed: true,
    toName: "John Doe",
    greeting: "Mr. John Doe",
    toCompany: "Example Corp",
    addressLine1: "1090C, Municipal no 1197/1090C, 15th Main, Mumbai",
    addressLine2: "Mumbai, Maharashtra 400001 India",
    requirement: "Google Workspace",
    items: [
      {
        sku: "business-plus",
        description: "Google Workspace Business Plus (Yearly)",
        pricePerUnit: "₹ 20,400.00",
        licenses: 50,
        total: "₹ 1,020,000.00",
      },
    ],
    totalLicenses: 50,
    subTotal: "₹ 1,020,000.00",
    discountLabel: "Discount 10%",
    discountAmount: "₹ 102,000.00",
    gstLabel: "GST (18%)",
    gstAmount: "₹ 165,240.00",
    grandTotal: "₹ 1,083,240.00",
    validTill: "28 October 2026",
    licenseTerm: "Yearly",
    email: "johnn@example.com",
    actions: ["download", "history"],
  },
  {
    id: 43,
    number: "TCCPLQ00043A",
    date: "05 October 2026",
    customerStatus: "Approved",
    invoice: "Approved",
    closed: false,
    toName: "John Doe",
    greeting: "Mr. John Doe",
    toCompany: "Example Corp",
    addressLine1: "1090C, Municipal no 1197/1090C, 15th Main, Mumbai",
    addressLine2: "Mumbai, Maharashtra 400001 India",
    requirement: "Google Workspace",
    items: [
      {
        sku: "business-plus",
        description: "Google Workspace Business Plus (Yearly)",
        pricePerUnit: "₹ 20,400.00",
        licenses: 50,
        total: "₹ 1,020,000.00",
      },
    ],
    totalLicenses: 50,
    subTotal: "₹ 1,020,000.00",
    discountLabel: "Discount 20%",
    discountAmount: "₹ 204,000.00",
    gstLabel: "GST (18%)",
    gstAmount: "₹ 146,880.00",
    grandTotal: "₹ 962,880.00",
    validTill: "20 October 2026",
    licenseTerm: "Yearly",
    email: "johnn@example.com",
    actions: ["download", "history"],
  },
];

function QuotationCard({ quotation, onOpenModal }) {
  const router = useRouter();

  const [isClosed, setIsClosed] = useState(!!quotation.closed);

  const activityPath = "/quotations/" + quotation.id + "/activity";

  const handleSendForDiscount = () => {
    if (onOpenModal) onOpenModal("sendDiscountModal");
  };

  const handleSend = () => {
    const quotationIdInput = document.getElementById("sendQuotationId");
    if (quotationIdInput) quotationIdInput.value = String(quotation.id);

    const emailsInput = document.getElementById("sendQuotationEmails");
    if (emailsInput) emailsInput.value = quotation.email;

    const primaryEmailInput = document.getElementById(
      "sendQuotationPrimaryEmail",
    );
    if (primaryEmailInput) primaryEmailInput.value = quotation.email;

    if (onOpenModal) onOpenModal("sendQuotationModal");
  };

  const has = (action) => quotation.actions.includes(action);

  return (
    <div className={isClosed ? "closed" : undefined}>
      <div className={styles.quotationTopMeta}>
        <div className={styles.qmetaField}>
          <span>Customer status</span>
          <strong>{quotation.customerStatus}</strong>
        </div>
        <div className={styles.qmetaField}>
          <span>Invoice</span>
          <strong>{quotation.invoice}</strong>
        </div>
        <div className={styles.qmetaField}>
          <Link href={activityPath} className={styles.quotationActivityLink}>
            Send &amp; approval history
          </Link>
        </div>
      </div>

      <div
        className={`${styles.quotationHeader} ${styles.quotationToggle}`}
        onClick={() => setIsClosed((previous) => !previous)}
      >
        <div className={styles.quotationNumber}>
          <span>Quotation No :</span>
          <strong>{quotation.number}</strong>
          <small>{quotation.date}</small>
        </div>

        <div className={styles.quotationCompany}>
          Tizzy Cloud Computing Private Limited
        </div>

        <div className={styles.quotationLogo}>
          <Image src={tizzyLogo} alt="Tizzy Cloud Group" />
          <div className="quotation-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.quotationBody}>
        <div className={styles.quotationTo}>
          <p>To,</p>
          <strong>{quotation.toName},</strong>
          <span>{quotation.toCompany}</span>
          {quotation.addressLine1 && <span>{quotation.addressLine1}</span>}
          {quotation.addressLine2 && <span>{quotation.addressLine2}</span>}
        </div>

        <div className={styles.quotationSubject}>
          Subject :<strong>Quotation for {quotation.requirement}</strong>
        </div>

        <div className={styles.quotationContent}>
          <p>Dear {quotation.greeting},</p>
          <p>
            Tizzy Cloud is a team of enthusiastic techies specialized in Cloud
            Computing Services. Since inception we are focused on educating
            rather than just selling services. Gaining trust of our elite
            clients, we have a customer retain ratio of almost 94%.
          </p>
          <p>
            We are a Cloud Business Email Hosting Company. We provide Cloud
            Email Service named as ‘Tizzy Mail’. We have 13000+ Email users on
            our robust infra hosted on Amazon AWS INDIA DC. We are serving 500+
            mid-sized and corporate companies along with dozens of IT companies
            empowering them to provide our premium Tizzy Mail services to their
            clients. Automated backup is done on S3 Bucket of AWS for 30 days.
            Customized paid backup service to store data up to 1 year is also
            provided with an additional cost. Zero IP blacklisting issue for
            Tizzy Mail Users. Plans starting as low as 10 GB to Corporate Plan
            of 1 TB Cloud Storage.
          </p>
          <p>
            We are official partners of Amazon AWS, Microsoft &amp; Google. We
            provide Microsoft 365 &amp; Google Workspace Licenses with its
            technical assistance.
          </p>
        </div>

        <div className={styles.commercialTitle}>
          Commercial Proposal for requirement :
          <strong>{quotation.requirement}</strong>
        </div>

        <div className={styles.quotationTableWrap}>
          <table className={styles.quotationTable}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Price Per Unit </th>
                <th>Licenses</th>
                <th>Total Price </th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.sku}</td>
                  <td>{item.description}</td>
                  <td>{item.pricePerUnit}</td>
                  <td>{item.licenses}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
              <tr className={styles.summaryRow}>
                <td></td>
                <td>Sub Total</td>
                <td></td>
                <td>{quotation.totalLicenses}</td>
                <td>{quotation.subTotal}</td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={2}>{quotation.discountLabel}</td>
                <td></td>
                <td>{quotation.discountAmount}</td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={2}>{quotation.gstLabel}</td>
                <td></td>
                <td>{quotation.gstAmount}</td>
              </tr>
              <tr className={styles.totalRow}>
                <td></td>
                <td colSpan={2}>
                  <strong>Total</strong>
                </td>
                <td></td>
                <td>
                  <strong>{quotation.grandTotal}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.quotationTerms}>
          <p>
            This quotation is valid till {quotation.validTill}. All Orders and
            payments will be in favour of ‘Tizzy Cloud Computing Private
            Limited’. Price quoted is exclusive of 18% GST. Payment term is 100%
            Advance. Activation/Transfer/Renewal within 3-5 working days.
            License term is {quotation.licenseTerm} commitment &amp; payment.
          </p>
          <p>It would be our pleasure serving you.</p>
        </div>

        <div className={styles.quotationSignature}>
          <span>Regards,</span>
          <strong>Shradha Kadam</strong>
          <span>Hr Admin – Cloud Services</span>
          <span>+91 9081929293</span>
        </div>

        <div className={styles.quotationFooter}>
          <small>Corporate Office Address :</small>
          <strong>Tizzy Cloud Computing Private Limited</strong>
          <span>
            Office No. 511, Kalpataru Avenue, Akurli Road, Kandivali (East),
            Mumbai – 400101, Maharashtra. INDIA
          </span>
          <div className={styles.footerContact}>
            <span>
              <LuPhone size={18} /> +91 9925 9925 99
            </span>
            <span>
              <RiGlobalLine size={18} /> www.tizzycloud.com
            </span>
            <span>
              <MdOutlineEmail size={18} /> sales@tizzycloud.com
            </span>
          </div>
        </div>

        <div className={styles.quotationActions}>
          {has("discount") && (
            <button
              type="button"
              data-modal-open="sendDiscountModal"
              onClick={handleSendForDiscount}
            >
              <MdOutlineTurnRight size={18} />
              Send For More Discount
            </button>
          )}

          {has("download") && (
            <button type="button">
              <LuDownload size={18} />
              Download
            </button>
          )}

          {has("edit") && (
            <button
              type="button"
              onClick={() =>
                router.push("/quotations/" + quotation.id + "/edit")
              }
            >
              <GoPencil size={18} />
              Edit
            </button>
          )}

          {has("send") && (
            <button
              type="button"
              data-modal-open="sendQuotationModal"
              onClick={handleSend}
            >
              <CiMail size={18} />
              Send
            </button>
          )}

          {has("history") && (
            <button type="button" onClick={() => router.push(activityPath)}>
              <RiHistoryLine size={18} />
              History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuotationDetail({ quotations, badge = "New", onOpenModal }) {
  const router = useRouter();
  const {
    data: quotationDetail,
    isLoading,
    isError,
  } = useGetQuotationDetailQuery(
    { quotation_id: router?.query?.slug },
    { skip: !router?.query?.slug },
  );

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href="/quotations">Quotations</Link>
            </p>
          </div>
          <h2>
            Quotations Detail <span className="badge approved">{badge}</span>
          </h2>
        </div>

        <div className="back">
          <Link href="/quotations" className="back-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            <span>Back</span>
          </Link>
        </div>
      </div>

      <section className="common-form pb-0 quotation-detail">
        {quotations.map((quotation) => (
          <QuotationCard
            key={quotation.id}
            quotation={quotation}
            onOpenModal={onOpenModal}
          />
        ))}
      </section>
    </main>
  );
}

export default function Page() {
  return <QuotationDetail quotations={SAMPLE_QUOTATIONS} />;
}
