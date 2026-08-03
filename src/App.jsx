import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CalendarClock,
  Check,
  Coins,
  HeartPulse,
  Flame,
  Landmark,
  PauseCircle,
  PiggyBank,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  Shuffle,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import KidsPortal from './KidsPortal.jsx';

const workspaces = [
  {
    id: 'main',
    icon: ShieldCheck,
    label: 'MAIN',
    kicker: 'Household Command',
    subtitle: 'Household budgets, bills, groceries & Safe-to-Spend pacing.',
  },
  {
    id: 'kids',
    icon: Coins,
    label: 'KIDS',
    kicker: 'Youth Savings',
    subtitle: 'Personal savings tracker, goals & allowance log.',
  },
];

const currencyOptions = ['USD', 'EUR', 'GBP', 'CNY'];
const accountTypes = ['Checking', 'Savings', 'Credit Card', 'Loan', 'Investment', 'Cash'];
const transactionCategories = [
  'Income',
  'Food',
  'Bills',
  'Transport',
  'Shopping',
  'Savings',
  'Debt',
  'Kids',
  'Other',
];
const categoryColors = {
  Bills: '#4f46e5',
  Debt: '#ef4444',
  Food: '#0f766e',
  Income: '#10b981',
  Kids: '#db2777',
  Other: '#64748b',
  Savings: '#06b6d4',
  Shopping: '#f59e0b',
  Transport: '#8b5cf6',
};
const permissionProfiles = [
  { id: 'admin', label: 'Admin', detail: 'Can approve proposals, apply autopilot, and manage money.' },
  { id: 'collaborator', label: 'Collaborator', detail: 'Can vote, comment, and suggest changes.' },
  { id: 'viewer', label: 'Viewer', detail: 'Can view the shared plan without changing money.' },
];

const startingHouseholdData = {
  accounts: [],
  remainingDays: 0,
  monthBudgetRemaining: 0,
  spentToday: 0,
  bills: [],
  goals: [],
  categories: [],
  activity: [],
  forecast: [],
  pressureWeeks: [],
  proposals: [],
  purchasePause: null,
  tradeoffs: [],
  roles: [],
  notifications: [],
  emotionalInsight: null,
  subscriptions: [],
  autopilot: [],
  lifeModes: [
    { id: 'normal', label: 'Normal', headline: 'Balanced household rhythm' },
    { id: 'moving', label: 'Moving', headline: 'Deposits, movers, and setup costs prioritized' },
    { id: 'baby', label: 'New Baby', headline: 'Medical, supplies, and leave planning surfaced' },
    { id: 'debt', label: 'Debt Sprint', headline: 'Extra cash routes toward payoff momentum' },
  ],
  changes: [],
};

const sampleHouseholdData = {
  ...startingHouseholdData,
  accounts: [
    { balance: 3280.45, id: 'sample-checking', label: 'Household Checking', type: 'Checking' },
    { balance: 6850, id: 'sample-savings', label: 'Emergency Savings', type: 'Savings' },
    { balance: -1240.32, id: 'sample-card', label: 'Family Rewards Card', type: 'Credit Card' },
  ],
  remainingDays: 18,
  monthBudgetRemaining: 2150,
  spentToday: 84.75,
  bills: [
    { amount: 1420, due: 'Aug 5', hoursAway: 24, id: 'sample-rent', name: 'Rent' },
    { amount: 168.4, due: 'Aug 8', hoursAway: 96, id: 'sample-electric', name: 'Electric' },
    { amount: 92, due: 'Aug 12', hoursAway: 168, id: 'sample-internet', name: 'Internet' },
  ],
  goals: [
    {
      contributors: [{ amount: 300, name: 'You' }],
      id: 'sample-emergency',
      name: 'Emergency Fund',
      saved: 6850,
      target: 10000,
    },
    {
      contributors: [{ amount: 150, name: 'You' }],
      id: 'sample-vacation',
      name: 'Fall Trip',
      saved: 1180,
      target: 2400,
    },
  ],
  categories: [
    { amount: 640.8, color: categoryColors.Food, id: 'sample-food', name: 'Food' },
    { amount: 318.2, color: categoryColors.Transport, id: 'sample-transport', name: 'Transport' },
    { amount: 214.9, color: categoryColors.Kids, id: 'sample-kids', name: 'Kids' },
    { amount: 189.4, color: categoryColors.Shopping, id: 'sample-shopping', name: 'Shopping' },
  ],
  activity: [
    {
      accountId: 'sample-checking',
      amount: -84.75,
      category: 'Food',
      date: 'Today',
      id: 'sample-grocery',
      merchant: 'Neighborhood Grocery',
      notes: 'Weekly groceries',
      transactionDate: '2026-08-02',
      type: 'expense',
    },
    {
      accountId: 'sample-checking',
      amount: 3200,
      category: 'Income',
      date: 'Aug 1',
      id: 'sample-payroll',
      merchant: 'Payroll Deposit',
      notes: 'Monthly income',
      transactionDate: '2026-08-01',
      type: 'income',
    },
    {
      accountId: 'sample-card',
      amount: -46.2,
      category: 'Transport',
      date: 'Jul 31',
      id: 'sample-fuel',
      merchant: 'Fuel Stop',
      notes: '',
      transactionDate: '2026-07-31',
      type: 'expense',
    },
  ],
  forecast: [
    { id: 'sample-forecast-7', label: '7 days', note: 'Rent week leaves a smaller daily lane.', safeSpend: 119.44 },
    { id: 'sample-forecast-14', label: '14 days', note: 'Cushion stays intact if food spending holds.', safeSpend: 107.5 },
    { id: 'sample-forecast-30', label: '30 days', note: 'Goal transfers remain possible at this pace.', safeSpend: 95.55 },
  ],
  pressureWeeks: [
    { bills: 2, id: 'sample-pressure-this-week', label: 'This week', level: 'high', total: 1588.4 },
    { bills: 1, id: 'sample-pressure-next-week', label: 'Next week', level: 'medium', total: 92 },
  ],
  proposals: [
    {
      change: 'Move $150 from dining out to the Fall Trip goal.',
      id: 'sample-vacation-shift',
      impact: 'Keeps the trip on track without changing bills.',
      title: 'Vacation boost',
    },
  ],
  purchasePause: {
    amount: 420,
    holdHours: 48,
    item: 'New tablet',
    reason: 'Wait until rent clears before deciding.',
  },
  tradeoffs: [
    { amount: 50, id: 'sample-emergency', label: 'Emergency', outcome: '$50 increases emergency coverage.' },
    { amount: 50, id: 'sample-vacation', label: 'Trip', outcome: '$50 gets the Fall Trip closer.' },
    { amount: 50, id: 'sample-card', label: 'Card', outcome: '$50 lowers credit card balance.' },
  ],
  roles: [
    { access: 'Can see all household cards and approve proposals.', id: 'sample-adult', label: 'Adult' },
    { access: 'Can see goals, chores, and kid-safe activity only.', id: 'sample-kid', label: 'Kid' },
    { access: 'Can review bills and shared decisions.', id: 'sample-partner', label: 'Partner' },
  ],
  emotionalInsight: {
    nudge: 'Plan a snack run before errands to keep impulse spending low.',
    pattern: 'Food spending spikes on long errand days.',
    trigger: 'Grocery and fuel runs',
  },
  subscriptions: [
    { amount: 15.99, id: 'sample-streaming', name: 'StreamBox', status: 'Keep', useScore: 84 },
    { amount: 9.99, id: 'sample-app', name: 'Photo Cloud', status: 'Review', useScore: 48 },
  ],
  autopilot: [
    { action: 'Move to emergency fund', amount: 100, id: 'sample-auto-emergency', timing: 'After rent clears' },
    { action: 'Pay extra to card', amount: 75, id: 'sample-auto-card', timing: 'If weekly food stays under plan' },
  ],
  changes: [
    'Sample household loaded with accounts, bills, goals, and activity.',
    'Rent week marked as high pressure.',
    'Food spending is on today\'s watch list.',
  ],
};

const tourContent = {
  main: [
    {
      title: 'Start With The Household Pulse',
      body: 'The top of Main shows your available cash, spending mood, and what changed so you can decide what needs attention first.',
      pointer: 'Balance and mood live at the top',
      visual: 'pulse',
    },
    {
      title: 'Use Safe-To-Spend',
      body: 'The pace card turns the remaining monthly budget into a daily number, then compares it with what has already been spent today.',
      pointer: 'Watch the daily pace meter',
      visual: 'pace',
    },
    {
      title: 'Plan Around Pressure',
      body: 'Bills, forecasts, subscriptions, and tradeoffs help the household see upcoming stress before it becomes a surprise.',
      pointer: 'Cards stay grouped by job',
      visual: 'cards',
    },
  ],
  kids: [
    {
      title: 'Meet The Money Box',
      body: 'Kids start with a simple ready-to-use balance so the app feels clear before introducing goals or chores.',
      pointer: 'The big balance is the first stop',
      visual: 'money-box',
    },
    {
      title: 'Save Toward Quests',
      body: 'Each quest shows how close the child is to something they want, and the Add or Take buttons teach tradeoffs in small steps.',
      pointer: 'Quest cards show progress and choices',
      visual: 'quests',
    },
    {
      title: 'Earn And Learn',
      body: 'Allowance, chores, and activity make money movement visible so saving feels concrete instead of mysterious.',
      pointer: 'Rewards and history sit together',
      visual: 'chores',
    },
  ],
};

function createId(label) {
  const slug = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'item';
  return `${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ensureItemId(item, labelKey = 'name') {
  if (!item || typeof item !== 'object') {
    return item;
  }

  if (item.id) {
    return item;
  }

  const label = String(item[labelKey] ?? item.name ?? item.label ?? item.title ?? item.action ?? 'item');
  return { ...item, id: createId(label) };
}

function normalizeCategory(item) {
  const category = ensureItemId(item, 'name');
  const name = category.name ?? 'Other';

  return {
    amount: 0,
    budget: 0,
    color: categoryColors[name] ?? categoryColors.Other,
    group: 'Everyday',
    rollover: 0,
    ...category,
  };
}

function normalizeHouseholdData(data, fallback) {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  return {
    ...fallback,
    ...data,
    accounts: Array.isArray(data.accounts) ? data.accounts.map((item) => ensureItemId(item, 'label')) : fallback.accounts,
    activity: Array.isArray(data.activity) ? data.activity.map((item) => ensureItemId(item, 'merchant')) : fallback.activity,
    autopilot: Array.isArray(data.autopilot) ? data.autopilot.map((item) => ensureItemId(item, 'action')) : fallback.autopilot,
    bills: Array.isArray(data.bills) ? data.bills.map((item) => ensureItemId(item, 'name')) : fallback.bills,
    categories: Array.isArray(data.categories) ? data.categories.map((item) => normalizeCategory(item)) : fallback.categories,
    forecast: Array.isArray(data.forecast) ? data.forecast.map((item) => ensureItemId(item, 'label')) : fallback.forecast,
    goals: Array.isArray(data.goals) ? data.goals.map((item) => ensureItemId(item, 'name')) : fallback.goals,
    pressureWeeks: Array.isArray(data.pressureWeeks)
      ? data.pressureWeeks.map((item) => ensureItemId(item, 'label'))
      : fallback.pressureWeeks,
    proposals: Array.isArray(data.proposals) ? data.proposals.map((item) => ensureItemId(item, 'title')) : fallback.proposals,
    roles: Array.isArray(data.roles) ? data.roles.map((item) => ensureItemId(item, 'label')) : fallback.roles,
    notifications: Array.isArray(data.notifications)
      ? data.notifications.map((item) => ensureItemId(item, 'message'))
      : fallback.notifications,
    subscriptions: Array.isArray(data.subscriptions)
      ? data.subscriptions.map((item) => ensureItemId(item, 'name'))
      : fallback.subscriptions,
    tradeoffs: Array.isArray(data.tradeoffs) ? data.tradeoffs.map((item) => ensureItemId(item, 'label')) : fallback.tradeoffs,
  };
}

function readStoredState(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : fallback;

    if (key.startsWith('budgethq-household-data')) {
      return normalizeHouseholdData(parsedValue, fallback);
    }

    return parsedValue;
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStoredState(key, fallback));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function shouldShowFirstTour(workspaceId) {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(`budgethq-${workspaceId}-tour-seen`) !== 'true';
}

function markTourSeen(workspaceId) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`budgethq-${workspaceId}-tour-seen`, 'true');
  }
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function downloadTextFile(filename, text, type = 'application/json') {
  if (typeof window === 'undefined') {
    return;
  }

  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

function escapeCsvCell(value) {
  const text = String(value ?? '');

  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function createActivityCsv(activity) {
  const rows = [
    ['date', 'merchant', 'category', 'type', 'amount', 'accountId', 'notes'],
    ...activity.map((entry) => [
      entry.transactionDate || entry.date || '',
      entry.merchant || '',
      entry.category || '',
      entry.type || '',
      entry.amount ?? 0,
      entry.accountId || '',
      entry.notes || '',
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
}

function createActivityEntry(entry) {
  const amount = Number(entry.amount) || 0;

  return {
    accountId: entry.accountId ?? null,
    category: entry.category ?? (amount >= 0 ? 'Income' : 'Other'),
    notes: entry.notes ?? '',
    transactionDate: entry.transactionDate || new Date().toISOString().slice(0, 10),
    type: entry.type ?? (amount >= 0 ? 'income' : 'expense'),
    ...entry,
    amount,
    date: 'Just now',
    id: `${entry.merchant}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
}

