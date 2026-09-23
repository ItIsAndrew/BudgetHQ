const budgetGuideQuestionGroups = {
  general: [
    'How should I start a monthly budget?',
    'How much should I keep in an emergency fund?',
    'Where is my money going each month?',
    'How can I save more without feeling restricted?',
    'Which bills should I pay first?',
    'How do I know what is safe to spend today?',
    'What should I do when I go over budget?',
    'How do I plan for an irregular paycheck?',
  ],
  spending: [
    'How can I lower grocery spending?',
    'Is my dining budget realistic?',
    'How do I pause non-essential spending?',
    'How can I spot spending leaks?',
    'How much fun money can I afford?',
    'How can I stop impulse purchases?',
    'Which spending category should I cut first?',
    'How do I recover after overspending?',
  ],
  saving: [
    'How do I build an emergency fund?',
    'How much should I save each month?',
    'Which savings goal should come first?',
    'How do I create a sinking fund?',
    'How can I save with irregular income?',
    'Should I save or pay down debt first?',
    'How do I stay motivated toward a savings goal?',
    'Where should I keep short-term savings?',
  ],
  bills: [
    'How should I organize my bill due dates?',
    'What should I do when a bill is due soon?',
    'How can I find subscriptions I no longer use?',
    'How do I plan for annual bills?',
    'Which bills should I automate?',
    'How can I prepare for a higher utility bill?',
    'What should I do if I cannot pay every bill?',
    'How do I avoid late fees?',
  ],
  debt: [
    'Which debt should I pay off first?',
    'How much extra should I put toward debt?',
    'Should I use the debt snowball or debt avalanche method?',
    'How do I budget for credit card payments?',
    'How can I lower my credit utilization?',
    'Should I keep saving while paying off debt?',
    'How do I make a realistic debt payoff plan?',
    'What should I do before taking a new loan?',
  ],
  family: [
    'How should I set a kids allowance?',
    'How can kids split money between saving and spending?',
    'How does Allowance Autopilot work?',
    'How should I review a kid goal request?',
    'How can our household budget together?',
    'What is an age-appropriate savings goal?',
    'How do I teach kids about needs and wants?',
    'How should rewards for chores fit the budget?',
  ],
  budgethq: [
    'Where do I add a transaction?',
    'How does Safe-to-Spend work?',
    'Where do I add an account?',
    'How do I create a savings goal?',
    'Where can I review upcoming bills?',
    'How do I use Spending Pause?',
    'What does the Summary workspace show?',
    'How do I reset the BudgetHQ demo?',
  ],
};

const budgetGuideTopicKeywords = {
  spending: [
    'spend',
    'grocery',
    'dining',
    'purchase',
    'category',
    'impulse',
    'over budget',
  ],
  saving: ['save', 'saving', 'emergenc', 'goal', 'sinking fund'],
  bills: ['bill', 'subscription', 'due', 'late fee', 'utility'],
  debt: ['debt', 'loan', 'credit', 'pay off', 'pay down'],
  family: ['kid', 'allowance', 'chore', 'child', 'household'],
  budgethq: [
    'budgethq',
    'transaction',
    'account',
    'safe-to-spend',
    'safe to spend',
    'spending pause',
    'summary workspace',
    'reset',
  ],
};

function getBudgetGuideTopic(question) {
  const normalizedQuestion = question.trim().toLowerCase();

  if (!normalizedQuestion) {
    return 'general';
  }

  const exactGroup = Object.entries(budgetGuideQuestionGroups).find(
    ([group, questions]) =>
      group !== 'general' &&
      questions.some((item) => item.toLowerCase() === normalizedQuestion),
  );

  if (exactGroup) {
    return exactGroup[0];
  }

  return (
    Object.entries(budgetGuideTopicKeywords).find(([, keywords]) =>
      keywords.some((keyword) => normalizedQuestion.includes(keyword)),
    )?.[0] ?? 'general'
  );
}

function createSeededRandom(seed) {
  let state = (Math.floor(seed) + 1) >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleQuestions(questions, seed) {
  const shuffledQuestions = [...questions];
  const random = createSeededRandom(seed);

  for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));

    [shuffledQuestions[index], shuffledQuestions[randomIndex]] = [
      shuffledQuestions[randomIndex],
      shuffledQuestions[index],
    ];
  }

  return shuffledQuestions;
}

function getBudgetGuideQuestions(question = '', shuffleSeed = 0, count = 5) {
  const topic = getBudgetGuideTopic(question);
  const normalizedQuestion = question.trim().toLowerCase();
  const topicQuestions = budgetGuideQuestionGroups[topic].filter(
    (item) => item.toLowerCase() !== normalizedQuestion,
  );
  const topicQuestionSet = new Set(topicQuestions);
  const remainingQuestions = getBudgetGuideQuestionCatalog().filter(
    (item) =>
      item.toLowerCase() !== normalizedQuestion && !topicQuestionSet.has(item),
  );
  const safeSeed = Number.isFinite(shuffleSeed)
    ? Math.max(0, Math.floor(shuffleSeed))
    : 0;
  const safeCount = Math.max(0, Math.floor(count));

  if (!normalizedQuestion) {
    return shuffleQuestions(
      [...topicQuestions, ...remainingQuestions],
      safeSeed,
    ).slice(0, safeCount);
  }

  const relatedCount = Math.min(2, safeCount, topicQuestions.length);
  const suggestions = [
    ...shuffleQuestions(topicQuestions, safeSeed).slice(0, relatedCount),
    ...shuffleQuestions(remainingQuestions, safeSeed + 1).slice(
      0,
      safeCount - relatedCount,
    ),
  ];

  return shuffleQuestions(suggestions, safeSeed + 2);
}

function getBudgetGuideQuestionCatalog() {
  return Object.values(budgetGuideQuestionGroups).flat();
}

export { getBudgetGuideQuestionCatalog, getBudgetGuideQuestions };
