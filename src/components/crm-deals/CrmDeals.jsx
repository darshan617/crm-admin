import Link from "next/link";
import styles from '@/components/crm-deals/CrmDeals.module.css'


const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-lucide="search"
    aria-hidden="true"
    className="lucide lucide-search"
  >
    <path d="m21 21-4.34-4.34"></path>
    <circle cx="11" cy="11" r="8"></circle>
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-lucide="eye"
    aria-hidden="true"
    className="lucide lucide-eye"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-lucide="chevron-left"
    aria-hidden="true"
    className="lucide lucide-chevron-left"
  >
    <path d="m15 18-6-6 6-6"></path>
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-lucide="chevron-right"
    aria-hidden="true"
    className="lucide lucide-chevron-right"
  >
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

const deals = [
  {
    id: 45,
    quotationId: "TCCPLQ00043A-A",
    avatarColor: "blue",
    avatarLetter: "E",
    company: "Example Corp",
    contact: "John Doe",
    lead: 69,
    plan: "Google Workspace Business Plus",
    type: "New",
    licenses: 50,
    term: "Yearly",
    price: "₹ 918,000.00",
    badge: "CRM00007",
    assignedInitial: "A",
    assignedName: "Admin",
    added: "Added 13 Oct, 2026 12:56 PM",
  },
  {
    id: 44,
    quotationId: "TCCPLQ00039A-A",
    avatarColor: "red",
    avatarLetter: "M",
    company: "MALAD RESIDENCY",
    contact: "Kapil Maurya",
    lead: 55,
    plan: "Microsoft 365 Business Standard (no Teams)",
    type: "New",
    licenses: 1,
    term: "Yearly",
    price: "₹ 6,224.40",
    badge: "CRM00006",
    assignedInitial: "P",
    assignedName: "Pratik V",
    added: "Added 12 Oct, 2026 01:48 PM",
  },
  {
    id: 43,
    quotationId: "TCCPLQ00043A",
    avatarColor: "yellow",
    avatarLetter: "E",
    company: "Example Corp",
    contact: "John Doe",
    lead: 69,
    plan: "Google Workspace Business Plus",
    type: "New",
    licenses: 50,
    term: "Yearly",
    price: "₹ 816,000.00",
    badge: "CRM00001",
    assignedInitial: "A",
    assignedName: "Admin",
    added: "Added 05 Oct, 2026 02:57 PM",
  },
  {
    id: 42,
    quotationId: "TCCPLQ00042A",
    avatarColor: "teal",
    avatarLetter: "M",
    company: "MINISTRY OF RAILWAYS",
    contact: "Sushil",
    lead: 68,
    plan: "Microsoft 365 Apps for business",
    type: "New",
    licenses: 1,
    term: "Yearly",
    price: "₹ 8,764.80",
    badge: "CRM00002",
    assignedInitial: "D",
    assignedName: "Darshan Bane",
    added: "Added 05 Oct, 2026 12:28 PM",
  },
  {
    id: 39,
    quotationId: "TCCPLQ00039A",
    avatarColor: "red",
    avatarLetter: "M",
    company: "MALAD RESIDENCY",
    contact: "Kapil Maurya",
    lead: 55,
    plan: "Microsoft 365 Business Standard (no Teams)",
    type: "New",
    licenses: 1,
    term: "Yearly",
    price: "₹ 7,102.20",
    badge: "CRM00003",
    assignedInitial: "P",
    assignedName: "Pratik V",
    added: "Added 24 Sep, 2026 06:42 PM",
  },
  {
    id: 38,
    quotationId: "TCCPLQ00038A",
    avatarColor: "yellow",
    avatarLetter: "I",
    company: "IT TEAMWORK",
    contact: "Janvi Singh",
    lead: 53,
    plan: "Tizzy® Mail Corporate – 1 TB",
    type: "New",
    licenses: 1,
    term: "Yearly",
    price: "₹ 7,040.00",
    badge: "CRM00004",
    assignedInitial: "P",
    assignedName: "Pratik V",
    added: "Added 24 Sep, 2026 06:28 PM",
  },
  {
    id: 37,
    quotationId: "TCCPLQ00037A",
    avatarColor: "teal",
    avatarLetter: "W",
    company: "WNS GLOBAL SERVICES PRIVATE LIMITED",
    contact: "Pratik Vardekar",
    lead: 52,
    plan: "Microsoft 365 Apps for business",
    type: "New",
    licenses: 1,
    term: "Yearly",
    price: "₹ 8,266.80",
    badge: "CRM00005",
    assignedInitial: "P",
    assignedName: "Pratik V",
    added: "Added 24 Sep, 2026 06:26 PM",
  },
];