function getCategoryTotals(activity) {
  return activity
    .filter((entry) => entry.amount < 0)
    .reduce((totals, entry) => {
      const name = entry.category || 'Other';
      const existing = totals.find((category) => category.name === name);

      if (existing) {
        existing.amount += Math.abs(entry.amount);
        return totals;
      }

      return [
        ...totals,
        {
          amount: Math.abs(entry.amount),
          color: categoryColors[name] ?? categoryColors.Other,
          id: createId(name),
          name,
        },
      ];
    }, []);
}

function addActivityToData(current, entry, currency) {
  const activityEntry = createActivityEntry(entry);
  const action = activityEntry.amount >= 0 ? 'added' : 'logged';

  return {
    ...current,
    activity: [activityEntry, ...current.activity].slice(0, 8),
    changes: [
      `${entry.merchant} ${action} ${formatMoney(Math.abs(activityEntry.amount), currency)}.`,
      ...current.changes,
    ].slice(0, 4),
  };
}

function addNotificationToData(current, message, actor = 'BudgetHQ') {
  return {
    ...current,
    notifications: [
      {
        actor,
        id: createId(message),
        message,
        time: 'Just now',
      },
      ...(current.notifications ?? []),
    ].slice(0, 6),
  };
}

function getCashflowInsights({ activity, bills, dailyLimit, goals, remainingDays, subscriptions, totalBalance }) {
  const incomeTotal = activity
    .filter((entry) => entry.amount > 0 || entry.type === 'income')
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  const spendingTotal = activity
    .filter((entry) => entry.amount < 0)
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  const billTotal = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const subscriptionTotal = subscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
  const upcomingBillTotal = bills
    .filter((bill) => bill.hoursAway <= 72)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const dailyReserve = dailyLimit > 0 ? dailyLimit * Math.min(Math.max(remainingDays, 1), 7) : spendingTotal * 0.2;
  const requiredReserve = billTotal + subscriptionTotal + dailyReserve;
  const surplus = Math.max(totalBalance - requiredReserve, 0);
  const firstOpenGoal = goals.find((goal) => goal.saved < goal.target);
  const recommendations = [];

  if (upcomingBillTotal > 0 && totalBalance >= upcomingBillTotal) {
    recommendations.push({
      action: 'Reserve upcoming bills',
      amount: upcomingBillTotal,
      id: 'auto-reserve-bills',
      reason: `${bills.filter((bill) => bill.hoursAway <= 72).length} bill reminders are close.`,
      source: 'calculated',
      timing: 'Before the next due date',
    });
  }

  if (firstOpenGoal && surplus > 0) {
    recommendations.push({
      action: `Move extra cash to ${firstOpenGoal.name}`,
      amount: Math.min(75, surplus, firstOpenGoal.target - firstOpenGoal.saved),
      id: `auto-goal-${firstOpenGoal.id}`,
      reason: 'Balance is above bills, subscriptions, and the near-term daily reserve.',
      source: 'calculated',
      timing: 'Available now',
    });
  }

  if (subscriptionTotal > 0 && spendingTotal > incomeTotal * 0.55) {
    recommendations.push({
      action: 'Review recurring subscriptions',
      amount: subscriptionTotal,
      id: 'auto-review-subscriptions',
      reason: 'Recent spending is high compared with logged income.',
      source: 'calculated',
      timing: 'This week',
    });
  }

  if (recommendations.length === 0 && totalBalance > 0) {
    recommendations.push({
      action: 'Hold cash buffer',
      amount: Math.min(totalBalance, Math.max(dailyLimit, 25)),
      id: 'auto-hold-buffer',
      reason: 'BudgetHQ is preserving flexibility until more income, bill, or goal data exists.',
      source: 'calculated',
      timing: 'Keep available',
    });
  }

  return {
    billTotal,
    incomeTotal,
    recommendations,
    requiredReserve,
    spendingTotal,
    subscriptionTotal,
    surplus,
  };
}

function getCalculatedForecast({ bills, dailyLimit, remainingDays, subscriptions, totalBalance }) {
  if (remainingDays <= 0 && totalBalance <= 0 && bills.length === 0 && subscriptions.length === 0) {
    return [];
  }

  const subscriptionTotal = subscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
  const billTotal = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const spendReserve = dailyLimit * Math.max(remainingDays, 0);
  const projectedEnd = totalBalance - billTotal - subscriptionTotal - spendReserve;

  return [
    {
      id: 'forecast-bills-subscriptions',
      label: 'Bills + subs',
      safeSpend: billTotal + subscriptionTotal,
      note: 'Calculated from current bill reminders and monthly subscriptions.',
    },
    {
      id: 'forecast-daily-reserve',
      label: 'Daily reserve',
      safeSpend: spendReserve,
      note: 'Calculated from the current Safe-to-Spend pace and days left.',
    },
    {
      id: 'forecast-month-end',
      label: 'Projected cushion',
      safeSpend: projectedEnd,
      note: projectedEnd >= 0 ? 'Cash left after planned spending.' : 'Potential shortfall after planned spending.',
    },
  ];
}

function getEmotionalInsight(activity) {
  const spending = activity.filter((entry) => entry.amount < 0);

  if (spending.length < 3) {
    return null;
  }

  const totals = getCategoryTotals(spending);
  const topCategory = totals.sort((a, b) => b.amount - a.amount)[0];

  if (!topCategory) {
    return null;
  }

  return {
    nudge: `Try one pause before the next ${topCategory.name.toLowerCase()} purchase.`,
    pattern: `${topCategory.name} is the biggest recent spending pattern at ${formatMoney(topCategory.amount, 'USD')}.`,
    trigger: `${spending.length} recent spending entries`,
  };
}

function getPaceStatus(spentToday, dailyLimit) {
  if (dailyLimit <= 0) {
    return { label: 'Ready to Set Up', tone: 'neutral' };
  }

  if (spentToday > dailyLimit) {
    return { label: 'Over Budget', tone: 'danger' };
  }

  if (spentToday >= dailyLimit * 0.82) {
    return { label: 'Near Limit', tone: 'warning' };
  }

  return { label: 'On Track', tone: 'success' };
}

function getBudgetMood({ dailyLimit, spentToday, totalBalance, urgentBills }) {
  if (dailyLimit <= 0 && totalBalance <= 0 && urgentBills === 0) {
    return {
      label: 'Not Set Up',
      score: 0,
      detail: 'Add accounts, bills, or a monthly budget to calculate your household mood.',
    };
  }

  if (urgentBills >= 2 || spentToday > dailyLimit) {
    return {
      label: 'Watchful',
      score: 72,
      detail: 'Bills are close, but the plan is still manageable.',
    };
  }

  if (totalBalance > 3500) {
    return {
      label: 'Calm',
      score: 88,
      detail: 'Cash, bills, and daily pace are moving together.',
    };
  }

  return {
    label: 'Tight',
    score: 61,
    detail: 'Keep spending small until the next income deposit.',
  };
}

function EmptyState({ children, title }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}

function FormMessage({ children, id, tone = 'error' }) {
  if (!children) {
    return null;
  }

  return (
    <p className={`form-message ${tone}`} id={id}>
      {children}
    </p>
  );
}

function TourVisual({ step, workspaceName }) {
  const visualClass = step.visual ? ` ${step.visual}` : '';

  return (
    <div className={`tour-visual${visualClass}`} aria-label={`${workspaceName} preview`}>
      <div className="tour-pointer">
        <span />
        <strong>{step.pointer}</strong>
      </div>
      <div className="tour-preview-shell">
        <span className="tour-preview-nav" />
        <span className="tour-preview-hero" />
        <span className="tour-preview-balance" />
        <span className="tour-preview-meter" />
        <span className="tour-preview-card card-one" />
        <span className="tour-preview-card card-two" />
        <span className="tour-preview-card card-three" />
      </div>
    </div>
  );
}

