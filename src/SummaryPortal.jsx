import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Coins,
  Landmark,
  PiggyBank,
  RefreshCcw,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import PortalTour from './PortalTour.jsx';
import './SummaryPortal.css';

const householdStorageKey = 'budgethq-household-data-v2';
const kidsStorageKey = 'budgethq-kids-data-v2';

const emptyHouseholdData = {
  accounts: [],
  activity: [],
};

const emptyKidsData = {
  activity: [],
  allowance: null,
  balance: 0,
  quests: [],
};

const getSummaryTourSteps = (isKidView) => {
  if (isKidView) {
    return [
      {
        body: 'See money in, spent, saved, and available in one view.',
        eyebrow: '01 · See the full picture',
        icon: Coins,
        label: 'My money snapshot',
        outcome: 'The top overview turns several money activities into one calm place to check in.',
        pointer: 'Read money in, spent, saved, and available',
        preview: {
          balance: { detail: 'Money in and out', title: 'My money' },
          cards: [
            { detail: 'Allowance and earnings', title: 'Money in' },
            { detail: 'Purchases this month', title: 'Spent' },
            { detail: 'Still available', title: 'Available' },
          ],
          hero: { detail: 'Your current month at a glance', title: 'My snapshot' },
          meter: { detail: 'Saved in goals', title: 'Progress' },
          nav: 'BudgetHQ / My Summary',
        },
        title: 'Know where your money stands',
        visual: 'cashflow',
      },
      {
        body: 'Check available money and goal savings before your next choice.',
        eyebrow: '02 · Find available money',
        icon: PiggyBank,
        label: 'Balance and goals',
        outcome: 'A quick balance check helps you make your next choice with confidence.',
        pointer: 'Check available money before you spend',
        preview: {
          balance: { detail: 'Ready for your next choice', title: 'Available' },
          cards: [
            { detail: 'Money you can use', title: 'Current balance' },
            { detail: 'Money set aside', title: 'Saved in goals' },
            { detail: 'A goal worth tracking', title: 'Your progress' },
          ],
          hero: { detail: 'Balance with context', title: 'My balance' },
          meter: { detail: 'Keep goals moving', title: 'Savings' },
          nav: 'BudgetHQ / My Summary',
        },
        title: 'See what is available and what is saved',
        visual: 'accounts',
      },
      {
        body: 'Use the gauge to see how quickly your money is moving.',
        eyebrow: '03 · Check your pace',
        icon: TrendingUp,
        label: 'Spending gauge',
        outcome: 'A quick pace check can help you pause before the month gets away from you.',
        pointer: 'Notice how much of your money has been spent',
        preview: {
          balance: { detail: 'A simple pace signal', title: 'Spending gauge' },
          cards: [
            { detail: 'Money received', title: 'Money in' },
            { detail: 'Money used', title: 'Spent' },
            { detail: 'Room to choose', title: 'Available' },
          ],
          hero: { detail: 'Compare spent with money in', title: 'Your pace' },
          meter: { detail: 'Spent this month', title: 'Keep an eye on the bar' },
          nav: 'BudgetHQ / My Summary',
        },
        title: 'Use the gauge to check your pace',
        visual: 'spending',
      },
      {
        body: 'Compare money in and out to spot the difference.',
        eyebrow: '04 · Compare the month',
        icon: BarChart3,
        label: 'Money comparison',
        outcome: 'Charts make changes easier to spot than a list of numbers alone.',
        pointer: 'Compare money in with money out',
        preview: {
          balance: { detail: 'See the difference', title: 'Money comparison' },
          cards: [
            { detail: 'Allowance and earnings', title: 'Money in' },
            { detail: 'Purchases and spending', title: 'Spent' },
            { detail: 'A clearer month', title: 'Compare' },
          ],
          hero: { detail: 'A visual month check', title: 'My chart' },
          meter: { detail: 'Bar by bar', title: 'Compare simply' },
          nav: 'BudgetHQ / My Summary',
        },
        title: 'Let the chart show the difference',
        visual: 'comparison',
      },
      {
        body: 'Refresh after activity changes.',
        eyebrow: '05 · Keep it current',
        icon: RefreshCcw,
        label: 'Refresh the snapshot',
        outcome: 'A fresh summary keeps your next decision grounded in what is actually happening.',
        pointer: 'Refresh after your money changes',
        preview: {
          balance: { detail: 'Latest activity included', title: 'Updated' },
          cards: [
            { detail: 'New money in or out', title: 'Transactions' },
            { detail: 'Updated goal progress', title: 'Savings' },
            { detail: 'Ready for a check-in', title: 'Fresh snapshot' },
          ],
          hero: { detail: 'Your latest information', title: 'Refresh summary' },
          meter: { detail: 'Stay in sync', title: 'One small tap' },
          nav: 'BudgetHQ / My Summary',
        },
        title: 'Refresh when your money changes',
        visual: 'refresh',
      },
    ];
  }

  return [
    {
      body: 'See income, expenses, savings, and available money together.',
      eyebrow: '01 · See the full picture',
      icon: Landmark,
      label: 'Monthly cash flow',
      outcome: 'The overview gives you a shared starting point before you make a budget decision.',
      pointer: 'Read income, expenses, savings, and balance',
      preview: {
        balance: { detail: 'Income less expenses', title: 'Net balance' },
        cards: [
          { detail: 'Money received this month', title: 'Income' },
          { detail: 'Money spent this month', title: 'Expenses' },
          { detail: 'What remains available', title: 'Balance' },
        ],
        hero: { detail: 'Your current month at a glance', title: 'Household snapshot' },
        meter: { detail: 'Income vs expenses', title: 'Cash flow' },
        nav: 'BudgetHQ / Summary',
      },
      title: 'Start with the household snapshot',
      visual: 'cashflow',
    },
    {
      body: 'Check account totals and balance before the next expense.',
      eyebrow: '02 · Find available money',
      icon: Wallet,
      label: 'Accounts and balance',
      outcome: 'Available money is more useful when you can see it alongside the activity that shaped it.',
      pointer: 'Check the balance before making a decision',
      preview: {
        balance: { detail: 'Across your tracked accounts', title: 'Available now' },
        cards: [
          { detail: 'Current account totals', title: 'Accounts' },
          { detail: 'Money still available', title: 'Balance' },
          { detail: 'Savings set aside', title: 'Goals' },
        ],
        hero: { detail: 'A grounded view of your money', title: 'Where you stand' },
        meter: { detail: 'Account totals in context', title: 'Available money' },
        nav: 'BudgetHQ / Summary',
      },
      title: 'See what is available before you spend',
      visual: 'accounts',
    },
    {
      body: 'Use the gauge to catch spending drift early.',
      eyebrow: '03 · Check your pace',
      icon: TrendingUp,
      label: 'Spending gauge',
      outcome: 'The gauge turns a pile of transactions into a signal you can act on early.',
      pointer: 'Notice how much income expenses have used',
      preview: {
        balance: { detail: 'Expenses as a share of income', title: 'Spending pace' },
        cards: [
          { detail: 'Income received', title: 'Money in' },
          { detail: 'Expenses recorded', title: 'Money out' },
          { detail: 'Status for this month', title: 'Pace' },
        ],
        hero: { detail: 'A simple signal for the month', title: 'Spending gauge' },
        meter: { detail: 'Keep the pace visible', title: 'Expenses vs income' },
        nav: 'BudgetHQ / Summary',
      },
      title: 'Use the gauge to catch spending drift',
      visual: 'spending',
    },
    {
      body: 'Compare household and kids activity to spot patterns.',
      eyebrow: '04 · Compare the month',
      icon: BarChart3,
      label: 'Comparison chart',
      outcome: 'A visual comparison helps the household spot patterns worth discussing or adjusting.',
      pointer: 'Compare household and kids money activity',
      preview: {
        balance: { detail: 'One view, two lenses', title: 'Compare' },
        cards: [
          { detail: 'Household income and expenses', title: 'Household' },
          { detail: 'Kids money in and out', title: 'Kids' },
          { detail: 'A clearer conversation', title: 'Patterns' },
        ],
        hero: { detail: 'A visual month check', title: 'Money comparison' },
        meter: { detail: 'Switch the chart lens', title: 'Household · Kids' },
        nav: 'BudgetHQ / Summary',
      },
      title: 'Let the chart surface useful patterns',
      visual: 'comparison',
    },
    {
      body: 'Refresh after activity changes.',
      eyebrow: '05 · Keep it current',
      icon: RefreshCcw,
      label: 'Refresh the snapshot',
      outcome: 'A current summary makes every other number easier to trust and use.',
      pointer: 'Refresh after your budget changes',
      preview: {
        balance: { detail: 'Latest activity included', title: 'Up to date' },
        cards: [
          { detail: 'New income or expenses', title: 'Transactions' },
          { detail: 'Updated goal activity', title: 'Savings' },
          { detail: 'Ready for a check-in', title: 'Fresh summary' },
        ],
        hero: { detail: 'Your latest household information', title: 'Refresh summary' },
        meter: { detail: 'Stay in sync', title: 'One small tap' },
        nav: 'BudgetHQ / Summary',
      },
      title: 'Refresh when the household changes',
      visual: 'refresh',
    },
  ];
};

function asFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function readStoredData(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(key));
    return parsedValue && typeof parsedValue === 'object'
      ? { ...fallback, ...parsedValue }
      : fallback;
  } catch {
    return fallback;
  }
}

function isEntryInMonth(entry, referenceDate) {
  const rawDate = entry?.transactionDate ?? entry?.createdAt ?? entry?.date;

  if (!rawDate || /today|just now/i.test(String(rawDate))) {
    return true;
  }

  const isoMatch = String(rawDate).match(/^(\d{4})-(\d{2})/);
  if (isoMatch) {
    return (
      Number(isoMatch[1]) === referenceDate.getFullYear() &&
      Number(isoMatch[2]) === referenceDate.getMonth() + 1
    );
  }

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return true;
  }

  return (
    parsedDate.getFullYear() === referenceDate.getFullYear() &&
    parsedDate.getMonth() === referenceDate.getMonth()
  );
}

function isKidsSavingsTransfer(entry) {
  return /^(moved to|moved back from|chore store saved for)/i.test(
    String(entry?.label ?? ''),
  );
}

function percentageOf(part, whole) {
  if (whole <= 0) {
    return 0;
  }

  return Math.round((part / whole) * 100);
}

function calculateSummaryMetrics(
  householdData = emptyHouseholdData,
  kidsData = emptyKidsData,
  referenceDate = new Date(),
) {
  const householdActivity = Array.isArray(householdData.activity)
    ? householdData.activity.filter((entry) =>
        isEntryInMonth(entry, referenceDate),
      )
    : [];
  const householdIncome = householdActivity.reduce(
    (total, entry) =>
      asFiniteNumber(entry.amount) > 0
        ? total + asFiniteNumber(entry.amount)
        : total,
    0,
  );
  const householdExpenses = householdActivity.reduce(
    (total, entry) =>
      asFiniteNumber(entry.amount) < 0
        ? total + Math.abs(asFiniteNumber(entry.amount))
        : total,
    0,
  );
  const accountBalance = Array.isArray(householdData.accounts)
    ? householdData.accounts.reduce(
        (total, account) => total + asFiniteNumber(account.balance),
        0,
      )
    : 0;
  const kidsActivity = Array.isArray(kidsData.activity)
    ? kidsData.activity
    : [];
  const kidsIncome = kidsActivity.reduce((total, entry) => {
    if (entry.type !== 'in' || isKidsSavingsTransfer(entry)) {
      return total;
    }

    return total + Math.max(0, asFiniteNumber(entry.amount));
  }, 0);
  const kidsExpenses = kidsActivity.reduce((total, entry) => {
    if (entry.type !== 'out' || isKidsSavingsTransfer(entry)) {
      return total;
    }

    return total + Math.max(0, asFiniteNumber(entry.amount));
  }, 0);
  const kidsAllowance = Math.max(0, asFiniteNumber(kidsData.allowance?.amount));
  const kidsIncomeBase = kidsIncome > 0 ? kidsIncome : kidsAllowance;
  const kidsSaved = Array.isArray(kidsData.quests)
    ? kidsData.quests.reduce(
        (total, quest) => total + Math.max(0, asFiniteNumber(quest.saved)),
        0,
      )
    : 0;

  return {
    accountBalance,
    accountCount: Array.isArray(householdData.accounts)
      ? householdData.accounts.length
      : 0,
    householdExpenses,
    householdIncome,
    householdSpentPercentage: percentageOf(householdExpenses, householdIncome),
    monthlyBalance: householdIncome - householdExpenses,
    kidsAllowance,
    kidsBalance: asFiniteNumber(kidsData.balance),
    kidsExpenses,
    kidsIncome,
    kidsSaved,
    kidsSpentPercentage: percentageOf(kidsExpenses, kidsIncomeBase),
  };
}

