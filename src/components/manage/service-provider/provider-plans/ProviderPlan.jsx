"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/manage/service-provider/provider-plans/ProviderPlan.module.css";
import { FaArrowLeft } from "react-icons/fa";
import {
  useGetProviderPlanQuery,
  useGetProviderQuery,
} from "@/redux/apis/providerApi";

const ProviderPlan = () => {
  const router = useRouter();
  const { slug, variant } = router.query;

  const id = Array.isArray(slug) ? slug[0] : slug;
  const activeVariant = Number(variant) || 1;

  const { data: providerData } = useGetProviderQuery();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetProviderPlanQuery(
      {
        id,
        variant: String(id) === "2" ? activeVariant : undefined,
      },
      { skip: !router.isReady || !id },
    );

  const providers = providerData?.data?.providers ?? [];

  const currentProvider = providers.find(
    (provider) => Number(provider.id) === Number(id),
  );

  const provider = data?.data?.provider || currentProvider;
  const providerName = provider?.name || "Provider";

  const plans = data?.data?.plans ?? [];
  const variants = data?.data?.variants ?? [];

  const selectedVariant = Number(data?.data?.selected_variant) || activeVariant;

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
              <Link href="/crm/providers">Services &amp; Providers</Link>
              <span>/</span>
              Provider
            </p>
          </div>

          <h2>{providerName}</h2>
        </div>

        <div className="back">
          <button
            type="button"
            onClick={() => router.back()}
            className="back-btn"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
        </div>
      </div>

      <section className={styles.planSection}>
        <div className={styles.planHeading}>
          <h2>{providerName}</h2>
        </div>

        {String(id) === "2" && (
          <div className={styles.partnerTabsWrap}>
            <div className={styles.partnerTabs}>
              {variants.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/manage/service-providers/${id}?variant=${tab.id}`}
                  className={`${styles.partnerTab} ${
                    selectedVariant === Number(tab.id) ? styles.active : ""
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!router.isReady || isLoading || isFetching ? (
          <div className="text-center py-5">
            <p>Loading plans...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-5">
            <p>Failed to load provider plans.</p>

            <button type="button" onClick={() => refetch()}>
              Try Again
            </button>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-5">
            <p>No plans found.</p>
          </div>
        ) : (
          <div className={styles.planGrid}>
            {plans.map((plan) => (
              <div className={styles.planCard} key={plan.id}>
                <div className={styles.planCardHeader}>
                  <h3>{plan.name}</h3>
                </div>

                <div className={styles.planCardBody}>
                  <div className={styles.planPrice}>
                    <strong>
                      ₹ {Number(plan?.rate).toLocaleString("en-IN")}
                    </strong>

                    <span>Per User / Per Year</span>

                    <small>GST 18% Additional</small>
                  </div>

                  <ul className={styles.planFeatures}>
                    {plan?.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProviderPlan;
