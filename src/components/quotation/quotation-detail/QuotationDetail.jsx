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
import { BiChevronDown } from "react-icons/bi";

function QuotationCard({ quotation, onOpenModal, isOpen, onToggle }) {
  const router = useRouter();

  const isClosed = !isOpen;

  const plans = Array.isArray(quotation?.plans)
    ? quotation?.plans
    : Array.isArray(quotation?.items)
      ? quotation?.items
      : [];
  const items = plans.map((plan) => {
    const rawQuantity = plan?.quantity ?? plan?.licenses;
    const rawRate = plan?.rate ?? plan?.price;
    const quantity = Number(rawQuantity);
    const rate = Number(rawRate);

    return {
      sku: plan?.sku || plan?.name || plan?.plan_name || "—",
      description: plan?.description || plan?.name || plan?.plan_name || "—",
      pricePerUnit: rawRate ?? "—",
      licenses: rawQuantity ?? "—",
      total:
        plan?.total_amount ??
        plan?.total ??
        (rawRate !== undefined &&
        rawRate !== null &&
        rawQuantity !== undefined &&
        rawQuantity !== null &&
        Number.isFinite(rate) &&
        Number.isFinite(quantity)
          ? rate * quantity
          : null),
    };
  });
  const totalLicenses =
    quotation?.total_licenses ??
    plans.reduce(
      (total, plan) => total + Number(plan?.quantity ?? plan?.licenses ?? 0),
      0,
    );
  const calculatedSubtotal =
    items.length > 0
      ? items.reduce((total, item) => {
          const value = Number(item.total);
          return total + (Number.isFinite(value) ? value : 0);
        }, 0)
      : null;
  const subTotal =
    quotation?.subtotal ?? quotation?.sub_total ?? calculatedSubtotal;
  const requirement =
    quotation?.requirement ||
    plans
      .map((plan) => plan?.name || plan?.plan_name)
      .filter(Boolean)
      .join(", ") ||
    "—";
  const contactName =
    quotation?.contact_name ||
    quotation?.name ||
    quotation?.customer_detail?.name ||
    "—";
  const email = quotation?.email || quotation?.customer_detail?.email || "";
  const actions = quotation?.actions || [];

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return value;
    return `₹ ${numericValue.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleSendForDiscount = () => {
    if (onOpenModal) onOpenModal("sendDiscountModal");
  };

  const handleSend = () => {
    const quotationIdInput = document.getElementById("sendQuotationId");
    if (quotationIdInput) quotationIdInput.value = String(quotation?.id ?? "");

    const emailsInput = document.getElementById("sendQuotationEmails");
    if (emailsInput) emailsInput.value = email;

    const primaryEmailInput = document.getElementById(
      "sendQuotationPrimaryEmail",
    );
    if (primaryEmailInput) primaryEmailInput.value = email;

    if (onOpenModal) onOpenModal("sendQuotationModal");
  };

  return (
    <div
      className={`${styles.quotationVersionDiv} ${
        isClosed ? styles.closed : ""
      }`}
    >
      <div className={styles.quotationTopMeta}>
        <div className={styles.qmetaField}>
          <span>Customer status</span>
          <strong>
            {quotation?.customer_status || quotation?.status || "—"}
          </strong>
        </div>
        <div className={styles.qmetaField}>
          <span>Invoice</span>
          <strong>
            {quotation?.invoice_status || quotation?.invoice || "—"}
          </strong>
        </div>
        <div className={styles.qmetaField}>
          <Link
            href={`/quotations/history/${quotation?.id}`}
            className={styles.quotationActivityLink}
          >
            Send &amp; approval history
          </Link>
        </div>
      </div>

      <div
        className={`${styles.quotationHeader} ${styles.quotationToggle}`}
        onClick={onToggle}
      >
        <div className={styles.quotationNumber}>
          <span>Quotation No :</span>
          <strong>
            {quotation?.quotation_no ||
              quotation?.number ||
              quotation?.id ||
              "—"}
          </strong>
          <small>
            {quotation?.quotation_date || quotation?.created_at || "—"}
          </small>
        </div>

        <div className={styles.quotationCompany}>
          Tizzy Cloud Computing Private Limited
        </div>

        <div className={styles.quotationLogo}>
          <Image src={tizzyLogo} alt="Tizzy Cloud Group" />
          <BiChevronDown size={24} />
        </div>
      </div>

      <div className={styles.quotationBody}>
        <hr />
        <div className={styles.quotationTo}>
          <p>To,</p>
          <strong>{contactName},</strong>
          <span>{quotation?.company_name || quotation?.toCompany || "—"}</span>
          {quotation?.addressLine1 && <span>{quotation?.addressLine1}</span>}
          {quotation?.addressLine2 && <span>{quotation?.addressLine2}</span>}
        </div>
        <div className={styles.quotationSubject}>
          Subject :<strong>Quotation for {requirement}</strong>
        </div>
        <div className={styles.quotationContent}>
          <p>Dear {quotation?.greeting || contactName},</p>
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
          Commercial Proposal for requirement :<strong>{requirement}</strong>
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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item?.sku}</td>
                  <td>{item?.description}</td>
                  <td>{formatAmount(item?.pricePerUnit)}</td>
                  <td>{item?.licenses}</td>
                  <td>{formatAmount(item?.total)}</td>
                </tr>
              ))}
              <tr className={styles.summaryRow}>
                <td></td>
                <td>Sub Total</td>
                <td></td>
                <td>{totalLicenses}</td>
                <td>{formatAmount(subTotal)}</td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={2}>
                  Discount
                  {quotation?.discount_percentage != null
                    ? ` (${quotation?.discount_percentage}%)`
                    : ""}
                </td>
                <td></td>
                <td>
                  {formatAmount(
                    quotation?.discount_amount ?? quotation?.discount,
                  )}
                </td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={2}>GST (18%)</td>
                <td></td>
                <td>
                  {formatAmount(quotation?.gst_amount ?? quotation?.tax_amount)}
                </td>
              </tr>
              <tr className={styles.totalRow}>
                <td></td>
                <td colSpan={2}>
                  <strong>Total</strong>
                </td>
                <td></td>
                <td>
                  <strong>
                    {formatAmount(
                      quotation?.grand_total ??
                        quotation?.total_amount ??
                        subTotal,
                    )}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.quotationTerms}>
          <p>
            This quotation is valid till{" "}
            {quotation?.valid_till || quotation?.valid_until || "—"}. All Orders
            and payments will be in favour of ‘Tizzy Cloud Computing Private
            Limited’. Price quoted is exclusive of 18% GST. Payment term is 100%
            Advance. Activation/Transfer/Renewal within 3-5 working days.
            License term is{" "}
            {quotation?.license_term || quotation?.quote_period || "—"}{" "}
            commitment &amp; payment.
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
          <button
            type="button"
            data-modal-open="sendDiscountModal"
            onClick={handleSendForDiscount}
          >
            <MdOutlineTurnRight size={18} />
            Send For More Discount
          </button>

          <button type="button">
            <LuDownload size={18} />
            Download
          </button>

          <button
            type="button"
            onClick={() => router.push(`/quotations/${quotation?.id}/edit`)}
          >
            <GoPencil size={18} />
            Edit
          </button>

          <button
            type="button"
            data-modal-open="sendQuotationModal"
            onClick={handleSend}
          >
            <CiMail size={18} />
            Send
          </button>

          <button type="button" onClick={() => router.push(activityPath)}>
            <RiHistoryLine size={18} />
            History
          </button>
        </div>
      </div>
    </div>
  );
}

function QuotationDetail({ badge = "New", onOpenModal }) {
  const router = useRouter();
  const [openQuotationId, setOpenQuotationId] = useState(undefined);
  const {
    data: quotationDetail,
    isLoading,
    isError,
  } = useGetQuotationDetailQuery(
    { quotation_id: router?.query?.slug },
    { skip: !router?.query?.slug },
  );
  const quotations = Array.isArray(quotationDetail?.data?.quotation)
    ? quotationDetail?.data?.quotation
    : [];

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

      <section className={`${styles.quotationDetail} pb-0`}>
        {isLoading ? (
          <p>Loading quotation details...</p>
        ) : isError ? (
          <p role="alert">
            Unable to load quotation details. Please try again.
          </p>
        ) : quotations?.length === 0 ? (
          <p>No quotation details found.</p>
        ) : (
          quotations?.toReversed()?.map((quotation, index) => {
            const isOpen =
              openQuotationId === undefined
                ? index === 0
                : openQuotationId === quotation?.id;

            return (
              <QuotationCard
                key={quotation?.id}
                quotation={quotation}
                onOpenModal={onOpenModal}
                isOpen={isOpen}
                onToggle={() =>
                  setOpenQuotationId(isOpen ? null : quotation?.id)
                }
              />
            );
          })
        )}
      </section>
    </main>
  );
}

export default function Page() {
  return <QuotationDetail />;
}