function getSpendingStatus(percentage, hasIncome) {
  if (!hasIncome) {
    return {
      detail: 'Add income to start measuring this month.',
      label: 'Waiting for income',
      tone: 'neutral',
    };
  }

  if (percentage > 100) {
    return {
      detail: 'Spending is above the income recorded for this period.',
      label: 'Over income',
      tone: 'danger',
    };
  }

  if (percentage >= 85) {
    return {
      detail: 'Most recorded income has been used.',
      label: 'Near limit',
      tone: 'warning',
    };
  }

  return {
    detail: 'Spending is within the income recorded for this period.',
    label: 'Within income',
    tone: 'positive',
  };
}

function MoneyRow({ label, value, formatMoney }) {
  return (
    <div className="summary-money-row">
      <span>{label}</span>
      <strong>{formatMoney(value)}</strong>
    </div>
  );
}

function SpendingGauge({ detail, label, percentage, tone }) {
  const visualPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="summary-gauge" data-tone={tone}>
      <div className="summary-gauge-heading">
        <div>
          <span>{label}</span>
          <small>{detail}</small>
        </div>
        <strong>{percentage}%</strong>
      </div>
      <div
        aria-label={`${percentage}% spent`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={Math.min(100, percentage)}
        className="summary-gauge-track"
        role="progressbar"
      >
        <span style={{ width: `${visualPercentage}%` }} />
      </div>
    </div>
  );
}

