import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BookOpen,
  CalendarDays,
  CalendarClock,
  Check,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  Coins,
  Flag,
  HeartPulse,
  Flame,
  Landmark,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  MousePointer2,
  PauseCircle,
  Pencil,
  PiggyBank,
  Plus,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Shuffle,
  Sparkles,
  TrendingUp,
  Trash2,
  Trophy,
  Upload,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AchievementShelf from './AchievementShelf.jsx';
import IncomeAllocationFlow from './IncomeAllocationFlow.jsx';
import KidsPortal from './KidsPortal.jsx';
import SummaryPortal from './SummaryPortal.jsx';
import TipsPortal from './TipsPortal.jsx';
import { getMainAchievementBadges } from './achievementBadges.js';
import { requestBudgetAssistant } from './budgetAssistantClient.js';
import { getBudgetGuideQuestions } from './budgetGuideQuestions.js';

const workspaces = [
  {
    id: 'main',
    icon: ShieldCheck,
    label: 'MAIN',
    kicker: 'Household Command',
    subtitle: 'Household budgets, bills, groceries & Safe-to-Spend pacing.',
    status: 'Full dashboard',
    cta: 'Open household tools',
    previewItems: ['Cashflow', 'Bills', 'Safe-to-Spend'],
  },
  {
    id: 'kids',
    icon: Coins,
    label: 'KIDS',
    kicker: 'Youth Savings',
    subtitle: 'Personal savings tracker, goals & allowance log.',
    status: 'Kid mode',
    cta: 'Open savings quests',
    previewItems: ['Goals', 'Allowance', 'Approvals'],
  },
  {
    id: 'tips',
    icon: Lightbulb,
    label: 'TIPS',
    kicker: 'Everyday Spending',
    subtitle:
      'Clear, practical budgeting tips for everyday spending and saving.',
    status: 'Advice library',
    cta: 'Read money tips',
    previewItems: ['Habits', 'Shopping', 'Planning'],
  },
  {
    id: 'summary',
    icon: TrendingUp,
    label: 'SUMMARY',
    kicker: 'Household Snapshot',
    subtitle: 'Balances, bills, goals & recent spending in one concise view.',
    status: 'Quick readout',
    cta: 'Open summary',
    previewItems: ['Income', 'Expenses', 'Charts'],
  },
];

const homeHighlights = [
  '4 focused portals',
  'Demo data stays local',
  'Built for adults and kids',
];

const ageQuestion = {
  id: 'ageGroup',
  eyebrow: 'First, a quick check',
  title: 'Are you less than 13 years old?',
  detail: 'We only use this answer to choose the right BudgetHQ experience.',
  options: [
    {
      value: 'under13',
      label: 'Yes, I am under 13',
      detail: 'Use simpler questions and recommend the Kids portal.',
    },
    {
      value: '13plus',
      label: 'No, I am 13 or older',
      detail: 'Continue with questions for the Main budgeting dashboard.',
    },
  ],
};

const adultOnboardingQuestions = [
  {
    id: 'experience',
    eyebrow: 'Your experience',
    title: 'How familiar are you with budgeting?',
    detail: 'This changes how much guidance BudgetHQ shows as you get started.',
    options: [
      {
        value: 'new',
        label: 'I am new to it',
        detail: 'Show clear next steps and keep financial language simple.',
      },
      {
        value: 'some',
        label: 'I know the basics',
        detail: 'Give me useful guidance without explaining every detail.',
      },
      {
        value: 'confident',
        label: 'I am confident',
        detail: 'Keep things compact and let the numbers lead.',
      },
    ],
  },
  {
    id: 'priority',
    eyebrow: 'Your main goal',
    title: 'What would you most like BudgetHQ to help with?',
    detail: 'Your answer becomes the first focus on the Main dashboard.',
    options: [
      {
        value: 'spending',
        label: 'Control spending',
        detail: 'See where money goes and build a safer daily pace.',
      },
      {
        value: 'bills',
        label: 'Stay ahead of bills',
        detail: 'Make due dates, urgency, and cash needs easier to scan.',
      },
      {
        value: 'savings',
        label: 'Grow savings',
        detail: 'Track goals and understand the trade-offs between them.',
      },
      {
        value: 'debt',
        label: 'Pay down debt',
        detail: 'Keep balances and planned payments in view.',
      },
      {
        value: 'kids',
        label: 'Teach kids about money',
        detail: 'Make chores, saving, spending, and donating feel concrete.',
      },
    ],
  },
  {
    id: 'household',
    eyebrow: 'Your household',
    title: 'Who are you budgeting for?',
    detail: 'This helps BudgetHQ choose the most useful household language.',
    options: [
      {
        value: 'solo',
        label: 'Just me',
        detail: 'A focused personal plan with fewer shared-money prompts.',
      },
      {
        value: 'couple',
        label: 'Me and a partner',
        detail: 'A shared view for two people making decisions together.',
      },
      {
        value: 'family',
        label: 'My family',
        detail: 'Household goals, bills, and everyday spending in one place.',
      },
      {
        value: 'family-kids',
        label: 'My family and kids',
        detail: 'Include kid-friendly money habits alongside the main budget.',
      },
    ],
  },
  {
    id: 'guidance',
    eyebrow: 'Your dashboard style',
    title: 'How much guidance would you like?',
    detail: 'You can change this later from Preferences in the Main portal.',
    options: [
      {
        value: 'guided',
        label: 'Guide me step by step',
        detail: 'Lead with one clear action and explain why it matters.',
      },
      {
        value: 'balanced',
        label: 'A balanced amount',
        detail: 'Show helpful context while keeping the dashboard efficient.',
      },
      {
        value: 'minimal',
        label: 'Keep it minimal',
        detail: 'Prioritize totals, status, and quick actions.',
      },
    ],
  },
];

const kidOnboardingQuestions = [
  {
    id: 'kidMoneyGoal',
    eyebrow: 'Your money goal',
    title: 'What would you most like to do with your money?',
    detail:
      'There is no wrong answer. This helps make your portal feel useful.',
    options: [
      {
        value: 'save',
        label: 'Save for something I want',
        detail: 'Make a savings quest and watch it grow.',
      },
      {
        value: 'spend',
        label: 'Learn to spend wisely',
        detail: 'Practice choosing what is worth buying.',
      },
      {
        value: 'share',
        label: 'Save, spend, and share',
        detail: 'Split money between goals, fun, and helping others.',
      },
    ],
  },
  {
    id: 'kidMoneySource',
    eyebrow: 'How you earn',
    title: 'How do you usually get money?',
    detail: 'The Kids portal can make these money moves easier to follow.',
    options: [
      {
        value: 'chores',
        label: 'Chores and jobs',
        detail: 'Earn rewards by finishing real tasks.',
      },
      {
        value: 'allowance',
        label: 'Allowance',
        detail: 'Keep track of money added on a regular schedule.',
      },
      {
        value: 'gifts',
        label: 'Gifts or special occasions',
        detail: 'Decide what to save, spend, or share when money arrives.',
      },
      {
        value: 'mix',
        label: 'A mix of these',
        detail: 'Track chores, allowance, and other money together.',
      },
    ],
  },
  {
    id: 'kidSavingGoal',
    eyebrow: 'Your first quest',
    title: 'What kind of thing would you like to save for?',
    detail: 'Your answer helps BudgetHQ suggest a good first savings quest.',
    options: [
      {
        value: 'soon',
        label: 'Something small or soon',
        detail: 'Start with a goal that can be reached quickly.',
      },
      {
        value: 'big',
        label: 'Something big',
        detail: 'Build a longer quest and celebrate progress along the way.',
      },
      {
        value: 'unsure',
        label: 'I am not sure yet',
        detail: 'Explore the portal first and choose a quest later.',
      },
    ],
  },
  {
    id: 'guidance',
    eyebrow: 'How you want to learn',
    title: 'How much help would you like?',
    detail: 'You can change your answers later from Preferences.',
    options: [
      {
        value: 'guided',
        label: 'Show me one step at a time',
        detail: 'Give me simple directions as I use my money box.',
      },
      {
        value: 'balanced',
        label: 'Give me a few helpful tips',
        detail: 'Explain important choices and let me explore too.',
      },
      {
        value: 'minimal',
        label: 'Let me explore',
        detail: 'Keep instructions short and show the main choices.',
      },
    ],
  },
];

function parseMoneyStoryDate(value, referenceDate) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  if (/^(today|just now)$/i.test(text)) {
    return new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
    );
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    return new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3]),
    );
  }

  const datedValue = new Date(`${text}, ${referenceDate.getFullYear()}`);

  return Number.isNaN(datedValue.getTime()) ? null : datedValue;
}

export function buildMonthlyMoneyStory(
  householdData = {},
  referenceDate = new Date(),
) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const groupedEvents = new Map();
  const totals = { bill: 0, income: 0, savings: 0, spending: 0 };

  const addEvent = ({ amount, date, label, type }) => {
    const parsedDate = parseMoneyStoryDate(date, referenceDate);
    const absoluteAmount = Math.abs(Number(amount) || 0);

    if (
      !parsedDate ||
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month ||
      absoluteAmount <= 0
    ) {
      return;
    }

    const day = parsedDate.getDate();
    const key = `${type}-${day}`;
    const existing = groupedEvents.get(key);

    totals[type] += absoluteAmount;
    groupedEvents.set(key, {
      amount: (existing?.amount ?? 0) + absoluteAmount,
      count: (existing?.count ?? 0) + 1,
      day,
      id: key,
      labels: [...(existing?.labels ?? []), label].filter(Boolean),
      type,
    });
  };

  (householdData.activity ?? []).forEach((entry) => {
    const category = String(entry.category ?? '').toLowerCase();
    const merchant = String(entry.merchant ?? 'Activity');
    const isSavings =
      category === 'savings' ||
      /contribution|savings|emergency fund|move to/i.test(merchant);

    addEvent({
      amount: entry.amount,
      date: entry.transactionDate || entry.date,
      label: merchant,
      type: entry.amount >= 0 ? 'income' : isSavings ? 'savings' : 'spending',
    });
  });

  (householdData.bills ?? []).forEach((bill) => {
    addEvent({
      amount: bill.amount,
      date: bill.due,
      label: bill.name,
      type: 'bill',
    });
  });

  const groupedValues = Array.from(groupedEvents.values());
  const maxAmount = Math.max(...groupedValues.map((event) => event.amount), 1);
  const typeOrder = { income: 0, savings: 1, bill: 2, spending: 3 };
  const events = groupedValues
    .sort((a, b) => a.day - b.day || typeOrder[a.type] - typeOrder[b.type])
    .map((event) => ({
      ...event,
      direction:
        event.type === 'income' || event.type === 'savings' ? 'up' : 'down',
      height: Math.round(24 + (event.amount / maxAmount) * 66),
      position:
        daysInMonth === 1 ? 50 : ((event.day - 1) / (daysInMonth - 1)) * 100,
    }));

  const lanePositions = {
    down: [-100, -100, -100],
    up: [-100, -100, -100],
  };

  events.forEach((event) => {
    const directionLanes = lanePositions[event.direction];
    let labelLane = directionLanes.findIndex(
      (lastPosition) => event.position - lastPosition >= 12,
    );

    if (labelLane === -1) {
      labelLane = directionLanes.indexOf(Math.min(...directionLanes));
    }

    directionLanes[labelLane] = event.position;
    event.labelLane = labelLane;
  });

  return {
    daysInMonth,
    events,
    label: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(referenceDate),
    totals,
  };
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildWeeklySpendingHeatmap(
  activity = [],
  referenceDate = new Date(),
) {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const mondayOffset = (today.getDay() + 6) % 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - mondayOffset - 21);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 27);
  const spendingByDate = new Map();

  activity.forEach((entry) => {
    const amount = Number(entry.amount) || 0;
    const category = String(entry.category ?? '').toLowerCase();
    const merchant = String(entry.merchant ?? '');
    const isSavings =
      category === 'savings' ||
      /contribution|savings|emergency fund|move to/i.test(merchant);

    if (amount >= 0 || isSavings) {
      return;
    }

    const parsedDate = parseMoneyStoryDate(
      entry.transactionDate || entry.date,
      referenceDate,
    );

    if (!parsedDate) {
      return;
    }

    const date = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    );

    if (date < startDate || date > endDate) {
      return;
    }

    const key = getLocalDateKey(date);
    spendingByDate.set(key, (spendingByDate.get(key) ?? 0) + Math.abs(amount));
  });

  const maxDailySpend = Math.max(...spendingByDate.values(), 0);
  const longDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  });
  const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
  });
  const days = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = getLocalDateKey(date);
    const amount = spendingByDate.get(key) ?? 0;

    return {
      amount,
      dayNumber: date.getDate(),
      isFuture: date > today,
      isToday: key === getLocalDateKey(today),
      key,
      label: longDateFormatter.format(date),
      level:
        amount > 0 && maxDailySpend > 0
          ? Math.max(1, Math.ceil((amount / maxDailySpend) * 4))
          : 0,
    };
  });
  const spendingDays = days.filter((day) => day.amount > 0);

  return {
    activeDays: spendingDays.length,
    days,
    maxDailySpend,
    periodLabel: `${shortDateFormatter.format(startDate)} - ${shortDateFormatter.format(endDate)}`,
    totalSpent: spendingDays.reduce((sum, day) => sum + day.amount, 0),
  };
}

const dailyMoneyTips = [
  'Name one priority before you spend. Clear choices make budgets easier.',
  'Check upcoming bills before deciding what is safe to spend today.',
  'A small automatic transfer can build a goal without extra decisions.',
  'Review subscriptions regularly and keep only the ones you still use.',
  'Give every new expense a category so your charts stay useful.',
  'Plan one low-cost day this week and move the difference toward a goal.',
  'Talk about one money win as a household, even if it feels small.',
];

function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

function getDailyMoneyTip(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / 86400000);

  return dailyMoneyTips[dayOfYear % dailyMoneyTips.length];
}

const currencyOptions = [
  'USD',
  'CAD',
  'EUR',
  'GBP',
  'AUD',
  'NZD',
  'JPY',
  'CNY',
  'INR',
  'KRW',
  'SGD',
  'HKD',
  'MXN',
  'BRL',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'ZAR',
  'AED',
  'SAR',
];
const accountTypes = [
  'Checking',
  'Savings',
  'Credit Card',
  'Loan',
  'Investment',
  'Cash',
];
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
const categoryIcons = {
  Bills: '🧾',
  Debt: '↘',
  Food: '🍽',
  Income: '↗',
  Kids: '★',
  Other: '•',
  Savings: '◇',
  Shopping: '◼',
  Transport: '↔',
};
const essentialSpendingCategories = ['Bills', 'Food', 'Transport'];
const permissionProfiles = [
  {
    detail:
      'Full household view with accounts, bills, subscriptions, roles, and money movement.',
    id: 'parent',
    label: 'Parent',
  },
  {
    detail:
      'Shared planning view for goals, categories, proposals, and recurring costs without payment controls.',
    id: 'teen',
    label: 'Teen',
  },
  {
    detail:
      'Kid-safe view focused on goals, saving choices, and simple activity.',
    id: 'kid',
    label: 'Kid',
  },
  {
    detail:
      'Read-only household view for reviewing the shared plan without changing money.',
    id: 'viewer',
    label: 'Viewer',
  },
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
  spendingPause: {
    active: false,
    allowedCategories: ['Bills', 'Food', 'Transport'],
    reason:
      'Pause non-essential spending and keep only bills, groceries, and needed expenses visible.',
  },
  tradeoffs: [],
  roles: [],
  notifications: [],
  emotionalInsight: null,
  subscriptions: [],
  autopilot: [],
  lifeModes: [
    { id: 'normal', label: 'Normal', headline: 'Balanced household rhythm' },
    {
      id: 'moving',
      label: 'Moving',
      headline: 'Deposits, movers, and setup costs prioritized',
    },
    {
      id: 'baby',
      label: 'New Baby',
      headline: 'Medical, supplies, and leave planning surfaced',
    },
    {
      id: 'debt',
      label: 'Debt Sprint',
      headline: 'Extra cash routes toward payoff momentum',
    },
  ],
  changes: [],
};

