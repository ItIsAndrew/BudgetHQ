const localGuideTopics = [
  {
    id: 'transactions',
    keywords: ['transaction', 'expense', 'income', 'add money'],
    responses: [
      'Use the centered + button and choose Transaction. Enter the amount, choose income or expense, add a category, and save. You can review or edit it later in Main > Transactions.',
      'For a clean transaction history, use the purchase date, pick the closest category, and add a short merchant name. Main > Transactions lets you search, filter, edit, or remove the entry later.',
      'Income should be entered as money in, while purchases and payments should be entered as expenses. After saving, check Summary to confirm the monthly totals changed as expected.',
    ],
  },
  {
    id: 'accounts',
    keywords: ['account', 'checking', 'savings account', 'credit card'],
    responses: [
      'Use the centered + button and choose Account, or open Main > Add & Manage. Add the account name, type, and current balance so BudgetHQ can calculate your available household balance.',
      'Add checking and savings as positive balances. Enter a credit-card balance as a liability so it reduces the household total instead of increasing available money.',
      'After adding an account, record new transactions against it and periodically update its balance. Summary will combine the accounts while Main keeps the individual details visible.',
    ],
  },
  {
    id: 'reset-demo',
    keywords: ['reset the budgethq demo', 'clear local data'],
    responses: [
      'Open the Main workspace and use Reset in the top navigation. It clears the household demo entries stored in this browser and returns Main to its starting state, so export a JSON backup first if you want to keep the current data.',
      'You can also open Main > Add & Manage and choose Clear Local Data. Both controls reset the browser-only household data, while Export JSON lets you keep a restorable backup.',
      'Reset only the demo when you are ready to remove the current accounts, bills, goals, and activity from this browser. Export JSON first if you may want those entries again.',
    ],
  },
  {
    id: 'safe-spend',
    keywords: ['safe-to-spend', 'safe to spend', 'daily limit', 'per day'],
    responses: [
      'Safe-to-Spend turns the money left after planned bills into a daily pace. Add your accounts, monthly budget, remaining days, and bills in Main > Add & Manage, then check the pace meter on Today.',
      "If the pace says Near Limit, compare today's spending with the daily amount and postpone one non-essential purchase. Over Budget means the current pace is using money faster than the plan allows.",
      'To make the daily number more reliable, keep bill amounts and due dates current, record expenses promptly, and update the number of days left whenever you change the budget period.',
    ],
  },
  {
    id: 'subscriptions',
    keywords: ['subscription', 'recurring', 'renewal', 'cancel service'],
    responses: [
      'Open Main > Add & Manage and add the subscription with its price and renewal date. Review subscriptions regularly and cancel services that no longer earn their place in the budget.',
      'Sort subscriptions by monthly cost and usefulness. Start with anything unused, duplicated, or recently increased in price, then decide whether to cancel, downgrade, or keep it.',
      'Convert annual subscriptions to a monthly equivalent before comparing them. Setting aside one-twelfth of the annual price each month prevents renewal day from becoming a surprise bill.',
    ],
  },
  {
    id: 'bills',
    keywords: ['bill', 'due date', 'reminder', 'utilities', 'rent'],
    responses: [
      'Use the centered + button and choose Bill. Add the amount and due date; BudgetHQ will surface upcoming bills and highlight the ones that are close to due.',
      'A practical bill routine is to sort by due date, cover anything due within 48 hours, then reserve money for the rest before deciding what is safe to spend.',
      "For variable bills such as electricity, start with a recent high amount instead of the lowest month. That creates a cushion, and any difference can stay in the next month's plan.",
    ],
  },
  {
    id: 'kids',
    keywords: ['kid', 'allowance', 'chore', 'quest', 'child'],
    responses: [
      'The Kids portal tracks available money, savings quests, chores, and allowance. Parents can manage allowance and requests from Main, while kids see only their own money summary.',
      'A simple allowance split is to choose amounts for spending, saving, and giving before the money is used. Savings quests make the trade-off visible without exposing household finances.',
      'Keep chores specific and attach rewards before they are completed. Allowance Autopilot can handle the regular schedule, while one-time chores can stay separate.',
    ],
  },
  {
    id: 'goals',
    keywords: ['goal', 'save', 'saving', 'vacation', 'rainy day'],
    responses: [
      'Pick one clear goal, give it a target amount, and divide that target by the number of months available. Add the goal with the centered + button, then record small contributions consistently.',
      'For the next step, choose a target date and subtract the amount already saved from the target amount. Divide the remainder by the months left to get the contribution your goal needs.',
      'When several goals compete, fund the essential cushion first, then the goal with the nearest deadline. A smaller automatic contribution is usually more dependable than waiting for leftover money.',
    ],
  },
  {
    id: 'emergency-fund',
    keywords: [
      'emergency fund',
      'emergency savings',
      'financial cushion',
      'unexpected expense',
    ],
    responses: [
      'Start with a small emergency target that could cover one common surprise, then work toward several months of essential expenses. Keep this money separate from everyday spending but easy to reach.',
      'Base the target on essentials such as housing, food, utilities, transport, insurance, and minimum debt payments. A household with variable income or one earner may want a larger cushion.',
      'If saving the full target feels distant, create milestones such as $500, one month of essentials, and three months. Keep contributing after each milestone instead of waiting for a perfect month.',
    ],
  },
  {
    id: 'sinking-funds',
    keywords: [
      'sinking fund',
      'set aside',
      'annual expense',
      'planned expense',
      'car repair',
      'home repair',
    ],
    responses: [
      'A sinking fund turns a known future cost into a monthly amount. Subtract what is already saved from the target, divide by the months remaining, and add that amount to the budget each month.',
      'Use separate goals for predictable costs such as repairs, school fees, gifts, or annual renewals. That keeps planned expenses from using the emergency fund.',
      'When the due date or cost is uncertain, use a reasonable high estimate and review it monthly. Any extra can roll into the next related expense instead of disappearing into general spending.',
    ],
  },
  {
    id: 'debt',
    keywords: ['debt', 'loan', 'credit balance', 'interest', 'pay off'],
    responses: [
      'Keep minimum payments in Bills, then direct extra money toward one balance at a time. Highest-interest-first usually reduces total cost; smallest-balance-first can make progress feel faster.',
      'List each balance, minimum payment, due date, and interest rate. Pay every minimum first, then put the extra amount toward the single debt strategy you selected.',
      'Before increasing a debt payment, leave enough for upcoming essentials and a small emergency cushion. A payoff plan works best when it does not force new borrowing after an ordinary surprise.',
    ],
  },
  {
    id: 'credit',
    keywords: [
      'credit score',
      'credit report',
      'credit utilization',
      'build credit',
      'improve credit',
    ],
    responses: [
      'The strongest credit basics are paying on time, keeping card balances low relative to their limits, and checking credit reports for errors. Avoid opening accounts only for a quick score change.',
      'Put every minimum payment on the bill calendar and aim to pay card statement balances in full when possible. Lower reported balances can also reduce credit utilization.',
      'Credit improvement is usually gradual. Focus on accurate reports, on-time payments, manageable balances, and few unnecessary applications rather than paying a company that promises a fast fix.',
    ],
  },
  {
    id: 'groceries',
    keywords: ['grocery', 'groceries', 'food', 'meal', 'supermarket'],
    responses: [
      'Turn the monthly food amount into a weekly target, plan a short meal list before shopping, and check what you already have. Record each trip under Food so the category stays current.',
      'Compare the current Food total with the number of weeks left. If the pace is high, plan meals around ingredients already at home and make one list for the next trip.',
      'Separate groceries from restaurants when reviewing Food spending. That shows whether the best adjustment is the shopping list, meal planning, or fewer meals away from home.',
    ],
  },
  {
    id: 'spending',
    keywords: [
      'spend less',
      'spending',
      'overspend',
      'over budget',
      'shopping',
    ],
    responses: [
      'Start with the category that has the largest avoidable spending. Set one specific weekly limit, use Spending Pause for non-essentials, and review progress after seven days.',
      'Look at the last few transactions and circle one repeat purchase you would genuinely miss the least. Reducing a frequent expense usually matters more than cutting a rare small treat.',
      'Try a 24-hour pause for non-essential purchases. Keep bills, groceries, and transport visible, then compare the money not spent with a savings goal at the end of the week.',
    ],
  },
  {
    id: 'affordability',
    keywords: [
      'can i afford',
      'can we afford',
      'how much can i afford',
      'big purchase',
      'down payment',
    ],
    responses: [
      "Treat a purchase as affordable only if it fits after bills, essentials, minimum debt payments, and a savings contribution without relying on next month's income. Include fees, upkeep, and financing cost in the total.",
      'Test the purchase before making it: save its expected monthly cost for two or three months. If the rest of the budget still works, you gain both evidence and a larger down payment.',
      'Compare the full cost with the cash left after essentials, not just the advertised monthly payment. A lower payment can still cost more when the term, interest, insurance, or maintenance is included.',
    ],
  },
  {
    id: 'income',
    keywords: [
      'paycheck',
      'salary',
      'take-home pay',
      'raise',
      'extra income',
      'side hustle',
    ],
    responses: [
      'Budget from take-home pay, not gross salary. Record each paycheck as income, then decide in advance how much goes to bills, essentials, goals, debt, and flexible spending.',
      'When income increases, direct part of the difference to a goal before expanding regular spending. That lets the budget improve without making every raise disappear into new monthly commitments.',
      'Keep dependable income separate from overtime, bonuses, or side work. Build recurring bills around the dependable amount and use extra income for one-time priorities.',
    ],
  },
  {
    id: 'irregular-income',
    keywords: [
      'irregular income',
      'variable income',
      'freelance',
      'commission',
      'seasonal income',
      'income changes',
    ],
    responses: [
      'With irregular income, build the core budget from a conservative monthly baseline. Cover essentials first, keep a larger buffer, and decide ahead of time where income above the baseline will go.',
      'Review the last 6 to 12 months and find a dependable low-month income level. Use that for recurring commitments, then refill taxes, future slow months, and goals when stronger months arrive.',
      'Separate business and household money when possible. Pay yourself a planned household amount, reserve taxes before spending, and avoid treating one strong month as a permanent raise.',
    ],
  },
  {
    id: 'cash-budgeting',
    keywords: [
      'cash envelope',
      'envelope method',
      'zero-based',
      'zero based',
      '50/30/20',
      'budget method',
    ],
    responses: [
      'Choose a budgeting method that is simple enough to maintain. Zero-based budgeting assigns every dollar, envelopes cap selected categories, and percentage rules provide a flexible starting point.',
      'Use envelopes for categories that tend to drift, such as dining or shopping, while leaving automatic bills in the account. Stop spending from an envelope when its amount reaches zero.',
      'A percentage rule is a starting point, not a pass-or-fail test. Adjust it for housing costs, debt, family size, and goals, then judge the plan by whether it is sustainable and avoids new debt.',
    ],
  },
  {
    id: 'net-worth',
    keywords: ['net worth', 'asset', 'liability', 'property value', 'wealth'],
    responses: [
      'Net worth is what you own minus what you owe. List cash, investments, and realistic property values as assets; list loans, cards, and other debts as liabilities.',
      'Track net worth on a regular schedule such as monthly or quarterly. The trend matters more than one market-driven change, so use consistent values and avoid updating property estimates too often.',
      'A negative net worth is a starting measurement, not a judgment. Improving cash savings, retirement contributions, and principal balances can all move it in the right direction.',
    ],
  },
  {
    id: 'taxes',
    keywords: [
      'tax',
      'refund',
      'withholding',
      'deduction',
      'quarterly payment',
    ],
    responses: [
      'Treat taxes as a required category, especially for freelance or untaxed income. Reserve a percentage in a separate account and use official tax guidance or a qualified professional for the exact amount.',
      'A large refund can fund a cushion, high-interest debt, or a planned expense, but it may also mean withholding should be reviewed. Do not build regular bills around a refund that may change.',
      'BudgetHQ can help reserve money and record tax payments, but it cannot determine filing status, deductions, or legal tax obligations. Use current official rules or a tax professional for those decisions.',
    ],
  },
  {
    id: 'insurance',
    keywords: [
      'insurance',
      'premium',
      'deductible',
      'coverage',
      'policy renewal',
    ],
    responses: [
      'Budget for both the premium and the amount you may need before coverage begins. A lower premium is not automatically cheaper if the deductible would be difficult to cover.',
      'Add policy renewals to Bills and create a sinking fund for deductibles or annual premiums. Compare coverage limits and exclusions as well as price when reviewing policies.',
      'Review insurance after major household changes and before renewal. Keep essential protection in place while shopping around; the right coverage depends on risks, dependents, and local requirements.',
    ],
  },
  {
    id: 'retirement',
    keywords: [
      'retirement',
      '401k',
      '401(k)',
      'ira',
      'pension',
      'employer match',
    ],
    responses: [
      'Start retirement saving with an amount the monthly budget can sustain, especially enough to capture an available employer match. Increase the percentage gradually when income rises or debt falls.',
      'Keep short-term spending money separate from retirement funds. Retirement accounts may have tax rules and withdrawal restrictions, so verify account choices with official plan information.',
      'Balance retirement with urgent needs: cover essentials, minimum debt payments, and a basic emergency cushion, then build a steady long-term contribution instead of waiting for a perfect time.',
    ],
  },
  {
    id: 'investing',
    keywords: [
      'invest',
      'investment',
      'stock',
      'bond',
      'portfolio',
      'brokerage',
    ],
    responses: [
      'Investing is generally for money that will not be needed soon. Before investing, protect near-term bills, high-interest debt payments, and an emergency cushion from market changes.',
      'A simple investing plan defines the goal, time horizon, risk tolerance, fees, and contribution amount. Diversification can reduce concentration risk, but no investment return is guaranteed.',
      'BudgetHQ can help decide how much cash flow is available to invest, but it does not recommend individual securities. Use regulated account information or a qualified adviser for personalized investment choices.',
    ],
  },
  {
    id: 'housing',
    keywords: [
      'mortgage',
      'apartment',
      'home purchase',
      'housing cost',
      'moving',
      'roommate',
    ],
    responses: [
      'Count the full housing cost: payment or rent, utilities, insurance, fees, maintenance, parking, and commuting changes. Compare that total with reliable take-home income before committing.',
      'For a move, make one goal for deposits, movers, setup costs, and overlap between homes. Keeping those one-time costs separate prevents the new monthly budget from looking cheaper than it is.',
      'If housing is straining the budget, compare changes in payment, utilities, transport, and contract costs together. A cheaper address can still cost more when the whole move is considered.',
    ],
  },
  {
    id: 'transport',
    keywords: [
      'car',
      'vehicle',
      'transport',
      'gas',
      'fuel',
      'public transit',
      'commute',
    ],
    responses: [
      'Track the full transport cost, including payment, fuel, insurance, registration, parking, transit, and repairs. A monthly sinking fund makes maintenance less disruptive.',
      'Before replacing a vehicle, compare the repair cost with the full annual cost of a replacement. Include financing, insurance changes, taxes, and depreciation instead of comparing only monthly payments.',
      'If transport spending is high, review the largest fixed cost first, then mileage, fuel, parking, and trip frequency. Small fuel savings cannot always offset an expensive loan or insurance policy.',
    ],
  },
  {
    id: 'healthcare',
    keywords: [
      'medical',
      'healthcare',
      'health care',
      'doctor',
      'prescription',
      'dental',
    ],
    responses: [
      'Keep regular premiums and prescriptions in the monthly budget, then use a sinking fund for deductibles, dental work, glasses, or expected appointments. Medical needs should stay visible during Spending Pause.',
      'For a planned procedure, ask for the estimated total, what insurance covers, payment timing, and available payment plans before changing the budget. Keep the estimate separate from the final bill.',
      'When a medical bill is difficult to pay, verify it, ask about an itemized statement and financial assistance, and agree to a payment you can actually maintain before using high-interest credit.',
    ],
  },
  {
    id: 'shared-finances',
    keywords: [
      'couple',
      'partner',
      'spouse',
      'shared finances',
      'split expenses',
      'joint account',
    ],
    responses: [
      'Choose together which expenses are shared, how contributions are calculated, and how much personal spending each person controls. A short regular money check-in is more useful than waiting for a problem.',
      'Shared costs can be split equally or in proportion to take-home income. Write down the rule, due dates, and account used so both people can predict what happens each month.',
      'Joint and separate accounts can both work. The important parts are visibility for shared obligations, agreed personal boundaries, and a plan for emergencies or income changes.',
    ],
  },
  {
    id: 'windfalls',
    keywords: [
      'windfall',
      'bonus',
      'inheritance',
      'gift money',
      'lottery',
      'unexpected money',
    ],
    responses: [
      'Pause before committing unexpected money. Set aside any taxes, protect a small amount for enjoyment, then compare emergency savings, expensive debt, and important goals.',
      'Keep a windfall out of the everyday spending account while deciding. One-time money is best matched with one-time priorities rather than new recurring bills.',
      'For a large inheritance or settlement, avoid rushed promises and verify tax or legal effects with a qualified professional. BudgetHQ can still help organize the cash-flow choices afterward.',
    ],
  },
  {
    id: 'fraud',
    keywords: [
      'fraud',
      'scam',
      'stolen card',
      'identity theft',
      'unauthorized charge',
    ],
    responses: [
      'For an unauthorized charge, contact the financial institution through an official channel, lock the affected card or account, change exposed passwords, and document every step promptly.',
      'Do not send money or verification codes because of an unexpected urgent message. Check the request using a trusted number or website, and report suspicious activity to the relevant institution.',
      'After suspected identity theft, review account activity and credit reports, replace affected credentials, and follow current official reporting guidance. Budget categories can wait until the accounts are protected.',
    ],
  },
  {
    id: 'hardship',
    keywords: [
      'lost my job',
      'job loss',
      'cannot pay',
      "can't pay",
      'behind on bills',
      'collections',
      'bankruptcy',
      'financial crisis',
    ],
    responses: [
      'Protect immediate needs first: housing, food, utilities, medicine, and essential transport. Pause non-essentials, list every due date, and contact creditors or service providers before missed payments when possible.',
      'Build a short survival budget using cash currently available and only reliable incoming money. Ask providers about hardship plans, document agreements, and avoid promises the budget cannot support.',
      'For eviction, shutoff, collections, or bankruptcy questions, use qualified local nonprofit or legal help because deadlines and rights vary. BudgetHQ can help organize amounts and dates, but it cannot replace that advice.',
    ],
  },
  {
    id: 'summary',
    keywords: ['summary', 'chart', 'percentage', 'money comparison'],
    responses: [
      "Summary combines this month's income, expenses, balance, spending percentage, and comparison chart. Adult profiles see household and kid totals; kid profiles see only their own money.",
      'If Summary shows zero, add income and expenses as transactions first. Account balances and transaction totals are separate, so both areas may need information before every card is filled.',
      'Use the Household and Kids chart buttons to compare money in with money out. A spending percentage above 100 means recorded expenses are greater than recorded income for the period.',
    ],
  },
  {
    id: 'budget',
    keywords: [
      'start a budget',
      'make a budget',
      'set a budget',
      'monthly budget',
      'monthly plan',
      'cash flow',
    ],
    responses: [
      'Start with monthly take-home income, then list bills and essential spending. Set the monthly budget and days left in Main > Add & Manage; BudgetHQ will calculate your balance and daily Safe-to-Spend pace.',
      'A useful second pass is to compare planned amounts with actual transactions. Adjust categories that are consistently unrealistic instead of treating every difference as a failure.',
      'Give every dollar a job in this order: upcoming bills, essentials, minimum debt payments, a savings contribution, then flexible spending. Leave a small cushion for expenses that do not arrive on schedule.',
    ],
  },
];

