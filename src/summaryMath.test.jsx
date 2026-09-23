import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SummaryPortal, {
  calculateSummaryMetrics,
  isEntryInMonth,
} from './SummaryPortal.jsx';

describe('Summary calculations', () => {
  it('uses only current-month household activity', () => {
    const metrics = calculateSummaryMetrics(
      {
        accounts: [{ balance: 800 }, { balance: -100 }],
        activity: [
          { amount: 2000, transactionDate: '2026-08-01' },
          { amount: -450, transactionDate: '2026-08-08' },
          { amount: -125, transactionDate: '2026-07-31' },
        ],
      },
      {
        activity: [
          { amount: 100, label: 'Allowance Autopilot', type: 'in' },
          { amount: 25, label: 'Chore Store spending choice', type: 'out' },
          { amount: 15, label: 'Moved to Bike', type: 'out' },
          { amount: 5, label: 'Moved back from Bike', type: 'in' },
        ],
        allowance: { amount: 20 },
        balance: 60,
        quests: [{ saved: 15 }],
      },
      new Date(2026, 7, 14),
    );

    expect(metrics.householdIncome).toBe(2000);
    expect(metrics.householdExpenses).toBe(450);
    expect(metrics.monthlyBalance).toBe(1550);
    expect(metrics.householdSpentPercentage).toBe(23);
    expect(metrics.accountBalance).toBe(700);
    expect(metrics.kidsIncome).toBe(100);
    expect(metrics.kidsExpenses).toBe(25);
    expect(metrics.kidsSpentPercentage).toBe(25);
    expect(metrics.kidsSaved).toBe(15);
  });

  it('uses the allowance plan when no kid income has been recorded', () => {
    const metrics = calculateSummaryMetrics(
      {},
      {
        activity: [{ amount: 10, label: 'Snack', type: 'out' }],
        allowance: { amount: 20 },
      },
      new Date(2026, 7, 14),
    );

    expect(metrics.kidsIncome).toBe(0);
    expect(metrics.kidsSpentPercentage).toBe(50);
  });

  it('keeps spending percentages at zero until an income base exists', () => {
    const metrics = calculateSummaryMetrics(
      {
        activity: [{ amount: -50, transactionDate: '2026-08-10' }],
      },
      {
        activity: [{ amount: 10, label: 'Snack', type: 'out' }],
      },
      new Date(2026, 7, 14),
    );

    expect(metrics.householdSpentPercentage).toBe(0);
    expect(metrics.kidsSpentPercentage).toBe(0);
  });

  it('handles ISO dates without timezone month drift', () => {
    expect(
      isEntryInMonth({ transactionDate: '2026-08-01' }, new Date(2026, 7, 14)),
    ).toBe(true);
  });

  it('keeps household financial details out of the kid summary', () => {
    const kidMarkup = renderToStaticMarkup(
      React.createElement(SummaryPortal, {
        audience: 'kid',
        onBack: () => {},
      }),
    );
    const adultMarkup = renderToStaticMarkup(
      React.createElement(SummaryPortal, {
        audience: 'adult',
        onBack: () => {},
      }),
    );

    expect(kidMarkup).toContain('My Summary');
    expect(kidMarkup).toContain('Percentage of income / allowance spent');
    expect(kidMarkup).not.toContain('Total monthly income');
    expect(kidMarkup).not.toContain('Available across accounts');
    expect(adultMarkup).toContain('Household summary');
  });
});