const sampleHouseholdData = {
  ...startingHouseholdData,
  accounts: [
    {
      balance: 3280.45,
      id: 'sample-checking',
      label: 'Household Checking',
      type: 'Checking',
    },
    {
      balance: 6850,
      id: 'sample-savings',
      label: 'Emergency Savings',
      type: 'Savings',
    },
    {
      balance: -1240.32,
      id: 'sample-card',
      label: 'Family Rewards Card',
      type: 'Credit Card',
    },
  ],
  remainingDays: 18,
  monthBudgetRemaining: 2150,
  spentToday: 84.75,
  bills: [
    {
      amount: 1420,
      due: 'Aug 5',
      hoursAway: 24,
      id: 'sample-rent',
      name: 'Rent',
    },
    {
      amount: 168.4,
      due: 'Aug 8',
      hoursAway: 96,
      id: 'sample-electric',
      name: 'Electric',
    },
    {
      amount: 92,
      due: 'Aug 12',
      hoursAway: 168,
      id: 'sample-internet',
      name: 'Internet',
    },
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
    {
      amount: 640.8,
      color: categoryColors.Food,
      id: 'sample-food',
      name: 'Food',
    },
    {
      amount: 318.2,
      color: categoryColors.Transport,
      id: 'sample-transport',
      name: 'Transport',
    },
    {
      amount: 214.9,
      color: categoryColors.Kids,
      id: 'sample-kids',
      name: 'Kids',
    },
    {
      amount: 189.4,
      color: categoryColors.Shopping,
      id: 'sample-shopping',
      name: 'Shopping',
    },
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
    {
      id: 'sample-forecast-7',
      label: '7 days',
      note: 'Rent week leaves a smaller daily lane.',
      safeSpend: 119.44,
    },
    {
      id: 'sample-forecast-14',
      label: '14 days',
      note: 'Cushion stays intact if food spending holds.',
      safeSpend: 107.5,
    },
    {
      id: 'sample-forecast-30',
      label: '30 days',
      note: 'Goal transfers remain possible at this pace.',
      safeSpend: 95.55,
    },
  ],
  pressureWeeks: [
    {
      bills: 2,
      id: 'sample-pressure-this-week',
      label: 'This week',
      level: 'high',
      total: 1588.4,
    },
    {
      bills: 1,
      id: 'sample-pressure-next-week',
      label: 'Next week',
      level: 'medium',
      total: 92,
    },
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
  spendingPause: {
    active: false,
    allowedCategories: ['Bills', 'Food', 'Transport'],
    reason:
      'Pause non-essential spending and keep only bills, groceries, and needed expenses visible.',
  },
  tradeoffs: [
    {
      amount: 50,
      id: 'sample-emergency',
      label: 'Emergency',
      outcome: '$50 increases emergency coverage.',
    },
    {
      amount: 50,
      id: 'sample-vacation',
      label: 'Trip',
      outcome: '$50 gets the Fall Trip closer.',
    },
    {
      amount: 50,
      id: 'sample-card',
      label: 'Card',
      outcome: '$50 lowers credit card balance.',
    },
  ],
  roles: [
    {
      access: 'Can see all household cards and approve proposals.',
      id: 'sample-adult',
      label: 'Parent',
      permission: 'parent',
    },
    {
      access: 'Can see goals, chores, and kid-safe activity only.',
      id: 'sample-kid',
      label: 'Kid',
      permission: 'kid',
    },
    {
      access: 'Can review goals, subscriptions, and shared decisions.',
      id: 'sample-teen',
      label: 'Teen',
      permission: 'teen',
    },
  ],
  emotionalInsight: {
    nudge: 'Plan a snack run before errands to keep impulse spending low.',
    pattern: 'Food spending spikes on long errand days.',
    trigger: 'Grocery and fuel runs',
  },
  subscriptions: [
    {
      amount: 15.99,
      id: 'sample-streaming',
      name: 'StreamBox',
      status: 'Keep',
      useScore: 84,
    },
    {
      amount: 12.99,
      id: 'sample-app',
      name: 'Photo Cloud',
      previousAmount: 9.99,
      status: 'Price increased',
      useScore: 48,
    },
  ],
  autopilot: [
    {
      action: 'Move to emergency fund',
      amount: 100,
      id: 'sample-auto-emergency',
      timing: 'After rent clears',
    },
    {
      action: 'Pay extra to card',
      amount: 75,
      id: 'sample-auto-card',
      timing: 'If weekly food stays under plan',
    },
  ],
  changes: [
    'Sample household loaded with accounts, bills, goals, and activity.',
    'Rent week marked as high pressure.',
    "Food spending is on today's watch list.",
  ],
};

const tourContent = {
  main: [
    {
      body: 'Start with the top-level readout before you make a money move. It turns account balances and recent activity into a quick household pulse.',
      eyebrow: '01 · Get oriented',
      icon: HeartPulse,
      label: 'Household pulse',
      outcome: 'Read available cash, cash flow, and money mood together.',
      pointer: 'Your key numbers live at the top',
      title: 'Start with the household pulse',
      visual: 'pulse',
    },
    {
      body: 'Safe-to-Spend turns the month into a daily decision. It accounts for the days left, planned bills, and today’s spending so the number stays practical.',
      eyebrow: '02 · Find your pace',
      icon: ShieldCheck,
      label: 'Safe-to-Spend',
      outcome: 'Use the daily amount as a guardrail, not a permission slip.',
      pointer: 'Watch the daily pace meter',
      title: 'Know what is safe today',
      visual: 'pace',
    },
    {
      body: 'The dashboard surfaces upcoming bills and pressure points before they become surprises. Use the action buttons to move from noticing a problem to handling it.',
      eyebrow: '03 · Stay ahead',
      icon: ReceiptText,
      label: 'Upcoming pressure',
      outcome:
        'Handle the next important bill before it crowds out other plans.',
      pointer: 'Turn alerts into the next useful action',
      title: 'Plan around pressure',
      visual: 'cards',
    },
    {
      body: 'Goals make future plans visible. Add contributions, watch milestone flags, and use the What-If tools when you want to test a change before committing to it.',
      eyebrow: '04 · Make progress visible',
      icon: PiggyBank,
      label: 'Goals and scenarios',
      outcome: 'Give every meaningful target a name, amount, and next step.',
      pointer: 'Progress is easier to keep when it has a destination',
      title: 'Turn intentions into progress',
      visual: 'goals',
    },
    {
      body: 'BudgetHQ works best when it reflects real life. Add transactions as they happen, review your charts weekly, and adjust your plan when the household changes.',
      eyebrow: '05 · Keep it useful',
      icon: BookOpen,
      label: 'Your rhythm',
      outcome: 'A small weekly check-in keeps the dashboard trustworthy.',
      pointer: 'Small updates keep the whole picture clear',
      title: 'Build a money rhythm',
      visual: 'rhythm',
    },
  ],
  kids: [
    {
      body: 'The money box is your starting point. Add money when it arrives so you can see what is ready now and choose what to do next.',
      eyebrow: '01 · Start here',
      icon: Coins,
      label: 'Money box',
      outcome: 'See your real balance before you choose a next move.',
      pointer: 'The big balance is the first stop',
      title: 'Meet your money box',
      visual: 'money-box',
    },
    {
      body: 'A savings quest gives your money a destination. Add small amounts, watch the progress flags, and take money back when you need to make a different choice.',
      eyebrow: '02 · Pick a goal',
      icon: PiggyBank,
      label: 'Savings quests',
      outcome: 'Small steps make a big goal easier to understand.',
      pointer: 'Quest cards show progress and choices',
      title: 'Save toward something you want',
      visual: 'quests',
    },
    {
      body: 'Progress flags show how close you are at 25%, 50%, 75%, and 100%. Completing a quest is a moment to celebrate and a chance to decide what comes next.',
      eyebrow: '03 · Notice progress',
      icon: Sparkles,
      label: 'Milestones',
      outcome: 'Celebrate the step you reached, not only the finish line.',
      pointer: 'Progress is meant to be seen',
      title: 'Watch your progress grow',
      visual: 'progress',
    },
    {
      body: 'Chores add rewards when they are finished. You get to see the connection between effort, money, and the choices you make with it.',
      eyebrow: '04 · Earn rewards',
      icon: Flag,
      label: 'Chores and rewards',
      outcome: 'Completed chores become money you can put toward a plan.',
      pointer: 'Chore choices sit beside activity',
      title: 'Earn and learn',
      visual: 'chores',
    },
    {
      body: 'The Chore Store gives you three clear choices: save for later, spend on something small, or donate. There is no single right answer.',
      eyebrow: '05 · Make the choice',
      icon: Trophy,
      label: 'Chore Store',
      outcome: 'Use rewards in a way that matches what matters to you.',
      pointer: 'Your money, your next choice',
      title: 'Choose what your reward means',
      visual: 'store',
    },
  ],
};

function createId(label) {
  const slug =
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') || 'item';
  return `${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createQuickAddDraft() {
  return {
    account: { balance: '', name: '', type: 'Checking' },
    bill: { amount: '', due: '', name: '' },
    goal: { name: '', target: '' },
    transaction: {
      accountId: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().slice(0, 10),
      merchant: '',
      type: 'expense',
    },
  };
}

function ensureItemId(item, labelKey = 'name') {
  if (!item || typeof item !== 'object') {
    return item;
  }

  if (item.id) {
    return item;
  }

  const label = String(
    item[labelKey] ??
      item.name ??
      item.label ??
      item.title ??
      item.action ??
      'item',
  );
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

  const normalizedData = { ...data };
  delete normalizedData.kidGoalRequests;

  return {
    ...fallback,
    ...normalizedData,
    accounts: Array.isArray(data.accounts)
      ? data.accounts.map((item) => ensureItemId(item, 'label'))
      : fallback.accounts,
    activity: Array.isArray(data.activity)
      ? data.activity.map((item) => ensureItemId(item, 'merchant'))
      : fallback.activity,
    autopilot: Array.isArray(data.autopilot)
      ? data.autopilot.map((item) => ensureItemId(item, 'action'))
      : fallback.autopilot,
    bills: Array.isArray(data.bills)
      ? data.bills.map((item) => ensureItemId(item, 'name'))
      : fallback.bills,
    categories: Array.isArray(data.categories)
      ? data.categories.map((item) => normalizeCategory(item))
      : fallback.categories,
    forecast: Array.isArray(data.forecast)
      ? data.forecast.map((item) => ensureItemId(item, 'label'))
      : fallback.forecast,
    goals: Array.isArray(data.goals)
      ? data.goals.map((item) => ensureItemId(item, 'name'))
      : fallback.goals,
    pressureWeeks: Array.isArray(data.pressureWeeks)
      ? data.pressureWeeks.map((item) => ensureItemId(item, 'label'))
      : fallback.pressureWeeks,
    proposals: Array.isArray(data.proposals)
      ? data.proposals.map((item) => ensureItemId(item, 'title'))
      : fallback.proposals,
    roles: Array.isArray(data.roles)
      ? data.roles.map((item) => ensureItemId(item, 'label'))
      : fallback.roles,
    notifications: Array.isArray(data.notifications)
      ? data.notifications.map((item) => ensureItemId(item, 'message'))
      : fallback.notifications,
    subscriptions: Array.isArray(data.subscriptions)
      ? data.subscriptions.map((item) => ensureItemId(item, 'name'))
      : fallback.subscriptions,
    tradeoffs: Array.isArray(data.tradeoffs)
      ? data.tradeoffs.map((item) => ensureItemId(item, 'label'))
      : fallback.tradeoffs,
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

  return (
    window.localStorage.getItem(`budgethq-${workspaceId}-tour-seen`) !== 'true'
  );
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

function getDateKey(dateValue) {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function getTransactionDateLabel(dateValue) {
  const key = getDateKey(dateValue);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (key === today) {
    return 'Today';
  }

  if (key === yesterday) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${key}T00:00:00`));
}

