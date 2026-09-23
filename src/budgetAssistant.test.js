import { describe, expect, it } from 'vitest';
import {
  createLocalBudgetReply,
  requestBudgetAssistant,
} from './budgetAssistantClient.js';

describe('BudgetHQ local guide', () => {
  it('answers product navigation questions without a network request', async () => {
    await expect(
      requestBudgetAssistant([
        { role: 'user', text: 'Where do I add a transaction?' },
      ]),
    ).resolves.toContain('centered + button');
  });

  it('provides focused budgeting guidance by topic', () => {
    expect(
      createLocalBudgetReply([
        { role: 'user', text: 'How should I plan for groceries?' },
      ]),
    ).toContain('weekly target');

    expect(
      createLocalBudgetReply([
        { role: 'user', text: 'How does safe-to-spend work?' },
      ]),
    ).toContain('daily pace');
  });

  it('uses only the latest user question', () => {
    expect(
      createLocalBudgetReply([
        { role: 'user', text: 'Tell me about bills' },
        { role: 'assistant', text: 'Previous answer' },
        { role: 'user', text: 'What about a savings goal?' },
      ]),
    ).toContain('target amount');
  });

  it('varies repeated answers and understands short follow-ups', () => {
    const firstReply = createLocalBudgetReply([
      { role: 'user', text: 'How does Safe-to-Spend work?' },
    ]);
    const secondReply = createLocalBudgetReply([
      { role: 'user', text: 'How does Safe-to-Spend work?' },
      { role: 'assistant', text: firstReply },
      { role: 'user', text: 'Tell me more' },
    ]);

    expect(secondReply).not.toBe(firstReply);
    expect(secondReply).toContain('Near Limit');
  });

  it('responds naturally to greetings and everyday conversation', () => {
    expect(createLocalBudgetReply([{ role: 'user', text: 'Hi' }])).toMatch(
      /Hi|Hello|Hey/,
    );
    expect(
      createLocalBudgetReply([{ role: 'user', text: 'How are you?' }]),
    ).toContain('doing well');
    expect(
      createLocalBudgetReply([{ role: 'user', text: 'Thanks!' }]),
    ).toContain('welcome');
  });

  it('covers a broad range of household finance topics', () => {
    const questionsAndExpectedText = [
      [
        'How do I budget with irregular income?',
        'conservative monthly baseline',
      ],
      ['How do I calculate my net worth?', 'what you own minus what you owe'],
      ['How should I start retirement savings?', 'employer match'],
      ['How do insurance deductibles fit my budget?', 'premium'],
      ['What should I do about an unauthorized charge?', 'official channel'],
      ['I lost my job and cannot pay my bills', 'Protect immediate needs'],
    ];

    questionsAndExpectedText.forEach(([question, expectedText]) => {
      expect(
        createLocalBudgetReply([{ role: 'user', text: question }]),
      ).toContain(expectedText);
    });
  });

  it('builds relevant, varied answers for budgeting questions off its topic list', () => {
    const question = 'How should I handle professional licensing fees?';
    const firstReply = createLocalBudgetReply([
      { role: 'user', text: question },
    ]);
    const secondReply = createLocalBudgetReply([
      { role: 'user', text: question },
      { role: 'assistant', text: firstReply },
      { role: 'user', text: 'What else?' },
    ]);

    expect(firstReply).toContain('professional licensing fees');
    expect(secondReply).toContain('professional licensing fees');
    expect(secondReply).not.toBe(firstReply);
  });

  it('does not invent an answer for unrelated topics', () => {
    const reply = createLocalBudgetReply([
      { role: 'user', text: 'Who won the game?' },
    ]);

    expect(reply).toContain('game');
    expect(reply).toMatch(/outside|may not|do not want to guess/i);
  });

  it('asks for a question when the conversation is empty', async () => {
    await expect(requestBudgetAssistant([])).rejects.toThrow(
      'Enter a budgeting question',
    );
  });
});
