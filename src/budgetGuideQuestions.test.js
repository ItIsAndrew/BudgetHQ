import { describe, expect, it } from 'vitest';
import { createLocalBudgetReply } from './budgetAssistantClient.js';
import {
  getBudgetGuideQuestionCatalog,
  getBudgetGuideQuestions,
} from './budgetGuideQuestions.js';

describe('BudgetHQ guided questions', () => {
  it('shows five unique questions from a catalog of at least 50', () => {
    const questions = getBudgetGuideQuestions();
    const catalog = getBudgetGuideQuestionCatalog();

    expect(catalog.length).toBeGreaterThanOrEqual(50);
    expect(questions).toHaveLength(5);
    expect(new Set(questions)).toHaveLength(5);
    expect(questions.every((question) => catalog.includes(question))).toBe(
      true,
    );
  });

  it('shuffles to a different set when questions are refreshed', () => {
    const firstSet = getBudgetGuideQuestions('', 0);
    const refreshedSet = getBudgetGuideQuestions('', 1);

    expect(refreshedSet).toHaveLength(5);
    expect(refreshedSet).not.toEqual(firstSet);
  });

  it('offers related follow-ups after a question is selected', () => {
    const selectedQuestion = 'How can I lower grocery spending?';
    const followUps = getBudgetGuideQuestions(selectedQuestion, 1);

    expect(followUps).toHaveLength(5);
    expect(followUps).not.toContain(selectedQuestion);
    expect(
      followUps.filter((question) =>
        [
          'Is my dining budget realistic?',
          'How do I pause non-essential spending?',
          'How can I spot spending leaks?',
          'How much fun money can I afford?',
          'How can I stop impulse purchases?',
          'Which spending category should I cut first?',
          'How do I recover after overspending?',
        ].includes(question),
      ),
    ).toHaveLength(2);
  });

  it('turns broad starter questions into focused follow-ups', () => {
    const followUps = getBudgetGuideQuestions(
      'How much should I keep in an emergency fund?',
      0,
    );

    expect(
      followUps.filter((question) =>
        [
          'How do I build an emergency fund?',
          'How much should I save each month?',
          'Which savings goal should come first?',
          'How do I create a sinking fund?',
          'How can I save with irregular income?',
          'Should I save or pay down debt first?',
          'How do I stay motivated toward a savings goal?',
          'Where should I keep short-term savings?',
        ].includes(question),
      ),
    ).toHaveLength(2);
  });

  it('keeps every selectable question within the local guide coverage', () => {
    getBudgetGuideQuestionCatalog().forEach((question) => {
      const reply = createLocalBudgetReply([{ role: 'user', text: question }]);

      expect(reply).not.toMatch(
        /do not want to guess|outside what I can answer/i,
      );
    });
  });
});