const moneyLanguage =
  /\b(account|afford|allowance|asset|balance|bank|bill|borrow|budget|buy|cash|charge|cost|credit|debt|dollar|earn|expense|fee|finance|financial|fund|goal|income|interest|invest|loan|money|mortgage|pay|payment|price|purchase|rent|save|saving|spend|spending|subscription|tax|transaction|wealth|worth)s?\b/i;

const subjectStopWords = new Set([
  'a',
  'about',
  'an',
  'and',
  'are',
  'budget',
  'budgeting',
  'can',
  'could',
  'do',
  'does',
  'for',
  'handle',
  'help',
  'how',
  'i',
  'is',
  'it',
  'manage',
  'me',
  'money',
  'my',
  'of',
  'on',
  'our',
  'plan',
  'save',
  'saving',
  'should',
  'spend',
  'spending',
  'the',
  'this',
  'to',
  'we',
  'what',
  'when',
  'where',
  'which',
  'with',
  'would',
  'you',
]);

const openEndedBudgetResponses = [
  (subject) =>
    `For ${subject}, start with the total expected cost and the date you will need the money. Subtract anything already saved, divide the remainder by the pay periods left, and add that amount as a goal or planned expense. If it does not fit, change the timing, amount, or another flexible category.`,
  (subject) =>
    `Give ${subject} its own line in the plan instead of hoping general spending will cover it. Protect bills and essentials first, choose a realistic cap, then check actual spending against that cap each week.`,
  (subject) =>
    `A useful way to decide about ${subject} is to compare three numbers: its full cost, the cash available after essentials, and the time until payment. That shows whether to pay now, save gradually, reduce the cost, or wait.`,
  (subject) =>
    `Break ${subject} into required costs, optional costs, and surprises. Fund the required part first, leave a small buffer, and record each payment in one category so Summary shows whether the plan is holding.`,
];