function ComparisonChart({ data, formatMoney, title }) {
  const highestValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div
      aria-label={`${title}. ${data
        .map((item) => `${item.label}: ${formatMoney(item.value)}`)
        .join('. ')}`}
      className="summary-chart"
      role="img"
    >
      <div className="summary-chart-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="summary-chart-bars" aria-hidden="true">
        {data.map((item) => {
          const height = item.value > 0 ? (item.value / highestValue) * 100 : 0;

          return (
            <div className="summary-chart-column" key={item.label}>
              <strong>{formatMoney(item.value)}</strong>
              <div className="summary-chart-lane">
                <span
                  className={`summary-chart-bar summary-chart-bar-${item.tone}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SummaryPortal({
  audience = 'adult',
  currency = 'USD',
  onBack,
}) {
  const isKidView = audience === 'kid';
  const [summaryData, setSummaryData] = useState(() => ({
    household: readStoredData(householdStorageKey, emptyHouseholdData),
    kids: readStoredData(kidsStorageKey, emptyKidsData),
  }));
  const [chartMode, setChartMode] = useState(isKidView ? 'kids' : 'household');
  const [showTour, setShowTour] = useState(false);
  const referenceDate = useMemo(() => new Date(), []);
  const metrics = useMemo(
    () =>
      calculateSummaryMetrics(
        summaryData.household,
        summaryData.kids,
        referenceDate,
      ),
    [referenceDate, summaryData],
  );

  const refreshSummary = () => {
    setSummaryData({
      household: readStoredData(householdStorageKey, emptyHouseholdData),
      kids: readStoredData(kidsStorageKey, emptyKidsData),
    });
  };

  useEffect(() => {
    const syncStoredData = (event) => {
      if (
        !event ||
        event.key === householdStorageKey ||
        event.key === kidsStorageKey
      ) {
        refreshSummary();
      }
    };

    window.addEventListener('focus', syncStoredData);
    window.addEventListener('storage', syncStoredData);

    return () => {
      window.removeEventListener('focus', syncStoredData);
      window.removeEventListener('storage', syncStoredData);
    };
  }, []);

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-US', {
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    }).format(amount);
  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(referenceDate);
  const householdStatus = getSpendingStatus(
    metrics.householdSpentPercentage,
    metrics.householdIncome > 0,
  );
  const kidsSpendBase = metrics.kidsIncome || metrics.kidsAllowance;
  const kidsStatus = getSpendingStatus(
    metrics.kidsSpentPercentage,
    kidsSpendBase > 0,
  );
  const kidsQuests = Array.isArray(summaryData.kids.quests)
    ? summaryData.kids.quests
    : [];
  const completedKidsQuests = kidsQuests.filter(
    (quest) =>
      asFiniteNumber(quest.target) > 0 &&
      asFiniteNumber(quest.saved) >= asFiniteNumber(quest.target),
  ).length;
  const showingKidsChart = isKidView || chartMode === 'kids';
  const chartData = showingKidsChart
    ? [
        {
          label: 'Money in',
          tone: 'income',
          value: metrics.kidsIncome,
        },
        {
          label: 'Spent',
          tone: 'expense',
          value: metrics.kidsExpenses,
        },
      ]
    : [
        {
          label: 'Income',
          tone: 'income',
          value: metrics.householdIncome,
        },
        {
          label: 'Expenses',
          tone: 'expense',
          value: metrics.householdExpenses,
        },
      ];

  return (
    <main
      className={`summary-shell ${isKidView ? 'summary-shell-kid' : 'summary-shell-adult'}`}
    >
      <nav className="summary-nav" aria-label="Summary portal navigation">
        <button className="summary-back-button" onClick={onBack} type="button">
          <ArrowLeft size={18} aria-hidden="true" />
          Switch Portal
        </button>
        {React.createElement(
          'span',
          { className: 'summary-brand' },
          isKidView ? 'BudgetHQ Kids Summary' : 'BudgetHQ Summary',
        )}
        <div className="summary-nav-actions">
          <button
            aria-label="Open Summary tutorial"
            className="summary-tour-button"
            onClick={() => setShowTour(true)}
            title="Open Summary tutorial"
            type="button"
          >
            <BookOpen size={17} aria-hidden="true" />
            Tour
          </button>
          <button
            aria-label="Refresh summary"
            className="summary-refresh-button"
            onClick={refreshSummary}
            title="Refresh summary"
            type="button"
          >
            <RefreshCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div className="summary-page">
        <header className="summary-header">
          <div>
            <p>{isKidView ? 'My money snapshot' : 'Household snapshot'}</p>
            <h1>{isKidView ? 'My Summary' : 'Summary'}</h1>
            <span>
              {isKidView
                ? 'See the money you received, spent, saved, and still have available.'
                : 'Income, expenses, and kid money habits together in one view.'}
            </span>
          </div>
          <time
            dateTime={`${referenceDate.getFullYear()}-${String(
              referenceDate.getMonth() + 1,
            ).padStart(2, '0')}`}
          >
            {monthLabel}
          </time>
        </header>

        {isKidView ? (
          <section
            className="summary-top-grid summary-kid-overview-grid"
            aria-label="My money overview"
          >
            <article className="summary-ledger-panel">
              <div className="summary-section-heading summary-section-heading-teal">
                <Coins size={20} aria-hidden="true" />
                <div>
                  <p>My money this month</p>
                  <h2>Money in and out</h2>
                </div>
              </div>
              <div className="summary-money-list">
                <MoneyRow
                  formatMoney={formatMoney}
                  label="Money received"
                  value={metrics.kidsIncome}
                />
                <MoneyRow
                  formatMoney={formatMoney}
                  label="Money spent"
                  value={metrics.kidsExpenses}
                />
              </div>
              <div className="summary-balance-row">
                <span>Money available</span>
                <strong>{formatMoney(metrics.kidsBalance)}</strong>
              </div>
            </article>

            <aside className="summary-account-panel summary-kid-balance-panel">
              <span className="summary-panel-icon" aria-hidden="true">
                <Wallet size={24} />
              </span>
              <p>My available money</p>
              <strong>{formatMoney(metrics.kidsBalance)}</strong>
              <span>{formatMoney(metrics.kidsSaved)} saved toward goals</span>
              {metrics.kidsIncome === 0 && metrics.kidsBalance === 0 ? (
                <small>Add money in Kids to start your summary.</small>
              ) : null}
            </aside>
          </section>
        ) : (
          <section className="summary-top-grid" aria-label="Monthly overview">
            <article className="summary-ledger-panel">
              <div className="summary-section-heading summary-section-heading-teal">
                <Landmark size={20} aria-hidden="true" />
                <div>
                  <p>Monthly cash flow</p>
                  <h2>Household summary</h2>
                </div>
              </div>
              <div className="summary-money-list">
                <MoneyRow
                  formatMoney={formatMoney}
                  label="Total monthly income"
                  value={metrics.householdIncome}
                />
                <MoneyRow
                  formatMoney={formatMoney}
                  label="Total monthly expenses"
                  value={metrics.householdExpenses}
                />
              </div>
              <div className="summary-balance-row">
                <span>Monthly balance</span>
                <strong>{formatMoney(metrics.monthlyBalance)}</strong>
              </div>
            </article>

            <aside className="summary-account-panel">
              <span className="summary-panel-icon" aria-hidden="true">
                <Wallet size={24} />
              </span>
              <p>Available across accounts</p>
              <strong>{formatMoney(metrics.accountBalance)}</strong>
              <span>
                {metrics.accountCount === 1
                  ? '1 connected account'
                  : `${metrics.accountCount} connected accounts`}
              </span>
              {metrics.accountCount === 0 ? (
                <small>
                  Add an account in Main to see available cash here.
                </small>
              ) : null}
            </aside>
          </section>
        )}

        {isKidView ? (
          <section className="summary-insights-grid summary-kid-focus-grid">
            <article className="summary-percentage-panel">
              <div className="summary-section-heading">
                <TrendingUp size={20} aria-hidden="true" />
                <div>
                  <p>Percentage of income / allowance spent</p>
                  <h2>My spending</h2>
                </div>
              </div>
              <SpendingGauge
                detail={kidsStatus.detail}
                label={kidsStatus.label}
                percentage={metrics.kidsSpentPercentage}
                tone={kidsStatus.tone}
              />
            </article>

            <article className="summary-kid-goals-panel">
              <div className="summary-section-heading">
                <PiggyBank size={20} aria-hidden="true" />
                <div>
                  <p>Allowance and savings</p>
                  <h2>My goals</h2>
                </div>
              </div>
              <div className="summary-kid-goal-stats">
                <div>
                  <span>Allowance plan</span>
                  <strong>{formatMoney(metrics.kidsAllowance)}</strong>
                </div>
                <div>
                  <span>Saved in goals</span>
                  <strong>{formatMoney(metrics.kidsSaved)}</strong>
                </div>
                <div>
                  <span>Goals reached</span>
                  <strong>
                    {completedKidsQuests} / {kidsQuests.length}
                  </strong>
                </div>
              </div>
              {kidsQuests.length === 0 ? (
                <p className="summary-kid-empty">
                  Create a savings goal in Kids to see progress here.
                </p>
              ) : null}
            </article>
          </section>
        ) : (
          <section className="summary-insights-grid">
            <article className="summary-percentage-panel">
              <div className="summary-section-heading">
                <TrendingUp size={20} aria-hidden="true" />
                <div>
                  <p>Percentage of income spent</p>
                  <h2>Household spending</h2>
                </div>
              </div>
              <SpendingGauge
                detail={householdStatus.detail}
                label={householdStatus.label}
                percentage={metrics.householdSpentPercentage}
                tone={householdStatus.tone}
              />
            </article>

            <article className="summary-kids-panel">
              <div className="summary-section-heading">
                <Coins size={20} aria-hidden="true" />
                <div>
                  <p>Allowance and money habits</p>
                  <h2>Kids summary</h2>
                </div>
              </div>
              <div className="summary-kids-stats">
                <div>
                  <span>Money in</span>
                  <strong>{formatMoney(metrics.kidsIncome)}</strong>
                </div>
                <div>
                  <span>Spent</span>
                  <strong>{formatMoney(metrics.kidsExpenses)}</strong>
                </div>
                <div>
                  <span>Available</span>
                  <strong>{formatMoney(metrics.kidsBalance)}</strong>
                </div>
                <div>
                  <span>Saved in goals</span>
                  <strong>{formatMoney(metrics.kidsSaved)}</strong>
                </div>
              </div>
              <div className="summary-kids-allowance">
                <PiggyBank size={18} aria-hidden="true" />
                <span>Allowance plan</span>
                <strong>{formatMoney(metrics.kidsAllowance)}</strong>
              </div>
              <SpendingGauge
                detail={kidsStatus.detail}
                label={`Kid income spent · ${kidsStatus.label}`}
                percentage={metrics.kidsSpentPercentage}
                tone={kidsStatus.tone}
              />
            </article>
          </section>
        )}

        <section
          className="summary-chart-panel"
          aria-labelledby="summary-chart-title"
        >
          <div className="summary-chart-header">
            <div>
              <p>{isKidView ? 'My money in and out' : 'Income and expenses'}</p>
              <h2 id="summary-chart-title">
                {isKidView ? 'My money comparison' : 'Money comparison'}
              </h2>
            </div>
            {!isKidView ? (
              <div
                aria-label="Chart view"
                className="summary-chart-toggle"
                role="group"
              >
                <button
                  aria-pressed={chartMode === 'household'}
                  className={chartMode === 'household' ? 'is-active' : ''}
                  onClick={() => setChartMode('household')}
                  type="button"
                >
                  Household
                </button>
                <button
                  aria-pressed={chartMode === 'kids'}
                  className={chartMode === 'kids' ? 'is-active' : ''}
                  onClick={() => setChartMode('kids')}
                  type="button"
                >
                  Kids
                </button>
              </div>
            ) : null}
          </div>
          <ComparisonChart
            data={chartData}
            formatMoney={formatMoney}
            title={`${showingKidsChart ? 'Kids' : 'Household'} money comparison`}
          />
        </section>
      </div>
      {showTour ? (
        <PortalTour
          onClose={() => setShowTour(false)}
          steps={getSummaryTourSteps(isKidView)}
          theme="summary"
          workspaceName={isKidView ? 'Kids Summary' : 'Household Summary'}
        />
      ) : null}
    </main>
  );
}

export { calculateSummaryMetrics, isEntryInMonth };
