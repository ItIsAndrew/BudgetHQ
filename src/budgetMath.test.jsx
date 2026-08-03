import { describe, expect, it } from 'vitest';
import { addActivityToData, getBudgetMood, getPaceStatus } from './App.jsx';

describe('budget pace helpers', () => {
  it('labels setup, healthy, warning, and over-budget states', () => {
    expect(getPaceStatus(0, 0)).toEqual({ label: 'Ready to Set Up', tone: 'neutral' });
    expect(getPaceStatus(20, 100)).toEqual({ label: 'On Track', tone: 'success' });
    expect(getPaceStatus(82, 100)).toEqual({ label: 'Near Limit', tone: 'warning' });
    expect(getPaceStatus(101, 100)).toEqual({ label: 'Over Budget', tone: 'danger' });
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

    const next = addActivityToData(current, { amount: -12, merchant: 'Groceries' }, 'USD');

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