function getBudgetStreak(activity, dailyLimit) {
  const spendByDay = activity.reduce((days, entry) => {
    if (entry.amount >= 0) {
      return days;
    }

    const key = getDateKey(entry.transactionDate || entry.date);
    return {
      ...days,
      [key]: (days[key] ?? 0) + Math.abs(entry.amount),
    };
  }, {});
  const days = Object.entries(spendByDay)
    .map(([date, spent]) => ({
      date,
      spent,
      under: dailyLimit > 0 && spent <= dailyLimit,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  let current = 0;
  let best = 0;
  let running = 0;

  days.forEach((day, index) => {
    if (day.under) {
      running += 1;
      best = Math.max(best, running);
      if (index === current) {
        current += 1;
      }
      return;
    }

    running = 0;
  });

  const recentSeven = days.slice(0, 7);
  const recentUnder = recentSeven.filter((day) => day.under).length;

  return {
    best,
    current,
    days,
    recentUnder,
    overDays: days.filter((day) => !day.under).length,
    underDays: days.filter((day) => day.under).length,
  };
}

function formatReceiptName(name) {
  return (
    name
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim() || 'Receipt'
  );
}

function createActivityEntry(entry) {
  const amount = Number(entry.amount) || 0;

  return {
    accountId: entry.accountId ?? null,
    category: entry.category ?? (amount >= 0 ? 'Income' : 'Other'),
    notes: entry.notes ?? '',
    transactionDate:
      entry.transactionDate || new Date().toISOString().slice(0, 10),
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

function getCategorySpendingSegments(categories) {
  const spendingCategories = categories
    .map((category) => ({ ...category, amount: Number(category.amount) || 0 }))
    .filter((category) => category.amount > 0);
  const total = spendingCategories.reduce(
    (sum, category) => sum + category.amount,
    0,
  );

  return spendingCategories.map((category) => ({
    ...category,
    percentage: (category.amount / total) * 100,
  }));
}

function getCategoryChartBackground(segments) {
  if (segments.length === 0) {
    return 'conic-gradient(#e2e8f0 0 100%)';
  }

  let offset = 0;
  const stops = segments.map((segment) => {
    const start = offset;
    offset += segment.percentage;
    return `${segment.color} ${start}% ${offset}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
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

function getCashflowInsights({
  activity,
  bills,
  dailyLimit,
  goals,
  remainingDays,
  subscriptions,
  totalBalance,
}) {
  const incomeTotal = activity
    .filter((entry) => entry.amount > 0 || entry.type === 'income')
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  const spendingTotal = activity
    .filter((entry) => entry.amount < 0)
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  const billTotal = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const subscriptionTotal = subscriptions.reduce(
    (sum, subscription) => sum + subscription.amount,
    0,
  );
  const upcomingBillTotal = bills
    .filter((bill) => bill.hoursAway <= 72)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const dailyReserve =
    dailyLimit > 0
      ? dailyLimit * Math.min(Math.max(remainingDays, 1), 7)
      : spendingTotal * 0.2;
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
      reason:
        'Balance is above bills, subscriptions, and the near-term daily reserve.',
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
      reason:
        'BudgetHQ is preserving flexibility until more income, bill, or goal data exists.',
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

function getCalculatedForecast({
  bills,
  dailyLimit,
  remainingDays,
  subscriptions,
  totalBalance,
}) {
  if (
    remainingDays <= 0 &&
    totalBalance <= 0 &&
    bills.length === 0 &&
    subscriptions.length === 0
  ) {
    return [];
  }

  const subscriptionTotal = subscriptions.reduce(
    (sum, subscription) => sum + subscription.amount,
    0,
  );
  const billTotal = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const spendReserve = dailyLimit * Math.max(remainingDays, 0);
  const projectedEnd =
    totalBalance - billTotal - subscriptionTotal - spendReserve;

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
      note:
        projectedEnd >= 0
          ? 'Cash left after planned spending.'
          : 'Potential shortfall after planned spending.',
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
      detail:
        'Add accounts, bills, or a monthly budget to calculate your household mood.',
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

function getMoneyHealthScore({
  dailyLimit,
  goals,
  spentToday,
  totalBalance,
  urgentBills,
}) {
  if (
    dailyLimit <= 0 &&
    totalBalance <= 0 &&
    goals.length === 0 &&
    urgentBills === 0
  ) {
    return {
      label: 'Set Up Needed',
      score: 0,
      detail:
        'Add accounts, bills, goals, and a monthly budget to calculate money health.',
    };
  }

  const pacePoints =
    dailyLimit <= 0
      ? 12
      : Math.max(0, Math.round(30 - (spentToday / dailyLimit) * 22));
  const bufferPoints =
    totalBalance <= 0
      ? 0
      : Math.min(
          30,
          Math.round((totalBalance / Math.max(dailyLimit * 14, 1)) * 30),
        );
  const billPoints = Math.max(0, 20 - urgentBills * 8);
  const goalProgress =
    goals.length === 0
      ? 0
      : goals.reduce(
          (sum, goal) => sum + goal.saved / Math.max(goal.target, 1),
          0,
        ) / goals.length;
  const goalPoints =
    goals.length === 0 ? 8 : Math.round(Math.min(goalProgress, 1) * 20);
  const score = Math.min(
    100,
    Math.max(0, pacePoints + bufferPoints + billPoints + goalPoints),
  );

  if (score >= 82) {
    return {
      label: 'Strong',
      score,
      detail:
        'Your cash buffer, bills, goals, and spending pace are working together.',
    };
  }

  if (score >= 60) {
    return {
      label: 'Steady',
      score,
      detail:
        'You have a workable plan. Keep an eye on daily spending and upcoming bills.',
    };
  }

  if (score >= 35) {
    return {
      label: 'Needs Attention',
      score,
      detail:
        'A few setup steps or smaller purchases would make the plan easier to trust.',
    };
  }

  return {
    label: 'Getting Started',
    score,
    detail:
      'Add money, bills, and goals so BudgetHQ can build a clearer picture.',
  };
}

function getRoleProfile(permission) {
  const normalizedPermission =
    permission === 'admin'
      ? 'parent'
      : permission === 'collaborator'
        ? 'teen'
        : permission;

  return (
    permissionProfiles.find((profile) => profile.id === normalizedPermission) ??
    permissionProfiles[0]
  );
}

function getBillShockAlert({
  bills,
  dailyLimit,
  monthBudgetRemaining,
  remainingDays,
}) {
  const shockBill = [...bills]
    .filter(
      (bill) =>
        bill.hoursAway <= 120 && bill.amount >= Math.max(dailyLimit * 3, 250),
    )
    .sort((a, b) => a.hoursAway - b.hoursAway || b.amount - a.amount)[0];

  if (!shockBill) {
    return null;
  }

  const adjustedDailySpend =
    remainingDays > 0
      ? Math.max((monthBudgetRemaining - shockBill.amount) / remainingDays, 0)
      : 0;

  return {
    adjustedDailySpend,
    bill: shockBill,
    reduction: Math.max(dailyLimit - adjustedDailySpend, 0),
  };
}

function getBillPresentation(bill, isShockBill = false) {
  if (bill.hoursAway < 0) {
    return {
      badge: 'Overdue',
      className: 'overdue',
      priority: 'Critical',
      timeline: `${Math.ceil(Math.abs(bill.hoursAway) / 24)}d late`,
    };
  }

  if (isShockBill) {
    return {
      badge: 'Shock',
      className: 'shock',
      priority: 'High',
      timeline: `${Math.max(Math.ceil(bill.hoursAway / 24), 1)}d left`,
    };
  }

  if (bill.hoursAway <= 48) {
    return {
      badge: 'Urgent',
      className: 'urgent',
      priority: 'High',
      timeline: `${Math.max(Math.ceil(bill.hoursAway / 24), 1)}d left`,
    };
  }

  if (bill.hoursAway <= 168) {
    return {
      badge: 'Upcoming',
      className: 'upcoming',
      priority: 'Medium',
      timeline: `${Math.ceil(bill.hoursAway / 24)}d left`,
    };
  }

  return {
    badge: 'Scheduled',
    className: 'scheduled',
    priority: 'Normal',
    timeline: 'On calendar',
  };
}

function getGoalPresentation(progress) {
  if (progress >= 100) {
    return { badge: 'Completed', className: 'completed', priority: 'Done' };
  }

  if (progress >= 75) {
    return { badge: 'Almost there', className: 'upcoming', priority: 'High' };
  }

  if (progress <= 25) {
    return { badge: 'Needs funding', className: 'overdue', priority: 'High' };
  }

  return { badge: 'In progress', className: 'scheduled', priority: 'Medium' };
}

const goalJourneyMilestones = [
  { label: 'Start', value: 0 },
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: '100%', value: 100 },
];

function GoalJourney({ currency, goal, progress }) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const nextMilestone = goalJourneyMilestones.find(
    (milestone) => milestone.value > safeProgress,
  );
  const currentMilestone = [...goalJourneyMilestones]
    .reverse()
    .find(
      (milestone) => milestone.value > 0 && milestone.value <= safeProgress,
    );
  const amountToNext = nextMilestone
    ? Math.max(goal.target * (nextMilestone.value / 100) - goal.saved, 0)
    : 0;

  return (
    <div
      aria-label={`${goal.name} goal journey, ${safeProgress}% complete`}
      className={`goal-journey${safeProgress >= 100 ? ' complete' : ''}`}
    >
      <div className="goal-journey-heading">
        <span>Goal journey</span>
        <strong>{safeProgress}%</strong>
      </div>
      <div className="goal-journey-chart" aria-hidden="true">
        <div className="goal-journey-track">
          <span style={{ width: `${safeProgress}%` }} />
        </div>
        <div className="goal-milestone-grid">
          {goalJourneyMilestones.map((milestone) => {
            const isReached = safeProgress >= milestone.value;
            const isNext = nextMilestone?.value === milestone.value;
            const isCurrent = currentMilestone?.value === milestone.value;

            return (
              <span
                className={`goal-milestone${
                  milestone.value > 0 ? ' flag' : ''
                }${isReached ? ' reached' : ''}${isNext ? ' next' : ''}${
                  isCurrent ? ' current' : ''
                }`}
                key={milestone.value}
              >
                <b>
                  {milestone.value > 0 ? (
                    `${milestone.value}%`
                  ) : isReached ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    milestone.value
                  )}
                </b>
                <small>{milestone.label}</small>
              </span>
            );
          })}
        </div>
      </div>
      <div className="goal-journey-summary">
        {nextMilestone ? (
          <>
            <span>Next milestone: {nextMilestone.label}</span>
            <strong>{formatMoney(amountToNext, currency)} to reach it</strong>
          </>
        ) : (
          <>
            <span>Journey complete</span>
            <strong>Target reached</strong>
          </>
        )}
      </div>
    </div>
  );
}

const heatmapWeekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function SpendingHeatmap({ currency, data }) {
  const hasSpending = data.totalSpent > 0;

  return (
    <article className="dashboard-card heatmap-card">
      <div className="card-heading heatmap-heading">
        <span className="module-icon">
          <CalendarDays size={20} aria-hidden="true" />
        </span>
        <div>
          <h2>Weekly Spending Heatmap</h2>
          <p>Darker days mean higher spending</p>
        </div>
        <span className="heatmap-period">{data.periodLabel}</span>
      </div>

      <div className="heatmap-summary" aria-label="Four week spending summary">
        <span>
          <strong>{formatMoney(data.totalSpent, currency)}</strong>
          <small>spent in four weeks</small>
        </span>
        <span>
          <strong>{data.activeDays}</strong>
          <small>spending days</small>
        </span>
      </div>

      <div
        aria-label={`Daily spending from ${data.periodLabel}`}
        className="weekly-spending-heatmap"
        role="group"
      >
        <div className="heatmap-weekdays" aria-hidden="true">
          {heatmapWeekdayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="heatmap-days">
          {data.days.map((day) => {
            const spendingLabel =
              day.amount > 0
                ? formatMoney(day.amount, currency)
                : 'No spending';

            return (
              <span
                aria-label={`${day.label}: ${spendingLabel}`}
                className={`heatmap-day level-${day.level}${
                  day.isToday ? ' today' : ''
                }${day.isFuture ? ' future' : ''}`}
                key={day.key}
                role="img"
                title={`${day.label}: ${spendingLabel}`}
              >
                <b>{day.dayNumber}</b>
              </span>
            );
          })}
        </div>
      </div>

      <div className="heatmap-footer">
        <span className="heatmap-legend" aria-label="Spending intensity legend">
          <small>Less</small>
          {[0, 1, 2, 3, 4].map((level) => (
            <i className={`level-${level}`} key={level} />
          ))}
          <small>More</small>
        </span>
        {!hasSpending ? (
          <span className="heatmap-empty-note">
            Add a transaction to start coloring the calendar.
          </span>
        ) : null}
      </div>
    </article>
  );
}

function getSubscriptionSignal(subscription) {
  if (
    subscription.previousAmount &&
    subscription.amount > subscription.previousAmount
  ) {
    return {
      label: 'Price increased',
      tone: 'danger',
      note: `Up from ${formatMoney(subscription.previousAmount, 'USD')}.`,
    };
  }

  if ((subscription.useScore ?? 0) >= 70 || subscription.status === 'Keep') {
    return {
      label: 'Used often',
      tone: 'success',
      note: 'Worth keeping based on the current use score.',
    };
  }

  if ((subscription.useScore ?? 0) <= 55 || subscription.status === 'Review') {
    return {
      label: 'Maybe cancel',
      tone: 'warning',
      note: 'Low value signal. Review before the next renewal.',
    };
  }

  return {
    label: 'Watch',
    tone: 'neutral',
    note: 'No strong signal yet.',
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

function ManageSectionHeading({ detail, icon: Icon, id, label, title }) {
  return (
    <div className="manage-section-heading" id={id}>
      <span className="manage-section-icon">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function TourVisual({ step, workspaceName }) {
  const visualClass = step.visual ? ` tour-step-${step.visual}` : '';
  const StepIcon = step.icon ?? Sparkles;

  return (
    <div
      className={`tour-visual${visualClass}`}
      aria-label={`${workspaceName} preview`}
    >
      <div className="tour-visual-header">
        <div className="tour-visual-label">
          <span className="tour-visual-icon">
            <StepIcon size={18} aria-hidden="true" />
          </span>
          <span>
            <small>Focus area</small>
            <strong>{step.pointer}</strong>
          </span>
        </div>
        <span className="tour-preview-badge">
          <MousePointer2 size={14} aria-hidden="true" />
          Preview
        </span>
      </div>
      <div className="tour-preview-shell">
        <span className="tour-preview-nav">BudgetHQ / Main</span>
        <span className="tour-preview-hero">
          <strong>Household pulse</strong>
          <small>Today&apos;s money picture</small>
        </span>
        <span className="tour-preview-balance">
          <strong>Available Cash</strong>
          <small>Accounts + money mood</small>
        </span>
        <span className="tour-preview-meter">
          <strong>Safe-to-Spend</strong>
          <small>Daily pace</small>
        </span>
        <span className="tour-preview-card card-one">
          <strong>Upcoming bills</strong>
          <small>Due dates + pressure</small>
        </span>
        <span className="tour-preview-card card-two">
          <strong>Savings goals</strong>
          <small>Milestones + next step</small>
        </span>
        <span className="tour-preview-card card-three">
          <strong>Weekly review</strong>
          <small>Keep your picture current</small>
        </span>
      </div>
      <div className="tour-visual-note">
        <CircleCheck size={17} aria-hidden="true" />
        <span>
          <strong>What to notice</strong>
          {step.outcome}
        </span>
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

  useEffect(() => {
    const handleTourKeys = (event) => {
      if (event.key === 'Escape') {
        closeTour();
        return;
      }

      if (event.key === 'ArrowLeft' && stepIndex > 0) {
        setStepIndex((current) => current - 1);
      }

      if (event.key === 'ArrowRight' && !isLastStep) {
        setStepIndex((current) => current + 1);
      }
    };

    window.addEventListener('keydown', handleTourKeys);
    return () => window.removeEventListener('keydown', handleTourKeys);
  }, [isLastStep, onClose, stepIndex]);

  return (
    <div className="tour-backdrop" role="presentation">
      <section
        aria-describedby="tour-description"
        aria-label={`${workspaceName} tour`}
        aria-labelledby="tour-title"
        aria-modal="true"
        className="tour-card"
        role="dialog"
      >
        <header className="tour-card-header">
          <div className="tour-brand">
            <span className="tour-brand-icon">
              <BookOpen size={18} aria-hidden="true" />
            </span>
            <span>
              <small>Guided walkthrough</small>
              <strong>{workspaceName}</strong>
            </span>
          </div>
          <div className="tour-header-actions">
            <span className="tour-step-count">
              {String(stepIndex + 1).padStart(2, '0')} /{' '}
              {String(steps.length).padStart(2, '0')}
            </span>
            <button
              aria-label="Close tutorial"
              className="tour-close"
              onClick={closeTour}
              title="Close tutorial"
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="tour-card-layout">
          <aside className="tour-step-rail" aria-label="Tutorial steps">
            <div className="tour-rail-heading">
              <span>What you&apos;ll learn</span>
              <strong>{currentStep.label}</strong>
            </div>
            <nav className="tour-step-list" aria-label="Choose a tutorial step">
              {steps.map((step, index) => (
                <button
                  aria-current={index === stepIndex ? 'step' : undefined}
                  className={index === stepIndex ? 'active' : ''}
                  key={step.title}
                  onClick={() => setStepIndex(index)}
                  type="button"
                >
                  <span className="tour-step-number">
                    {index < stepIndex ? (
                      <CircleCheck size={15} aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                  <span>{step.label}</span>
                </button>
              ))}
            </nav>
            <div className="tour-rail-tip">
              <Sparkles size={17} aria-hidden="true" />
              <span>
                <strong>Go at your pace</strong>
                You can jump to any step and come back later.
              </span>
            </div>
          </aside>

          <div className="tour-card-main">
            <div
              aria-label={`Step ${stepIndex + 1} of ${steps.length}`}
              aria-valuemax={steps.length}
              aria-valuemin="1"
              aria-valuenow={stepIndex + 1}
              className="tour-progress"
              role="progressbar"
            >
              {steps.map((step, index) => (
                <span
                  className={index <= stepIndex ? 'active' : ''}
                  key={step.title}
                />
              ))}
            </div>
            <TourVisual step={currentStep} workspaceName={workspaceName} />
            <div className="tour-card-copy" key={currentStep.title}>
              <p className="eyebrow">{currentStep.eyebrow}</p>
              <h2 id="tour-title">{currentStep.title}</h2>
              <p id="tour-description">{currentStep.body}</p>
            </div>
          </div>
        </div>

        <footer className="tour-actions">
          <button className="tour-secondary" onClick={closeTour} type="button">
            Exit tour
          </button>
          <div className="tour-step-actions">
            {stepIndex > 0 ? (
              <button
                className="tour-secondary"
                onClick={() => setStepIndex((current) => current - 1)}
                type="button"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back
              </button>
            ) : null}
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
              {isLastStep ? <CircleCheck size={16} aria-hidden="true" /> : null}
              {isLastStep ? 'Complete tour' : 'Continue'}
              {!isLastStep ? <ArrowRight size={16} aria-hidden="true" /> : null}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function getPersonalizedDashboard(profile) {
  const priorityDetails = {
    bills: {
      action: 'Add your next bill',
      detail: 'Start with the bill due soonest so reminders become useful.',
      focus: 'Bills and reminders',
      page: 'manage',
    },
    debt: {
      action: 'Add a debt account',
      detail: 'Enter a credit card or loan balance to make progress visible.',
      focus: 'Balances and payments',
      page: 'manage',
    },
    kids: {
      action: 'Open the Kids portal',
      detail: 'Set up real chores, rewards, and a first savings quest.',
      focus: 'Kid-friendly money habits',
      page: 'kids',
    },
    savings: {
      action: 'Create your first goal',
      detail: 'Choose one real target so BudgetHQ can track its progress.',
      focus: 'Savings goals',
      page: 'manage',
    },
    spending: {
      action: 'Add your first transaction',
      detail: 'A real expense starts the spending chart and category view.',
      focus: 'Daily spending pace',
      page: 'transactions',
    },
  };
  const experienceLabels = {
    confident: 'Compact view',
    new: 'Beginner guidance',
    some: 'Helpful guidance',
  };
  const rhythmLabels = {
    monthly: 'Monthly review',
    paycheck: 'Payday review',
    weekly: 'Weekly review',
  };
  const selectedPriority =
    priorityDetails[profile?.priority] ?? priorityDetails.spending;

  return {
    ...selectedPriority,
    experience: experienceLabels[profile?.experience] ?? 'Helpful guidance',
    rhythm: rhythmLabels[profile?.rhythm] ?? 'Weekly review',
  };
}

function PersonalizationOverlay({
  initialProfile,
  onComplete,
  onResetAnswers,
  onSkip,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(initialProfile ?? {});
  const isKidPath = answers.ageGroup === 'under13';
  const onboardingQuestions = [
    ageQuestion,
    ...(isKidPath ? kidOnboardingQuestions : adultOnboardingQuestions),
  ];
  const question = onboardingQuestions[stepIndex];
  const selectedAnswer = answers[question.id];
  const isLastStep = stepIndex === onboardingQuestions.length - 1;

  const chooseAnswer = (value) => {
    if (question.id === 'ageGroup') {
      setAnswers({ ageGroup: value });
      return;
    }

    setAnswers((current) => ({ ...current, [question.id]: value }));
  };

  return (
    <div className="personalization-backdrop" role="presentation">
      <section
        aria-label="Personalize BudgetHQ"
        aria-modal="true"
        className="personalization-dialog"
        role="dialog"
      >
        <div className="personalization-header">
          <div>
            <p className="eyebrow">
              {isKidPath ? 'Build your Kids portal' : 'Make BudgetHQ yours'}
            </p>
            <strong>
              Question {stepIndex + 1} of {onboardingQuestions.length}
            </strong>
          </div>
          <div className="personalization-header-actions">
            {initialProfile ? (
              <button
                className="personalization-reset"
                onClick={() => {
                  setAnswers({});
                  setStepIndex(0);
                  onResetAnswers();
                }}
                type="button"
              >
                Reset answers
              </button>
            ) : null}
            <button
              className="personalization-skip"
              onClick={onSkip}
              type="button"
            >
              Skip for now
            </button>
          </div>
        </div>

        <div className="personalization-progress" aria-hidden="true">
          {onboardingQuestions.map((item, index) => (
            <span
              className={index <= stepIndex ? 'active' : ''}
              key={item.id}
            />
          ))}
        </div>

        {isKidPath && stepIndex > 0 ? (
          <div className="kid-portal-recommendation" role="status">
            <Coins size={20} aria-hidden="true" />
            <span>
              <strong>Kids portal recommended</strong>
              It is made for kids under 13, with a money box, savings quests,
              chores, and simple choices.
            </span>
          </div>
        ) : null}

        <div className="personalization-copy">
          <p>{question.eyebrow}</p>
          <h2>{question.title}</h2>
          <span>{question.detail}</span>
        </div>

        <div
          aria-label={question.title}
          className="personalization-options"
          role="radiogroup"
        >
          {question.options.map((option) => (
            <button
              aria-checked={selectedAnswer === option.value}
              className={selectedAnswer === option.value ? 'selected' : ''}
              key={option.value}
              onClick={() => chooseAnswer(option.value)}
              role="radio"
              type="button"
            >
              <span className="personalization-radio" aria-hidden="true" />
              <span>
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="personalization-actions">
          <button
            className="personalization-back"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            type="button"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back
          </button>
          <button
            className="personalization-next"
            disabled={!selectedAnswer}
            onClick={() => {
              if (isLastStep) {
                onComplete(
                  isKidPath
                    ? { ...answers, experience: 'new', priority: 'kids' }
                    : answers,
                );
                return;
              }

              setStepIndex((current) => current + 1);
            }}
            type="button"
          >
            {isLastStep
              ? isKidPath
                ? 'See My Kids Portal Recommendation'
                : 'Personalize My Dashboard'
              : 'Continue'}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}

function MainWorkspace({
  currency,
  onEditPreferences,
  onCurrencyChange,
  onReset,
  onShowKids,
  onSwitchPortal,
  onStartTour,
  onTourComplete,
  profile,
  showTour,
}) {
  const [householdData, setHouseholdData] = useStoredState(
    'budgethq-household-data-v2',
    startingHouseholdData,
  );
  const [approvedProposal, setApprovedProposal] = useState(null);
  const [activeMainPage, setActiveMainPage] = useState('dashboard');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('transaction');
  const [quickAddDraft, setQuickAddDraft] = useState(createQuickAddDraft);
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
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [transactionNotes, setTransactionNotes] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionSort, setTransactionSort] = useState('date-desc');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [csvImportText, setCsvImportText] = useState('');
  const [receiptItems, setReceiptItems] = useState([]);
  const [backupText, setBackupText] = useState('');
  const [privacyMode, setPrivacyMode] = useStoredState(
    'budgethq-privacy-mode',
    false,
  );
  const [whatIfRentChange, setWhatIfRentChange] = useState('');
  const [whatIfWeeklySavings, setWhatIfWeeklySavings] = useState('');
  const [whatIfIncomeChange, setWhatIfIncomeChange] = useState('');
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
  const [rolePermission, setRolePermission] = useState('teen');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalChange, setProposalChange] = useState('');
  const [proposalCommentDrafts, setProposalCommentDrafts] = useState({});
  const [pauseItem, setPauseItem] = useState('');
  const [pauseAmount, setPauseAmount] = useState('');
  const [autopilotAction, setAutopilotAction] = useState('');
  const [autopilotAmount, setAutopilotAmount] = useState('');
  const [formMessages, setFormMessages] = useState({});
  const personalizedDashboard = getPersonalizedDashboard(profile);

  useEffect(() => {
    if (!quickAddOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setQuickAddOpen(false);
      }
    };

    document.body.classList.add('quick-add-open');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('quick-add-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [quickAddOpen]);

  const hasPositiveAmount = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0;
  };

  const checkingBalance = householdData.accounts[0]?.balance ?? 0;
  const transactionAccountId =
    selectedAccountId || householdData.accounts[0]?.id || '';
  const transactionAccountBalance =
    householdData.accounts.find(
      (account) => account.id === transactionAccountId,
    )?.balance ?? 0;
  const canAddMoney = hasPositiveAmount(depositAmount);
  const canLogSpending =
    hasPositiveAmount(spendAmount) &&
    transactionAccountBalance >= Number(spendAmount);
  const canAddAccount =
    accountName.trim() && Number.isFinite(Number(accountBalance));
  const canSaveTransaction =
    transactionMerchant.trim() &&
    hasPositiveAmount(transactionAmount) &&
    (transactionType === 'income' || Boolean(transactionAccountId));
  const canSaveBudget =
    hasPositiveAmount(budgetAmount) && hasPositiveAmount(budgetDays);
  const canAddCategory =
    categoryName.trim() && hasPositiveAmount(categoryBudget);
  const canAddBill = billName.trim() && hasPositiveAmount(billAmount);
  const canAddGoal = goalName.trim() && hasPositiveAmount(goalTarget);
  const canAddSubscription =
    subscriptionName.trim() && hasPositiveAmount(subscriptionAmount);
  const canAddRole = roleName.trim() && roleAccess.trim();
  const canAddProposal = proposalTitle.trim() && proposalChange.trim();
  const canAddPause = pauseItem.trim() && hasPositiveAmount(pauseAmount);
  const canAddAutopilot =
    autopilotAction.trim() && hasPositiveAmount(autopilotAmount);
  const spendingPause =
    householdData.spendingPause ?? startingHouseholdData.spendingPause;
  const isSpendingPaused = Boolean(spendingPause?.active);
  const allowedPauseCategories =
    spendingPause?.allowedCategories ?? essentialSpendingCategories;
  const isSpendCategoryPaused =
    isSpendingPaused && !allowedPauseCategories.includes(spendCategory);
  const isTransactionCategoryPaused =
    isSpendingPaused &&
    transactionType === 'expense' &&
    !allowedPauseCategories.includes(transactionCategory);
  const activeMember =
    householdData.roles.find((role) => role.id === activeRole) ??
    householdData.roles[0] ??
    null;
  const activeProfile = getRoleProfile(activeMember?.permission ?? 'parent');
  const activePermission = activeProfile.id;
  const canManageMoney = activePermission === 'parent';
  const canCollaborate =
    activePermission === 'parent' || activePermission === 'teen';
  const canViewBills = activePermission !== 'kid';
  const canViewSubscriptions =
    activePermission === 'parent' || activePermission === 'teen';
  const canViewReports =
    activePermission === 'parent' || activePermission === 'viewer';
  const canViewTransactions = activePermission !== 'kid';
  const activeMemberName = activeMember?.label ?? 'You';
  const hasHouseholdData =
    householdData.accounts.length > 0 ||
    householdData.activity.length > 0 ||
    householdData.bills.length > 0 ||
    householdData.goals.length > 0;
  const money = (amount) =>
    privacyMode ? 'Private' : formatMoney(amount, currency);

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
    setTransactionSearch('');
    setTransactionSort('date-desc');
    setEditingTransactionId(null);
    setCsvImportText('');
    setReceiptItems([]);
    setWhatIfRentChange('');
    setWhatIfWeeklySavings('');
    setWhatIfIncomeChange('');
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
    setRolePermission('teen');
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
      if (
        parsedBackup.currency &&
        currencyOptions.includes(parsedBackup.currency)
      ) {
        onCurrencyChange(parsedBackup.currency);
      }
      clearFormMessage('backup');
    } catch {
      setFormMessage(
        'backup',
        'Paste a valid BudgetHQ JSON backup before restoring.',
      );
    }
  };

  const updateAccountBalance = (accounts, accountId, amount) =>
    accounts.map((account) =>
      account.id === accountId
        ? { ...account, balance: account.balance + amount }
        : account,
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
      changes: [
        `${accountName.trim()} account added.`,
        ...current.changes,
      ].slice(0, 4),
    }));
    setSelectedAccountId(id);
    setAccountName('');
    setAccountBalance('');
    setAccountType('Checking');
  };

  const deleteAccount = (accountId) => {
    const account = householdData.accounts.find(
      (item) => item.id === accountId,
    );

    if (!account) {
      return;
    }

    if (Math.abs(account.balance) > 0.01) {
      setFormMessage(
        'account',
        'Empty this account balance before deleting it.',
      );
      return;
    }

    clearFormMessage('account');
    setHouseholdData((current) => ({
      ...current,
      accounts: current.accounts.filter((item) => item.id !== accountId),
      changes: [`${account.label} account deleted.`, ...current.changes].slice(
        0,
        4,
      ),
    }));

    if (selectedAccountId === accountId) {
      setSelectedAccountId('');
    }
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

    if (
      !transactionMerchant.trim() ||
      !Number.isFinite(rawAmount) ||
      rawAmount <= 0
    ) {
      setFormMessage('transaction', 'Enter a merchant and positive amount.');
      return;
    }

    if (!accountId && transactionType === 'expense') {
      setFormMessage(
        'transaction',
        'Add or select an account before logging spending.',
      );
      return;
    }

    const existingTransaction = householdData.activity.find(
      (entry) => entry.id === editingTransactionId,
    );
    const existingAccount = householdData.accounts.find(
      (account) => account.id === accountId,
    );
    const balanceAfterReversal =
      existingTransaction?.accountId === accountId
        ? (existingAccount?.balance ?? 0) - existingTransaction.amount
        : (existingAccount?.balance ?? 0);

    if (transactionType === 'expense' && balanceAfterReversal < rawAmount) {
      setFormMessage(
        'transaction',
        'This account does not have enough money for that expense.',
      );
      return;
    }

    if (isTransactionCategoryPaused) {
      setFormMessage(
        'transaction',
        'Spending pause is on. Use bills, food, or transport for expense entries.',
      );
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
              accounts: accountId
                ? updateAccountBalance(
                    current.accounts,
                    accountId,
                    signedAmount,
                  )
                : current.accounts,
            },
            nextEntry,
            currency,
          ),
          activity: [nextEntry, ...current.activity].slice(0, 20),
        };
      }

      const previous = current.activity.find(
        (entry) => entry.id === editingTransactionId,
      );
      let accounts = current.accounts;

      if (previous?.accountId) {
        accounts = updateAccountBalance(
          accounts,
          previous.accountId,
          -previous.amount,
        );
      }

      if (accountId) {
        accounts = updateAccountBalance(accounts, accountId, signedAmount);
      }

      return {
        ...current,
        accounts,
        activity: current.activity.map((entry) =>
          entry.id === editingTransactionId
            ? { ...nextEntry, id: editingTransactionId }
            : entry,
        ),
        changes: [
          `${transactionMerchant.trim()} transaction updated.`,
          ...current.changes,
        ].slice(0, 4),
      };
    });
    resetTransactionForm();
  };

  const editTransaction = (transactionId) => {
    const transaction = householdData.activity.find(
      (entry) => entry.id === transactionId,
    );

    if (!transaction) {
      return;
    }

    setEditingTransactionId(transaction.id);
    setSelectedAccountId(
      transaction.accountId ?? householdData.accounts[0]?.id ?? '',
    );
    setTransactionMerchant(transaction.merchant);
    setTransactionAmount(String(Math.abs(transaction.amount)));
    setTransactionCategory(transaction.category ?? 'Other');
    setTransactionDate(
      transaction.transactionDate ?? new Date().toISOString().slice(0, 10),
    );
    setTransactionNotes(transaction.notes ?? '');
    setTransactionType(transaction.amount >= 0 ? 'income' : 'expense');
  };

  const deleteTransaction = (transactionId) => {
    setHouseholdData((current) => {
      const transaction = current.activity.find(
        (entry) => entry.id === transactionId,
      );

      if (!transaction) {
        return current;
      }

      const accounts = transaction.accountId
        ? updateAccountBalance(
            current.accounts,
            transaction.accountId,
            -transaction.amount,
          )
        : current.accounts;

      return {
        ...current,
        accounts,
        activity: current.activity.filter(
          (entry) => entry.id !== transactionId,
        ),
        changes: [
          `${transaction.merchant} transaction deleted.`,
          ...current.changes,
        ].slice(0, 4),
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
        const [
          date,
          merchant,
          amountValue,
          category = 'Other',
          accountNameValue = 'Imported Checking',
          typeValue,
          notes = '',
        ] = row.split(',').map((cell) => cell.trim());
        const amount = Number(amountValue);
        const signedAmount =
          typeValue === 'income' || amount > 0
            ? Math.abs(amount || 0)
            : -Math.abs(amount || 0);
        let account = accounts.find(
          (item) => item.label.toLowerCase() === accountNameValue.toLowerCase(),
        );

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
          category: transactionCategories.includes(category)
            ? category
            : 'Other',
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
        changes: [
          `${imported.length} transactions imported.`,
          ...current.changes,
        ].slice(0, 4),
      };
    });
    setCsvImportText('');
  };

  const handleReceiptFiles = (files) => {
    const acceptedFiles = Array.from(files ?? []).filter(
      (file) =>
        file.type.startsWith('image/') ||
        file.name.toLowerCase().endsWith('.csv'),
    );

    if (acceptedFiles.length === 0) {
      setFormMessage('receipt', 'Drop a receipt image or CSV file.');
      return;
    }

    clearFormMessage('receipt');
    acceptedFiles.forEach((file) => {
      if (file.name.toLowerCase().endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = String(reader.result ?? '').trim();
          setCsvImportText((current) =>
            [current, text].filter(Boolean).join('\n'),
          );
          setReceiptItems((current) =>
            [
              {
                id: createId(file.name),
                name: file.name,
                status: 'CSV rows staged for import',
                type: 'CSV',
              },
              ...current,
            ].slice(0, 5),
          );
        };
        reader.readAsText(file);
        return;
      }

      setReceiptItems((current) =>
        [
          {
            id: createId(file.name),
            name: formatReceiptName(file.name),
            status: 'Image staged for receipt extraction',
            type: 'Image',
          },
          ...current,
        ].slice(0, 5),
      );
    });
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
        : [
            {
              balance: amount,
              id: accountId,
              label: 'Checking',
              type: 'Checking',
            },
          ];

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

    if (isSpendCategoryPaused) {
      setFormMessage(
        'logSpending',
        'Spending pause is on. Choose bills, food, or transport only.',
      );
      return;
    }

    if (!transactionAccountId) {
      setFormMessage('logSpending', 'Add an account before logging spending.');
      return;
    }

    if (transactionAccountBalance < amount) {
      setFormMessage(
        'logSpending',
        'Add money to the selected account before logging this purchase.',
      );
      return;
    }

    clearFormMessage('logSpending');
    setHouseholdData((current) => ({
      ...current,
      accounts: updateAccountBalance(
        current.accounts,
        transactionAccountId,
        -amount,
      ),
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
      emotionalInsight: current.emotionalInsight ?? {
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
      changes: [
        `Budget plan set for ${formatMoney(amount, currency)} across ${days} days.`,
        ...current.changes,
      ].slice(0, 4),
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
              ? {
                  ...category,
                  budget,
                  group: categoryGroup.trim() || category.group || 'Everyday',
                }
              : category,
          ),
          changes: [
            `${name} category budget updated.`,
            ...current.changes,
          ].slice(0, 4),
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
        changes: [`${name} category budget added.`, ...current.changes].slice(
          0,
          4,
        ),
      };
    });
    setSpendCategory(name);
    setTransactionCategory(name);
    setCategoryName('');
    setCategoryBudget('');
    setCategoryGroup('');
  };

  const deleteCategory = (categoryId) => {
    const category = householdData.categories.find(
      (item) => item.id === categoryId,
    );

    if (!category) {
      return;
    }

    setHouseholdData((current) => ({
      ...current,
      categories: current.categories.filter((item) => item.id !== categoryId),
      changes: [
        `${category.name} category budget deleted.`,
        ...current.changes,
      ].slice(0, 4),
    }));
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
            (budgetCategories.find((item) => item.name === category.name)
              ?.amount ?? category.amount),
          0,
        ),
      })),
      spentToday: 0,
      changes: [
        'Category rollover completed for the next period.',
        ...current.changes,
      ].slice(0, 4),
    }));
  };

  const rebalanceCategories = () => {
    setHouseholdData((current) => {
      const overspent = budgetCategories.find(
        (category) =>
          category.amount > (category.budget ?? 0) + (category.rollover ?? 0),
      );
      const available = budgetCategories.find(
        (category) =>
          category.amount < (category.budget ?? 0) + (category.rollover ?? 0),
      );

      if (!overspent || !available || overspent.id === available.id) {
        setFormMessage(
          'category',
          'No category has both overspending and available budget to rebalance.',
        );
        return current;
      }

      const overAmount =
        overspent.amount -
        ((overspent.budget ?? 0) + (overspent.rollover ?? 0));
      const availableAmount =
        (available.budget ?? 0) + (available.rollover ?? 0) - available.amount;
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
            return {
              ...category,
              budget: Math.max((category.budget ?? 0) - transfer, 0),
            };
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
      changes: [
        `${billName.trim()} added to bill reminders.`,
        ...current.changes,
      ].slice(0, 4),
    }));
    setBillName('');
    setBillAmount('');
    setBillDue('');
  };

  const deleteBill = (billId) => {
    const bill = householdData.bills.find((item) => item.id === billId);

    if (!bill) {
      return;
    }

    setHouseholdData((current) => {
      const nextBills = current.bills.filter((item) => item.id !== billId);

      return {
        ...current,
        bills: nextBills,
        pressureWeeks:
          nextBills.length > 0
            ? [
                {
                  bills: nextBills.length,
                  id: 'pressure-upcoming',
                  label: 'Upcoming',
                  level: nextBills.some((item) => item.amount > 500)
                    ? 'high'
                    : 'medium',
                  total: nextBills.reduce((sum, item) => sum + item.amount, 0),
                },
              ]
            : [],
        changes: [`${bill.name} bill deleted.`, ...current.changes].slice(0, 4),
      };
    });
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
      changes: [`${goalName.trim()} goal created.`, ...current.changes].slice(
        0,
        4,
      ),
    }));
    setSelectedTradeoff(id);
    setGoalName('');
    setGoalTarget('');
  };

  const deleteGoal = (goalId) => {
    const goal = householdData.goals.find((item) => item.id === goalId);

    if (!goal) {
      return;
    }

    if (goal.saved > 0) {
      setFormMessage(
        'goal',
        'Move saved money out of this goal before deleting it.',
      );
      return;
    }

    clearFormMessage('goal');
    setHouseholdData((current) => ({
      ...current,
      goals: current.goals.filter((item) => item.id !== goalId),
      tradeoffs: current.tradeoffs.filter((item) => item.id !== goalId),
      changes: [`${goal.name} goal deleted.`, ...current.changes].slice(0, 4),
    }));

    if (selectedTradeoff === goalId) {
      setSelectedTradeoff(null);
    }
  };

  const addSubscription = () => {
    const amount = Number(subscriptionAmount);

    if (!subscriptionName.trim() || !hasPositiveAmount(subscriptionAmount)) {
      setFormMessage(
        'subscription',
        'Enter a subscription name and positive monthly cost.',
      );
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
          previousAmount: amount >= 20 ? Math.max(amount - 3, 1) : null,
          status: amount >= 20 ? 'Price increased' : 'Review',
          useScore: amount < 12 ? 76 : 48,
        },
        ...current.subscriptions,
      ],
      changes: [
        `${subscriptionName.trim()} subscription added.`,
        ...current.changes,
      ].slice(0, 4),
    }));
    setSubscriptionName('');
    setSubscriptionAmount('');
  };

  const deleteSubscription = (subscriptionId) => {
    const subscription = householdData.subscriptions.find(
      (item) => item.id === subscriptionId,
    );

    if (!subscription) {
      return;
    }

    setHouseholdData((current) => ({
      ...current,
      subscriptions: current.subscriptions.filter(
        (item) => item.id !== subscriptionId,
      ),
      changes: [
        `${subscription.name} subscription deleted.`,
        ...current.changes,
      ].slice(0, 4),
    }));
  };

  const addRole = () => {
    if (!roleName.trim() || !roleAccess.trim()) {
      setFormMessage(
        'role',
        'Enter a role name and what this person can access.',
      );
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
          message: `${roleName.trim()} joined as ${permissionProfiles.find((profile) => profile.id === rolePermission)?.label ?? 'Teen'}.`,
          time: 'Just now',
        },
        ...(current.notifications ?? []),
      ].slice(0, 6),
    }));
    setActiveRole(id);
    setRoleName('');
    setRoleAccess('');
    setRolePermission('teen');
  };

  const deleteRole = (roleId) => {
    const role = householdData.roles.find((item) => item.id === roleId);

    if (!role) {
      return;
    }

    setHouseholdData((current) => ({
      ...current,
      roles: current.roles.filter((item) => item.id !== roleId),
      notifications: [
        {
          actor: 'BudgetHQ',
          id: createId(`${role.label} removed`),
          message: `${role.label} role was removed.`,
          time: 'Just now',
        },
        ...(current.notifications ?? []),
      ].slice(0, 6),
    }));

    if (activeRole === roleId) {
      setActiveRole(null);
    }
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
      setFormMessage(
        'proposalDecision',
        'Viewers can read proposals but cannot vote.',
      );
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
                  ...(item.votes ?? []).filter(
                    (vote) => vote.memberId !== activeRole,
                  ),
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

      return addNotificationToData(
        nextData,
        `${activeMemberName} ${decision} ${proposal.title}.`,
        activeMemberName,
      );
    });
    setApprovedProposal(decision === 'approved' ? proposalId : null);
  };

  const addProposalComment = (proposalId) => {
    const comment = proposalCommentDrafts[proposalId]?.trim();

    if (!comment) {
      return;
    }

    if (!canCollaborate) {
      setFormMessage(
        'proposalDecision',
        'Viewers can read comments but cannot add them.',
      );
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

  const toggleSpendingPause = () => {
    setHouseholdData((current) => {
      const currentPause =
        current.spendingPause ?? startingHouseholdData.spendingPause;
      const active = !currentPause.active;

      return {
        ...current,
        spendingPause: {
          ...currentPause,
          active,
          allowedCategories:
            currentPause.allowedCategories ?? essentialSpendingCategories,
        },
        changes: [
          active
            ? 'Spending pause turned on for bills, groceries, and needed expenses.'
            : 'Spending pause turned off.',
          ...current.changes,
        ].slice(0, 4),
      };
    });
  };

  const addAutopilotRule = () => {
    const amount = Number(autopilotAmount);

    if (!autopilotAction.trim() || !hasPositiveAmount(autopilotAmount)) {
      setFormMessage(
        'autopilot',
        'Enter an autopilot action and positive amount.',
      );
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
      setFormMessage('permission', 'Only Parent members can pay bills.');
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
          index === 0
            ? { ...account, balance: account.balance - bill.amount }
            : account,
        ),
        bills: current.bills.filter((item) => item.id !== billId),
        pressureWeeks: current.pressureWeeks.map((week, index) =>
          index === 0
            ? {
                ...week,
                bills: Math.max(week.bills - 1, 0),
                total: Math.max(week.total - bill.amount, 0),
              }
            : week,
        ),
      };

      return addActivityToData(
        nextData,
        { merchant: `${bill.name} paid`, amount: -bill.amount },
        currency,
      );
    });
  };

  const fundGoal = (goalId) => {
    if (!canManageMoney) {
      setFormMessage(
        'permission',
        'Only Parent members can move money into goals.',
      );
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
          index === 0
            ? { ...account, balance: account.balance - amount }
            : account,
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

      return addActivityToData(
        nextData,
        { merchant: `${goal.name} contribution`, amount: -amount },
        currency,
      );
    });
  };

  const addAutopilotTransfer = (suggestion) => {
    if (!canManageMoney) {
      setFormMessage(
        'permission',
        'Only Parent members can apply autopilot actions.',
      );
      return;
    }

    clearFormMessage('permission');

    if (suggestion.action === 'Review recurring subscriptions') {
      setHouseholdData((current) =>
        addNotificationToData(
          current,
          'Subscription review queued from Cashflow Autopilot.',
          activeMemberName,
        ),
      );
      return;
    }

    if (suggestion.action.startsWith('Move extra cash to ')) {
      const goalId = suggestion.id.replace('auto-goal-', '');

      setHouseholdData((current) => {
        const goal = current.goals.find((item) => item.id === goalId);
        const checkingBalance = current.accounts[0]?.balance ?? 0;
        const amount = Math.min(
          suggestion.amount,
          checkingBalance,
          goal ? goal.target - goal.saved : 0,
        );

        if (!goal || amount <= 0) {
          return current;
        }

        const nextData = {
          ...current,
          accounts: current.accounts.map((account, index) =>
            index === 0
              ? { ...account, balance: account.balance - amount }
              : account,
          ),
          goals: current.goals.map((item) =>
            item.id === goalId
              ? {
                  ...item,
                  saved: item.saved + amount,
                  contributors: [
                    ...(item.contributors ?? []),
                    { name: activeMemberName, amount },
                  ],
                }
              : item,
          ),
        };

        return addNotificationToData(
          addActivityToData(
            nextData,
            { merchant: suggestion.action, amount: -amount },
            currency,
          ),
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
          index === 0
            ? { ...account, balance: account.balance - suggestion.amount }
            : account,
        ),
      };

      return addNotificationToData(
        addActivityToData(
          nextData,
          { merchant: suggestion.action, amount: -suggestion.amount },
          currency,
        ),
        `${activeMemberName} applied autopilot: ${suggestion.action}.`,
        activeMemberName,
      );
    });
  };

  const totalBalance = householdData.accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );
  const dailyLimit =
    householdData.remainingDays > 0
      ? householdData.monthBudgetRemaining / householdData.remainingDays
      : 0;
  const paceStatus = getPaceStatus(householdData.spentToday, dailyLimit);
  const urgentBills = householdData.bills.filter(
    (bill) => bill.hoursAway <= 48,
  ).length;
  const sortedBills = [...householdData.bills].sort(
    (a, b) => a.hoursAway - b.hoursAway,
  );
  const billTimelineBills = sortedBills.slice(0, 4);
  const billTimelineHours = Math.min(
    Math.max(
      168,
      ...billTimelineBills.map((bill) => Math.max(bill.hoursAway, 0)),
    ),
    720,
  );
  const budgetMood = getBudgetMood({
    dailyLimit,
    spentToday: householdData.spentToday,
    totalBalance,
    urgentBills,
  });
  const billShockAlert = getBillShockAlert({
    bills: householdData.bills,
    dailyLimit,
    monthBudgetRemaining: householdData.monthBudgetRemaining,
    remainingDays: householdData.remainingDays,
  });
  const moneyHealth = getMoneyHealthScore({
    dailyLimit,
    goals: householdData.goals,
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
      const configured = householdData.categories.find(
        (category) => category.name === name,
      );
      const computed = computedCategories.find(
        (category) => category.name === name,
      );

      return {
        amount: computed?.amount ?? configured?.amount ?? 0,
        budget: configured?.budget ?? 0,
        color:
          configured?.color ??
          computed?.color ??
          categoryColors[name] ??
          categoryColors.Other,
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
    (sum, category) =>
      sum +
      Math.max(
        (category.budget ?? 0) + (category.rollover ?? 0) - category.amount,
        0,
      ),
    0,
  );
  const visibleTransactions = householdData.activity
    .filter((entry) => {
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
    })
    .filter((entry) => {
      const query = transactionSearch.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return [
        entry.merchant,
        entry.category,
        entry.notes,
        entry.transactionDate,
        entry.date,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  const sortedTransactions = [...visibleTransactions].sort((a, b) => {
    if (transactionSort === 'amount-desc') {
      return Math.abs(b.amount) - Math.abs(a.amount);
    }

    if (transactionSort === 'amount-asc') {
      return Math.abs(a.amount) - Math.abs(b.amount);
    }

    if (transactionSort === 'merchant-asc') {
      return a.merchant.localeCompare(b.merchant);
    }

    const dateA = getDateKey(a.transactionDate || a.date);
    const dateB = getDateKey(b.transactionDate || b.date);

    return transactionSort === 'date-asc'
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });
  const groupedTransactions = sortedTransactions.reduce((groups, entry) => {
    const key = getDateKey(entry.transactionDate || entry.date);
    const group = groups.find((item) => item.key === key);

    if (group) {
      group.items.push(entry);
      group.total += entry.amount;
      return groups;
    }

    return [
      ...groups,
      {
        key,
        label: getTransactionDateLabel(key),
        total: entry.amount,
        items: [entry],
      },
    ];
  }, []);
  const totalCategorySpend = budgetCategories.reduce(
    (sum, category) => sum + category.amount,
    0,
  );
  const categorySpendingSegments =
    getCategorySpendingSegments(budgetCategories);
  const categoryChartBackground = getCategoryChartBackground(
    categorySpendingSegments,
  );
  const visibleAnalyticsCategories = budgetCategories.filter(
    (category) =>
      category.amount > 0 || category.budget > 0 || category.rollover > 0,
  );
  const incomeTotal = householdData.activity
    .filter((entry) => entry.amount > 0)
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expenseTotal = householdData.activity
    .filter((entry) => entry.amount < 0)
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  const cashFlowTotal = incomeTotal - expenseTotal;
  const monthlyBudgetTotal = Math.max(
    expenseTotal + householdData.monthBudgetRemaining,
    0,
  );
  const monthlyBudgetUsed =
    monthlyBudgetTotal > 0
      ? Math.min((expenseTotal / monthlyBudgetTotal) * 100, 100)
      : 0;
  const monthlyMoneyStory = buildMonthlyMoneyStory(householdData);
  const weeklySpendingHeatmap = buildWeeklySpendingHeatmap(
    householdData.activity,
  );
  const netWorthPoints = householdData.accounts.map((account, index) => ({
    label: account.label,
    value: householdData.accounts
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.balance, 0),
  }));
  const maxNetWorthPoint = Math.max(
    ...netWorthPoints.map((point) => Math.abs(point.value)),
    1,
  );
  const monthlyTrend = [
    { label: 'Last month', value: Math.round(expenseTotal * 0.82) },
    { label: 'This month', value: expenseTotal },
    {
      label: 'Projected',
      value: Math.round(
        expenseTotal + dailyLimit * Math.max(householdData.remainingDays, 0),
      ),
    },
  ];
  const maxMonthlyTrend = Math.max(
    ...monthlyTrend.map((point) => point.value),
    1,
  );
  const calendarEvents = [
    ...householdData.bills.map((bill) => ({
      amount: bill.amount,
      id: bill.id,
      label: bill.name,
      meta: bill.due,
      type: 'bill',
    })),
    ...householdData.activity.slice(0, 4).map((entry) => ({
      amount: Math.abs(entry.amount),
      id: entry.id,
      label: entry.merchant,
      meta: entry.transactionDate || entry.date,
      type: entry.amount >= 0 ? 'income' : 'spend',
    })),
  ].slice(0, 6);
  const paceMeterWidth =
    dailyLimit > 0
      ? Math.min((householdData.spentToday / dailyLimit) * 100, 100)
      : 0;
  const safeToSpendLeft = Math.max(dailyLimit - householdData.spentToday, 0);
  const safeToSpendUsed =
    dailyLimit > 0
      ? Math.min((householdData.spentToday / dailyLimit) * 100, 100)
      : 0;
  const safeCountdownTotal =
    safeToSpendLeft * Math.max(householdData.remainingDays, 0);
  const whatIfMonthlyImpact =
    Number(whatIfIncomeChange || 0) -
    Number(whatIfRentChange || 0) -
    Number(whatIfWeeklySavings || 0) * 4.33;
  const whatIfBudgetRemaining =
    householdData.monthBudgetRemaining + whatIfMonthlyImpact;
  const whatIfDailyLimit =
    householdData.remainingDays > 0
      ? Math.max(whatIfBudgetRemaining / householdData.remainingDays, 0)
      : 0;
  const whatIfDailyDelta = whatIfDailyLimit - dailyLimit;
  const budgetStreak = getBudgetStreak(householdData.activity, dailyLimit);
  const mainAchievementBadges = getMainAchievementBadges({
    activity: householdData.activity,
    budgetStreak,
    goals: householdData.goals,
  });
  const safeToSpendSummary =
    dailyLimit > 0
      ? `${formatMoney(safeToSpendLeft, currency)} left today. Keep that pace for ${householdData.remainingDays} days to protect about ${formatMoney(safeCountdownTotal, currency)}.`
      : 'Set a budget and days left to turn on the daily spending chart.';
  const selectedRole = activeMember ?? {
    access: 'Add family members to tailor what each person can see and do.',
  };
  const visibleRoleModules = [
    canManageMoney ? 'accounts' : null,
    canViewBills ? 'bills' : null,
    'goals',
    canViewSubscriptions ? 'subscriptions' : null,
    canViewReports ? 'reports' : null,
    canViewTransactions ? 'transactions' : 'kid-safe activity',
  ].filter(Boolean);
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
  const selectedGoalForTradeoff =
    householdData.goals.find((goal) => goal.id === selectedTradeoff) ??
    householdData.goals[0] ??
    null;
  const alternateGoalForTradeoff =
    householdData.goals.find(
      (goal) => goal.id !== selectedGoalForTradeoff?.id,
    ) ?? null;
  const tradeoffDailyPace = Math.max(
    Math.round(Math.max(safeToSpendLeft, dailyLimit * 0.2, 0)),
    7,
  );
  const selectedGoalRemaining = selectedGoalForTradeoff
    ? Math.max(
        selectedGoalForTradeoff.target - selectedGoalForTradeoff.saved,
        0,
      )
    : 0;
  const goalTradeoffAmount = selectedGoalForTradeoff
    ? Math.min(20, selectedGoalRemaining || 20)
    : 20;
  const selectedGoalDaysBefore =
    selectedGoalRemaining > 0
      ? Math.ceil(selectedGoalRemaining / tradeoffDailyPace)
      : 0;
  const selectedGoalDaysAfter =
    selectedGoalRemaining > 0
      ? Math.ceil(
          Math.max(selectedGoalRemaining - goalTradeoffAmount, 0) /
            tradeoffDailyPace,
        )
      : 0;
  const selectedGoalDaysSooner = Math.max(
    selectedGoalDaysBefore - selectedGoalDaysAfter,
    selectedGoalRemaining > 0 ? 1 : 0,
  );
  const alternateDelayDays = alternateGoalForTradeoff
    ? Math.max(1, Math.ceil(goalTradeoffAmount / tradeoffDailyPace))
    : 0;
  const tradeoffSummary = selectedGoalForTradeoff
    ? alternateGoalForTradeoff
      ? `If you add ${formatMoney(goalTradeoffAmount, currency)} to ${selectedGoalForTradeoff.name}, ${alternateGoalForTradeoff.name} finishes ${alternateDelayDays} ${alternateDelayDays === 1 ? 'day' : 'days'} later.`
      : `Adding ${formatMoney(goalTradeoffAmount, currency)} moves ${selectedGoalForTradeoff.name} ${selectedGoalDaysSooner} ${selectedGoalDaysSooner === 1 ? 'day' : 'days'} closer.`
    : 'Add goals to compare where the next dollar should go.';
  const calculatedForecast = getCalculatedForecast({
    bills: householdData.bills,
    dailyLimit,
    remainingDays: householdData.remainingDays,
    subscriptions: householdData.subscriptions,
    totalBalance,
  });
  const forecastItems =
    calculatedForecast.length > 0 ? calculatedForecast : householdData.forecast;
  const subscriptionWatchlist = householdData.subscriptions.map(
    (subscription) => ({
      ...subscription,
      signal: getSubscriptionSignal(subscription),
    }),
  );
  const autopilotSuggestions = [
    ...cashflowInsights.recommendations,
    ...householdData.autopilot.map((suggestion) => ({
      ...suggestion,
      reason: 'User-created rule.',
      source: 'manual',
    })),
  ];
  const calculatedEmotionalInsight = getEmotionalInsight(
    householdData.activity,
  );
  const emotionalInsight =
    calculatedEmotionalInsight ?? householdData.emotionalInsight;
  const decisionBill =
    householdData.bills.find((bill) => bill.hoursAway <= 72) ??
    householdData.bills[0];
  const decisionAutopilot = autopilotSuggestions[0];
  const decisionProposal = householdData.proposals.find(
    (proposal) =>
      proposal.status !== 'Approved' && proposal.status !== 'Declined',
  );
  const quickTransactionAccountId =
    quickAddDraft.transaction.accountId || householdData.accounts[0]?.id || '';
  const quickTransactionBalance =
    householdData.accounts.find(
      (account) => account.id === quickTransactionAccountId,
    )?.balance ?? 0;
  const quickTransactionAmount = Number(quickAddDraft.transaction.amount);
  const quickAddCanSubmit = {
    account:
      quickAddDraft.account.name.trim() &&
      Number.isFinite(Number(quickAddDraft.account.balance)),
    bill:
      quickAddDraft.bill.name.trim() &&
      hasPositiveAmount(quickAddDraft.bill.amount),
    goal:
      quickAddDraft.goal.name.trim() &&
      hasPositiveAmount(quickAddDraft.goal.target),
    transaction:
      quickAddDraft.transaction.merchant.trim() &&
      hasPositiveAmount(quickAddDraft.transaction.amount) &&
      (quickAddDraft.transaction.type === 'income' ||
        (Boolean(quickTransactionAccountId) &&
          quickTransactionBalance >= quickTransactionAmount)) &&
      !(
        isSpendingPaused &&
        quickAddDraft.transaction.type === 'expense' &&
        !allowedPauseCategories.includes(quickAddDraft.transaction.category)
      ),
  };
  const quickAddLabels = {
    account: 'Add Account',
    bill: 'Add Bill',
    goal: 'Create Goal',
    transaction: 'Add Transaction',
  };

  const updateQuickAddDraft = (section, field, value) => {
    setQuickAddDraft((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const resetQuickAddSection = (section) => {
    const emptyDraft = createQuickAddDraft();
    setQuickAddDraft((current) => ({
      ...current,
      [section]: emptyDraft[section],
    }));
  };

  const submitQuickAdd = (event) => {
    event.preventDefault();

    if (!canManageMoney || !quickAddCanSubmit[quickAddType]) {
      return;
    }

    if (quickAddType === 'account') {
      const account = quickAddDraft.account;
      const id = createId(account.name);
      setHouseholdData((current) => ({
        ...current,
        accounts: [
          ...current.accounts,
          {
            balance: Number(account.balance),
            id,
            label: account.name.trim(),
            type: account.type,
          },
        ],
        changes: [
          `${account.name.trim()} account added.`,
          ...current.changes,
        ].slice(0, 4),
      }));
      setSelectedAccountId(id);
    }

    if (quickAddType === 'transaction') {
      const transaction = quickAddDraft.transaction;
      const signedAmount =
        transaction.type === 'expense'
          ? -Number(transaction.amount)
          : Number(transaction.amount);
      const entry = createActivityEntry({
        accountId: quickTransactionAccountId || null,
        amount: signedAmount,
        category: transaction.category,
        merchant: transaction.merchant.trim(),
        transactionDate: transaction.date,
        type: transaction.type,
      });

      setHouseholdData((current) => ({
        ...addActivityToData(
          {
            ...current,
            accounts: quickTransactionAccountId
              ? updateAccountBalance(
                  current.accounts,
                  quickTransactionAccountId,
                  signedAmount,
                )
              : current.accounts,
          },
          entry,
          currency,
        ),
        activity: [entry, ...current.activity].slice(0, 20),
      }));
    }

    if (quickAddType === 'bill') {
      const bill = quickAddDraft.bill;
      const amount = Number(bill.amount);
      const hoursAway = bill.due
        ? Math.round(
            (new Date(`${bill.due}T23:59:59`).getTime() - Date.now()) / 3600000,
          )
        : 24;
      setHouseholdData((current) => ({
        ...current,
        bills: [
          {
            amount,
            due: bill.due || 'Upcoming',
            hoursAway,
            id: createId(bill.name),
            name: bill.name.trim(),
          },
          ...current.bills,
        ],
        changes: [
          `${bill.name.trim()} added to bill reminders.`,
          ...current.changes,
        ].slice(0, 4),
      }));
    }

    if (quickAddType === 'goal') {
      const goal = quickAddDraft.goal;
      const id = createId(goal.name);
      setHouseholdData((current) => ({
        ...current,
        goals: [
          {
            contributors: [],
            id,
            name: goal.name.trim(),
            saved: 0,
            target: Number(goal.target),
          },
          ...current.goals,
        ],
        tradeoffs: [
          {
            amount: 50,
            id,
            label: goal.name.trim(),
            outcome: `${formatMoney(50, currency)} starts this goal today.`,
          },
          ...current.tradeoffs,
        ],
        changes: [
          `${goal.name.trim()} goal created.`,
          ...current.changes,
        ].slice(0, 4),
      }));
      setSelectedTradeoff(id);
    }

    resetQuickAddSection(quickAddType);
    setQuickAddOpen(false);
  };

  return (
    <div
      className={`dashboard-shell role-${activePermission} guidance-${profile?.guidance ?? 'balanced'}`}
    >
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
          <button
            className="nav-button"
            onClick={onEditPreferences}
            type="button"
          >
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span>Preferences</span>
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
          <button
            className="nav-button reset-button"
            onClick={resetDemo}
            type="button"
          >
            <RefreshCcw size={17} aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </nav>

      <header className="dashboard-header">
        <div className="dashboard-sign">
          <p className="eyebrow">MAIN Workspace</p>
          <h1>
            {activeMainPage === 'dashboard'
              ? 'Today'
              : activeMainPage === 'transactions'
                ? 'Transactions'
                : 'Manage Money'}
          </h1>
          <span>
            {activeMainPage === 'dashboard'
              ? 'Balance, safe-to-spend, bills, and health score'
              : activeMainPage === 'transactions'
                ? 'Grouped ledger with filters, sorting, and edit controls'
                : 'Accounts and the essentials for building your budget'}
          </span>
        </div>
        <div className="balance-card" aria-label="Total available balance">
          <span className="card-label">Total Available</span>
          <strong>{money(totalBalance)}</strong>
          <span>
            {householdData.accounts.length > 0
              ? `${householdData.accounts.length} ${householdData.accounts.length === 1 ? 'account' : 'accounts'} included`
              : 'Add an account to get started'}
          </span>
        </div>
      </header>

      {activePermission === 'kid' ? (
        <section
          className="kid-safe-summary"
          aria-label="Kid-safe money summary"
        >
          <div>
            <p className="eyebrow">Kid View</p>
            <h2>Goals and simple money moves</h2>
            <span>
              Big bills, account balances, and subscription details stay with
              adults.
            </span>
          </div>
          <div className="kid-safe-grid">
            <span>
              <strong>{householdData.goals.length}</strong>
              goals
            </span>
            <span>
              <strong>
                {
                  householdData.activity.filter(
                    (entry) => entry.category === 'Kids',
                  ).length
                }
              </strong>
              kid-safe moves
            </span>
          </div>
        </section>
      ) : null}

      <section className="main-page-switch" aria-label="Main page switcher">
        <button
          className={activeMainPage === 'dashboard' ? 'selected' : ''}
          onClick={() => setActiveMainPage('dashboard')}
          type="button"
        >
          <ArrowRight size={18} aria-hidden="true" />
          <span>Today</span>
        </button>
        <button
          className={activeMainPage === 'manage' ? 'selected' : ''}
          onClick={() => setActiveMainPage('manage')}
          type="button"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Add & Manage</span>
        </button>
        <button
          className={activeMainPage === 'transactions' ? 'selected' : ''}
          onClick={() => setActiveMainPage('transactions')}
          type="button"
        >
          <ReceiptText size={18} aria-hidden="true" />
          <span>Transactions</span>
        </button>
      </section>

      {activeMainPage === 'dashboard' && profile ? (
        <section
          className={`personalized-start priority-${profile.priority}`}
          aria-label="Your personalized starting point"
        >
          <div className="personalized-start-icon" aria-hidden="true">
            <SlidersHorizontal size={21} />
          </div>
          <div className="personalized-start-copy">
            <p>Your BudgetHQ</p>
            <h2>{personalizedDashboard.focus}</h2>
            <span>{personalizedDashboard.detail}</span>
          </div>
          <div
            className="personalized-profile-tags"
            aria-label="Your preferences"
          >
            <span>{personalizedDashboard.experience}</span>
            <span>{personalizedDashboard.rhythm}</span>
          </div>
          <button
            onClick={() => {
              if (personalizedDashboard.page === 'kids') {
                onShowKids();
                return;
              }

              setActiveMainPage(personalizedDashboard.page);
            }}
            type="button"
          >
            {personalizedDashboard.action}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </section>
      ) : null}

      {activeMainPage === 'manage' ? (
        <>
          <nav className="manage-section-nav" aria-label="Manage sections">
            <a href="#manage-setup">
              <Landmark size={18} aria-hidden="true" />
              <span>
                <strong>Setup</strong>
                <small>Budget building blocks</small>
              </span>
            </a>
            <a href="#manage-accounts">
              <Wallet size={18} aria-hidden="true" />
              <span>
                <strong>Accounts</strong>
                <small>Connections & imports</small>
              </span>
            </a>
            <a href="#manage-tools">
              <Sparkles size={18} aria-hidden="true" />
              <span>
                <strong>Planning</strong>
                <small>What-if & receipts</small>
              </span>
            </a>
            <a href="#manage-data">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <strong>Data</strong>
                <small>Backup & privacy</small>
              </span>
            </a>
            <a href="#manage-activity">
              <ReceiptText size={18} aria-hidden="true" />
              <span>
                <strong>Activity</strong>
                <small>Quick money actions</small>
              </span>
            </a>
          </nav>

          <ManageSectionHeading
            detail="Budget, categories, bills, goals, and subscriptions in one quick setup area."
            icon={Landmark}
            id="manage-setup"
            label="01 · Budget Setup"
            title="Build your budget"
          />

          <section
            className="core-setup-panel"
            aria-label="Budget setup controls"
          >
            <div className="core-setup-grid">
              <div className="setup-action">
                <strong>Monthly budget</strong>
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
                <button
                  disabled={!canSaveBudget}
                  onClick={saveBudgetPlan}
                  type="button"
                >
                  Save Budget
                </button>
                <FormMessage
                  id="budget-message"
                  tone={formMessages.budget ? 'error' : 'hint'}
                >
                  {formMessages.budget ||
                    ((budgetAmount || budgetDays) && !canSaveBudget
                      ? 'Enter a positive budget and number of days.'
                      : '')}
                </FormMessage>
              </div>

              <div className="setup-action">
                <strong>Category</strong>
                <label htmlFor="category-name">Name</label>
                <input
                  id="category-name"
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Groceries"
                  type="text"
                  value={categoryName}
                />
                <label htmlFor="category-budget">Budget</label>
                <input
                  id="category-budget"
                  min="1"
                  onChange={(event) => setCategoryBudget(event.target.value)}
                  placeholder="0"
                  type="number"
                  value={categoryBudget}
                />
                <button
                  disabled={!canAddCategory}
                  onClick={addCategory}
                  type="button"
                >
                  Save Category
                </button>
                <FormMessage
                  id="category-message"
                  tone={formMessages.category ? 'error' : 'hint'}
                >
                  {formMessages.category ||
                    ((categoryName || categoryBudget) && !canAddCategory
                      ? 'Enter a name and positive budget.'
                      : '')}
                </FormMessage>
              </div>

              <div className="setup-action">
                <strong>Bill</strong>
                <label htmlFor="bill-name">Name</label>
                <input
                  id="bill-name"
                  onChange={(event) => setBillName(event.target.value)}
                  placeholder="Electric"
                  type="text"
                  value={billName}
                />
                <label htmlFor="bill-amount">Amount</label>
                <input
                  id="bill-amount"
                  min="1"
                  onChange={(event) => setBillAmount(event.target.value)}
                  placeholder="0"
                  type="number"
                  value={billAmount}
                />
                <label htmlFor="bill-due">Due</label>
                <input
                  id="bill-due"
                  onChange={(event) => setBillDue(event.target.value)}
                  placeholder="Aug 20"
                  type="text"
                  value={billDue}
                />
                <button disabled={!canAddBill} onClick={addBill} type="button">
                  Add Bill
                </button>
                <FormMessage
                  id="bill-message"
                  tone={formMessages.bill ? 'error' : 'hint'}
                >
                  {formMessages.bill ||
                    ((billName || billAmount) && !canAddBill
                      ? 'Enter a name and positive amount.'
                      : '')}
                </FormMessage>
              </div>

              <div className="setup-action goal-setup-action">
                <strong>Goal</strong>
                <label htmlFor="goal-name">Name</label>
                <input
                  id="goal-name"
                  onChange={(event) => setGoalName(event.target.value)}
                  placeholder="Emergency fund"
                  type="text"
                  value={goalName}
                />
                <label htmlFor="goal-target">Target</label>
                <input
                  id="goal-target"
                  min="1"
                  onChange={(event) => setGoalTarget(event.target.value)}
                  placeholder="0"
                  type="number"
                  value={goalTarget}
                />
                <button disabled={!canAddGoal} onClick={addGoal} type="button">
                  Add Goal
                </button>
                <FormMessage
                  id="goal-message"
                  tone={formMessages.goal ? 'error' : 'hint'}
                >
                  {formMessages.goal ||
                    ((goalName || goalTarget) && !canAddGoal
                      ? 'Enter a name and positive target.'
                      : '')}
                </FormMessage>
              </div>

              <div className="setup-action">
                <strong>Subscription</strong>
                <label htmlFor="subscription-name">Name</label>
                <input
                  id="subscription-name"
                  onChange={(event) => setSubscriptionName(event.target.value)}
                  placeholder="Streaming"
                  type="text"
                  value={subscriptionName}
                />
                <label htmlFor="subscription-amount">Monthly cost</label>
                <input
                  id="subscription-amount"
                  min="1"
                  onChange={(event) =>
                    setSubscriptionAmount(event.target.value)
                  }
                  placeholder="0"
                  type="number"
                  value={subscriptionAmount}
                />
                <button
                  disabled={!canAddSubscription}
                  onClick={addSubscription}
                  type="button"
                >
                  Add Subscription
                </button>
                <FormMessage
                  id="subscription-message"
                  tone={formMessages.subscription ? 'error' : 'hint'}
                >
                  {formMessages.subscription ||
                    ((subscriptionName || subscriptionAmount) &&
                    !canAddSubscription
                      ? 'Enter a name and positive monthly cost.'
                      : '')}
                </FormMessage>
              </div>
            </div>
          </section>

          <IncomeAllocationFlow
            amount={incomeTotal || budgetAmount}
            variant="household"
          />
        </>
      ) : null}

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
              <strong className={cashFlowTotal >= 0 ? 'positive' : 'negative'}>
                {money(cashFlowTotal)}
              </strong>
              <div className="mini-bars">
                <label>
                  <span>Income</span>
                  <i
                    style={{
                      width: `${Math.min((incomeTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%`,
                    }}
                  />
                  <b>{money(incomeTotal)}</b>
                </label>
                <label>
                  <span>Expenses</span>
                  <i
                    className="expense-bar"
                    style={{
                      width: `${Math.min((expenseTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%`,
                    }}
                  />
                  <b>{money(expenseTotal)}</b>
                </label>
              </div>
              <small>
                Positive means the household has more coming in than going out.
              </small>
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
                    <i
                      style={{
                        height: `${point.value > 0 ? Math.max((point.value / maxMonthlyTrend) * 100, 8) : 0}%`,
                      }}
                    />
                    <span>{point.label}</span>
                    <b>{money(point.value)}</b>
                  </label>
                ))}
              </div>
              <small>
                Projected adds the remaining daily spending pace to this month.
              </small>
            </article>

            <article className="top-graph-card health-score-card">
              <div className="top-graph-heading">
                <span className="module-icon">
                  <HeartPulse size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="eyebrow">Money Health</p>
                  <h2>{moneyHealth.label}</h2>
                </div>
              </div>
              <div
                aria-label={`Money health score ${moneyHealth.score} out of 100`}
                className="health-score-ring"
                style={{ '--health-score': `${moneyHealth.score}%` }}
              >
                <strong>{moneyHealth.score}</strong>
                <span>/100</span>
              </div>
              <small>{moneyHealth.detail}</small>
            </article>

            <article className="top-graph-card budget-runway-card">
              <div className="top-graph-heading">
                <span className="module-icon">
                  <CalendarClock size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="eyebrow">Budget Runway</p>
                  <h2>Monthly budget used</h2>
                </div>
              </div>
              <strong>{Math.round(monthlyBudgetUsed)}%</strong>
              <div className="budget-runway-chart">
                <div
                  aria-label={`${Math.round(monthlyBudgetUsed)} percent of the monthly budget used`}
                  className="budget-runway-track"
                  role="img"
                >
                  <span style={{ width: `${monthlyBudgetUsed}%` }} />
                </div>
                <div className="budget-runway-values">
                  <span>
                    <b>{money(expenseTotal)}</b>
                    Spent
                  </span>
                  <span>
                    <b>{money(householdData.monthBudgetRemaining)}</b>
                    Remaining
                  </span>
                </div>
              </div>
              <small>
                This compares recorded spending with the amount left this month.
              </small>
            </article>
          </section>

          <AchievementShelf
            badges={mainAchievementBadges}
            id="main-achievements"
            tone="main"
          />

          <section
            className="monthly-money-story"
            aria-labelledby="monthly-money-story-title"
          >
            <header className="monthly-story-header">
              <div className="monthly-story-title">
                <span className="module-icon" aria-hidden="true">
                  <TrendingUp size={19} />
                </span>
                <div>
                  <p className="eyebrow">Monthly Money Story</p>
                  <h2 id="monthly-money-story-title">
                    {monthlyMoneyStory.label}
                  </h2>
                </div>
              </div>

              <div
                className="monthly-story-legend"
                aria-label="Monthly money totals"
              >
                {[
                  ['income', 'Income', monthlyMoneyStory.totals.income],
                  ['bill', 'Bills', monthlyMoneyStory.totals.bill],
                  ['spending', 'Spending', monthlyMoneyStory.totals.spending],
                  ['savings', 'Savings', monthlyMoneyStory.totals.savings],
                ].map(([type, label, total]) => (
                  <span className={type} key={type}>
                    <i aria-hidden="true" />
                    <b>{label}</b>
                    <strong>{money(total)}</strong>
                  </span>
                ))}
              </div>
            </header>

            <div className="monthly-story-scroll">
              <div className="monthly-story-chart">
                <div className="monthly-story-plot">
                  <span className="monthly-story-axis" aria-hidden="true" />
                  {[1, 8, 15, 22, monthlyMoneyStory.daysInMonth].map(
                    (day, index) => (
                      <span
                        className="monthly-story-tick"
                        key={`${day}-${index}`}
                        style={{
                          '--story-left': `${
                            ((day - 1) /
                              Math.max(monthlyMoneyStory.daysInMonth - 1, 1)) *
                            100
                          }%`,
                        }}
                      >
                        <i aria-hidden="true" />
                        <small>{day}</small>
                      </span>
                    ),
                  )}

                  {monthlyMoneyStory.events.map((event) => {
                    const eventLabels = event.labels.join(', ');
                    const eventSummary = `Day ${event.day}, ${event.type}, ${money(event.amount)}${
                      eventLabels ? `: ${eventLabels}` : ''
                    }`;

                    return (
                      <span
                        aria-label={eventSummary}
                        className={`monthly-story-event ${event.type} ${event.direction}`}
                        key={event.id}
                        role="img"
                        style={{
                          '--story-height': `${event.height}px`,
                          '--story-label-shift': `${event.labelLane * 30}px`,
                          '--story-left': `${event.position}%`,
                          '--story-offset': `${
                            event.type === 'income' || event.type === 'bill'
                              ? -8
                              : 8
                          }px`,
                        }}
                        title={eventSummary}
                      >
                        <span
                          className="monthly-story-peak"
                          aria-hidden="true"
                        />
                        <span
                          className="monthly-story-dot"
                          aria-hidden="true"
                        />
                        <span className="monthly-story-event-label">
                          <strong>{money(event.amount)}</strong>
                          <small>Day {event.day}</small>
                        </span>
                      </span>
                    );
                  })}

                  {monthlyMoneyStory.events.length === 0 ? (
                    <button
                      className="monthly-story-empty"
                      onClick={() => setActiveMainPage('transactions')}
                      type="button"
                    >
                      <Plus size={18} aria-hidden="true" />
                      Add activity to draw your month
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {hasHouseholdData ? (
            <section
              className="decision-center"
              aria-labelledby="decision-center-title"
            >
              <div className="decision-center-heading">
                <p className="eyebrow">Decision Center</p>
                <h2 id="decision-center-title">Needs attention</h2>
              </div>
              <div className="decision-list">
                {decisionBill ? (
                  <article className="decision-item">
                    <span>Bills due soon</span>
                    <strong>{decisionBill.name}</strong>
                    <p>
                      {money(decisionBill.amount)} · {decisionBill.due}
                    </p>
                    <button
                      disabled={
                        !canManageMoney || checkingBalance < decisionBill.amount
                      }
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
                    <p>
                      {money(decisionAutopilot.amount)} ·{' '}
                      {decisionAutopilot.timing}
                    </p>
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
                      onClick={() =>
                        updateProposalDecision(decisionProposal.id, 'approved')
                      }
                      type="button"
                    >
                      Approve
                    </button>
                  </article>
                ) : null}

                {!decisionBill && !decisionAutopilot && !decisionProposal ? (
                  <EmptyState title="Nothing urgent">
                    Bills and recommendations will appear here when they need a
                    decision.
                  </EmptyState>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      ) : activeMainPage === 'manage' ? (
        <>
          <ManageSectionHeading
            detail="Connect accounts, review balances, and bring in transaction rows."
            icon={Wallet}
            id="manage-accounts"
            label="02 · Accounts & Imports"
            title="Bring your household money into one place"
          />

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
                    <div
                      className={
                        transactionAccountId === account.id
                          ? 'account-chip selected'
                          : 'account-chip'
                      }
                      key={account.id}
                    >
                      <button
                        onClick={() => setSelectedAccountId(account.id)}
                        type="button"
                      >
                        <span>{account.type}</span>
                        <strong>{account.label}</strong>
                        <b>{money(account.balance)}</b>
                      </button>
                      <button
                        className="mini-delete-button"
                        onClick={() => deleteAccount(account.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No accounts yet">
                    Add checking, savings, credit cards, loans, or cash
                    accounts.
                  </EmptyState>
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
              <select
                id="account-type"
                onChange={(event) => setAccountType(event.target.value)}
                value={accountType}
              >
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
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
              <button
                disabled={!canAddAccount}
                onClick={addAccount}
                type="button"
              >
                Add Account
              </button>
              <FormMessage
                id="account-message"
                tone={formMessages.account ? 'error' : 'hint'}
              >
                {formMessages.account ||
                  (accountName && !canAddAccount
                    ? 'Add a numeric starting balance.'
                    : '')}
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
              <button
                disabled={!csvImportText.trim()}
                onClick={importCsvTransactions}
                type="button"
              >
                Import Rows
              </button>
              <FormMessage
                id="csv-message"
                tone={formMessages.csv ? 'error' : 'hint'}
              >
                {formMessages.csv ||
                  'Format: date, merchant, amount, category, account, type, notes'}
              </FormMessage>
            </div>
          </section>

          <ManageSectionHeading
            detail="Explore budget changes and stage receipts before turning them into activity."
            icon={Sparkles}
            id="manage-tools"
            label="03 · Planning Tools"
            title="Think through the next money move"
          />

          <section
            className="prototype-tools-grid"
            aria-label="Budget planning tools"
          >
            <article className="what-if-card">
              <div className="setup-heading">
                <div>
                  <p className="eyebrow">What-If Simulator</p>
                  <h2>Test changes before they hit</h2>
                </div>
              </div>

              <div className="what-if-form">
                <label htmlFor="rent-change">
                  Rent change
                  <input
                    id="rent-change"
                    onChange={(event) =>
                      setWhatIfRentChange(event.target.value)
                    }
                    placeholder="100"
                    type="number"
                    value={whatIfRentChange}
                  />
                </label>
                <label htmlFor="weekly-savings-change">
                  Extra weekly savings
                  <input
                    id="weekly-savings-change"
                    onChange={(event) =>
                      setWhatIfWeeklySavings(event.target.value)
                    }
                    placeholder="25"
                    type="number"
                    value={whatIfWeeklySavings}
                  />
                </label>
                <label htmlFor="income-change">
                  Income change
                  <input
                    id="income-change"
                    onChange={(event) =>
                      setWhatIfIncomeChange(event.target.value)
                    }
                    placeholder="0"
                    type="number"
                    value={whatIfIncomeChange}
                  />
                </label>
              </div>

              <div className="what-if-result">
                <span>New daily safe-to-spend</span>
                <strong>{money(whatIfDailyLimit)}</strong>
                <small
                  className={whatIfDailyDelta >= 0 ? 'positive' : 'negative'}
                >
                  {whatIfDailyDelta >= 0 ? '+' : ''}
                  {money(whatIfDailyDelta)} per day versus current pace
                </small>
              </div>
            </article>

            <article className="receipt-drop-card">
              <div className="setup-heading">
                <div>
                  <p className="eyebrow">Receipt Drop Zone</p>
                  <h2>Stage receipts and CSVs</h2>
                </div>
              </div>
              <label
                className="receipt-drop-zone"
                htmlFor="receipt-file-input"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleReceiptFiles(event.dataTransfer.files);
                }}
              >
                <Upload size={22} aria-hidden="true" />
                <strong>Drop receipt images or CSV files</strong>
                <span>
                  CSV rows go into the importer. Images are staged for
                  extraction later.
                </span>
                <input
                  accept="image/*,.csv,text/csv"
                  id="receipt-file-input"
                  multiple
                  onChange={(event) => handleReceiptFiles(event.target.files)}
                  type="file"
                />
              </label>
              <div className="receipt-stage-list">
                {receiptItems.length > 0 ? (
                  receiptItems.map((item) => (
                    <div key={item.id}>
                      <span>{item.type}</span>
                      <strong>{item.name}</strong>
                      <small>{item.status}</small>
                    </div>
                  ))
                ) : (
                  <EmptyState title="Nothing staged">
                    Drop a receipt image or CSV to prepare transactions.
                  </EmptyState>
                )}
              </div>
              <FormMessage
                id="receipt-message"
                tone={formMessages.receipt ? 'error' : 'hint'}
              >
                {formMessages.receipt ||
                  'Use Import Rows after a CSV is staged.'}
              </FormMessage>
            </article>
          </section>

          <ManageSectionHeading
            detail="Keep local backups close and choose when amounts should be hidden."
            icon={ShieldCheck}
            id="manage-data"
            label="04 · Data & Privacy"
            title="Keep your budget portable and private"
          />

          <section
            className="onboarding-data-grid"
            aria-label="Onboarding and data controls"
          >
            <article className="onboarding-card">
              <div>
                <p className="eyebrow">Quick Start</p>
                <h2>Start from blank</h2>
                <p>
                  The Main portal starts empty. Add your own accounts,
                  transactions, bills, and goals, or load demo data only when
                  you want to preview a filled dashboard.
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
                BudgetHQ stores this prototype's data in this browser only.
                Export a backup before clearing local data or moving browsers.
              </p>

              <div className="data-action-row">
                <button onClick={exportJsonBackup} type="button">
                  Export JSON
                </button>
                <button onClick={exportActivityCsv} type="button">
                  Export CSV
                </button>
                <button onClick={restoreJsonBackup} type="button">
                  Restore JSON
                </button>
                <button
                  className="danger-action"
                  onClick={resetDemo}
                  type="button"
                >
                  Clear Local Data
                </button>
              </div>

              <textarea
                aria-label="BudgetHQ backup text"
                onChange={(event) => setBackupText(event.target.value)}
                placeholder="Exported JSON or CSV preview appears here. Paste a JSON backup here to restore."
                value={backupText}
              />
              <FormMessage
                id="backup-message"
                tone={formMessages.backup ? 'error' : 'hint'}
              >
                {formMessages.backup ||
                  'JSON restores the full household; CSV exports transaction rows only.'}
              </FormMessage>
            </article>
          </section>

          <ManageSectionHeading
            detail="Pause non-essential spending, add money, and record quick activity."
            icon={ReceiptText}
            id="manage-activity"
            label="05 · Money Activity"
            title="Make the changes that keep the plan current"
          />

          <section className="quick-actions" aria-label="Money actions">
            <div
              className={`spending-pause-banner ${isSpendingPaused ? 'active' : ''}`}
            >
              <div>
                <span>
                  {isSpendingPaused
                    ? 'Spending Pause On'
                    : 'Spending Pause Off'}
                </span>
                <strong>Bills, groceries, and needed expenses only</strong>
                <small>{spendingPause.reason}</small>
              </div>
              <button onClick={toggleSpendingPause} type="button">
                {isSpendingPaused ? 'Resume Spending' : 'Pause Non-Essentials'}
              </button>
            </div>
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
              <FormMessage
                id="add-money-message"
                tone={formMessages.addMoney ? 'error' : 'hint'}
              >
                {formMessages.addMoney ||
                  (depositAmount && !canAddMoney
                    ? 'Amount must be greater than zero.'
                    : '')}
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
                        {isSpendingPaused &&
                        !allowedPauseCategories.includes(category)
                          ? `${category} paused`
                          : category}
                      </option>
                    ))}
                </select>
              </label>
              <button
                disabled={!canLogSpending || isSpendCategoryPaused}
                onClick={logSpending}
                type="button"
              >
                Log Purchase
              </button>
              <FormMessage
                id="log-spending-message"
                tone={formMessages.logSpending ? 'error' : 'hint'}
              >
                {formMessages.logSpending ||
                  (isSpendCategoryPaused
                    ? 'Spending pause allows bills, food, and transport only.'
                    : '') ||
                  (spendAmount && !canLogSpending
                    ? 'Enter an amount covered by the selected account.'
                    : '')}
              </FormMessage>
            </div>
          </section>
        </>
      ) : null}

      {activeMainPage === 'transactions' ? (
        <>
          <section
            className="transaction-panel"
            aria-label="Transaction system"
          >
            <div className="setup-heading">
              <div>
                <p className="eyebrow">Transactions</p>
                <h2>
                  {editingTransactionId
                    ? 'Edit transaction'
                    : 'Add a detailed transaction'}
                </h2>
              </div>
              <div className="transaction-toolbar">
                <select
                  aria-label="Filter transactions"
                  onChange={(event) => setTransactionFilter(event.target.value)}
                  value={transactionFilter}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {isSpendingPaused &&
                      transactionType === 'expense' &&
                      !allowedPauseCategories.includes(category)
                        ? `${category} paused`
                        : category}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Search transactions"
                  onChange={(event) => setTransactionSearch(event.target.value)}
                  placeholder="Search merchant, category, note"
                  type="search"
                  value={transactionSearch}
                />
                <select
                  aria-label="Sort transactions"
                  onChange={(event) => setTransactionSort(event.target.value)}
                  value={transactionSort}
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="amount-desc">Largest amount</option>
                  <option value="amount-asc">Smallest amount</option>
                  <option value="merchant-asc">Merchant A-Z</option>
                </select>
              </div>
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
              <select
                id="transaction-type"
                onChange={(event) => setTransactionType(event.target.value)}
                value={transactionType}
              >
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
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <label className="transaction-notes" htmlFor="transaction-notes">
                Notes
              </label>
              <input
                id="transaction-notes"
                onChange={(event) => setTransactionNotes(event.target.value)}
                placeholder="Optional note"
                type="text"
                value={transactionNotes}
              />
              <div className="transaction-actions">
                <button
                  disabled={!canSaveTransaction || isTransactionCategoryPaused}
                  onClick={saveTransaction}
                  type="button"
                >
                  {editingTransactionId ? 'Save Edit' : 'Add Transaction'}
                </button>
                {editingTransactionId ? (
                  <button
                    className="secondary-action"
                    onClick={resetTransactionForm}
                    type="button"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
              <FormMessage
                id="transaction-message"
                tone={formMessages.transaction ? 'error' : 'hint'}
              >
                {formMessages.transaction ||
                  (isTransactionCategoryPaused
                    ? 'Spending pause allows expense entries only for bills, food, and transport.'
                    : 'Transactions update account balances and analytics immediately.')}
              </FormMessage>
            </div>

            <div
              className="transaction-ledger"
              aria-label="Grouped transactions"
            >
              <div className="transaction-ledger-head" aria-hidden="true">
                <span>Category</span>
                <span>Merchant</span>
                <span>Account</span>
                <span>Amount</span>
                <span>Actions</span>
              </div>
              {groupedTransactions.length > 0 ? (
                groupedTransactions.map((group) => (
                  <section className="transaction-date-group" key={group.key}>
                    <div className="transaction-date-heading">
                      <strong>{group.label}</strong>
                      <span
                        className={group.total >= 0 ? 'positive' : 'negative'}
                      >
                        {formatMoney(group.total, currency)}
                      </span>
                    </div>
                    {group.items.map((entry) => {
                      const account = householdData.accounts.find(
                        (item) => item.id === entry.accountId,
                      );
                      const category =
                        entry.category ||
                        (entry.amount >= 0 ? 'Income' : 'Other');

                      return (
                        <article
                          className="transaction-table-row"
                          key={entry.id}
                        >
                          <span
                            className="transaction-category-badge"
                            style={{
                              '--category-color':
                                categoryColors[category] ??
                                categoryColors.Other,
                            }}
                          >
                            <b>
                              {categoryIcons[category] ?? categoryIcons.Other}
                            </b>
                            {category}
                          </span>
                          <div>
                            <strong>{entry.merchant}</strong>
                            {entry.notes ? <small>{entry.notes}</small> : null}
                          </div>
                          <span>{account?.label ?? 'No account'}</span>
                          <strong
                            className={
                              entry.amount > 0
                                ? 'positive amount-cell'
                                : 'negative amount-cell'
                            }
                          >
                            {formatMoney(entry.amount, currency)}
                          </strong>
                          <div className="row-actions">
                            <button
                              onClick={() => editTransaction(entry.id)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTransaction(entry.id)}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </section>
                ))
              ) : (
                <EmptyState title="No matching transactions">
                  Add a transaction, import CSV rows, or change the
                  filter/search.
                </EmptyState>
              )}
            </div>
          </section>
        </>
      ) : null}

      {activeMainPage === 'dashboard' ? (
        <>
          <section className="charts-section" aria-labelledby="charts-title">
            <div className="charts-heading">
              <p className="eyebrow">Charts</p>
              <h2 id="charts-title">Safe to spend</h2>
            </div>

            <article
              className={`spend-ring-card ${paceStatus.tone}`}
              aria-label="Safe-to-spend chart"
            >
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
                <h3>Safe-to-spend countdown</h3>
                <p>{safeToSpendSummary}</p>
                <div
                  className="chart-stats"
                  aria-label="Safe-to-spend chart values"
                >
                  <span>
                    <strong>
                      {formatMoney(householdData.spentToday, currency)}
                    </strong>
                    spent
                  </span>
                  <span>
                    <strong>{formatMoney(dailyLimit, currency)}</strong>
                    daily pace
                  </span>
                  <span>
                    <strong>{formatMoney(safeCountdownTotal, currency)}</strong>
                    protected
                  </span>
                </div>
              </div>
            </article>
          </section>
        </>
      ) : null}

      {activeMainPage === 'advanced-setup' ? (
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
                <button
                  disabled={!canSaveBudget}
                  onClick={saveBudgetPlan}
                  type="button"
                >
                  Save Budget
                </button>
                <FormMessage
                  id="budget-message"
                  tone={formMessages.budget ? 'error' : 'hint'}
                >
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
                <button
                  disabled={!canAddCategory}
                  onClick={addCategory}
                  type="button"
                >
                  Save Category
                </button>
                <div className="split-actions">
                  <button
                    disabled={householdData.categories.length === 0}
                    onClick={rebalanceCategories}
                    type="button"
                  >
                    Rebalance
                  </button>
                  <button
                    disabled={householdData.categories.length === 0}
                    onClick={rolloverCategories}
                    type="button"
                  >
                    Rollover
                  </button>
                </div>
                <FormMessage
                  id="category-message"
                  tone={formMessages.category ? 'error' : 'hint'}
                >
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
                <button disabled={!canAddBill} onClick={addBill} type="button">
                  Add Bill
                </button>
                <FormMessage
                  id="bill-message"
                  tone={formMessages.bill ? 'error' : 'hint'}
                >
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
                <button disabled={!canAddGoal} onClick={addGoal} type="button">
                  Add Goal
                </button>
                <FormMessage
                  id="goal-message"
                  tone={formMessages.goal ? 'error' : 'hint'}
                >
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
                  onChange={(event) =>
                    setSubscriptionAmount(event.target.value)
                  }
                  placeholder="0"
                  type="number"
                  value={subscriptionAmount}
                />
                <button
                  disabled={!canAddSubscription}
                  onClick={addSubscription}
                  type="button"
                >
                  Add Subscription
                </button>
                <FormMessage
                  id="subscription-message"
                  tone={formMessages.subscription ? 'error' : 'hint'}
                >
                  {formMessages.subscription ||
                    ((subscriptionName || subscriptionAmount) &&
                    !canAddSubscription
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
                <button disabled={!canAddRole} onClick={addRole} type="button">
                  Add Role
                </button>
                <FormMessage
                  id="role-message"
                  tone={formMessages.role ? 'error' : 'hint'}
                >
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
                <button
                  disabled={!canAddProposal}
                  onClick={addProposal}
                  type="button"
                >
                  Add Proposal
                </button>
                <FormMessage
                  id="proposal-message"
                  tone={formMessages.proposal ? 'error' : 'hint'}
                >
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
                <button
                  disabled={!canAddPause}
                  onClick={addPause}
                  type="button"
                >
                  Start Hold
                </button>
                <FormMessage
                  id="pause-message"
                  tone={formMessages.pause ? 'error' : 'hint'}
                >
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
                <button
                  disabled={!canAddAutopilot}
                  onClick={addAutopilotRule}
                  type="button"
                >
                  Add Rule
                </button>
                <FormMessage
                  id="autopilot-message"
                  tone={formMessages.autopilot ? 'error' : 'hint'}
                >
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
          <section
            className="insight-strip"
            aria-label="BudgetHQ signature insights"
          >
            <article className="insight-card mood-card">
              <span className="card-label">Budget Mood</span>
              <strong>{budgetMood.label}</strong>
              <p>{budgetMood.detail}</p>
              <div
                className="mood-meter"
                aria-label={`Budget confidence score ${budgetMood.score}`}
              >
                <span style={{ width: `${budgetMood.score}%` }} />
              </div>
            </article>

            <article className="insight-card">
              <span className="card-label">What Changed?</span>
              {householdData.changes.length > 0 ? (
                <ul className="change-list">
                  {householdData.changes.map((change, index) => (
                    <li key={`${change}-${index}`}>{change}</li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No changes yet">
                  BudgetHQ will summarize changes after activity exists.
                </EmptyState>
              )}
            </article>

            <article className="insight-card recovery-card">
              <span className="card-label">No-Shame Recovery</span>
              <strong>Small fix, not a failure.</strong>
              <p>
                {billShockAlert
                  ? `${billShockAlert.bill.name} is coming soon. Shift daily spending to ${formatMoney(
                      billShockAlert.adjustedDailySpend,
                      currency,
                    )} to stay safe.`
                  : dailyLimit > 0
                    ? `Hold extra spending and keep daily purchases under ${formatMoney(
                        dailyLimit,
                        currency,
                      )} to stay on pace.`
                    : 'Once a budget is added, BudgetHQ will suggest small recovery steps without shame.'}
              </p>
            </article>
          </section>

          <section
            className="dashboard-grid"
            aria-label="Household dashboard summary"
          >
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
              <div
                className="meter-track"
                aria-label={`${paceStatus.label} spending meter`}
              >
                <span
                  className="meter-fill"
                  style={{ width: `${paceMeterWidth}%` }}
                />
              </div>
              <p className="fine-print">
                {formatMoney(householdData.spentToday, currency)} spent today
                from a{' '}
                {formatMoney(householdData.monthBudgetRemaining, currency)}{' '}
                remaining monthly budget.
              </p>
            </article>

            <article className="dashboard-card streak-card">
              <div className="card-heading">
                <span className="module-icon">
                  <Check size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2>Budget Streaks</h2>
                  <p>Days and weeks under safe-to-spend</p>
                </div>
              </div>
              {dailyLimit > 0 && budgetStreak.days.length > 0 ? (
                <>
                  <div className="streak-hero">
                    <strong>{budgetStreak.current}</strong>
                    <span>day current streak</span>
                  </div>
                  <div className="streak-stats">
                    <span>
                      <strong>{budgetStreak.best}</strong>
                      best streak
                    </span>
                    <span>
                      <strong>{budgetStreak.recentUnder}/7</strong>
                      recent under-days
                    </span>
                  </div>
                  <div
                    className="streak-days"
                    aria-label="Recent budget streak days"
                  >
                    {budgetStreak.days.slice(0, 7).map((day) => (
                      <span
                        className={day.under ? 'under' : 'over'}
                        key={day.date}
                        title={`${day.date}: ${formatMoney(day.spent, currency)}`}
                      />
                    ))}
                  </div>
                  <p className="fine-print">
                    {budgetStreak.underDays} days under pace,{' '}
                    {budgetStreak.overDays} days over pace.
                  </p>
                </>
              ) : (
                <EmptyState title="No streak yet">
                  Set a budget and log dated spending to start the household
                  streak.
                </EmptyState>
              )}
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
              {billTimelineBills.length > 0 ? (
                <div className="bill-timeline">
                  <div className="bill-timeline-scale" aria-hidden="true">
                    <span>Now</span>
                    <span>{Math.ceil(billTimelineHours / 24)} days</span>
                  </div>
                  <div
                    aria-label="Upcoming bill due-date timeline"
                    className="bill-timeline-track"
                    role="list"
                  >
                    {billTimelineBills.map((bill, index) => {
                      const billStatus = getBillPresentation(
                        bill,
                        billShockAlert?.bill.id === bill.id,
                      );
                      const position = Math.min(
                        (Math.max(bill.hoursAway, 0) / billTimelineHours) * 100,
                        100,
                      );

                      return (
                        <span
                          aria-label={`${bill.name}, due ${bill.due}, ${billStatus.timeline}`}
                          className={`bill-timeline-marker ${billStatus.className} lane-${index % 2}`}
                          key={bill.id}
                          role="listitem"
                          style={{
                            left: `clamp(46px, ${position}%, calc(100% - 46px))`,
                          }}
                        >
                          <b>{index + 1}</b>
                          <span>
                            <strong>{bill.name}</strong>
                            <small>{billStatus.timeline}</small>
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div className="bill-list">
                {billShockAlert ? (
                  <div className="bill-shock-alert">
                    <strong>Bill Shock Alert</strong>
                    <span>
                      {billShockAlert.bill.name} is due{' '}
                      {billShockAlert.bill.due}. Drop daily spending by{' '}
                      {formatMoney(billShockAlert.reduction, currency)} to about{' '}
                      {formatMoney(billShockAlert.adjustedDailySpend, currency)}{' '}
                      / day.
                    </span>
                  </div>
                ) : null}
                {sortedBills.length > 0 ? (
                  sortedBills.map((bill) => {
                    const billStatus = getBillPresentation(
                      bill,
                      billShockAlert?.bill.id === bill.id,
                    );

                    return (
                      <div
                        className={`bill-item ${billStatus.className}`}
                        key={bill.id}
                      >
                        <div className="item-main">
                          <strong>{bill.name}</strong>
                          <span>
                            Due {bill.due} · {billStatus.timeline}
                          </span>
                        </div>
                        <span
                          className={`status-badge ${billStatus.className}`}
                        >
                          {billStatus.badge}
                        </span>
                        <span className="priority-indicator">
                          <b>{billStatus.priority}</b>
                          priority
                        </span>
                        <span className="row-amount">
                          {formatMoney(bill.amount, currency)}
                        </span>
                        <div className="row-actions">
                          <button
                            aria-label={`Pay ${bill.name}`}
                            disabled={
                              !canManageMoney || checkingBalance < bill.amount
                            }
                            onClick={() => payBill(bill.id)}
                            type="button"
                          >
                            Pay
                          </button>
                          <button
                            className="mini-delete-button"
                            onClick={() => deleteBill(bill.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState title="No bills yet">
                    Add bills to see reminders and urgency alerts.
                  </EmptyState>
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
                  <p>Milestones toward household plans</p>
                </div>
              </div>
              <div className="quick-goal-form" aria-label="Add a savings goal">
                <label htmlFor="dashboard-goal-name">
                  <span>Goal name</span>
                  <input
                    id="dashboard-goal-name"
                    onChange={(event) => setGoalName(event.target.value)}
                    placeholder="Emergency fund"
                    type="text"
                    value={goalName}
                  />
                </label>
                <label htmlFor="dashboard-goal-target">
                  <span>Target</span>
                  <input
                    id="dashboard-goal-target"
                    min="1"
                    onChange={(event) => setGoalTarget(event.target.value)}
                    placeholder="0"
                    type="number"
                    value={goalTarget}
                  />
                </label>
                <button disabled={!canAddGoal} onClick={addGoal} type="button">
                  Add Goal
                </button>
                <FormMessage
                  id="dashboard-goal-message"
                  tone={formMessages.goal ? 'error' : 'hint'}
                >
                  {formMessages.goal ||
                    ((goalName || goalTarget) && !canAddGoal
                      ? 'Enter a name and positive target.'
                      : '')}
                </FormMessage>
              </div>
              <div className="goal-list">
                {householdData.goals.length > 0 ? (
                  householdData.goals.map((goal) => {
                    const progress =
                      goal.target > 0
                        ? Math.min(
                            Math.round((goal.saved / goal.target) * 100),
                            100,
                          )
                        : 0;
                    const availableGoalContribution = Math.min(
                      50,
                      goal.target - goal.saved,
                      checkingBalance,
                    );
                    const remaining = Math.max(goal.target - goal.saved, 0);
                    const goalStatus = getGoalPresentation(progress);

                    return (
                      <div
                        className={`goal-item ${goalStatus.className}`}
                        key={goal.id}
                      >
                        <div className="goal-row-header">
                          <div className="item-main">
                            <strong>{goal.name}</strong>
                            <span>
                              {formatMoney(goal.saved, currency)} saved of{' '}
                              {formatMoney(goal.target, currency)}
                            </span>
                          </div>
                          <span
                            className={`status-badge ${goalStatus.className}`}
                          >
                            {goalStatus.badge}
                            {goalStatus.className === 'completed' ? (
                              <Sparkles size={13} aria-hidden="true" />
                            ) : null}
                          </span>
                          <span className="priority-indicator">
                            <b>{goalStatus.priority}</b>
                            priority
                          </span>
                        </div>
                        <GoalJourney
                          currency={currency}
                          goal={goal}
                          progress={progress}
                        />
                        <div className="goal-amounts">
                          {remaining > 0
                            ? `${formatMoney(remaining, currency)} left to complete`
                            : 'Completed and ready to celebrate'}
                        </div>
                        <div
                          className="contributor-list"
                          aria-label={`${goal.name} family contributions`}
                        >
                          {(goal.contributors ?? []).map(
                            (contributor, index) => (
                              <span
                                key={`${goal.id}-${contributor.name}-${index}`}
                              >
                                <b>{contributor.name}</b>
                                {formatMoney(contributor.amount, currency)}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="row-actions goal-actions">
                          <button
                            aria-label={`Add ${formatMoney(availableGoalContribution, currency)} to ${goal.name}`}
                            className="inline-action"
                            disabled={availableGoalContribution <= 0}
                            onClick={() => fundGoal(goal.id)}
                            type="button"
                          >
                            Add{' '}
                            {formatMoney(availableGoalContribution, currency)}
                          </button>
                          <button
                            className="mini-delete-button"
                            onClick={() => deleteGoal(goal.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState title="No goals yet">
                    Create a goal to start tracking shared progress.
                  </EmptyState>
                )}
              </div>
            </article>

            <SpendingHeatmap currency={currency} data={weeklySpendingHeatmap} />

            <article className="dashboard-card spending-snapshot-card">
              <div className="card-heading snapshot-heading">
                <span className="module-icon">
                  <TrendingUp size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2>Spending Snapshot</h2>
                  <p>Categories and recent activity in one view</p>
                </div>
                <button
                  className="snapshot-link"
                  onClick={() => setActiveMainPage('transactions')}
                  type="button"
                >
                  <ReceiptText size={17} aria-hidden="true" />
                  Transactions
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="spending-snapshot-grid">
                <section
                  aria-label="Category spending chart"
                  className="snapshot-chart-pane"
                >
                  <div className="snapshot-section-heading">
                    <div>
                      <span className="card-label">By category</span>
                      <strong>Where money went</strong>
                    </div>
                    <strong>{formatMoney(totalCategorySpend, currency)}</strong>
                  </div>
                  <div className="category-visual snapshot-category-visual">
                    <div
                      aria-label={
                        categorySpendingSegments.length > 0
                          ? `Category spending total ${formatMoney(totalCategorySpend, currency)}`
                          : 'No category spending yet'
                      }
                      className="category-donut"
                      style={{ background: categoryChartBackground }}
                    >
                      <span>
                        <strong>
                          {formatMoney(totalCategorySpend, currency)}
                        </strong>
                        <small>spent</small>
                      </span>
                    </div>
                    <div className="category-legend">
                      {visibleAnalyticsCategories.length > 0 ? (
                        visibleAnalyticsCategories
                          .slice(0, 5)
                          .map((category) => (
                            <div
                              className="category-legend-item"
                              key={category.id}
                            >
                              <span
                                className="category-dot"
                                style={{ background: category.color }}
                              />
                              <strong>{category.name}</strong>
                              <span>
                                {formatMoney(category.amount, currency)}
                              </span>
                              {householdData.categories.some(
                                (item) => item.id === category.id,
                              ) ? (
                                <button
                                  aria-label={`Delete ${category.name} category`}
                                  className="mini-delete-button snapshot-delete"
                                  onClick={() => deleteCategory(category.id)}
                                  title="Delete category"
                                  type="button"
                                >
                                  <X size={14} aria-hidden="true" />
                                </button>
                              ) : null}
                            </div>
                          ))
                      ) : (
                        <div className="snapshot-chart-empty">
                          <strong>No category data yet</strong>
                          <span>Your first expense will color this chart.</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="budget-summary-grid snapshot-metrics"
                    aria-label="Category budget summary"
                  >
                    <span>
                      <strong>
                        {formatMoney(categoryBudgetTotal, currency)}
                      </strong>
                      budgeted
                    </span>
                    <span>
                      <strong>
                        {formatMoney(categoryLeftTotal, currency)}
                      </strong>
                      left
                    </span>
                    <span>
                      <strong>
                        {formatMoney(totalCategorySpend, currency)}
                      </strong>
                      spent
                    </span>
                  </div>
                </section>

                <section
                  aria-label="Recent transaction preview"
                  className="snapshot-activity-pane"
                >
                  <div className="snapshot-section-heading">
                    <div>
                      <span className="card-label">Latest</span>
                      <strong>Recent activity</strong>
                    </div>
                    <span>{householdData.activity.length} total</span>
                  </div>
                  {householdData.activity.length > 0 ? (
                    <div className="snapshot-transaction-list">
                      {householdData.activity.slice(0, 4).map((entry) => {
                        const account = householdData.accounts.find(
                          (item) => item.id === entry.accountId,
                        );

                        return (
                          <div className="snapshot-transaction" key={entry.id}>
                            <span className="activity-icon" aria-hidden="true">
                              {entry.amount > 0 ? (
                                <Wallet size={17} />
                              ) : (
                                <ReceiptText size={17} />
                              )}
                            </span>
                            <div>
                              <strong>{entry.merchant}</strong>
                              <span>
                                {entry.category || 'Other'} ·{' '}
                                {account?.label ?? 'No account'}
                              </span>
                            </div>
                            <strong
                              className={
                                entry.amount > 0 ? 'positive' : 'negative'
                              }
                            >
                              {formatMoney(entry.amount, currency)}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="snapshot-start-guide">
                      <div className="snapshot-empty-bars" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <strong>Build this view in three quick steps</strong>
                      <div className="snapshot-steps">
                        <span>
                          <b>1</b> Open Transactions
                        </span>
                        <span>
                          <b>2</b> Add an amount and category
                        </span>
                        <span>
                          <b>3</b> Watch the charts update
                        </span>
                      </div>
                      <button
                        className="inline-action"
                        onClick={() => setActiveMainPage('transactions')}
                        type="button"
                      >
                        Add first transaction
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </article>

            <article className="dashboard-card reports-card" hidden>
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
                  <strong
                    className={cashFlowTotal >= 0 ? 'positive' : 'negative'}
                  >
                    {formatMoney(cashFlowTotal, currency)}
                  </strong>
                  <div className="income-expense-bars">
                    <i
                      style={{
                        width: `${Math.min((incomeTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%`,
                      }}
                    />
                    <b
                      style={{
                        width: `${Math.min((expenseTotal / Math.max(incomeTotal, expenseTotal, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <small>
                    {formatMoney(incomeTotal, currency)} income ·{' '}
                    {formatMoney(expenseTotal, currency)} expenses
                  </small>
                </section>

                <section className="report-panel">
                  <span>Monthly spending trend</span>
                  <div className="trend-bars">
                    {monthlyTrend.map((point) => (
                      <label key={point.label}>
                        <i
                          style={{
                            height: `${point.value > 0 ? Math.max((point.value / maxMonthlyTrend) * 100, 8) : 0}%`,
                          }}
                        />
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
                  <small>
                    {formatMoney(totalBalance, currency)} current total
                  </small>
                </section>

                <section className="report-panel calendar-report">
                  <span>Calendar view</span>
                  <div>
                    {calendarEvents.length > 0 ? (
                      calendarEvents.map((event) => (
                        <b className={event.type} key={event.id}>
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

            <article className="dashboard-card activity-card" hidden>
              <div className="card-heading">
                <span className="module-icon">
                  <ReceiptText size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2>Recent Activity</h2>
                  <p>Latest money moves, with details in Transactions</p>
                </div>
              </div>
              <div className="transaction-list">
                {householdData.activity.length > 0 ? (
                  householdData.activity.slice(0, 5).map((entry) => {
                    const account = householdData.accounts.find(
                      (item) => item.id === entry.accountId,
                    );

                    return (
                      <div className="transaction-row" key={entry.id}>
                        <span className="activity-icon" aria-hidden="true">
                          {entry.amount > 0 ? (
                            <Wallet size={17} />
                          ) : (
                            <ReceiptText size={17} />
                          )}
                        </span>
                        <div>
                          <strong>{entry.merchant}</strong>
                          <span>
                            {entry.transactionDate || entry.date} ·{' '}
                            {entry.category || 'Other'} ·{' '}
                            {account?.label ?? 'No account'}
                          </span>
                          {entry.notes ? <small>{entry.notes}</small> : null}
                        </div>
                        <strong
                          className={entry.amount > 0 ? 'positive' : 'negative'}
                        >
                          {formatMoney(entry.amount, currency)}
                        </strong>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState title="No activity yet">
                    Add a transaction or import CSV rows to build the ledger.
                  </EmptyState>
                )}
                <button
                  className="inline-action"
                  onClick={() => setActiveMainPage('transactions')}
                  type="button"
                >
                  Open Transactions
                </button>
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
                  <EmptyState title="No forecast yet">
                    Add a budget and bills to generate a forecast.
                  </EmptyState>
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
                  <EmptyState title="No pressure weeks yet">
                    Bill timing will appear after bills are added.
                  </EmptyState>
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
                      <div
                        className={`proposal-item ${approved ? 'approved' : ''}`}
                        key={proposal.id}
                      >
                        <div>
                          <strong>{proposal.title}</strong>
                          <span>{proposal.change}</span>
                          <small>
                            {proposal.status ?? 'Pending'} · Created by{' '}
                            {proposal.createdBy ?? 'You'} · {proposal.impact}
                          </small>
                        </div>
                        <div className="vote-actions">
                          <button
                            aria-label={`Approve ${proposal.title}`}
                            disabled={!canCollaborate}
                            onClick={() =>
                              updateProposalDecision(proposal.id, 'approved')
                            }
                            type="button"
                          >
                            <Check size={16} aria-hidden="true" />
                          </button>
                          <button
                            aria-label={`Decline ${proposal.title}`}
                            disabled={!canCollaborate}
                            onClick={() =>
                              updateProposalDecision(proposal.id, 'declined')
                            }
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
                              disabled={
                                !canCollaborate ||
                                !proposalCommentDrafts[proposal.id]?.trim()
                              }
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
                  <EmptyState title="No proposals yet">
                    Budget change proposals will appear here.
                  </EmptyState>
                )}
                <FormMessage id="proposal-decision-message" tone="error">
                  {formMessages.proposalDecision}
                </FormMessage>
              </div>
            </article>

            <article
              className={`dashboard-card spending-pause-card ${isSpendingPaused ? 'active' : ''}`}
            >
              <div className="card-heading">
                <span className="module-icon">
                  <PauseCircle size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2>Spending Pause Button</h2>
                  <p>Temporarily block non-essential categories</p>
                </div>
              </div>
              <div className="pause-mode-panel">
                <div>
                  <span>
                    {isSpendingPaused
                      ? 'Pause mode active'
                      : 'Normal spending mode'}
                  </span>
                  <strong>
                    {isSpendingPaused
                      ? 'Essentials highlighted'
                      : 'All categories available'}
                  </strong>
                  <small>
                    Allowed now: {allowedPauseCategories.join(', ')}
                  </small>
                </div>
                <button onClick={toggleSpendingPause} type="button">
                  {isSpendingPaused ? 'Resume' : 'Pause Non-Essentials'}
                </button>
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
                    <span>
                      {formatMoney(
                        householdData.purchasePause.amount,
                        currency,
                      )}
                    </span>
                    <small>{householdData.purchasePause.reason}</small>
                  </div>
                  <button
                    className={pausedPurchase ? 'pause-active' : ''}
                    onClick={() => setPausedPurchase((current) => !current)}
                    type="button"
                  >
                    {pausedPurchase
                      ? `${householdData.purchasePause.holdHours}h Hold Active`
                      : 'Start Hold'}
                  </button>
                </div>
              ) : (
                <EmptyState title="No paused purchases">
                  Optional holds will appear when a purchase is added.
                </EmptyState>
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
              {householdData.goals.length > 0 && selectedGoalForTradeoff ? (
                <>
                  <div
                    className="segmented-control"
                    aria-label="Tradeoff options"
                  >
                    {householdData.goals.map((goal) => (
                      <button
                        className={
                          selectedGoalForTradeoff.id === goal.id
                            ? 'selected'
                            : ''
                        }
                        key={goal.id}
                        onClick={() => setSelectedTradeoff(goal.id)}
                        type="button"
                      >
                        {goal.name}
                      </button>
                    ))}
                  </div>
                  <div className="simulator-result">
                    <strong>{formatMoney(goalTradeoffAmount, currency)}</strong>
                    <span>{tradeoffSummary}</span>
                    <div className="tradeoff-details">
                      <span>
                        {selectedGoalForTradeoff.name}:{' '}
                        {selectedGoalDaysSooner || 0} days sooner
                      </span>
                      {alternateGoalForTradeoff ? (
                        <span>
                          {alternateGoalForTradeoff.name}: {alternateDelayDays}{' '}
                          days later
                        </span>
                      ) : (
                        <span>Add a second goal to see the trade-off.</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState title="No tradeoffs yet">
                  Add goals to compare where the next dollar should go.
                </EmptyState>
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
                        className={
                          selectedRole.id === role.id ? 'selected' : ''
                        }
                        key={role.id}
                        onClick={() => setActiveRole(role.id)}
                        type="button"
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                  <div className="role-summary">
                    <strong>{activeProfile.label} mode</strong>
                    <span>{selectedRole.access}</span>
                    <small>{activeProfile.detail}</small>
                    <small>Visible: {visibleRoleModules.join(', ')}.</small>
                    <button
                      className="mini-delete-button"
                      onClick={() => deleteRole(selectedRole.id)}
                      type="button"
                    >
                      Delete Role
                    </button>
                  </div>
                  <div
                    className="notification-list"
                    aria-label="Household notifications"
                  >
                    {(householdData.notifications ?? []).length > 0 ? (
                      householdData.notifications.map((notification) => (
                        <div
                          className="notification-item"
                          key={notification.id}
                        >
                          <strong>{notification.actor}</strong>
                          <span>{notification.message}</span>
                        </div>
                      ))
                    ) : (
                      <EmptyState title="No household updates">
                        Votes, comments, and member changes will appear here.
                      </EmptyState>
                    )}
                  </div>
                </>
              ) : (
                <EmptyState title="No family roles yet">
                  Add household members to customize their views.
                </EmptyState>
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
                <EmptyState title="No patterns yet">
                  Spending patterns will appear after activity exists.
                </EmptyState>
              )}
            </article>

            <article className="dashboard-card subscription-card">
              <div className="card-heading">
                <span className="module-icon">
                  <ReceiptText size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2>Subscription Watchlist</h2>
                  <p>Used often, maybe cancel, and price increase signals</p>
                </div>
              </div>
              <div className="subscription-list">
                {subscriptionWatchlist.length > 0 ? (
                  subscriptionWatchlist.map((subscription) => (
                    <div
                      className={`subscription-item ${subscription.signal.tone}`}
                      key={subscription.id}
                    >
                      <div>
                        <strong>{subscription.name}</strong>
                        <span>
                          {formatMoney(subscription.amount, currency)} / month
                        </span>
                        <small>{subscription.signal.note}</small>
                      </div>
                      <div className="score-pill">
                        <span>{subscription.useScore}</span>
                        <small>{subscription.signal.label}</small>
                      </div>
                      <button
                        className="mini-delete-button"
                        onClick={() => deleteSubscription(subscription.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No subscriptions yet">
                    Recurring payments will show up here once added.
                  </EmptyState>
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
                    const isReviewAction =
                      suggestion.action === 'Review recurring subscriptions';
                    const canApplySuggestion =
                      canManageMoney &&
                      (isReviewAction ||
                        suggestion.action.startsWith('Move extra cash to ') ||
                        checkingBalance >= suggestion.amount);

                    return (
                      <div
                        className={`autopilot-item ${suggestion.source}`}
                        key={suggestion.id}
                      >
                        <strong>{suggestion.action}</strong>
                        <span>
                          {formatMoney(suggestion.amount, currency)} ·{' '}
                          {suggestion.timing}
                        </span>
                        <small>{suggestion.reason}</small>
                        <button
                          aria-label={`Apply ${suggestion.action}`}
                          disabled={!canApplySuggestion}
                          onClick={() => addAutopilotTransfer(suggestion)}
                          type="button"
                        >
                          {suggestion.source === 'calculated'
                            ? 'Apply Recommendation'
                            : 'Apply Rule'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState title="No autopilot yet">
                    Add accounts, income, bills, subscriptions, or goals to
                    generate recommendations.
                  </EmptyState>
                )}
                <FormMessage id="permission-message" tone="error">
                  {formMessages.permission}
                </FormMessage>
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
      {canManageMoney ? (
        <button
          aria-expanded={quickAddOpen}
          aria-label="Open Quick-Add Center"
          className="quick-add-launcher"
          onClick={() => setQuickAddOpen(true)}
          title="Quick add"
          type="button"
        >
          <Plus size={28} strokeWidth={2.6} aria-hidden="true" />
        </button>
      ) : null}
      {quickAddOpen ? (
        <div
          className="quick-add-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setQuickAddOpen(false);
            }
          }}
          role="presentation"
        >
          <section
            aria-label="Quick-Add Center"
            aria-modal="true"
            className="quick-add-dialog"
            role="dialog"
          >
            <header className="quick-add-header">
              <div>
                <p className="eyebrow">Quick-Add Center</p>
                <h2>Add it without leaving the page</h2>
              </div>
              <button
                aria-label="Close Quick-Add Center"
                className="quick-add-close"
                onClick={() => setQuickAddOpen(false)}
                title="Close"
                type="button"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="quick-add-types" aria-label="Choose what to add">
              {[
                { icon: ReceiptText, id: 'transaction', label: 'Transaction' },
                { icon: CalendarClock, id: 'bill', label: 'Bill' },
                { icon: Wallet, id: 'account', label: 'Account' },
                { icon: PiggyBank, id: 'goal', label: 'Goal' },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    aria-pressed={quickAddType === item.id}
                    className={quickAddType === item.id ? 'selected' : ''}
                    key={item.id}
                    onClick={() => setQuickAddType(item.id)}
                    type="button"
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <form className="quick-add-form" onSubmit={submitQuickAdd}>
              {quickAddType === 'transaction' ? (
                <div className="quick-add-fields">
                  <label>
                    Merchant
                    <input
                      autoFocus
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'transaction',
                          'merchant',
                          event.target.value,
                        )
                      }
                      placeholder="Grocery store"
                      type="text"
                      value={quickAddDraft.transaction.merchant}
                    />
                  </label>
                  <label>
                    Amount
                    <input
                      min="0.01"
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'transaction',
                          'amount',
                          event.target.value,
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={quickAddDraft.transaction.amount}
                    />
                  </label>
                  <label>
                    Type
                    <select
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'transaction',
                          'type',
                          event.target.value,
                        )
                      }
                      value={quickAddDraft.transaction.type}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </label>
                  <label>
                    Account
                    <select
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'transaction',
                          'accountId',
                          event.target.value,
                        )
                      }
                      value={quickTransactionAccountId}
                    >
                      <option value="">No account</option>
                      {householdData.accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.label} · {money(account.balance)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Category
                    <select
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'transaction',
                          'category',
                          event.target.value,
                        )
                      }
                      value={quickAddDraft.transaction.category}
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {isSpendingPaused &&
                          quickAddDraft.transaction.type === 'expense' &&
                          !allowedPauseCategories.includes(category)
                            ? `${category} paused`
                            : category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Date
                    <input
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'transaction',
                          'date',
                          event.target.value,
                        )
                      }
                      type="date"
                      value={quickAddDraft.transaction.date}
                    />
                  </label>
                </div>
              ) : null}

              {quickAddType === 'bill' ? (
                <div className="quick-add-fields">
                  <label>
                    Bill name
                    <input
                      autoFocus
                      onChange={(event) =>
                        updateQuickAddDraft('bill', 'name', event.target.value)
                      }
                      placeholder="Internet"
                      type="text"
                      value={quickAddDraft.bill.name}
                    />
                  </label>
                  <label>
                    Amount
                    <input
                      min="0.01"
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'bill',
                          'amount',
                          event.target.value,
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={quickAddDraft.bill.amount}
                    />
                  </label>
                  <label className="quick-add-wide-field">
                    Due date
                    <input
                      onChange={(event) =>
                        updateQuickAddDraft('bill', 'due', event.target.value)
                      }
                      type="date"
                      value={quickAddDraft.bill.due}
                    />
                  </label>
                </div>
              ) : null}

              {quickAddType === 'account' ? (
                <div className="quick-add-fields">
                  <label>
                    Account name
                    <input
                      autoFocus
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'account',
                          'name',
                          event.target.value,
                        )
                      }
                      placeholder="Family checking"
                      type="text"
                      value={quickAddDraft.account.name}
                    />
                  </label>
                  <label>
                    Type
                    <select
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'account',
                          'type',
                          event.target.value,
                        )
                      }
                      value={quickAddDraft.account.type}
                    >
                      {accountTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="quick-add-wide-field">
                    Starting balance
                    <input
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'account',
                          'balance',
                          event.target.value,
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={quickAddDraft.account.balance}
                    />
                  </label>
                </div>
              ) : null}

              {quickAddType === 'goal' ? (
                <div className="quick-add-fields">
                  <label>
                    Goal name
                    <input
                      autoFocus
                      onChange={(event) =>
                        updateQuickAddDraft('goal', 'name', event.target.value)
                      }
                      placeholder="Emergency fund"
                      type="text"
                      value={quickAddDraft.goal.name}
                    />
                  </label>
                  <label>
                    Target amount
                    <input
                      min="0.01"
                      onChange={(event) =>
                        updateQuickAddDraft(
                          'goal',
                          'target',
                          event.target.value,
                        )
                      }
                      placeholder="1000.00"
                      step="0.01"
                      type="number"
                      value={quickAddDraft.goal.target}
                    />
                  </label>
                </div>
              ) : null}

              <div className="quick-add-footer">
                <span>
                  {quickAddType === 'transaction' &&
                  quickAddDraft.transaction.type === 'expense' &&
                  householdData.accounts.length === 0
                    ? 'Add an account first, or record this as income.'
                    : quickAddType === 'transaction' &&
                        quickAddDraft.transaction.type === 'expense' &&
                        quickTransactionAmount > quickTransactionBalance
                      ? `Available: ${money(quickTransactionBalance)}`
                      : 'Your dashboard updates immediately.'}
                </span>
                <button
                  disabled={!quickAddCanSubmit[quickAddType]}
                  type="submit"
                >
                  <Plus size={18} aria-hidden="true" />
                  {quickAddLabels[quickAddType]}
                </button>
              </div>
            </form>
          </section>
        </div>
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

function BudgetQuestionPicker({
  compact = false,
  isLoading,
  onAsk,
  onRefresh,
  questions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnOutsidePress = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const chooseQuestion = (question) => {
    setIsOpen(false);
    onAsk(question);
  };

  return (
    <div
      className={`budget-question-picker${compact ? ' compact' : ''}`}
      ref={pickerRef}
    >
      {!compact ? (
        <div className="budget-question-picker-copy">
          <strong>Choose your next question</strong>
          <span>{questions.length} shuffled suggestions ready</span>
        </div>
      ) : null}
      <div className="budget-question-select">
        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="budget-question-trigger"
          disabled={isLoading}
          id={compact ? 'guide-quick-question' : 'guide-question'}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span>
            {isLoading
              ? 'Finding your answer...'
              : `Choose from ${questions.length} questions`}
          </span>
          <ChevronDown aria-hidden="true" size={17} />
        </button>
        {isOpen ? (
          <div
            aria-label="Suggested budgeting questions"
            className="budget-question-menu"
            role="menu"
          >
            {questions.map((question) => (
              <button
                className="budget-question-option"
                key={question}
                onClick={() => chooseQuestion(question)}
                role="menuitem"
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <button
        aria-label="Shuffle budgeting questions"
        className="budget-question-refresh"
        disabled={isLoading}
        onClick={() => {
          onRefresh();
          setIsOpen(true);
        }}
        title="Shuffle questions"
        type="button"
      >
        {isLoading ? (
          <LoaderCircle
            className="budget-assistant-spinner"
            size={17}
            aria-hidden="true"
          />
        ) : (
          <Shuffle size={17} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

function BudgetChatLauncher({
  isLoading,
  onAsk,
  onEnter,
  onRefreshQuestions,
  questions,
}) {
  return (
    <aside aria-label="BudgetHQ Guide" className="budget-chat-launcher">
      <span className="budget-chat-launcher-icon" aria-hidden="true">
        <MessageCircle size={19} />
      </span>
      <BudgetQuestionPicker
        compact
        isLoading={isLoading}
        onAsk={onAsk}
        onRefresh={onRefreshQuestions}
        questions={questions}
      />
      <button
        aria-label="Open BudgetHQ Guide"
        className="enter-budget-chat"
        onClick={onEnter}
        title="Open BudgetHQ Guide"
        type="button"
      >
        Open guide
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </aside>
  );
}

function BudgetAssistantScreen({
  error,
  isLoading,
  messages,
  onAsk,
  onBack,
  onClear,
  onRefreshQuestions,
  onRetry,
  questions,
}) {
  const messagesEndRef = useRef(null);
  const hasConversation = messages.length > 0 || isLoading || error;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [error, isLoading, messages]);

  return (
    <main className="budget-assistant-screen">
      <header className="budget-assistant-header">
        <button
          aria-label="Return to BudgetHQ"
          className="budget-assistant-back"
          onClick={onBack}
          title="Return to BudgetHQ"
          type="button"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <span className="budget-assistant-brand-icon" aria-hidden="true">
          <Lightbulb size={22} />
        </span>
        <div>
          <strong>BudgetHQ Guide</strong>
          <span>
            {isLoading ? 'Finding a tip...' : 'Built-in budgeting help'}
          </span>
        </div>
        <button
          aria-label="Clear conversation"
          className="budget-assistant-clear"
          disabled={isLoading || (messages.length === 0 && !error)}
          onClick={onClear}
          title="Clear conversation"
          type="button"
        >
          <Trash2 size={19} aria-hidden="true" />
        </button>
      </header>

      <section
        aria-label="BudgetHQ Guide conversation"
        aria-busy={isLoading}
        aria-live="polite"
        className="budget-assistant-conversation"
      >
        {hasConversation ? (
          <div className="budget-message-list">
            {messages.map((message) => (
              <article
                className={`budget-message ${message.role}`}
                key={message.id}
              >
                <span className="budget-message-avatar" aria-hidden="true">
                  {message.role === 'assistant' ? (
                    <Lightbulb size={18} />
                  ) : (
                    <Users size={18} />
                  )}
                </span>
                <div>
                  <strong>
                    {message.role === 'assistant' ? 'BudgetHQ Guide' : 'You'}
                  </strong>
                  <p>{message.text}</p>
                </div>
              </article>
            ))}
            {isLoading ? (
              <article
                aria-label="BudgetHQ Guide is finding a tip"
                className="budget-message assistant pending"
              >
                <span className="budget-message-avatar" aria-hidden="true">
                  <Lightbulb size={18} />
                </span>
                <div>
                  <strong>BudgetHQ Guide</strong>
                  <span className="budget-assistant-thinking">
                    <i aria-hidden="true" />
                    <i aria-hidden="true" />
                    <i aria-hidden="true" />
                    Thinking
                  </span>
                </div>
              </article>
            ) : null}
            {error ? (
              <div className="budget-assistant-error" role="alert">
                <CircleAlert size={20} aria-hidden="true" />
                <span>{error}</span>
                <button onClick={onRetry} type="button">
                  <RotateCcw size={16} aria-hidden="true" />
                  Try again
                </button>
              </div>
            ) : null}
            <span className="budget-message-end" ref={messagesEndRef} />
          </div>
        ) : (
          <div className="budget-chat-welcome">
            <span className="budget-chat-welcome-icon" aria-hidden="true">
              <Lightbulb size={30} />
            </span>
            <h1>What can I help you figure out?</h1>
            <p>
              Pick a question about budgeting, saving, bills, transactions, or
              how to use BudgetHQ.
            </p>
          </div>
        )}
      </section>

      <BudgetQuestionPicker
        isLoading={isLoading}
        onAsk={onAsk}
        onRefresh={onRefreshQuestions}
        questions={questions}
      />
      <p className="budget-assistant-disclaimer">
        Built-in budgeting guidance, not individualized financial advice. Avoid
        sharing account numbers, passwords, or other secrets.
      </p>
    </main>
  );
}

function App() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useStoredState(
    'budgethq-selected-workspace-v1',
    null,
  );
  const [currency, setCurrency] = useState('USD');
  const [activeTour, setActiveTour] = useState(null);
  const [personalizationProfile, setPersonalizationProfile] = useStoredState(
    'budgethq-personalization-profile-v1',
    null,
  );
  const [personalizationStatus, setPersonalizationStatus] = useStoredState(
    'budgethq-personalization-status-v1',
    'pending',
  );
  const [householdName, setHouseholdName] = useStoredState(
    'budgethq-household-name-v1',
    '',
  );
  const [householdNameDraft, setHouseholdNameDraft] = useState(householdName);
  const [isEditingHouseholdName, setIsEditingHouseholdName] = useState(false);
  const [isBudgetChatOpen, setIsBudgetChatOpen] = useState(false);
  const [budgetChatMessages, setBudgetChatMessages] = useStoredState(
    'budgethq-assistant-messages-v1',
    [],
  );
  const [budgetChatRequest, setBudgetChatRequest] = useState({
    error: '',
    retryMessages: [],
    status: 'idle',
  });
  const [budgetQuestionShuffle, setBudgetQuestionShuffle] = useState(() =>
    Math.floor(Math.random() * 1_000_000),
  );
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === selectedWorkspaceId,
  );

  useEffect(() => {
    window.scrollTo({ behavior: 'auto', left: 0, top: 0 });
  }, [isBudgetChatOpen, selectedWorkspaceId]);

  const completeTour = (workspaceId) => {
    markTourSeen(workspaceId);
    setActiveTour(null);
  };

  const chooseWorkspace = (workspace) => {
    setSelectedWorkspaceId(workspace.id);
    setActiveTour(
      workspace.id !== 'tips' && shouldShowFirstTour(workspace.id)
        ? workspace.id
        : null,
    );
  };

  const saveHouseholdName = () => {
    setHouseholdName(householdNameDraft.trim().slice(0, 40));
    setIsEditingHouseholdName(false);
  };

  const cancelHouseholdNameEdit = () => {
    setHouseholdNameDraft(householdName);
    setIsEditingHouseholdName(false);
  };

  const finishPersonalization = (profile) => {
    setPersonalizationProfile(profile);
    setPersonalizationStatus('complete');
    setActiveTour(null);
    setSelectedWorkspaceId(null);
  };

  const runBudgetAssistant = async (requestMessages) => {
    setBudgetChatRequest({
      error: '',
      retryMessages: requestMessages,
      status: 'loading',
    });

    try {
      const reply = await requestBudgetAssistant(requestMessages);
      const assistantMessage = {
        id: createId('assistant-message'),
        role: 'assistant',
        text: reply,
      };

      setBudgetChatMessages((current) =>
        [...current, assistantMessage].slice(-50),
      );
      setBudgetChatRequest({ error: '', retryMessages: [], status: 'idle' });
    } catch (error) {
      setBudgetChatRequest({
        error:
          error instanceof Error
            ? error.message
            : 'BudgetHQ Guide could not answer that. Try another question.',
        retryMessages: requestMessages,
        status: 'error',
      });
    }
  };

  const askBudgetAssistant = (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || budgetChatRequest.status === 'loading') {
      setIsBudgetChatOpen(true);
      return;
    }

    const userMessage = {
      id: createId('user-message'),
      role: 'user',
      text: trimmedQuestion,
    };
    const requestMessages = [...budgetChatMessages, userMessage].slice(-12);

    setBudgetChatMessages((current) => [...current, userMessage].slice(-50));
    setIsBudgetChatOpen(true);
    runBudgetAssistant(requestMessages);
  };

  const chooseBudgetGuideQuestion = (question) => {
    setBudgetQuestionShuffle((current) => current + 1);
    askBudgetAssistant(question);
  };

  const retryBudgetAssistant = () => {
    if (
      budgetChatRequest.status === 'loading' ||
      budgetChatRequest.retryMessages.length === 0
    ) {
      return;
    }

    runBudgetAssistant(budgetChatRequest.retryMessages);
  };

  const clearBudgetAssistant = () => {
    setBudgetChatMessages([]);
    setBudgetChatRequest({ error: '', retryMessages: [], status: 'idle' });
    setBudgetQuestionShuffle((current) => current + 1);
  };

  const recommendedWorkspaceId =
    personalizationProfile?.ageGroup === 'under13' ||
    personalizationProfile?.priority === 'kids'
      ? 'kids'
      : 'main';
  const showPersonalization =
    personalizationStatus === 'pending' || personalizationStatus === 'editing';

  const personalizationOverlay = showPersonalization ? (
    <PersonalizationOverlay
      initialProfile={personalizationProfile}
      onComplete={finishPersonalization}
      onResetAnswers={() => {
        setPersonalizationProfile(null);
        setPersonalizationStatus('pending');
      }}
      onSkip={() => setPersonalizationStatus('skipped')}
    />
  ) : null;
  const isBudgetChatLoading = budgetChatRequest.status === 'loading';
  const lastBudgetGuideQuestion = [...budgetChatMessages]
    .reverse()
    .find((message) => message.role === 'user')?.text;
  const budgetGuideQuestions = getBudgetGuideQuestions(
    lastBudgetGuideQuestion,
    budgetQuestionShuffle,
  );
  const refreshBudgetGuideQuestions = () => {
    setBudgetQuestionShuffle((current) => current + 1);
  };
  const budgetChatLauncher =
    personalizationStatus !== 'pending' &&
    personalizationStatus !== 'editing' ? (
      <BudgetChatLauncher
        isLoading={isBudgetChatLoading}
        onAsk={chooseBudgetGuideQuestion}
        onEnter={() => setIsBudgetChatOpen(true)}
        onRefreshQuestions={refreshBudgetGuideQuestions}
        questions={budgetGuideQuestions}
      />
    ) : null;
  const bottomUtility = budgetChatLauncher;

  if (isBudgetChatOpen) {
    return (
      <BudgetAssistantScreen
        error={budgetChatRequest.error}
        isLoading={isBudgetChatLoading}
        messages={budgetChatMessages}
        onAsk={chooseBudgetGuideQuestion}
        onBack={() => setIsBudgetChatOpen(false)}
        onClear={clearBudgetAssistant}
        onRefreshQuestions={refreshBudgetGuideQuestions}
        onRetry={retryBudgetAssistant}
        questions={budgetGuideQuestions}
      />
    );
  }

  if (selectedWorkspace?.id === 'tips') {
    return (
      <>
        <TipsPortal onBack={() => setSelectedWorkspaceId(null)} />
        {personalizationOverlay}
        {bottomUtility}
      </>
    );
  }

  if (selectedWorkspace?.id === 'summary') {
    return (
      <>
        <SummaryPortal
          audience={
            personalizationProfile?.ageGroup === 'under13' ? 'kid' : 'adult'
          }
          currency={currency}
          onBack={() => setSelectedWorkspaceId(null)}
        />
        {personalizationOverlay}
        {bottomUtility}
      </>
    );
  }

  if (selectedWorkspace?.id === 'kids') {
    return (
      <>
        <KidsPortal
          onBack={() => setSelectedWorkspaceId(null)}
          onStartTour={() => setActiveTour('kids')}
          onTourComplete={() => completeTour('kids')}
          showTour={activeTour === 'kids'}
          tourSteps={tourContent.kids}
        />
        {personalizationOverlay}
        {bottomUtility}
      </>
    );
  }

  if (selectedWorkspace?.id === 'main') {
    return (
      <main className="app-shell dashboard-app main-background">
        <MainWorkspace
          currency={currency}
          onEditPreferences={() => setPersonalizationStatus('editing')}
          onCurrencyChange={setCurrency}
          onReset={() => setCurrency('USD')}
          onShowKids={() => setSelectedWorkspaceId('kids')}
          onStartTour={() => setActiveTour('main')}
          onSwitchPortal={() => setSelectedWorkspaceId(null)}
          onTourComplete={() => completeTour('main')}
          profile={personalizationProfile}
          showTour={activeTour === 'main'}
        />
        {personalizationOverlay}
        {bottomUtility}
      </main>
    );
  }

  return (
    <main className="app-shell welcome-shell">
      <section className="welcome-panel" aria-labelledby="app-title">
        <div className="welcome-hero">
          <div className="welcome-sign">
            <p className="eyebrow">Household Money Command Center</p>
            <h1 id="app-title">BudgetHQ</h1>
            <p>
              A shared budgeting dashboard for tracking household cashflow,
              bills, safe-to-spend limits, savings goals, and kid-friendly money
              habits.
            </p>
            <div
              className="home-highlight-row"
              aria-label="BudgetHQ highlights"
            >
              {homeHighlights.map((highlight) => (
                <span key={highlight}>
                  <CircleCheck size={16} strokeWidth={2.3} aria-hidden="true" />
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <aside className="home-command-preview" aria-label="BudgetHQ preview">
            <div className="home-preview-topline">
              <span>First visit</span>
              <strong>Ready to set up</strong>
            </div>
            <div className="home-preview-balance">
              <span>Money view</span>
              <strong>Ready for your plan</strong>
            </div>
            <div className="home-preview-bars" aria-hidden="true">
              <span style={{ '--bar-width': '0%' }} />
              <span style={{ '--bar-width': '0%' }} />
              <span style={{ '--bar-width': '0%' }} />
            </div>
            <div className="home-preview-footer">
              <span>Accounts, bills, goals</span>
              <strong>Add your first item</strong>
            </div>
          </aside>
        </div>

        <div className="welcome-personal-row">
          <section
            className="household-greeting"
            aria-label="Household greeting"
          >
            <span className="welcome-detail-icon" aria-hidden="true">
              <Users size={20} />
            </span>
            <div>
              <span>{getTimeGreeting()}</span>
              {isEditingHouseholdName ? (
                <form
                  className="household-name-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveHouseholdName();
                  }}
                >
                  <label className="sr-only" htmlFor="household-name">
                    Household or name
                  </label>
                  <input
                    autoFocus
                    id="household-name"
                    maxLength="40"
                    onChange={(event) =>
                      setHouseholdNameDraft(event.target.value)
                    }
                    placeholder="Household or name"
                    type="text"
                    value={householdNameDraft}
                  />
                  <button aria-label="Save household name" type="submit">
                    <Check size={17} aria-hidden="true" />
                  </button>
                  <button
                    aria-label="Cancel household name edit"
                    onClick={cancelHouseholdNameEdit}
                    type="button"
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                </form>
              ) : (
                <strong>{householdName || 'Household or Name'}</strong>
              )}
            </div>
            {!isEditingHouseholdName ? (
              <button
                aria-label={
                  householdName
                    ? 'Edit household or name'
                    : 'Add household or name'
                }
                className="edit-household-button"
                onClick={() => setIsEditingHouseholdName(true)}
                title={
                  householdName
                    ? 'Edit household or name'
                    : 'Add household or name'
                }
                type="button"
              >
                <Pencil size={17} aria-hidden="true" />
              </button>
            ) : null}
          </section>

          <section className="daily-tip" aria-label="Daily money tip">
            <span className="welcome-detail-icon" aria-hidden="true">
              <Lightbulb size={20} />
            </span>
            <div>
              <span>Today&apos;s money tip</span>
              <strong>{getDailyMoneyTip()}</strong>
            </div>
          </section>
        </div>

        <div className="workspace-grid" aria-label="Workspace options">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            const isRecommended =
              personalizationProfile && workspace.id === recommendedWorkspaceId;

            if (workspace.preview) {
              return (
                <article
                  aria-label="Summary workspace preview"
                  className={`workspace-card ${workspace.id}-workspace-card workspace-preview-card`}
                  key={workspace.id}
                >
                  <span className="workspace-preview-status">
                    {workspace.status}
                  </span>
                  <span className="workspace-icon" aria-hidden="true">
                    <Icon size={32} strokeWidth={2.1} />
                  </span>
                  <span className="workspace-content">
                    <span className="workspace-kicker">{workspace.kicker}</span>
                    <span className="workspace-title">{workspace.label}</span>
                    <span className="workspace-subtitle">
                      {workspace.subtitle}
                    </span>
                    <span className="workspace-chip-row" aria-hidden="true">
                      {workspace.previewItems.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </span>
                    <span className="summary-card-preview" aria-hidden="true">
                      <i>
                        <b />
                      </i>
                      <i>
                        <b />
                      </i>
                      <i>
                        <b />
                      </i>
                    </span>
                  </span>
                </article>
              );
            }

            return (
              <button
                className={`workspace-card ${workspace.id}-workspace-card`}
                key={workspace.id}
                onClick={() => chooseWorkspace(workspace)}
                type="button"
              >
                {isRecommended ? (
                  <span className="workspace-recommendation">
                    <Sparkles size={13} strokeWidth={2.4} aria-hidden="true" />
                    Recommended
                  </span>
                ) : null}
                <span className="workspace-card-top">
                  <span className="workspace-icon" aria-hidden="true">
                    <Icon size={32} strokeWidth={2.1} />
                  </span>
                  <span className="workspace-preview-status">
                    {workspace.status}
                  </span>
                </span>
                <span className="workspace-content">
                  <span className="workspace-kicker">{workspace.kicker}</span>
                  <span className="workspace-title">{workspace.label}</span>
                  <span className="workspace-subtitle">
                    {workspace.subtitle}
                  </span>
                  <span className="workspace-chip-row" aria-hidden="true">
                    {workspace.previewItems.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </span>
                  <span className="workspace-card-footer">
                    <span>{workspace.cta}</span>
                    <ArrowRight
                      size={17}
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      {personalizationOverlay}
      {bottomUtility}
    </main>
  );
}

export {
  addActivityToData,
  getBudgetMood,
  getCategoryChartBackground,
  getCategorySpendingSegments,
  getPaceStatus,
};

export default App;