export default function CrmDeals() {
  return (
    <section className="content">
      <div className="page-header">
        <div className="">
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span> CRM Deals
            </p>
          </div>
          <h2>CRM Deals</h2>
        </div>
      </div>

      <section className="common-table-section crm-quo-list">
        <div className="common-table-card">
          <div className="common-table-header crm-quo-header">
            <div className="crm-quo-title">
              <p>
                Showing <strong>1 - 7</strong>
                from
                <strong>7</strong> approved deals
              </p>
            </div>
            <form method="GET" action="/crm/deals" className="table-search">
              <input
                type="text"
                name="search"
                defaultValue=""
                placeholder="Search company, quote, employee"
                autoComplete="off"
              />
              <SearchIcon />
            </form>
          </div>

          <table className="crm-quo-table">
            <thead>
              <tr className="table-head">
                <td className="order-id">Id</td>
                <td className="order-id">Contact Information</td>
                <td className="order-id">Plan</td>
                <td className="status-col">Status</td>
                <td className="status-col">Assigned To</td>
              </tr>
            </thead>
            <tbody className="table-body">
              {deals.map((deal) => (
                <tr className="crm-quo-row table-row" key={deal.id}>
                  <td className="order-id" data-label="Id">
                    <Link
                      href={`/crm/quotations/${deal.id}`}
                      className="quotation-id"
                    >
                      {deal.quotationId}
                    </Link>
                  </td>
                  <td className="customer" data-label="Contact">
                    <div className={`avatar ${deal.avatarColor}`}>
                      {deal.avatarLetter}
                    </div>
                    <div>
                      <h5>{deal.company}</h5>
                      <p>
                        {deal.contact}
                        {" · Lead #"}
                        {deal.lead}
                      </p>
                    </div>
                  </td>
                  <td className="plan-info" data-label="Plan">
                    <div className="plan-icon">
                      <img
                        src="https://img.icons8.com/color/48/microsoft.png"
                        alt="Plan"
                      />
                    </div>
                    <div>
                      <h5>{deal.plan}</h5>
                      <p className="plan-meta">
                        <span>{deal.type}</span>
                        <span>{deal.licenses} Licenses</span>
                        <span>{deal.term}</span>
                        <span>{deal.price}</span>
                      </p>
                    </div>
                  </td>
                  <td className="status-col" data-label="Status">
                    <span className="badge approved">{deal.badge}</span>
                  </td>
                  <td className="plan-action" data-label="Assigned To">
                    <div className={styles.assignedUser}>
                      <div className="user-info">
                        <div className={styles.avatarFlex}>
                          <div className="mini-avatar primary">
                            {deal.assignedInitial}
                          </div>
                          <h5>{deal.assignedName}</h5>
                        </div>
                        <small>{deal.added}</small>
                      </div>
                      <div className="actions">
                        <Link
                          href={`/crm/deals/${deal.id}/view`}
                          className="action-btn"
                          title="View order"
                        >
                          <EyeIcon />
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-pagination">
            <a href="#" className="page-btn">
              <ChevronLeftIcon />
            </a>

            <Link href="/crm/deals?page=1" className="page-btn active">
              1
            </Link>

            <a href="#" className="page-btn">
              <ChevronRightIcon />
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
