"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/components/manage/service-provider/ServiceProvider.module.css";
import { useGetProviderQuery } from "@/redux/apis/providerApi";


const tabs = [
  { variant: 1, label: "Plans with Teams" },
  { variant: 5, label: "Plans with Copilot / With Teams" },
  { variant: 6, label: "Plans with Copilot / Without Teams" },
  { variant: 2, label: "Plans without Teams" },
];

export default function ServiceProvider({ providerId, variant = 1 }) {
  const activeVariant = Number(variant);

  const { data, isLoading, isError, refetch } = useGetProviderQuery();

  const providers = data?.data?.providers ?? [];

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span>
              Manage
              <span>/</span>
              Services &amp; Providers
            </p>
          </div>

          <h2>Provider</h2>
        </div>
      </div>

      {Number(providerId) === 2 && (
        <div className={styles.partnerTabsWrap}>
          <div className={styles.partnerTabs}>
            {tabs.map((tab) => (
              <Link
                key={tab.variant}
                href={`/manage/service-providers/2?variant=${tab?.variant}`}
                className={`${styles.partnerTab} ${
                  activeVariant === tab?.variant ? styles.active : ""
                }`}
              >
                {tab?.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <section className={styles.providerSection}>
        {isLoading ? (
          <div className="text-center py-5">
            <p>Loading providers...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-5">
            <p>Failed to load providers.</p>

            <button
              type="button"
              onClick={refetch}
              className={styles.viewPlanBtn}
            >
              Try Again
            </button>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-5">
            <p>No providers found.</p>
          </div>
        ) : (
          <div className={styles.providerGrid}>
            {providers.map((provider) => (
              <div className={styles.providerCard} key={provider?.id}>
                <span className={styles.providerStatus}>
                  {provider?.status === "active" ? "Active" : "Inactive"}
                </span>

                <div className={styles.providerLogo}>
                  {provider?.logo_url && (
                    <Image
                      src={provider?.logo_url}
                      alt={provider?.name || "Provider"}
                      width={120}
                      height={60}
                      unoptimized
                    />
                  )}
                </div>

                <h3>{provider?.name}</h3>

                <p>{provider?.description || ""}</p>

                <div className={styles.providerActions}>
                  <Link
                    href={`/manage/service-providers/${provider?.id}`}
                    className={styles.viewPlanBtn}
                  >
                    View Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