const outOfScopeResponses = [
  (subject) =>
    `I am built mainly for budgeting, so I may not have a reliable answer about ${subject}. If it affects your money, tell me the cost, timing, and goal, and I can help you fit it into the budget.`,
  (subject) =>
    `That sounds like a question about ${subject}, which is outside my dependable knowledge. I can still help with the money side, such as comparing options, setting a spending limit, or saving for it.`,
  (subject) =>
    `I do not want to guess about ${subject}. For a budgeting angle, tell me what it may cost or what decision you are making, and I will help turn it into a practical plan.`,
];

const conversationalIntents = [
  {
    id: 'greeting',
    patterns: [
      /\b(hello|hey|hi|hiya)\b/i,
      /\bgood (afternoon|evening|morning)\b/i,
    ],
    responses: [
      'Hi! What would you like to work on today: spending, bills, saving, or something inside BudgetHQ?',
      'Hello! I’m here. Tell me what is happening with your money or which part of BudgetHQ you are trying to use.',
      'Hey! We can take this one step at a time. What would feel most helpful right now?',
    ],
  },
  {
    id: 'thanks',
    patterns: [/\b(thank you|thanks|thx)\b/i, /\bappreciate (it|you)\b/i],
    responses: [
      'You’re welcome. What would you like to tackle next?',
      'Glad that helped. I’m ready for the next question.',
      'Of course. We can keep going whenever you’re ready.',
    ],
  },
  {
    id: 'wellbeing',
    patterns: [/\bhow are you\b/i, /\bhow'?s it going\b/i, /\bwhat'?s up\b/i],
    responses: [
      'I’m doing well and ready to help. How are things going with your budget?',
      'I’m good, thanks for asking. What’s on your mind today?',
      'Doing well. I’m here with you, so tell me what you’d like to figure out.',
    ],
  },
  {
    id: 'identity',
    patterns: [
      /\bwho are you\b/i,
      /\bwhat are you\b/i,
      /\bwhat can you do\b/i,
      /^can you help(?: me)?[?!.]*$/i,
    ],
    responses: [
      'I’m the built-in BudgetHQ Guide. I can talk through budgeting choices and help you find transactions, bills, goals, Safe-to-Spend, Summary, and Kids features.',
      'I’m your local BudgetHQ Guide. I don’t send questions to a paid AI service, but I can still help with common money decisions and show you where things live in the app.',
      'I can help you plan a budget, reduce spending, organize bills, build savings goals, understand the dashboard, or use the Kids portal. What should we start with?',
    ],
  },
  {
    id: 'apology',
    patterns: [/\b(sorry|my bad)\b/i],
    responses: [
      'No worries at all. What would you like to try next?',
      'You don’t need to apologize. Tell me what you meant and we’ll keep going.',
      'It’s completely okay. We can start again from wherever makes sense.',
    ],
  },
  {
    id: 'goodbye',
    patterns: [/\b(bye|goodbye|see you|later)\b/i],
    responses: [
      'Bye for now. Your BudgetHQ information will be here when you come back.',
      'See you later. Nice work taking time to look after your money.',
      'Take care. Come back whenever you want to plan the next step.',
    ],
  },
  {
    id: 'negative',
    patterns: [/^(no|nope|not really)[?!.]*$/i],
    responses: [
      'No problem. Tell me what didn’t fit, and I’ll try a different direction.',
      'Okay. What would be more useful instead?',
      'Got it. Give me a little more context and we can reset the approach.',
    ],
  },
];