function TourOverlay({ steps, workspaceName, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const closeTour = () => {
    onClose();
    setStepIndex(0);
  };

  return (
    <div className="tour-backdrop" role="presentation">
      <section
        aria-label={`${workspaceName} tour`}
        aria-modal="true"
        className="tour-card"
        role="dialog"
      >
        <div className="tour-progress" aria-hidden="true">
          {steps.map((step, index) => (
            <span className={index <= stepIndex ? 'active' : ''} key={step.title} />
          ))}
        </div>
        <TourVisual step={currentStep} workspaceName={workspaceName} />
        <p className="eyebrow">{workspaceName} Tour</p>
        <h2>{currentStep.title}</h2>
        <p>{currentStep.body}</p>
        <div className="tour-actions">
          <button className="tour-secondary" onClick={closeTour} type="button">
            Skip
          </button>
          <button
            onClick={() => {
              if (isLastStep) {
                closeTour();
                return;
              }

              setStepIndex((current) => current + 1);
            }}
            type="button"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  );
}

function MainWorkspace({
  currency,
  onCurrencyChange,
  onReset,
  onSwitchPortal,
  onStartTour,
  onTourComplete,
  showTour,
}) {
  const [householdData, setHouseholdData] = useStoredState(
    'budgethq-household-data-v2',
    startingHouseholdData,
  );
  const [approvedProposal, setApprovedProposal] = useState(null);
  const [activeMainPage, setActiveMainPage] = useState('dashboard');
  const [pausedPurchase, setPausedPurchase] = useState(true);
  const [selectedTradeoff, setSelectedTradeoff] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [activeLifeMode, setActiveLifeMode] = useState('normal');
  const [depositAmount, setDepositAmount] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [spendLabel, setSpendLabel] = useState('');
  const [spendCategory, setSpendCategory] = useState('Other');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('Checking');
  const [accountBalance, setAccountBalance] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [transactionMerchant, setTransactionMerchant] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCategory, setTransactionCategory] = useState('Other');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
  const [transactionNotes, setTransactionNotes] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [csvImportText, setCsvImportText] = useState('');
  const [backupText, setBackupText] = useState('');
  const [privacyMode, setPrivacyMode] = useStoredState('budgethq-privacy-mode', false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetDays, setBudgetDays] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryBudget, setCategoryBudget] = useState('');
  const [categoryGroup, setCategoryGroup] = useState('');
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDue, setBillDue] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionAmount, setSubscriptionAmount] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleAccess, setRoleAccess] = useState('');
  const [rolePermission, setRolePermission] = useState('collaborator');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalChange, setProposalChange] = useState('');
  const [proposalCommentDrafts, setProposalCommentDrafts] = useState({});
  const [pauseItem, setPauseItem] = useState('');
  const [pauseAmount, setPauseAmount] = useState('');
  const [autopilotAction, setAutopilotAction] = useState('');
  const [autopilotAmount, setAutopilotAmount] = useState('');
  const [formMessages, setFormMessages] = useState({});

  const hasPositiveAmount = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0;
  };

  const checkingBalance = householdData.accounts[0]?.balance ?? 0;
  const transactionAccountId = selectedAccountId || householdData.accounts[0]?.id || '';
  const transactionAccountBalance =
    householdData.accounts.find((account) => account.id === transactionAccountId)?.balance ?? 0;
  const canAddMoney = hasPositiveAmount(depositAmount);
  const canLogSpending = hasPositiveAmount(spendAmount) && transactionAccountBalance >= Number(spendAmount);
  const canAddAccount = accountName.trim() && Number.isFinite(Number(accountBalance));
  const canSaveTransaction =
    transactionMerchant.trim() &&
    hasPositiveAmount(transactionAmount) &&
    (transactionType === 'income' || Boolean(transactionAccountId));
  const canSaveBudget = hasPositiveAmount(budgetAmount) && hasPositiveAmount(budgetDays);
  const canAddCategory = categoryName.trim() && hasPositiveAmount(categoryBudget);
  const canAddBill = billName.trim() && hasPositiveAmount(billAmount);
  const canAddGoal = goalName.trim() && hasPositiveAmount(goalTarget);
  const canAddSubscription = subscriptionName.trim() && hasPositiveAmount(subscriptionAmount);
  const canAddRole = roleName.trim() && roleAccess.trim();
  const canAddProposal = proposalTitle.trim() && proposalChange.trim();
  const canAddPause = pauseItem.trim() && hasPositiveAmount(pauseAmount);
  const canAddAutopilot = autopilotAction.trim() && hasPositiveAmount(autopilotAmount);
  const activeMember = householdData.roles.find((role) => role.id === activeRole) ?? null;
  const activePermission = activeMember?.permission ?? 'admin';
  const canManageMoney = activePermission === 'admin';
  const canCollaborate = activePermission === 'admin' || activePermission === 'collaborator';
  const activeMemberName = activeMember?.label ?? 'You';
  const hasHouseholdData =
    householdData.accounts.length > 0 ||
    householdData.activity.length > 0 ||
    householdData.bills.length > 0 ||
    householdData.goals.length > 0;
  const money = (amount) => (privacyMode ? 'Private' : formatMoney(amount, currency));

  const setFormMessage = (key, message) => {
    setFormMessages((current) => ({ ...current, [key]: message }));
  };

  const clearFormMessage = (key) => {
    setFormMessages((current) => {
      if (!current[key]) {
        return current;
      }

      const nextMessages = { ...current };
      delete nextMessages[key];
      return nextMessages;
    });
  };

  const resetDemo = () => {
    setHouseholdData(startingHouseholdData);
    setApprovedProposal(null);
    setActiveMainPage('dashboard');
    setPausedPurchase(true);
    setSelectedTradeoff(null);
    setActiveRole(null);
    setActiveLifeMode('normal');
    setDepositAmount('');
    setSpendAmount('');
    setSpendLabel('');
    setSpendCategory('Other');
    setAccountName('');
    setAccountType('Checking');
    setAccountBalance('');
    setSelectedAccountId('');
    setTransactionMerchant('');
    setTransactionAmount('');
    setTransactionCategory('Other');
    setTransactionDate(new Date().toISOString().slice(0, 10));
    setTransactionNotes('');
    setTransactionType('expense');
    setTransactionFilter('all');
    setEditingTransactionId(null);
    setCsvImportText('');
    setBudgetAmount('');
    setBudgetDays('');
    setCategoryName('');
    setCategoryBudget('');
    setCategoryGroup('');
    setBillName('');
    setBillAmount('');
    setBillDue('');
    setGoalName('');
    setGoalTarget('');
    setSubscriptionName('');
    setSubscriptionAmount('');
    setRoleName('');
    setRoleAccess('');
    setRolePermission('collaborator');
    setProposalTitle('');
    setProposalChange('');
    setProposalCommentDrafts({});
    setPauseItem('');
    setPauseAmount('');
    setAutopilotAction('');
    setAutopilotAmount('');
    setBackupText('');
    setFormMessages({});
    onReset();
  };

  const loadSampleHousehold = () => {
    setHouseholdData(sampleHouseholdData);
    setApprovedProposal('sample-vacation-shift');
    setPausedPurchase(true);
    setSelectedTradeoff('sample-emergency');
    setActiveRole('sample-adult');
    setActiveLifeMode('normal');
    setBackupText('');
    clearFormMessage('backup');
  };

  const exportJsonBackup = () => {
    const backup = JSON.stringify(
      {
        currency,
        exportedAt: new Date().toISOString(),
        householdData,
        version: 1,
      },
      null,
      2,
    );

    setBackupText(backup);
    downloadTextFile('budgethq-backup.json', backup);
  };

  const exportActivityCsv = () => {
    const csv = createActivityCsv(householdData.activity);
    setBackupText(csv);
    downloadTextFile('budgethq-transactions.csv', csv, 'text/csv');
  };

  const restoreJsonBackup = () => {
    try {
      const parsedBackup = JSON.parse(backupText);
      const nextData = parsedBackup.householdData ?? parsedBackup;
      setHouseholdData(normalizeHouseholdData(nextData, startingHouseholdData));
      if (parsedBackup.currency && currencyOptions.includes(parsedBackup.currency)) {
        onCurrencyChange(parsedBackup.currency);
      }
      clearFormMessage('backup');
    } catch {
      setFormMessage('backup', 'Paste a valid BudgetHQ JSON backup before restoring.');
    }
  };

  const updateAccountBalance = (accounts, accountId, amount) =>
    accounts.map((account) =>
      account.id === accountId ? { ...account, balance: account.balance + amount } : account,
    );

  const addAccount = () => {
    const balance = Number(accountBalance);

    if (!accountName.trim() || !Number.isFinite(balance)) {
      setFormMessage('account', 'Enter an account name and starting balance.');
      return;
    }

    clearFormMessage('account');
    const id = createId(accountName);
    setHouseholdData((current) => ({
      ...current,
      accounts: [
        ...current.accounts,
        {
          balance,
          id,
          label: accountName.trim(),
          type: accountType,
        },
      ],
      changes: [`${accountName.trim()} account added.`, ...current.changes].slice(0, 4),
    }));
    setSelectedAccountId(id);
    setAccountName('');
    setAccountBalance('');
    setAccountType('Checking');
  };

  const resetTransactionForm = () => {
    setTransactionMerchant('');
    setTransactionAmount('');
    setTransactionCategory('Other');
    setTransactionDate(new Date().toISOString().slice(0, 10));
    setTransactionNotes('');
    setTransactionType('expense');
    setEditingTransactionId(null);
  };

  const saveTransaction = () => {
    const rawAmount = Number(transactionAmount);
    const signedAmount = transactionType === 'expense' ? -rawAmount : rawAmount;
    const accountId = transactionAccountId;

    if (!transactionMerchant.trim() || !Number.isFinite(rawAmount) || rawAmount <= 0) {
      setFormMessage('transaction', 'Enter a merchant and positive amount.');
      return;
    }

    if (!accountId && transactionType === 'expense') {
      setFormMessage('transaction', 'Add or select an account before logging spending.');
      return;
    }

    const existingTransaction = householdData.activity.find((entry) => entry.id === editingTransactionId);
    const existingAccount = householdData.accounts.find((account) => account.id === accountId);
    const balanceAfterReversal =
      existingTransaction?.accountId === accountId
        ? (existingAccount?.balance ?? 0) - existingTransaction.amount
        : existingAccount?.balance ?? 0;

    if (transactionType === 'expense' && balanceAfterReversal < rawAmount) {
      setFormMessage('transaction', 'This account does not have enough money for that expense.');
      return;
    }

    clearFormMessage('transaction');
    setHouseholdData((current) => {
      const nextEntry = createActivityEntry({
        accountId,
        amount: signedAmount,
        category: transactionCategory,
        merchant: transactionMerchant.trim(),
        notes: transactionNotes.trim(),
        transactionDate,
        type: transactionType,
      });

      if (!editingTransactionId) {
        return {
          ...addActivityToData(
            {
              ...current,
              accounts: accountId ? updateAccountBalance(current.accounts, accountId, signedAmount) : current.accounts,
            },
            nextEntry,
            currency,
          ),
          activity: [nextEntry, ...current.activity].slice(0, 20),
        };
      }

      const previous = current.activity.find((entry) => entry.id === editingTransactionId);
      let accounts = current.accounts;

      if (previous?.accountId) {
        accounts = updateAccountBalance(accounts, previous.accountId, -previous.amount);
      }

      if (accountId) {
        accounts = updateAccountBalance(accounts, accountId, signedAmount);
      }

      return {
        ...current,
        accounts,
        activity: current.activity.map((entry) =>
          entry.id === editingTransactionId ? { ...nextEntry, id: editingTransactionId } : entry,
        ),
        changes: [`${transactionMerchant.trim()} transaction updated.`, ...current.changes].slice(0, 4),
      };
    });
    resetTransactionForm();
  };

  const editTransaction = (transactionId) => {
    const transaction = householdData.activity.find((entry) => entry.id === transactionId);

    if (!transaction) {
      return;
    }

    setEditingTransactionId(transaction.id);
    setSelectedAccountId(transaction.accountId ?? householdData.accounts[0]?.id ?? '');
    setTransactionMerchant(transaction.merchant);
    setTransactionAmount(String(Math.abs(transaction.amount)));
    setTransactionCategory(transaction.category ?? 'Other');
    setTransactionDate(transaction.transactionDate ?? new Date().toISOString().slice(0, 10));
    setTransactionNotes(transaction.notes ?? '');
    setTransactionType(transaction.amount >= 0 ? 'income' : 'expense');
  };

  const deleteTransaction = (transactionId) => {
    setHouseholdData((current) => {
      const transaction = current.activity.find((entry) => entry.id === transactionId);

      if (!transaction) {
        return current;
      }

      const accounts = transaction.accountId
        ? updateAccountBalance(current.accounts, transaction.accountId, -transaction.amount)
        : current.accounts;

      return {
        ...current,
        accounts,
        activity: current.activity.filter((entry) => entry.id !== transactionId),
        changes: [`${transaction.merchant} transaction deleted.`, ...current.changes].slice(0, 4),
      };
    });
  };

  const importCsvTransactions = () => {
    const rows = csvImportText
      .split('\n')
      .map((row) => row.trim())
      .filter(Boolean);

    if (rows.length === 0) {
      setFormMessage('csv', 'Paste CSV rows before importing.');
      return;
    }

    clearFormMessage('csv');
    setHouseholdData((current) => {
      let accounts = [...current.accounts];
      const imported = rows.map((row) => {
        const [date, merchant, amountValue, category = 'Other', accountNameValue = 'Imported Checking', typeValue, notes = ''] =
          row.split(',').map((cell) => cell.trim());
        const amount = Number(amountValue);
        const signedAmount =
          typeValue === 'income' || amount > 0 ? Math.abs(amount || 0) : -Math.abs(amount || 0);
        let account = accounts.find((item) => item.label.toLowerCase() === accountNameValue.toLowerCase());

        if (!account) {
          account = {
            balance: 0,
            id: createId(accountNameValue),
            label: accountNameValue,
            type: 'Checking',
          };
          accounts = [...accounts, account];
        }

        accounts = updateAccountBalance(accounts, account.id, signedAmount);

        return createActivityEntry({
          accountId: account.id,
          amount: signedAmount,
          category: transactionCategories.includes(category) ? category : 'Other',
          merchant: merchant || 'Imported transaction',
          notes,
          transactionDate: date || new Date().toISOString().slice(0, 10),
          type: signedAmount >= 0 ? 'income' : 'expense',
        });
      });

      return {
        ...current,
        accounts,
        activity: [...imported, ...current.activity].slice(0, 40),
        changes: [`${imported.length} transactions imported.`, ...current.changes].slice(0, 4),
      };
    });
    setCsvImportText('');
  };

  const addMoney = () => {
    const amount = Number(depositAmount);

    if (!hasPositiveAmount(depositAmount)) {
      setFormMessage('addMoney', 'Enter a positive amount to add to checking.');
      return;
    }

    clearFormMessage('addMoney');
    setHouseholdData((current) => {
      const accountId = transactionAccountId || createId('Checking');
      const hasAccounts = current.accounts.length > 0;
      const accounts = hasAccounts
        ? updateAccountBalance(current.accounts, accountId, amount)
        : [{ balance: amount, id: accountId, label: 'Checking', type: 'Checking' }];

      return addActivityToData(
        { ...current, accounts },
        {
          accountId,
          amount,
          category: 'Income',
          merchant: 'Manual money added',
          transactionDate: new Date().toISOString().slice(0, 10),
          type: 'income',
        },
        currency,
      );
    });
    setDepositAmount('');
  };

  const logSpending = () => {
    const amount = Number(spendAmount);
    if (!hasPositiveAmount(spendAmount)) {
      setFormMessage('logSpending', 'Enter a positive purchase amount.');
      return;
    }

    if (!transactionAccountId) {
      setFormMessage('logSpending', 'Add an account before logging spending.');
      return;
    }

    if (transactionAccountBalance < amount) {
      setFormMessage('logSpending', 'Add money to the selected account before logging this purchase.');
      return;
    }

    clearFormMessage('logSpending');
    setHouseholdData((current) => ({
      ...current,
      accounts: updateAccountBalance(current.accounts, transactionAccountId, -amount),
      activity: [
        createActivityEntry({
          accountId: transactionAccountId,
          amount: -amount,
          category: spendCategory,
          merchant: spendLabel || 'Manual spending',
          transactionDate: new Date().toISOString().slice(0, 10),
          type: 'expense',
        }),
        ...current.activity,
      ].slice(0, 20),
      spentToday: current.spentToday + amount,
      monthBudgetRemaining: Math.max(current.monthBudgetRemaining - amount, 0),
      emotionalInsight:
        current.emotionalInsight ??
        {
          trigger: spendLabel || 'New spending',
          pattern: 'BudgetHQ is watching for repeat spending patterns.',
          nudge: 'A gentle check-in will appear when a pattern is clear.',
        },
      changes: [
        `${spendLabel || 'Manual spending'} logged ${formatMoney(amount, currency)} in ${spendCategory}.`,
        ...current.changes,
      ].slice(0, 4),
    }));
    setSpendAmount('');
    setSpendLabel('');
  };

  const updateForecast = (budget, days) => {
    if (budget <= 0 || days <= 0) {
      return [];
    }

    return [
      {
        id: 'forecast-7-days',
        label: '7 days',
        safeSpend: budget / days,
        note: 'Based on the budget and days entered.',
      },
      {
        id: 'forecast-14-days',
        label: '14 days',
        safeSpend: (budget * 0.9) / days,
        note: 'Leaves a little cushion for surprise costs.',
      },
      {
        id: 'forecast-30-days',
        label: '30 days',
        safeSpend: (budget * 0.8) / days,
        note: 'Protects goals while spending stays flexible.',
      },
    ];
  };

  const saveBudgetPlan = () => {
    const amount = Number(budgetAmount);
    const days = Number(budgetDays);

    if (!hasPositiveAmount(budgetAmount) || !hasPositiveAmount(budgetDays)) {
      setFormMessage('budget', 'Enter a positive budget amount and days left.');
      return;
    }

    clearFormMessage('budget');
    setHouseholdData((current) => ({
      ...current,
      monthBudgetRemaining: amount,
      remainingDays: days,
      forecast: updateForecast(amount, days),
      changes: [`Budget plan set for ${formatMoney(amount, currency)} across ${days} days.`, ...current.changes].slice(0, 4),
    }));
    setBudgetAmount('');
    setBudgetDays('');
  };

  const addCategory = () => {
    const budget = Number(categoryBudget);
    const name = categoryName.trim();

    if (!name || !hasPositiveAmount(categoryBudget)) {
      setFormMessage('category', 'Enter a category name and positive budget.');
      return;
    }

    clearFormMessage('category');
    setHouseholdData((current) => {
      const existing = current.categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      );

      if (existing) {
        return {
          ...current,
          categories: current.categories.map((category) =>
            category.id === existing.id
              ? { ...category, budget, group: categoryGroup.trim() || category.group || 'Everyday' }
              : category,
          ),
          changes: [`${name} category budget updated.`, ...current.changes].slice(0, 4),
        };
      }

      return {
        ...current,
        categories: [
          {
            amount: 0,
            budget,
            color: categoryColors[name] ?? categoryColors.Other,
            group: categoryGroup.trim() || 'Everyday',
            id: createId(name),
            name,
            rollover: 0,
          },
          ...current.categories,
        ],
        changes: [`${name} category budget added.`, ...current.changes].slice(0, 4),
      };
    });
    setSpendCategory(name);
    setTransactionCategory(name);
    setCategoryName('');
    setCategoryBudget('');
    setCategoryGroup('');
  };

  const rolloverCategories = () => {
    setHouseholdData((current) => ({
      ...current,
      categories: current.categories.map((category) => ({
        ...category,
        amount: 0,
        rollover: Math.max(
          (category.budget ?? 0) +
            (category.rollover ?? 0) -
            (budgetCategories.find((item) => item.name === category.name)?.amount ?? category.amount),
          0,
        ),
      })),
      spentToday: 0,
      changes: ['Category rollover completed for the next period.', ...current.changes].slice(0, 4),
    }));
  };

  const rebalanceCategories = () => {
    setHouseholdData((current) => {
      const overspent = budgetCategories.find(
        (category) => category.amount > (category.budget ?? 0) + (category.rollover ?? 0),
      );
      const available = budgetCategories.find(
        (category) => category.amount < (category.budget ?? 0) + (category.rollover ?? 0),
      );

      if (!overspent || !available || overspent.id === available.id) {
        setFormMessage('category', 'No category has both overspending and available budget to rebalance.');
        return current;
      }

      const overAmount = overspent.amount - ((overspent.budget ?? 0) + (overspent.rollover ?? 0));
      const availableAmount = (available.budget ?? 0) + (available.rollover ?? 0) - available.amount;
      const transfer = Math.min(overAmount, availableAmount);

      if (transfer <= 0) {
        return current;
      }

      clearFormMessage('category');
      return {
        ...current,
        categories: current.categories.map((category) => {
          if (category.name === overspent.name) {
            return { ...category, budget: (category.budget ?? 0) + transfer };
          }

          if (category.name === available.name) {
            return { ...category, budget: Math.max((category.budget ?? 0) - transfer, 0) };
          }

          return category;
        }),
        changes: [
          `Rebalanced ${formatMoney(transfer, currency)} from ${available.name} to ${overspent.name}.`,
          ...current.changes,
        ].slice(0, 4),
      };
    });
  };

  const addBill = () => {
    const amount = Number(billAmount);

    if (!billName.trim() || !hasPositiveAmount(billAmount)) {
      setFormMessage('bill', 'Enter a bill name and positive amount.');
      return;
    }

    clearFormMessage('bill');
    const hoursAway = 24;
    const id = createId(billName);
    setHouseholdData((current) => ({
      ...current,
      bills: [
        {
          amount,
          due: billDue.trim() || 'Upcoming',
          hoursAway,
          id,
          name: billName.trim(),
        },
        ...current.bills,
      ],
      pressureWeeks: [
        {
          bills: current.bills.length + 1,
          id: 'pressure-upcoming',
          label: 'Upcoming',
          level: amount > 500 ? 'high' : 'medium',
          total: current.bills.reduce((sum, bill) => sum + bill.amount, amount),
        },
      ],
      changes: [`${billName.trim()} added to bill reminders.`, ...current.changes].slice(0, 4),
    }));
    setBillName('');
    setBillAmount('');
    setBillDue('');
  };

  const addGoal = () => {
    const target = Number(goalTarget);

    if (!goalName.trim() || !hasPositiveAmount(goalTarget)) {
      setFormMessage('goal', 'Enter a goal name and positive target.');
      return;
    }

    clearFormMessage('goal');
    const id = createId(goalName);
    setHouseholdData((current) => ({
      ...current,
      goals: [
        {
          contributors: [],
          id,
          name: goalName.trim(),
          saved: 0,
          target,
        },
        ...current.goals,
      ],
      tradeoffs: [
        {
          amount: 50,
          id,
          label: goalName.trim(),
          outcome: `${formatMoney(50, currency)} starts this goal today.`,
        },
        ...current.tradeoffs,
      ],
      changes: [`${goalName.trim()} goal created.`, ...current.changes].slice(0, 4),
    }));
    setSelectedTradeoff(id);
    setGoalName('');
    setGoalTarget('');
  };

  const addSubscription = () => {
    const amount = Number(subscriptionAmount);

    if (!subscriptionName.trim() || !hasPositiveAmount(subscriptionAmount)) {
      setFormMessage('subscription', 'Enter a subscription name and positive monthly cost.');
      return;
    }

    clearFormMessage('subscription');
    setHouseholdData((current) => ({
      ...current,
      subscriptions: [
        {
          amount,
          id: createId(subscriptionName),
          name: subscriptionName.trim(),
          status: 'Review',
          useScore: 50,
        },
        ...current.subscriptions,
      ],
      changes: [`${subscriptionName.trim()} subscription added.`, ...current.changes].slice(0, 4),
    }));
    setSubscriptionName('');
    setSubscriptionAmount('');
  };

  const addRole = () => {
    if (!roleName.trim() || !roleAccess.trim()) {
      setFormMessage('role', 'Enter a role name and what this person can access.');
      return;
    }

    clearFormMessage('role');
    const id = createId(roleName);
    setHouseholdData((current) => ({
      ...current,
      roles: [
        {
          access: roleAccess.trim(),
          id,
          label: roleName.trim(),
          permission: rolePermission,
        },
        ...current.roles,
      ],
      notifications: [
        {
          actor: 'BudgetHQ',
          id: createId(`${roleName.trim()} invited`),
          message: `${roleName.trim()} joined as ${permissionProfiles.find((profile) => profile.id === rolePermission)?.label ?? 'Collaborator'}.`,
          time: 'Just now',
        },
        ...(current.notifications ?? []),
      ].slice(0, 6),
    }));
    setActiveRole(id);
    setRoleName('');
    setRoleAccess('');
    setRolePermission('collaborator');
  };

  const addProposal = () => {
    if (!proposalTitle.trim() || !proposalChange.trim()) {
      setFormMessage('proposal', 'Enter a proposal title and change.');
      return;
    }

    clearFormMessage('proposal');
    const id = createId(proposalTitle);
    setHouseholdData((current) => ({
      ...current,
      proposals: [
        {
          change: proposalChange.trim(),
          comments: [],
          createdBy: activeMemberName,
          id,
          impact: 'Ready for the household to review.',
          status: 'Pending',
          title: proposalTitle.trim(),
          votes: [],
        },
        ...current.proposals,
      ],
      notifications: [
        {
          actor: activeMemberName,
          id: createId(`${proposalTitle.trim()} proposal`),
          message: `New proposal: ${proposalTitle.trim()}.`,
          time: 'Just now',
        },
        ...(current.notifications ?? []),
      ].slice(0, 6),
    }));
    setApprovedProposal(id);
    setProposalTitle('');
    setProposalChange('');
  };

  const updateProposalDecision = (proposalId, decision) => {
    if (!canCollaborate) {
      setFormMessage('proposalDecision', 'Viewers can read proposals but cannot vote.');
      return;
    }

    clearFormMessage('proposalDecision');
    setHouseholdData((current) => {
      const proposal = current.proposals.find((item) => item.id === proposalId);

      if (!proposal) {
        return current;
      }

      const status = decision === 'approved' ? 'Approved' : 'Declined';
      const nextData = {
        ...current,
        proposals: current.proposals.map((item) =>
          item.id === proposalId
            ? {
                ...item,
                impact: `${status} by ${activeMemberName}.`,
                status,
                votes: [
                  ...(item.votes ?? []).filter((vote) => vote.memberId !== activeRole),
                  {
                    decision,
                    memberId: activeRole ?? 'owner',
                    name: activeMemberName,
                    time: 'Just now',
                  },
                ],
              }
            : item,
        ),
      };

      return addNotificationToData(nextData, `${activeMemberName} ${decision} ${proposal.title}.`, activeMemberName);
    });
    setApprovedProposal(decision === 'approved' ? proposalId : null);
  };

  const addProposalComment = (proposalId) => {
    const comment = proposalCommentDrafts[proposalId]?.trim();

    if (!comment) {
      return;
    }

    if (!canCollaborate) {
      setFormMessage('proposalDecision', 'Viewers can read comments but cannot add them.');
      return;
    }

    clearFormMessage('proposalDecision');
    setHouseholdData((current) => {
      const proposal = current.proposals.find((item) => item.id === proposalId);
      const nextData = {
        ...current,
        proposals: current.proposals.map((item) =>
          item.id === proposalId
            ? {
                ...item,
                comments: [
                  {
                    body: comment,
                    id: createId(comment),
                    memberId: activeRole ?? 'owner',
                    name: activeMemberName,
                    time: 'Just now',
                  },
                  ...(item.comments ?? []),
                ].slice(0, 4),
              }
            : item,
        ),
      };

      return addNotificationToData(
        nextData,
        `${activeMemberName} commented on ${proposal?.title ?? 'a proposal'}.`,
        activeMemberName,
      );
    });
    setProposalCommentDrafts((current) => ({ ...current, [proposalId]: '' }));
  };

  const addPause = () => {
    const amount = Number(pauseAmount);

    if (!pauseItem.trim() || !hasPositiveAmount(pauseAmount)) {
      setFormMessage('pause', 'Enter a purchase name and positive amount.');
      return;
    }

    clearFormMessage('pause');
    setHouseholdData((current) => ({
      ...current,
      purchasePause: {
        amount,
        holdHours: 48,
        item: pauseItem.trim(),
        reason: 'User-created cooling-off hold.',
      },
    }));
    setPausedPurchase(true);
    setPauseItem('');
    setPauseAmount('');
  };

  const addAutopilotRule = () => {
    const amount = Number(autopilotAmount);

    if (!autopilotAction.trim() || !hasPositiveAmount(autopilotAmount)) {
      setFormMessage('autopilot', 'Enter an autopilot action and positive amount.');
      return;
    }

    clearFormMessage('autopilot');
    setHouseholdData((current) => ({
      ...current,
      autopilot: [
        {
          action: autopilotAction.trim(),
          amount,
          id: createId(autopilotAction),
          timing: 'When cash is available',
        },
        ...current.autopilot,
      ],
    }));
    setAutopilotAction('');
    setAutopilotAmount('');
  };

  const payBill = (billId) => {
    if (!canManageMoney) {
      setFormMessage('permission', 'Only Admin members can pay bills.');
      return;
    }

    clearFormMessage('permission');
    setHouseholdData((current) => {
      const bill = current.bills.find((item) => item.id === billId);
      const checkingBalance = current.accounts[0]?.balance ?? 0;

      if (!bill || checkingBalance < bill.amount) {
        return current;
      }

      const nextData = {
        ...current,
        accounts: current.accounts.map((account, index) =>
          index === 0 ? { ...account, balance: account.balance - bill.amount } : account,
        ),
        bills: current.bills.filter((item) => item.id !== billId),
        pressureWeeks: current.pressureWeeks.map((week, index) =>
          index === 0
            ? { ...week, bills: Math.max(week.bills - 1, 0), total: Math.max(week.total - bill.amount, 0) }
            : week,
        ),
      };

      return addActivityToData(nextData, { merchant: `${bill.name} paid`, amount: -bill.amount }, currency);
    });
  };

  const fundGoal = (goalId) => {
    if (!canManageMoney) {
      setFormMessage('permission', 'Only Admin members can move money into goals.');
      return;
    }

    clearFormMessage('permission');
    setHouseholdData((current) => {
      const goal = current.goals.find((item) => item.id === goalId);
      const checkingBalance = current.accounts[0]?.balance ?? 0;

      if (!goal) {
        return current;
      }

      const amount = Math.min(50, goal.target - goal.saved, checkingBalance);

      if (amount <= 0) {
        return current;
      }

      const nextData = {
        ...current,
        accounts: current.accounts.map((account, index) =>
          index === 0 ? { ...account, balance: account.balance - amount } : account,
        ),
        goals: current.goals.map((item) =>
          item.id === goalId
            ? {
                ...item,
                saved: item.saved + amount,
                contributors: [
                  ...(item.contributors ?? []),
                  { name: 'You', amount },
                ],
              }
            : item,
        ),
      };

      return addActivityToData(nextData, { merchant: `${goal.name} contribution`, amount: -amount }, currency);
    });
  };

  const addAutopilotTransfer = (suggestion) => {
    if (!canManageMoney) {
      setFormMessage('permission', 'Only Admin members can apply autopilot actions.');
      return;
    }

    clearFormMessage('permission');

    if (suggestion.action === 'Review recurring subscriptions') {
      setHouseholdData((current) =>
        addNotificationToData(current, 'Subscription review queued from Cashflow Autopilot.', activeMemberName),
      );
      return;
    }

    if (suggestion.action.startsWith('Move extra cash to ')) {
      const goalId = suggestion.id.replace('auto-goal-', '');

      setHouseholdData((current) => {
        const goal = current.goals.find((item) => item.id === goalId);
        const checkingBalance = current.accounts[0]?.balance ?? 0;
        const amount = Math.min(suggestion.amount, checkingBalance, goal ? goal.target - goal.saved : 0);

        if (!goal || amount <= 0) {
          return current;
        }

        const nextData = {
          ...current,
          accounts: current.accounts.map((account, index) =>
            index === 0 ? { ...account, balance: account.balance - amount } : account,
          ),
          goals: current.goals.map((item) =>
            item.id === goalId
              ? {
                  ...item,
                  saved: item.saved + amount,
                  contributors: [...(item.contributors ?? []), { name: activeMemberName, amount }],
                }
              : item,
          ),
        };

        return addNotificationToData(
          addActivityToData(nextData, { merchant: suggestion.action, amount: -amount }, currency),
          `${activeMemberName} applied autopilot: ${suggestion.action}.`,
          activeMemberName,
        );
      });
      return;
    }

    setHouseholdData((current) => {
      const checkingBalance = current.accounts[0]?.balance ?? 0;

      if (!suggestion || checkingBalance < suggestion.amount) {
        return current;
      }

      const nextData = {
        ...current,
        accounts: current.accounts.map((account, index) =>
          index === 0 ? { ...account, balance: account.balance - suggestion.amount } : account,
        ),
      };

      return addNotificationToData(
        addActivityToData(nextData, { merchant: suggestion.action, amount: -suggestion.amount }, currency),
        `${activeMemberName} applied autopilot: ${suggestion.action}.`,
        activeMemberName,
      );
    });
  };

  const totalBalance = householdData.accounts.reduce((sum, account) => sum + account.balance, 0);
  const dailyLimit =
    householdData.remainingDays > 0
      ? householdData.monthBudgetRemaining / householdData.remainingDays
      : 0;
  const paceStatus = getPaceStatus(householdData.spentToday, dailyLimit);
  const urgentBills = householdData.bills.filter((bill) => bill.hoursAway <= 48).length;
  const budgetMood = getBudgetMood({
    dailyLimit,
    spentToday: householdData.spentToday,
    totalBalance,
    urgentBills,
  });
  const computedCategories = getCategoryTotals(householdData.activity);
  const categoryOptions = Array.from(
    new Set([
      ...transactionCategories,
      ...householdData.categories.map((category) => category.name),
      ...computedCategories.map((category) => category.name),
    ]),
  );
  const budgetCategories = categoryOptions
    .filter((name) => name !== 'Income')
    .map((name) => {
      const configured = householdData.categories.find((category) => category.name === name);
      const computed = computedCategories.find((category) => category.name === name);

      return {
        amount: computed?.amount ?? configured?.amount ?? 0,
        budget: configured?.budget ?? 0,
        color: configured?.color ?? computed?.color ?? categoryColors[name] ?? categoryColors.Other,
        group: configured?.group ?? 'Everyday',
        id: configured?.id ?? computed?.id ?? name,
        name,
        rollover: configured?.rollover ?? 0,
      };
    });
  const categoryBudgetTotal = budgetCategories.reduce(
    (sum, category) => sum + (category.budget ?? 0) + (category.rollover ?? 0),
    0,
  );
  const categoryLeftTotal = budgetCategories.reduce(
    (sum, category) => sum + Math.max((category.budget ?? 0) + (category.rollover ?? 0) - category.amount, 0),
    0,
  );
  const visibleTransactions = householdData.activity.filter((entry) => {
    if (transactionFilter === 'all') {
      return true;
    }

    if (transactionFilter === 'income') {
      return entry.amount >= 0;
    }

    if (transactionFilter === 'expense') {
      return entry.amount < 0;
    }

    return entry.category === transactionFilter;
  });
  const totalCategorySpend = budgetCategories.reduce(
    (sum, category) => sum + category.amount,
    0,
  );
  const incomeTotal = householdData.activity
    .filter((entry) => entry.amount > 0)
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expenseTotal = householdData.activity
    .filter((entry) => entry.amount < 0)
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  const cashFlowTotal = incomeTotal - expenseTotal;
  const netWorthPoints = householdData.accounts.map((account, index) => ({
    label: account.label,
    value: householdData.accounts.slice(0, index + 1).reduce((sum, item) => sum + item.balance, 0),
  }));
  const maxNetWorthPoint = Math.max(...netWorthPoints.map((point) => Math.abs(point.value)), 1);
  const monthlyTrend = [
    { label: 'Last month', value: Math.round(expenseTotal * 0.82) },
    { label: 'This month', value: expenseTotal },
    { label: 'Projected', value: Math.round(expenseTotal + dailyLimit * Math.max(householdData.remainingDays, 0)) },
  ];
  const maxMonthlyTrend = Math.max(...monthlyTrend.map((point) => point.value), 1);
  const calendarEvents = [
    ...householdData.bills.map((bill) => ({
      amount: bill.amount,
      label: bill.name,
      meta: bill.due,
      type: 'bill',
    })),
    ...householdData.activity.slice(0, 4).map((entry) => ({
      amount: Math.abs(entry.amount),
      label: entry.merchant,
      meta: entry.transactionDate,
      type: entry.amount >= 0 ? 'income' : 'spend',
    })),
  ].slice(0, 6);
  const paceMeterWidth =
    dailyLimit > 0 ? Math.min((householdData.spentToday / dailyLimit) * 100, 100) : 0;
  const safeToSpendLeft = Math.max(dailyLimit - householdData.spentToday, 0);
  const safeToSpendUsed = dailyLimit > 0 ? Math.min((householdData.spentToday / dailyLimit) * 100, 100) : 0;
  const safeToSpendSummary =
    dailyLimit > 0
      ? `${formatMoney(safeToSpendLeft, currency)} left from today's ${formatMoney(dailyLimit, currency)} pace.`
      : 'Set a budget and days left to turn on the daily spending chart.';
  const selectedTradeoffPlan = householdData.tradeoffs.find(
    (tradeoff) => tradeoff.id === selectedTradeoff,
  ) ?? {
    amount: 0,
    outcome: 'Add a tradeoff option to compare how spare cash changes each goal.',
  };
  const selectedRole = householdData.roles.find((role) => role.id === activeRole) ?? {
    access: 'Add family members to tailor what each person can see and do.',
  };
  const selectedLifeMode =
    householdData.lifeModes.find((mode) => mode.id === activeLifeMode) ??
    householdData.lifeModes[0];
  const cashflowInsights = getCashflowInsights({
    activity: householdData.activity,
    bills: householdData.bills,
    dailyLimit,
    goals: householdData.goals,
    remainingDays: householdData.remainingDays,
    subscriptions: householdData.subscriptions,
    totalBalance,
  });
  const calculatedForecast = getCalculatedForecast({
    bills: householdData.bills,
    dailyLimit,
    remainingDays: householdData.remainingDays,
    subscriptions: householdData.subscriptions,
    totalBalance,
  });
  const forecastItems = calculatedForecast.length > 0 ? calculatedForecast : householdData.forecast;
  const autopilotSuggestions = [
    ...cashflowInsights.recommendations,
    ...householdData.autopilot.map((suggestion) => ({
      ...suggestion,
      reason: 'User-created rule.',
      source: 'manual',
    })),
  ];
  const calculatedEmotionalInsight = getEmotionalInsight(householdData.activity);
  const emotionalInsight = calculatedEmotionalInsight ?? householdData.emotionalInsight;
  const decisionBill = householdData.bills.find((bill) => bill.hoursAway <= 72) ?? householdData.bills[0];
  const decisionAutopilot = autopilotSuggestions[0];
  const decisionProposal = householdData.proposals.find((proposal) => proposal.status !== 'Approved' && proposal.status !== 'Declined');

  return (
    <div className="dashboard-shell">
      <nav className="top-nav" aria-label="Main workspace controls">
        <button className="nav-button" onClick={onSwitchPortal} type="button">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Switch Portal</span>
        </button>

        <div className="nav-actions">
          <button className="nav-button" onClick={onStartTour} type="button">
            <Sparkles size={17} aria-hidden="true" />
            <span>Tour</span>
          </button>
          <div className="currency-control">
            <label htmlFor="currency-select">Currency</label>
            <select
              id="currency-select"
              value={currency}
              onChange={(event) => onCurrencyChange(event.target.value)}
            >
              {currencyOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <button className="nav-button reset-button" onClick={resetDemo} type="button">
            <RefreshCcw size={17} aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </nav>

      <header className="dashboard-header">
        <div className="dashboard-sign">
          <p className="eyebrow">MAIN Workspace</p>
          <h1>{activeMainPage === 'dashboard' ? 'Dashboard' : 'Manage Money'}</h1>
          <span>
            {activeMainPage === 'dashboard'
              ? 'Household money overview'
              : 'Accounts, imports, transactions, and setup'}
          </span>
        </div>
        <div className="balance-card" aria-label="Total available balance">
          <span className="card-label">Total Available</span>
          <strong>{money(totalBalance)}</strong>
          <span>Add accounts to calculate your available household balance.</span>
        </div>
      </header>

      <section className="main-page-switch" aria-label="Main page switcher">
        <button
          className={activeMainPage === 'dashboard' ? 'selected' : ''}
          onClick={() => setActiveMainPage('dashboard')}
          type="button"
        >
          <ArrowRight size={18} aria-hidden="true" />
          <span>Dashboard</span>
        </button>
        <button
          className={activeMainPage === 'manage' ? 'selected' : ''}
          onClick={() => setActiveMainPage('manage')}
          type="button"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Manage Page</span>
        </button>
      </section>

      {activeMainPage === 'dashboard' ? (
        <>
      <section className="top-graphs" aria-label="Main dashboard graphs">
        <article className="top-graph-card">
          <div className="top-graph-heading">
            <span className="module-icon">
              <Wallet size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Cash Flow</p>
              <h2>Money in vs. money out</h2>
            </div>
          </div>
          <strong className={cashFlowTotal >= 0 ? 'positive' : 'negative'}>{money(cashFlowTotal)}</strong>
          <div className="mini-bars">
            <label>
              <span>Income</span>
              <i style={{ width: `${Math.min((incomeTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%` }} />
              <b>{money(incomeTotal)}</b>
            </label>
            <label>
              <span>Expenses</span>
              <i className="expense-bar" style={{ width: `${Math.min((expenseTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%` }} />
              <b>{money(expenseTotal)}</b>
            </label>
          </div>
          <small>Positive means the household has more coming in than going out.</small>
        </article>

        <article className="top-graph-card">
          <div className="top-graph-heading">
            <span className="module-icon">
              <TrendingUp size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Spending Trend</p>
              <h2>Month pace</h2>
            </div>
          </div>
          <strong>{money(expenseTotal)}</strong>
          <div className="mini-trend">
            {monthlyTrend.map((point) => (
              <label key={point.label}>
                <i style={{ height: `${Math.max((point.value / maxMonthlyTrend) * 100, 8)}%` }} />
                <span>{point.label}</span>
                <b>{money(point.value)}</b>
              </label>
            ))}
          </div>
          <small>Projected adds the remaining daily spending pace to this month.</small>
        </article>

        <article className="top-graph-card">
          <div className="top-graph-heading">
            <span className="module-icon">
              <Landmark size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Account Total</p>
              <h2>Balance by account</h2>
            </div>
          </div>
          <strong>{money(totalBalance)}</strong>
          <div className="mini-line">
            {netWorthPoints.length > 0 ? (
              netWorthPoints.map((point, index) => (
                <i key={`${point.label}-${index}`}>
                  {(() => {
                    const left = `${netWorthPoints.length === 1 ? 50 : (index / (netWorthPoints.length - 1)) * 100}%`;

                    return (
                      <>
                  <span
                    style={{
                      left,
                      bottom: `${50 + (point.value / maxNetWorthPoint) * 38}%`,
                    }}
                  />
                  <b style={{ left }}>{point.label}</b>
                      </>
                    );
                  })()}
                </i>
              ))
            ) : (
              <p>No account data yet</p>
            )}
          </div>
          <small>{householdData.accounts.length || 0} accounts connected. Add accounts below to fill this chart.</small>
        </article>
      </section>

      {hasHouseholdData ? (
      <section className="decision-center" aria-labelledby="decision-center-title">
        <div className="decision-center-heading">
          <p className="eyebrow">Decision Center</p>
          <h2 id="decision-center-title">Needs attention</h2>
        </div>
        <div className="decision-list">
          {decisionBill ? (
            <article className="decision-item">
              <span>Bills due soon</span>
              <strong>{decisionBill.name}</strong>
              <p>{money(decisionBill.amount)} · {decisionBill.due}</p>
              <button
                disabled={!canManageMoney || checkingBalance < decisionBill.amount}
                onClick={() => payBill(decisionBill.id)}
                type="button"
              >
                Pay
              </button>
            </article>
          ) : null}

          {decisionAutopilot ? (
            <article className="decision-item">
              <span>Autopilot idea</span>
              <strong>{decisionAutopilot.action}</strong>
              <p>{money(decisionAutopilot.amount)} · {decisionAutopilot.timing}</p>
              <button
                disabled={!canManageMoney}
                onClick={() => addAutopilotTransfer(decisionAutopilot)}
                type="button"
              >
                Apply
              </button>
            </article>
          ) : null}

          {decisionProposal ? (
            <article className="decision-item">
              <span>Proposal waiting</span>
              <strong>{decisionProposal.title}</strong>
              <p>{decisionProposal.change}</p>
              <button
                disabled={!canCollaborate}
                onClick={() => updateProposalDecision(decisionProposal.id, 'approved')}
                type="button"
              >
                Approve
              </button>
            </article>
          ) : null}

          {!decisionBill && !decisionAutopilot && !decisionProposal ? (
            <EmptyState title="Nothing urgent">Bills, recommendations, and proposals will appear here when they need a decision.</EmptyState>
          ) : null}
        </div>
      </section>
      ) : null}
        </>
      ) : (
        <>

      <section className="accounts-panel" aria-label="Accounts and imports">
        <div className="accounts-summary">
          <div className="setup-heading">
            <div>
              <p className="eyebrow">Accounts</p>
              <h2>Manual connections for the prototype</h2>
            </div>
          </div>
          <div className="account-list">
            {householdData.accounts.length > 0 ? (
              householdData.accounts.map((account) => (
                <button
                  className={transactionAccountId === account.id ? 'account-chip selected' : 'account-chip'}
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  type="button"
                >
                  <span>{account.type}</span>
                  <strong>{account.label}</strong>
                  <b>{money(account.balance)}</b>
                </button>
              ))
            ) : (
              <EmptyState title="No accounts yet">Add checking, savings, credit cards, loans, or cash accounts.</EmptyState>
            )}
          </div>
        </div>

        <div className="account-create-card">
          <label htmlFor="account-name">Account name</label>
          <input
            id="account-name"
            onChange={(event) => setAccountName(event.target.value)}
            placeholder="Family checking"
            type="text"
            value={accountName}
          />
          <label htmlFor="account-type">Type</label>
          <select id="account-type" onChange={(event) => setAccountType(event.target.value)} value={accountType}>
            {accountTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <label htmlFor="account-balance">Starting balance</label>
          <input
            id="account-balance"
            onChange={(event) => setAccountBalance(event.target.value)}
            placeholder="0"
            type="number"
            value={accountBalance}
          />
          <button disabled={!canAddAccount} onClick={addAccount} type="button">Add Account</button>
          <FormMessage id="account-message" tone={formMessages.account ? 'error' : 'hint'}>
            {formMessages.account || (accountName && !canAddAccount ? 'Add a numeric starting balance.' : '')}
          </FormMessage>
        </div>

        <div className="csv-import-card">
          <label htmlFor="csv-import">CSV import</label>
          <textarea
            id="csv-import"
            onChange={(event) => setCsvImportText(event.target.value)}
            placeholder="2026-08-02, Grocery Store, -45.25, Food, Family Checking, expense, weekly groceries"
            value={csvImportText}
          />
          <button disabled={!csvImportText.trim()} onClick={importCsvTransactions} type="button">Import Rows</button>
          <FormMessage id="csv-message" tone={formMessages.csv ? 'error' : 'hint'}>
            {formMessages.csv || 'Format: date, merchant, amount, category, account, type, notes'}
          </FormMessage>
        </div>
      </section>

      <section className="onboarding-data-grid" aria-label="Onboarding and data controls">
        <article className="onboarding-card">
          <div>
            <p className="eyebrow">Quick Start</p>
            <h2>Start from blank</h2>
            <p>
              The Main portal starts empty. Add your own accounts, transactions, bills, and goals,
              or load demo data only when you want to preview a filled dashboard.
            </p>
          </div>
          <button onClick={loadSampleHousehold} type="button">
            <Sparkles size={17} aria-hidden="true" />
            Load Demo Data
          </button>
        </article>

        <article className="data-controls-card">
          <div className="data-controls-header">
            <div>
              <p className="eyebrow">Data & Privacy</p>
              <h2>Local backup controls</h2>
            </div>
            <label className="privacy-toggle">
              <input
                checked={privacyMode}
                onChange={(event) => setPrivacyMode(event.target.checked)}
                type="checkbox"
              />
              <span>Hide amounts</span>
            </label>
          </div>

          <p className="data-note">
            BudgetHQ stores this prototype's data in this browser only. Export a backup before
            clearing local data or moving browsers.
          </p>

          <div className="data-action-row">
            <button onClick={exportJsonBackup} type="button">Export JSON</button>
            <button onClick={exportActivityCsv} type="button">Export CSV</button>
            <button onClick={restoreJsonBackup} type="button">Restore JSON</button>
            <button className="danger-action" onClick={resetDemo} type="button">Clear Local Data</button>
          </div>

          <textarea
            aria-label="BudgetHQ backup text"
            onChange={(event) => setBackupText(event.target.value)}
            placeholder="Exported JSON or CSV preview appears here. Paste a JSON backup here to restore."
            value={backupText}
          />
          <FormMessage id="backup-message" tone={formMessages.backup ? 'error' : 'hint'}>
            {formMessages.backup || 'JSON restores the full household; CSV exports transaction rows only.'}
          </FormMessage>
        </article>
      </section>

      <section className="quick-actions" aria-label="Money actions">
        <div className="money-action">
          <label htmlFor="main-add-money">
            <span>Add Money</span>
            <input
              id="main-add-money"
              min="1"
              onChange={(event) => setDepositAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={depositAmount}
            />
          </label>
          <button disabled={!canAddMoney} onClick={addMoney} type="button">
            Add to Account
          </button>
          <FormMessage id="add-money-message" tone={formMessages.addMoney ? 'error' : 'hint'}>
            {formMessages.addMoney ||
              (depositAmount && !canAddMoney ? 'Amount must be greater than zero.' : '')}
          </FormMessage>
        </div>
        <div className="money-action spending-action">
          <label htmlFor="main-spending-label">
            <span>Log Spending</span>
            <input
              id="main-spending-label"
              onChange={(event) => setSpendLabel(event.target.value)}
              placeholder="What was it?"
              type="text"
              value={spendLabel}
            />
          </label>
          <label htmlFor="main-spending-amount">
            <span>Spending amount</span>
            <input
              id="main-spending-amount"
              min="1"
              onChange={(event) => setSpendAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={spendAmount}
            />
          </label>
          <label htmlFor="main-spending-category">
            <span>Category</span>
            <select
              id="main-spending-category"
              onChange={(event) => setSpendCategory(event.target.value)}
              value={spendCategory}
            >
              {categoryOptions
                .filter((category) => category !== 'Income')
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </label>
          <button disabled={!canLogSpending} onClick={logSpending} type="button">
            Log Purchase
          </button>
          <FormMessage id="log-spending-message" tone={formMessages.logSpending ? 'error' : 'hint'}>
            {formMessages.logSpending ||
              (spendAmount && !canLogSpending
                ? 'Enter an amount covered by the selected account.'
                : '')}
          </FormMessage>
        </div>
      </section>

      <section className="transaction-panel" aria-label="Transaction system">
        <div className="setup-heading">
          <div>
            <p className="eyebrow">Transactions</p>
            <h2>{editingTransactionId ? 'Edit transaction' : 'Add a detailed transaction'}</h2>
          </div>
          <select
            aria-label="Filter transactions"
            onChange={(event) => setTransactionFilter(event.target.value)}
            value={transactionFilter}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="transaction-form">
          <label htmlFor="transaction-account">Account</label>
          <select
            id="transaction-account"
            onChange={(event) => setSelectedAccountId(event.target.value)}
            value={transactionAccountId}
          >
            <option value="">No account</option>
            {householdData.accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.label} · {account.type}
              </option>
            ))}
          </select>
          <label htmlFor="transaction-type">Type</label>
          <select id="transaction-type" onChange={(event) => setTransactionType(event.target.value)} value={transactionType}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <label htmlFor="transaction-date">Date</label>
          <input
            id="transaction-date"
            onChange={(event) => setTransactionDate(event.target.value)}
            type="date"
            value={transactionDate}
          />
          <label htmlFor="transaction-merchant">Merchant</label>
          <input
            id="transaction-merchant"
            onChange={(event) => setTransactionMerchant(event.target.value)}
            placeholder="Merchant"
            type="text"
            value={transactionMerchant}
          />
          <label htmlFor="transaction-amount">Amount</label>
          <input
            id="transaction-amount"
            min="1"
            onChange={(event) => setTransactionAmount(event.target.value)}
            placeholder="0"
            type="number"
            value={transactionAmount}
          />
          <label htmlFor="transaction-category">Category</label>
          <select
            id="transaction-category"
            onChange={(event) => setTransactionCategory(event.target.value)}
            value={transactionCategory}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <label className="transaction-notes" htmlFor="transaction-notes">Notes</label>
          <input
            id="transaction-notes"
            onChange={(event) => setTransactionNotes(event.target.value)}
            placeholder="Optional note"
            type="text"
            value={transactionNotes}
          />
          <div className="transaction-actions">
            <button disabled={!canSaveTransaction} onClick={saveTransaction} type="button">
              {editingTransactionId ? 'Save Edit' : 'Add Transaction'}
            </button>
            {editingTransactionId ? (
              <button className="secondary-action" onClick={resetTransactionForm} type="button">Cancel</button>
            ) : null}
          </div>
          <FormMessage id="transaction-message" tone={formMessages.transaction ? 'error' : 'hint'}>
            {formMessages.transaction || 'Transactions update account balances and analytics immediately.'}
          </FormMessage>
        </div>
      </section>

        </>
      )}

      {activeMainPage === 'dashboard' ? (
        <>
      <section className="charts-section" aria-labelledby="charts-title">
        <div className="charts-heading">
          <p className="eyebrow">Charts</p>
          <h2 id="charts-title">
            Charts <ArrowRight size={19} aria-hidden="true" /> Safe-To-Spend
          </h2>
        </div>

        <article className={`spend-ring-card ${paceStatus.tone}`} aria-label="Safe-to-spend chart">
          <div
            aria-hidden="true"
            className="spend-ring"
            style={{ '--spend-used': `${safeToSpendUsed}%` }}
          >
            <div className="spend-ring-center">
              <strong>{formatMoney(safeToSpendLeft, currency)}</strong>
              <span>left today</span>
            </div>
          </div>
          <div className="spend-ring-copy">
            <span className="chart-pill">{paceStatus.label}</span>
            <h3>Daily spending pace</h3>
            <p>{safeToSpendSummary}</p>
            <div className="chart-stats" aria-label="Safe-to-spend chart values">
              <span>
                <strong>{formatMoney(householdData.spentToday, currency)}</strong>
                spent
              </span>
              <span>
                <strong>{formatMoney(dailyLimit, currency)}</strong>
                daily pace
              </span>
            </div>
          </div>
        </article>
      </section>

        </>
      ) : null}

      {activeMainPage === 'manage' ? (
        <>
      <section className="setup-panel" aria-label="Feature setup">
        <div className="setup-heading">
          <p className="eyebrow">Setup</p>
          <h2>Turn on each BudgetHQ feature</h2>
        </div>

        <div className="setup-grid">
          <div className="setup-action">
            <label htmlFor="budget-amount">Budget left</label>
            <input
              id="budget-amount"
              min="1"
              onChange={(event) => setBudgetAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={budgetAmount}
            />
            <label htmlFor="budget-days">Days left</label>
            <input
              id="budget-days"
              min="1"
              onChange={(event) => setBudgetDays(event.target.value)}
              placeholder="0"
              type="number"
              value={budgetDays}
            />
            <button disabled={!canSaveBudget} onClick={saveBudgetPlan} type="button">Save Budget</button>
            <FormMessage id="budget-message" tone={formMessages.budget ? 'error' : 'hint'}>
              {formMessages.budget ||
                ((budgetAmount || budgetDays) && !canSaveBudget
                  ? 'Budget and days both need positive numbers.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="category-name">Category</label>
            <input
              id="category-name"
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Groceries"
              type="text"
              value={categoryName}
            />
            <label htmlFor="category-budget">Category budget</label>
            <input
              id="category-budget"
              min="1"
              onChange={(event) => setCategoryBudget(event.target.value)}
              placeholder="0"
              type="number"
              value={categoryBudget}
            />
            <label htmlFor="category-group">Group</label>
            <input
              id="category-group"
              onChange={(event) => setCategoryGroup(event.target.value)}
              placeholder="Everyday"
              type="text"
              value={categoryGroup}
            />
            <button disabled={!canAddCategory} onClick={addCategory} type="button">Save Category</button>
            <div className="split-actions">
              <button disabled={householdData.categories.length === 0} onClick={rebalanceCategories} type="button">
                Rebalance
              </button>
              <button disabled={householdData.categories.length === 0} onClick={rolloverCategories} type="button">
                Rollover
              </button>
            </div>
            <FormMessage id="category-message" tone={formMessages.category ? 'error' : 'hint'}>
              {formMessages.category ||
                ((categoryName || categoryBudget) && !canAddCategory
                  ? 'Add a category name and positive budget.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="bill-name">Bill</label>
            <input
              id="bill-name"
              onChange={(event) => setBillName(event.target.value)}
              placeholder="Name"
              type="text"
              value={billName}
            />
            <label htmlFor="bill-amount">Bill amount</label>
            <input
              id="bill-amount"
              min="1"
              onChange={(event) => setBillAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={billAmount}
            />
            <label htmlFor="bill-due">Bill due date</label>
            <input
              id="bill-due"
              onChange={(event) => setBillDue(event.target.value)}
              placeholder="Tomorrow"
              type="text"
              value={billDue}
            />
            <button disabled={!canAddBill} onClick={addBill} type="button">Add Bill</button>
            <FormMessage id="bill-message" tone={formMessages.bill ? 'error' : 'hint'}>
              {formMessages.bill ||
                ((billName || billAmount) && !canAddBill
                  ? 'Add a bill name and positive amount.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="goal-name">Goal</label>
            <input
              id="goal-name"
              onChange={(event) => setGoalName(event.target.value)}
              placeholder="Name"
              type="text"
              value={goalName}
            />
            <label htmlFor="goal-target">Goal target</label>
            <input
              id="goal-target"
              min="1"
              onChange={(event) => setGoalTarget(event.target.value)}
              placeholder="0"
              type="number"
              value={goalTarget}
            />
            <button disabled={!canAddGoal} onClick={addGoal} type="button">Add Goal</button>
            <FormMessage id="goal-message" tone={formMessages.goal ? 'error' : 'hint'}>
              {formMessages.goal ||
                ((goalName || goalTarget) && !canAddGoal
                  ? 'Add a goal name and positive target.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="subscription-name">Subscription</label>
            <input
              id="subscription-name"
              onChange={(event) => setSubscriptionName(event.target.value)}
              placeholder="Name"
              type="text"
              value={subscriptionName}
            />
            <label htmlFor="subscription-amount">Monthly cost</label>
            <input
              id="subscription-amount"
              min="1"
              onChange={(event) => setSubscriptionAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={subscriptionAmount}
            />
            <button disabled={!canAddSubscription} onClick={addSubscription} type="button">Add Subscription</button>
            <FormMessage id="subscription-message" tone={formMessages.subscription ? 'error' : 'hint'}>
              {formMessages.subscription ||
                ((subscriptionName || subscriptionAmount) && !canAddSubscription
                  ? 'Add a name and positive monthly cost.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="role-name">Family role</label>
            <input
              id="role-name"
              onChange={(event) => setRoleName(event.target.value)}
              placeholder="Name"
              type="text"
              value={roleName}
            />
            <label htmlFor="role-access">Role access</label>
            <input
              id="role-access"
              onChange={(event) => setRoleAccess(event.target.value)}
              placeholder="What can they see?"
              type="text"
              value={roleAccess}
            />
            <label htmlFor="role-permission">Permission</label>
            <select
              id="role-permission"
              onChange={(event) => setRolePermission(event.target.value)}
              value={rolePermission}
            >
              {permissionProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
            <button disabled={!canAddRole} onClick={addRole} type="button">Add Role</button>
            <FormMessage id="role-message" tone={formMessages.role ? 'error' : 'hint'}>
              {formMessages.role ||
                ((roleName || roleAccess) && !canAddRole
                  ? 'Add a role name and access note.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="proposal-title">Proposal</label>
            <input
              id="proposal-title"
              onChange={(event) => setProposalTitle(event.target.value)}
              placeholder="Title"
              type="text"
              value={proposalTitle}
            />
            <label htmlFor="proposal-change">Proposal change</label>
            <input
              id="proposal-change"
              onChange={(event) => setProposalChange(event.target.value)}
              placeholder="What changes?"
              type="text"
              value={proposalChange}
            />
            <button disabled={!canAddProposal} onClick={addProposal} type="button">Add Proposal</button>
            <FormMessage id="proposal-message" tone={formMessages.proposal ? 'error' : 'hint'}>
              {formMessages.proposal ||
                ((proposalTitle || proposalChange) && !canAddProposal
                  ? 'Add a title and the proposed change.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="pause-item">Purchase hold</label>
            <input
              id="pause-item"
              onChange={(event) => setPauseItem(event.target.value)}
              placeholder="Item"
              type="text"
              value={pauseItem}
            />
            <label htmlFor="pause-amount">Purchase amount</label>
            <input
              id="pause-amount"
              min="1"
              onChange={(event) => setPauseAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={pauseAmount}
            />
            <button disabled={!canAddPause} onClick={addPause} type="button">Start Hold</button>
            <FormMessage id="pause-message" tone={formMessages.pause ? 'error' : 'hint'}>
              {formMessages.pause ||
                ((pauseItem || pauseAmount) && !canAddPause
                  ? 'Add the purchase and positive amount.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="autopilot-action">Autopilot rule</label>
            <input
              id="autopilot-action"
              onChange={(event) => setAutopilotAction(event.target.value)}
              placeholder="Transfer to savings"
              type="text"
              value={autopilotAction}
            />
            <label htmlFor="autopilot-amount">Autopilot amount</label>
            <input
              id="autopilot-amount"
              min="1"
              onChange={(event) => setAutopilotAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={autopilotAmount}
            />
            <button disabled={!canAddAutopilot} onClick={addAutopilotRule} type="button">Add Rule</button>
            <FormMessage id="autopilot-message" tone={formMessages.autopilot ? 'error' : 'hint'}>
              {formMessages.autopilot ||
                ((autopilotAction || autopilotAmount) && !canAddAutopilot
                  ? 'Add the rule action and positive amount.'
                  : '')}
            </FormMessage>
          </div>
        </div>
      </section>

        </>
      ) : null}

      {activeMainPage === 'dashboard' ? (
        <>
      <section className="insight-strip" aria-label="BudgetHQ signature insights">
        <article className="insight-card mood-card">
          <span className="card-label">Budget Mood</span>
          <strong>{budgetMood.label}</strong>
          <p>{budgetMood.detail}</p>
          <div className="mood-meter" aria-label={`Budget confidence score ${budgetMood.score}`}>
            <span style={{ width: `${budgetMood.score}%` }} />
          </div>
        </article>

        <article className="insight-card">
          <span className="card-label">What Changed?</span>
          {householdData.changes.length > 0 ? (
            <ul className="change-list">
              {householdData.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No changes yet">BudgetHQ will summarize changes after activity exists.</EmptyState>
          )}
        </article>

        <article className="insight-card recovery-card">
          <span className="card-label">No-Shame Recovery</span>
          <strong>Small fix, not a failure.</strong>
          <p>
            {dailyLimit > 0
              ? `Hold extra spending and keep daily purchases under ${formatMoney(
                  dailyLimit,
                  currency,
                )} to stay on pace.`
              : 'Once a budget is added, BudgetHQ will suggest small recovery steps without shame.'}
          </p>
        </article>
      </section>

      <section className="dashboard-grid" aria-label="Household dashboard summary">
        <article className={`dashboard-card pace-card ${paceStatus.tone}`}>
          <div className="card-heading">
            <span className="module-icon">
              <Flame size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Safe-to-Spend Pace</h2>
              <p>{householdData.remainingDays} days left this month</p>
            </div>
          </div>
          <div className="pace-value">
            <strong>{formatMoney(dailyLimit, currency)}</strong>
            <span>/ day</span>
          </div>
          <div className="status-row">
            <span className="status-dot" aria-hidden="true" />
            <span>{paceStatus.label}</span>
          </div>
          <div className="meter-track" aria-label={`${paceStatus.label} spending meter`}>
            <span
              className="meter-fill"
              style={{ width: `${paceMeterWidth}%` }}
            />
          </div>
          <p className="fine-print">
            {formatMoney(householdData.spentToday, currency)} spent today from a{' '}
            {formatMoney(householdData.monthBudgetRemaining, currency)} remaining monthly budget.
          </p>
        </article>

        <article className="dashboard-card reminders-card">
          <div className="card-heading">
            <span className="module-icon">
              <CalendarClock size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Calendar & Reminders</h2>
              <p>Upcoming bills</p>
            </div>
          </div>
          <div className="bill-list">
            {householdData.bills.length > 0 ? (
              householdData.bills.map((bill) => (
                <div className={`bill-item ${bill.hoursAway <= 48 ? 'urgent' : ''}`} key={bill.id}>
                  <div>
                    <strong>{bill.name}</strong>
                    <span>
                      {bill.due}
                      {bill.hoursAway <= 48 ? <em className="urgency-pill">Urgent</em> : null}
                    </span>
                  </div>
                  <span>{formatMoney(bill.amount, currency)}</span>
                  <button
                    aria-label={`Pay ${bill.name}`}
                    disabled={checkingBalance < bill.amount}
                    onClick={() => payBill(bill.id)}
                    type="button"
                  >
                    Pay
                  </button>
                </div>
              ))
            ) : (
              <EmptyState title="No bills yet">Add bills to see reminders and urgency alerts.</EmptyState>
            )}
          </div>
        </article>

        <article className="dashboard-card goals-card">
          <div className="card-heading">
            <span className="module-icon">
              <PiggyBank size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Savings & Budgeting Goals</h2>
              <p>Progress toward household plans</p>
            </div>
          </div>
          <div className="goal-list">
            {householdData.goals.length > 0 ? (
              householdData.goals.map((goal) => {
                const progress = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
                const availableGoalContribution = Math.min(50, goal.target - goal.saved, checkingBalance);

                return (
                  <div className="goal-item" key={goal.id}>
                    <div className="goal-topline">
                      <strong>{goal.name}</strong>
                      <span>{progress}%</span>
                    </div>
                    <div className="goal-amounts">
                      {formatMoney(goal.saved, currency)} saved of {formatMoney(goal.target, currency)}
                    </div>
                    <div className="progress-track">
                      <span className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="contributor-list" aria-label={`${goal.name} family contributions`}>
                      {(goal.contributors ?? []).map((contributor, index) => (
                        <span key={`${goal.id}-${contributor.name}-${index}`}>
                          <b>{contributor.name}</b>
                          {formatMoney(contributor.amount, currency)}
                        </span>
                      ))}
                    </div>
                    <button
                      aria-label={`Add ${formatMoney(availableGoalContribution, currency)} to ${goal.name}`}
                      className="inline-action"
                      disabled={availableGoalContribution <= 0}
                      onClick={() => fundGoal(goal.id)}
                      type="button"
                    >
                      Add {formatMoney(availableGoalContribution, currency)}
                    </button>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No goals yet">Create a goal to start tracking shared progress.</EmptyState>
            )}
          </div>
        </article>

        <article className="dashboard-card analytics-card">
          <div className="card-heading">
            <span className="module-icon">
              <TrendingUp size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Analytics</h2>
              <p>Category spending breakdown</p>
            </div>
          </div>
          {budgetCategories.length > 0 ? (
            <>
              <div className="category-stack" aria-label="Category spending by budget">
                {budgetCategories.map((category) => (
                  <span
                    key={category.id}
                    style={{
                      background: category.color,
                      width: `${totalCategorySpend > 0 ? (category.amount / totalCategorySpend) * 100 : 0}%`,
                    }}
                  />
                ))}
              </div>
              <div className="budget-summary-grid" aria-label="Category budget summary">
                <span>
                  <strong>{formatMoney(categoryBudgetTotal, currency)}</strong>
                  budgeted
                </span>
                <span>
                  <strong>{formatMoney(categoryLeftTotal, currency)}</strong>
                  left
                </span>
                <span>
                  <strong>{formatMoney(totalCategorySpend, currency)}</strong>
                  spent
                </span>
              </div>
              <div className="category-list">
                {budgetCategories.map((category) => {
                  const available = (category.budget ?? 0) + (category.rollover ?? 0);
                  const progress = available > 0 ? Math.min((category.amount / available) * 100, 100) : 0;

                  return (
                    <div className="category-item budget-category-item" key={category.id}>
                      <span className="category-dot" style={{ background: category.color }} />
                      <div>
                        <span>{category.name}</span>
                        <small>
                          {category.group} · {formatMoney(category.rollover ?? 0, currency)} rollover
                        </small>
                        <div className="progress-track" aria-label={`${category.name} budget progress`}>
                          <span className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <strong>
                        {formatMoney(category.amount, currency)}
                        <small>of {formatMoney(available, currency)}</small>
                      </strong>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState title="No categories yet">Create category budgets or add transactions to build analytics.</EmptyState>
          )}
        </article>

        <article className="dashboard-card reports-card">
          <div className="card-heading">
            <span className="module-icon">
              <Landmark size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Reports</h2>
              <p>Cash flow, trends, net worth, and calendar drill-downs</p>
            </div>
          </div>

          <div className="report-grid">
            <section className="report-panel">
              <span>Cash flow</span>
              <strong className={cashFlowTotal >= 0 ? 'positive' : 'negative'}>
                {formatMoney(cashFlowTotal, currency)}
              </strong>
              <div className="income-expense-bars">
                <i style={{ width: `${Math.min((incomeTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%` }} />
                <b style={{ width: `${Math.min((expenseTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%` }} />
              </div>
              <small>
                {formatMoney(incomeTotal, currency)} income · {formatMoney(expenseTotal, currency)} expenses
              </small>
            </section>

            <section className="report-panel">
              <span>Monthly spending trend</span>
              <div className="trend-bars">
                {monthlyTrend.map((point) => (
                  <label key={point.label}>
                    <i style={{ height: `${Math.max((point.value / maxMonthlyTrend) * 100, 8)}%` }} />
                    <small>{point.label}</small>
                  </label>
                ))}
              </div>
            </section>

            <section className="report-panel">
              <span>Net worth line</span>
              <div className="net-worth-line">
                {netWorthPoints.length > 0 ? (
                  netWorthPoints.map((point, index) => (
                    <i
                      key={`${point.label}-${index}`}
                      style={{
                        left: `${netWorthPoints.length === 1 ? 50 : (index / (netWorthPoints.length - 1)) * 100}%`,
                        bottom: `${50 + (point.value / maxNetWorthPoint) * 42}%`,
                      }}
                      title={`${point.label}: ${formatMoney(point.value, currency)}`}
                    />
                  ))
                ) : (
                  <span>No account data</span>
                )}
              </div>
              <small>{formatMoney(totalBalance, currency)} current total</small>
            </section>

            <section className="report-panel calendar-report">
              <span>Calendar view</span>
              <div>
                {calendarEvents.length > 0 ? (
                  calendarEvents.map((event) => (
                    <b className={event.type} key={`${event.label}-${event.meta}`}>
                      {event.meta}
                      <small>{event.label}</small>
                    </b>
                  ))
                ) : (
                  <small>No dated bills or transactions yet</small>
                )}
              </div>
            </section>
          </div>
        </article>

        <article className="dashboard-card activity-card">
          <div className="card-heading">
            <span className="module-icon">
              <ReceiptText size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Transaction Table</h2>
              <p>Search-ready ledger with categories, notes, edit, and delete</p>
            </div>
          </div>
          <div className="transaction-list">
            {visibleTransactions.length > 0 ? (
              visibleTransactions.map((entry) => {
                const account = householdData.accounts.find((item) => item.id === entry.accountId);

                return (
                  <div className="transaction-row" key={entry.id}>
                    <span className="activity-icon" aria-hidden="true">
                      {entry.amount > 0 ? <Wallet size={17} /> : <ReceiptText size={17} />}
                    </span>
                    <div>
                      <strong>{entry.merchant}</strong>
                      <span>
                        {entry.transactionDate || entry.date} · {entry.category || 'Other'} · {account?.label ?? 'No account'}
                      </span>
                      {entry.notes ? <small>{entry.notes}</small> : null}
                    </div>
                    <strong className={entry.amount > 0 ? 'positive' : 'negative'}>
                      {formatMoney(entry.amount, currency)}
                    </strong>
                    <div className="row-actions">
                      <button onClick={() => editTransaction(entry.id)} type="button">Edit</button>
                      <button onClick={() => deleteTransaction(entry.id)} type="button">Delete</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No transactions yet">Add a transaction or import CSV rows to build the ledger.</EmptyState>
            )}
          </div>
        </article>

        <article className="dashboard-card forecast-card">
          <div className="card-heading">
            <span className="module-icon">
              <TrendingUp size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Safe-to-Spend Forecast</h2>
              <p>How today changes the next month</p>
            </div>
          </div>
          <div className="forecast-list">
            {forecastItems.length > 0 ? (
              forecastItems.map((period) => (
                <div className="forecast-item" key={period.id}>
                  <span>{period.label}</span>
                  <strong>{formatMoney(period.safeSpend, currency)}</strong>
                  <small>{period.note}</small>
                </div>
              ))
            ) : (
              <EmptyState title="No forecast yet">Add a budget and bills to generate a forecast.</EmptyState>
            )}
          </div>
        </article>

        <article className="dashboard-card stress-card">
          <div className="card-heading">
            <span className="module-icon">
              <HeartPulse size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Bill Stress Radar</h2>
              <p>Pressure weeks before they hit</p>
            </div>
          </div>
          <div className="stress-list">
            {householdData.pressureWeeks.length > 0 ? (
              householdData.pressureWeeks.map((week) => (
                <div className={`stress-item ${week.level}`} key={week.id}>
                  <div>
                    <strong>{week.label}</strong>
                    <span>{week.bills} bills stacked</span>
                  </div>
                  <span>{formatMoney(week.total, currency)}</span>
                </div>
              ))
            ) : (
              <EmptyState title="No pressure weeks yet">Bill timing will appear after bills are added.</EmptyState>
            )}
          </div>
        </article>

        <article className="dashboard-card proposals-card">
          <div className="card-heading">
            <span className="module-icon">
              <Users size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Household Negotiation</h2>
              <p>Shared budget changes with a decision trail</p>
            </div>
          </div>
          <div className="proposal-list">
            {householdData.proposals.length > 0 ? (
              householdData.proposals.map((proposal) => {
                const approved = approvedProposal === proposal.id;

                return (
                  <div className={`proposal-item ${approved ? 'approved' : ''}`} key={proposal.id}>
                    <div>
                      <strong>{proposal.title}</strong>
                      <span>{proposal.change}</span>
                      <small>
                        {proposal.status ?? 'Pending'} · Created by {proposal.createdBy ?? 'You'} · {proposal.impact}
                      </small>
                    </div>
                    <div className="vote-actions">
                      <button
                        aria-label={`Approve ${proposal.title}`}
                        disabled={!canCollaborate}
                        onClick={() => updateProposalDecision(proposal.id, 'approved')}
                        type="button"
                      >
                        <Check size={16} aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`Decline ${proposal.title}`}
                        disabled={!canCollaborate}
                        onClick={() => updateProposalDecision(proposal.id, 'declined')}
                        type="button"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="proposal-thread">
                      {(proposal.votes ?? []).length > 0 ? (
                        <div className="proposal-meta-list">
                          {(proposal.votes ?? []).map((vote) => (
                            <span key={`${proposal.id}-${vote.memberId}`}>
                              {vote.name} {vote.decision}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {(proposal.comments ?? []).map((comment) => (
                        <p className="proposal-comment" key={comment.id}>
                          <strong>{comment.name}</strong>
                          {comment.body}
                        </p>
                      ))}
                      <div className="proposal-comment-form">
                        <input
                          aria-label={`Comment on ${proposal.title}`}
                          disabled={!canCollaborate}
                          onChange={(event) =>
                            setProposalCommentDrafts((current) => ({
                              ...current,
                              [proposal.id]: event.target.value,
                            }))
                          }
                          placeholder="Add a decision note"
                          type="text"
                          value={proposalCommentDrafts[proposal.id] ?? ''}
                        />
                        <button
                          disabled={!canCollaborate || !proposalCommentDrafts[proposal.id]?.trim()}
                          onClick={() => addProposalComment(proposal.id)}
                          type="button"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No proposals yet">Budget change proposals will appear here.</EmptyState>
            )}
            <FormMessage id="proposal-decision-message" tone="error">
              {formMessages.proposalDecision}
            </FormMessage>
          </div>
        </article>

        <article className="dashboard-card pause-card">
          <div className="card-heading">
            <span className="module-icon">
              <PauseCircle size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Purchase Pause Timer</h2>
              <p>Slow down nonessential buys</p>
            </div>
          </div>
          {householdData.purchasePause ? (
            <div className="pause-panel">
              <div>
                <strong>{householdData.purchasePause.item}</strong>
                <span>{formatMoney(householdData.purchasePause.amount, currency)}</span>
                <small>{householdData.purchasePause.reason}</small>
              </div>
              <button
                className={pausedPurchase ? 'pause-active' : ''}
                onClick={() => setPausedPurchase((current) => !current)}
                type="button"
              >
                {pausedPurchase ? `${householdData.purchasePause.holdHours}h Hold Active` : 'Start Hold'}
              </button>
            </div>
          ) : (
            <EmptyState title="No paused purchases">Optional holds will appear when a purchase is added.</EmptyState>
          )}
        </article>

        <article className="dashboard-card tradeoff-card">
          <div className="card-heading">
            <span className="module-icon">
              <Shuffle size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Goal Tradeoff Simulator</h2>
              <p>Compare one dollar, three futures</p>
            </div>
          </div>
          {householdData.tradeoffs.length > 0 && selectedTradeoffPlan ? (
            <>
              <div className="segmented-control" aria-label="Tradeoff options">
                {householdData.tradeoffs.map((tradeoff) => (
                  <button
                    className={selectedTradeoff === tradeoff.id ? 'selected' : ''}
                    key={tradeoff.id}
                    onClick={() => setSelectedTradeoff(tradeoff.id)}
                    type="button"
                  >
                    {tradeoff.label}
                  </button>
                ))}
              </div>
              <div className="simulator-result">
                <strong>{formatMoney(selectedTradeoffPlan.amount, currency)}</strong>
                <span>{selectedTradeoffPlan.outcome}</span>
              </div>
            </>
          ) : (
            <EmptyState title="No tradeoffs yet">Add goals to compare where the next dollar should go.</EmptyState>
          )}
        </article>

        <article className="dashboard-card roles-card">
          <div className="card-heading">
            <span className="module-icon">
              <Users size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Family Money Roles</h2>
              <p>Different views for different people</p>
            </div>
          </div>
          {householdData.roles.length > 0 && selectedRole ? (
            <>
              <div className="role-tabs" aria-label="Family role views">
                {householdData.roles.map((role) => (
                  <button
                    className={activeRole === role.id ? 'selected' : ''}
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    type="button"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <div className="role-summary">
                <strong>
                  {permissionProfiles.find((profile) => profile.id === activePermission)?.label ?? 'Admin'} mode
                </strong>
                <span>{selectedRole.access}</span>
                <small>
                  {permissionProfiles.find((profile) => profile.id === activePermission)?.detail ??
                    permissionProfiles[0].detail}
                </small>
              </div>
              <div className="notification-list" aria-label="Household notifications">
                {(householdData.notifications ?? []).length > 0 ? (
                  householdData.notifications.map((notification) => (
                    <div className="notification-item" key={notification.id}>
                      <strong>{notification.actor}</strong>
                      <span>{notification.message}</span>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No household updates">Votes, comments, and member changes will appear here.</EmptyState>
                )}
              </div>
            </>
          ) : (
            <EmptyState title="No family roles yet">Add household members to customize their views.</EmptyState>
          )}
        </article>

        <article className="dashboard-card emotion-card">
          <div className="card-heading">
            <span className="module-icon">
              <HeartPulse size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Emotional Spending Check-In</h2>
              <p>Pattern-aware, optional nudges</p>
            </div>
          </div>
          {emotionalInsight ? (
            <div className="insight-panel">
              <span>{emotionalInsight.trigger}</span>
              <strong>{emotionalInsight.pattern}</strong>
              <small>{emotionalInsight.nudge}</small>
            </div>
          ) : (
            <EmptyState title="No patterns yet">Spending patterns will appear after activity exists.</EmptyState>
          )}
        </article>

        <article className="dashboard-card subscription-card">
          <div className="card-heading">
            <span className="module-icon">
              <ReceiptText size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Subscription Usefulness</h2>
              <p>Recurring spend with value signals</p>
            </div>
          </div>
          <div className="subscription-list">
            {householdData.subscriptions.length > 0 ? (
              householdData.subscriptions.map((subscription) => (
                <div className="subscription-item" key={subscription.id}>
                  <div>
                    <strong>{subscription.name}</strong>
                    <span>{formatMoney(subscription.amount, currency)} / month</span>
                  </div>
                  <div className="score-pill">
                    <span>{subscription.useScore}</span>
                    <small>{subscription.status}</small>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No subscriptions yet">Recurring payments will show up here once added.</EmptyState>
            )}
          </div>
        </article>

        <article className="dashboard-card autopilot-card">
          <div className="card-heading">
            <span className="module-icon">
              <Landmark size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Cashflow Autopilot</h2>
              <p>Suggested transfer timing</p>
            </div>
          </div>
          <div className="autopilot-list">
            {autopilotSuggestions.length > 0 ? (
              autopilotSuggestions.map((suggestion) => {
                const isReviewAction = suggestion.action === 'Review recurring subscriptions';
                const canApplySuggestion =
                  canManageMoney &&
                  (isReviewAction || suggestion.action.startsWith('Move extra cash to ') || checkingBalance >= suggestion.amount);

                return (
                  <div className={`autopilot-item ${suggestion.source}`} key={suggestion.id}>
                    <strong>{suggestion.action}</strong>
                    <span>
                      {formatMoney(suggestion.amount, currency)} · {suggestion.timing}
                    </span>
                    <small>{suggestion.reason}</small>
                    <button
                      aria-label={`Apply ${suggestion.action}`}
                      disabled={!canApplySuggestion}
                      onClick={() => addAutopilotTransfer(suggestion)}
                      type="button"
                    >
                      {suggestion.source === 'calculated' ? 'Apply Recommendation' : 'Apply Rule'}
                    </button>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No autopilot yet">Add accounts, income, bills, subscriptions, or goals to generate recommendations.</EmptyState>
            )}
            <FormMessage id="permission-message" tone="error">{formMessages.permission}</FormMessage>
          </div>
        </article>

        <article className="dashboard-card life-mode-card">
          <div className="card-heading">
            <span className="module-icon">
              {activeLifeMode === 'baby' ? (
                <Baby size={20} aria-hidden="true" />
              ) : (
                <Sparkles size={20} aria-hidden="true" />
              )}
            </span>
            <div>
              <h2>Life Event Budget Modes</h2>
              <p>One tap reshapes priorities</p>
            </div>
          </div>
          <div className="mode-grid" aria-label="Life event modes">
            {householdData.lifeModes.map((mode) => (
              <button
                className={activeLifeMode === mode.id ? 'selected' : ''}
                key={mode.id}
                onClick={() => setActiveLifeMode(mode.id)}
                type="button"
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="mode-summary">{selectedLifeMode.headline}</p>
        </article>
      </section>
        </>
      ) : null}
      {showTour ? (
        <TourOverlay
          onClose={onTourComplete}
          steps={tourContent.main}
          workspaceName="Main Workspace"
        />
      ) : null}
    </div>
  );
}

function App() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [activeTour, setActiveTour] = useState(null);

  const completeTour = (workspaceId) => {
    markTourSeen(workspaceId);
    setActiveTour(null);
  };

  const chooseWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setActiveTour(shouldShowFirstTour(workspace.id) ? workspace.id : null);
  };

  if (selectedWorkspace?.id === 'kids') {
    return (
      <KidsPortal
        onBack={() => setSelectedWorkspace(null)}
        onStartTour={() => setActiveTour('kids')}
        onTourComplete={() => completeTour('kids')}
        showTour={activeTour === 'kids'}
        tourSteps={tourContent.kids}
      />
    );
  }

  if (selectedWorkspace?.id === 'main') {
    return (
      <main className="app-shell dashboard-app main-background">
        <MainWorkspace
          currency={currency}
          onCurrencyChange={setCurrency}
          onReset={() => setCurrency('USD')}
          onStartTour={() => setActiveTour('main')}
          onSwitchPortal={() => setSelectedWorkspace(null)}
          onTourComplete={() => completeTour('main')}
          showTour={activeTour === 'main'}
        />
      </main>
    );
  }

  return (
    <main className="app-shell welcome-shell">
      <section className="welcome-panel" aria-labelledby="app-title">
        <div className="welcome-sign">
          <p className="eyebrow">Household Money Command Center</p>
          <h1 id="app-title">BudgetHQ</h1>
          <p>
            A shared budgeting dashboard for tracking household cashflow, bills, safe-to-spend
            limits, savings goals, and kid-friendly money habits.
          </p>
        </div>

        <div className="workspace-grid" aria-label="Workspace options">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;

            return (
              <button
                className={`workspace-card ${workspace.id}-workspace-card`}
                key={workspace.id}
                onClick={() => chooseWorkspace(workspace)}
                type="button"
              >
                <span className="workspace-icon" aria-hidden="true">
                  <Icon size={32} strokeWidth={2.1} />
                </span>
                <span className="workspace-content">
                  <span className="workspace-kicker">{workspace.kicker}</span>
                  <span className="workspace-title">{workspace.label}</span>
                  <span className="workspace-subtitle">{workspace.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export { addActivityToData, getBudgetMood, getPaceStatus };

export default App;
