import { describe, expect, it } from 'vitest';
import {
  addActivityToData,
  buildMonthlyMoneyStory,
  buildWeeklySpendingHeatmap,
  getBudgetMood,
  getCategoryChartBackground,
  getCategorySpendingSegments,
  getPaceStatus,
} from './App.jsx';

describe('monthly money story', () => {
  it('groups current-month activity into visual income, bill, spending, and savings events', () => {
    const story = buildMonthlyMoneyStory(
      {
        activity: [
          {
            amount: 1000,
            category: 'Income',
            merchant: 'Payroll',
            transactionDate: '2026-08-01',
          },
          {
            amount: -80,
            category: 'Food',
            merchant: 'Groceries',
            transactionDate: '2026-08-03',
          },
          {
            amount: -50,
            category: 'Savings',
            merchant: 'Goal contribution',
            transactionDate: '2026-08-04',
          },
          {
            amount: -25,
            category: 'Food',
            merchant: 'Earlier month',
            transactionDate: '2026-07-31',
          },
        ],
        bills: [{ amount: 300, due: 'Aug 5', name: 'Rent' }],
      },
      new Date(2026, 7, 14),
    );

    expect(story.label).toBe('August 2026');
    expect(story.totals).toEqual({
      bill: 300,
      income: 1000,
      savings: 50,
      spending: 80,
    });
    expect(
      story.events.map(({ day, direction, labelLane, type }) => ({
        day,
        direction,
        labelLane,
        type,
      })),
    ).toEqual([
      { day: 1, direction: 'up', labelLane: 0, type: 'income' },
      { day: 3, direction: 'down', labelLane: 0, type: 'spending' },
      { day: 4, direction: 'up', labelLane: 1, type: 'savings' },
      { day: 5, direction: 'down', labelLane: 1, type: 'bill' },
    ]);
    expect(story.events.at(-1).position).toBeGreaterThan(0);
  });
});

describe('weekly spending heatmap', () => {
  it('groups four Monday-to-Sunday weeks and scales daily spending intensity', () => {
    const heatmap = buildWeeklySpendingHeatmap(
      [
        {
          amount: -10,
          category: 'Food',
          merchant: 'Lunch',
          transactionDate: '2026-08-14',
        },
        {
          amount: -40,
          category: 'Shopping',
          merchant: 'Supplies',
          transactionDate: '2026-08-14',
        },
        {
          amount: -25,
          category: 'Transport',
          merchant: 'Train',
          transactionDate: '2026-08-15',
        },
        {
          amount: -100,
          category: 'Savings',
          merchant: 'Emergency fund contribution',
          transactionDate: '2026-08-15',
        },
        {
          amount: -80,
          category: 'Food',
          merchant: 'Outside range',
          transactionDate: '2026-07-19',
        },
      ],
      new Date(2026, 7, 16),
    );

    expect(heatmap.days).toHaveLength(28);
    expect(heatmap.days[0].key).toBe('2026-07-20');
    expect(heatmap.days.at(-1).key).toBe('2026-08-16');
    expect(heatmap.periodLabel).toBe('Jul 20 - Aug 16');
    expect(heatmap.totalSpent).toBe(75);
    expect(heatmap.activeDays).toBe(2);
    expect(heatmap.maxDailySpend).toBe(50);
    expect(heatmap.days.find((day) => day.key === '2026-08-14')).toMatchObject({
      amount: 50,
      level: 4,
    });
    expect(heatmap.days.find((day) => day.key === '2026-08-15')).toMatchObject({
      amount: 25,
      level: 2,
    });
  });
});

describe('budget pace helpers', () => {
  it('labels setup, healthy, warning, and over-budget states', () => {
    expect(getPaceStatus(0, 0)).toEqual({
      label: 'Ready to Set Up',
      tone: 'neutral',
    });
    expect(getPaceStatus(20, 100)).toEqual({
      label: 'On Track',
      tone: 'success',
    });
    expect(getPaceStatus(82, 100)).toEqual({
      label: 'Near Limit',
      tone: 'warning',
    });
    expect(getPaceStatus(101, 100)).toEqual({
      label: 'Over Budget',
      tone: 'danger',
    });
  });

  it('calculates the household mood from setup, balance, bills, and pace', () => {
    expect(
      getBudgetMood({
        dailyLimit: 0,
        spentToday: 0,
        totalBalance: 0,
        urgentBills: 0,
      }).label,
    ).toBe('Not Set Up');

    expect(
      getBudgetMood({
        dailyLimit: 100,
        spentToday: 20,
        totalBalance: 4000,
        urgentBills: 0,
      }).label,
    ).toBe('Calm');

    expect(
      getBudgetMood({
        dailyLimit: 100,
        spentToday: 120,
        totalBalance: 4000,
        urgentBills: 0,
      }).label,
    ).toBe('Watchful');
  });
});

describe('activity state transitions', () => {
  it('prepends activity entries and caps activity and change history', () => {
    const current = {
      activity: Array.from({ length: 8 }, (_, index) => ({
        amount: index,
        date: 'Earlier',
        id: `activity-${index}`,
        merchant: `Merchant ${index}`,
      })),
      changes: ['one', 'two', 'three', 'four'],
    };

    const next = addActivityToData(
      current,
      { amount: -12, merchant: 'Groceries' },
      'USD',
    );

    expect(next.activity).toHaveLength(8);
    expect(next.activity[0]).toMatchObject({
      amount: -12,
      date: 'Just now',
      merchant: 'Groceries',
    });
    expect(next.changes).toHaveLength(4);
    expect(next.changes[0]).toBe('Groceries logged $12.00.');
  });
});

describe('category analytics', () => {
  it('leaves the spending bar empty when every category has zero spending', () => {
    expect(
      getCategorySpendingSegments([
        { amount: 0, id: 'food', name: 'Food' },
        { amount: 0, id: 'transport', name: 'Transport' },
      ]),
    ).toEqual([]);
  });

  it('only includes categories with spending and calculates their share', () => {
    expect(
      getCategorySpendingSegments([
        { amount: 75, id: 'food', name: 'Food' },
        { amount: 0, id: 'transport', name: 'Transport' },
        { amount: 25, id: 'kids', name: 'Kids' },
      ]),
    ).toEqual([
      { amount: 75, id: 'food', name: 'Food', percentage: 75 },
      { amount: 25, id: 'kids', name: 'Kids', percentage: 25 },
    ]);
  });

  it('builds an empty ring or proportional category ring', () => {
    expect(getCategoryChartBackground([])).toBe(
      'conic-gradient(#e2e8f0 0 100%)',
    );
    expect(
      getCategoryChartBackground([
        { color: '#111111', percentage: 75 },
        { color: '#222222', percentage: 25 },
      ]),
    ).toBe('conic-gradient(#111111 0% 75%, #222222 75% 100%)');
  });
});