function getUserQuestions(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) => message?.role === 'user' && typeof message.text === 'string',
    )
    .map((message) => message.text.trim().toLowerCase())
    .filter(Boolean);
}

function getTopicScore(question, topic) {
  return topic.keywords.reduce(
    (score, keyword) =>
      question.includes(keyword)
        ? score + keyword.split(/\s+/).length * 100 + keyword.length
        : score,
    0,
  );
}

function findTopic(question) {
  return localGuideTopics.reduce(
    (bestMatch, topic) => {
      const score = getTopicScore(question, topic);

      return score > bestMatch.score ? { score, topic } : bestMatch;
    },
    { score: 0, topic: null },
  ).topic;
}

function findConversationalIntent(question) {
  return conversationalIntents.find((intent) =>
    intent.patterns.some((pattern) => pattern.test(question)),
  );
}

function isShortFollowUp(question) {
  return /^(another|another tip|go on|how|more|okay|ok|tell me more|what else|why|yes)[?!.]*$/i.test(
    question,
  );
}

function findConversationTopic(userQuestions) {
  const latestQuestion = userQuestions.at(-1);
  const directTopic = findTopic(latestQuestion);

  if (directTopic || !isShortFollowUp(latestQuestion)) {
    return directTopic;
  }

  for (let index = userQuestions.length - 2; index >= 0; index -= 1) {
    const priorTopic = findTopic(userQuestions[index]);

    if (priorTopic) {
      return priorTopic;
    }
  }

  return null;
}

function getConversationQuestion(userQuestions) {
  const latestQuestion = userQuestions.at(-1);

  if (!isShortFollowUp(latestQuestion)) {
    return latestQuestion;
  }

  return (
    userQuestions
      .slice(0, -1)
      .findLast((question) => !isShortFollowUp(question)) ?? latestQuestion
  );
}

function hashText(text) {
  return [...text].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
}

function getQuestionSubject(question) {
  const words = question.match(/[a-z0-9][a-z0-9'-]*/g) ?? [];
  const subjectWords = words
    .filter((word) => !subjectStopWords.has(word))
    .filter(
      (word) =>
        !['much', 'need', 'please', 'put', 'reserve', 'set', 'who'].includes(
          word,
        ),
    )
    .slice(0, 7);

  return subjectWords.length > 0 ? subjectWords.join(' ') : 'that situation';
}

function getLastAssistantReply(messages) {
  if (!Array.isArray(messages)) {
    return '';
  }

  return (
    messages.findLast(
      (message) =>
        message?.role === 'assistant' && typeof message.text === 'string',
    )?.text ?? ''
  );
}

function buildOpenEndedReply(question, priorReplyCount, lastAssistantReply) {
  const subject = getQuestionSubject(question);
  const responses = moneyLanguage.test(question)
    ? openEndedBudgetResponses
    : outOfScopeResponses;
  const startIndex = (hashText(question) + priorReplyCount) % responses.length;

  for (let offset = 0; offset < responses.length; offset += 1) {
    const response =
      responses[(startIndex + offset) % responses.length](subject);

    if (response !== lastAssistantReply) {
      return response;
    }
  }

  return responses[startIndex](subject);
}

export function createLocalBudgetReply(messages) {
  const userQuestions = getUserQuestions(messages);

  if (userQuestions.length === 0) {
    throw new Error('Enter a budgeting question to continue.');
  }

  const matchedTopic = findConversationTopic(userQuestions);
  const latestQuestion = userQuestions.at(-1);
  const conversationQuestion = getConversationQuestion(userQuestions);
  const conversationalIntent = findConversationalIntent(latestQuestion);
  const priorReplyCount = Array.isArray(messages)
    ? messages.filter((message) => message?.role === 'assistant').length
    : 0;

  if (matchedTopic) {
    const topicReply =
      matchedTopic.responses[priorReplyCount % matchedTopic.responses.length];

    return conversationalIntent?.id === 'greeting'
      ? `Hi! ${topicReply}`
      : topicReply;
  }

  if (conversationalIntent) {
    if (
      conversationalIntent.id === 'greeting' &&
      moneyLanguage.test(conversationQuestion)
    ) {
      return `Hi! ${buildOpenEndedReply(
        conversationQuestion,
        priorReplyCount,
        getLastAssistantReply(messages),
      )}`;
    }

    return conversationalIntent.responses[
      priorReplyCount % conversationalIntent.responses.length
    ];
  }

  return buildOpenEndedReply(
    conversationQuestion,
    priorReplyCount,
    getLastAssistantReply(messages),
  );
}

export async function requestBudgetAssistant(messages) {
  return createLocalBudgetReply(messages);
}
