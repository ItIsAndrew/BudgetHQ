import {
  ArrowLeft,
  BookOpen,
  Car,
  CircleCheck,
  CircleDollarSign,
  Coffee,
  Gift,
  Home,
  Lightbulb,
  PiggyBank,
  ShoppingBasket,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import PortalTour from './PortalTour.jsx';

const mainTipCategories = [
  'All',
  'Basics',
  'Shopping',
  'Food',
  'Home',
  'Transport',
  'Habits',
];

const categoryIcons = {
  Basics: PiggyBank,
  Food: UtensilsCrossed,
  Habits: Coffee,
  Home,
  Shopping: ShoppingBasket,
  Transport: Car,
  Earning: CircleDollarSign,
  Giving: Gift,
  Saving: PiggyBank,
  Spending: ShoppingBasket,
};

const mainTips = [
  {
    action: 'Move a small amount to savings as soon as income arrives.',
    category: 'Basics',
    id: 'basics-pay-yourself',
    summary:
      'Treat savings like a regular bill instead of waiting to see what is left at the end of the month.',
    title: 'Pay yourself first',
    why: 'Savings grows before other spending gets a chance to use it.',
  },
  {
    action:
      'Review one week of purchases and circle anything that surprised you.',
    category: 'Basics',
    id: 'basics-weekly-review',
    summary:
      'A short weekly check makes spending easier to understand without turning it into a daily chore.',
    title: 'Use a ten-minute money check-in',
    why: 'Frequent, small reviews make overspending easier to correct.',
  },
  {
    action:
      'Put non-essential purchases on a list and wait two full days before checking out.',
    category: 'Shopping',
    id: 'shopping-wait-list',
    summary:
      'The pause separates things you genuinely want from purchases driven by the moment.',
    title: 'Let the first urge pass',
    why: 'A little time can cut impulse spending without banning fun purchases.',
  },
  {
    action: 'Compare the shelf unit price instead of choosing by package size.',
    category: 'Shopping',
    id: 'shopping-unit-price',
    summary:
      'The largest package and the brightest sale sticker are not always the best value.',
    title: 'Shop by unit, not package',
    why: 'You can compare different brands and sizes on equal terms.',
  },
  {
    action:
      'Choose three meals from food already at home before writing a grocery list.',
    category: 'Food',
    id: 'food-pantry-first',
    summary:
      'Start with the pantry, freezer, and fridge so groceries support what you already have.',
    title: 'Run a pantry-first week',
    why: 'It reduces food waste and lowers the next grocery trip.',
  },
  {
    action:
      'Keep one easy, low-cost lunch ready for days when plans fall apart.',
    category: 'Food',
    id: 'food-default-lunch',
    summary:
      'A dependable backup meal makes convenience spending less tempting.',
    title: 'Create a backup meal',
    why: 'The easiest available option is often the one you choose.',
  },
  {
    action:
      'Ask one provider to check for current loyalty, retention, or lower-cost plans.',
    category: 'Home',
    id: 'home-provider-call',
    summary:
      'Internet, phone, insurance, and other recurring bills are worth reviewing once a year.',
    title: 'Ask for the newer rate',
    why: 'One short call can reduce a bill that repeats every month.',
  },
  {
    action:
      'Estimate how often you will use an item before deciding whether it is a good deal.',
    category: 'Home',
    id: 'home-cost-per-use',
    summary:
      'A more expensive item can be sensible when it will be used often and last longer.',
    title: 'Think in cost per use',
    why: 'Value depends on usefulness, not just the number on the price tag.',
  },
  {
    action:
      "Group this week's errands into one route and skip low-priority extra trips.",
    category: 'Transport',
    id: 'transport-errand-loop',
    summary:
      'Plan stops together before leaving instead of making several separate drives.',
    title: 'Build one errand loop',
    why: 'Fewer trips save fuel, time, and unplanned stops.',
  },
  {
    action:
      'Unsubscribe from three marketing messages that regularly pull you toward a purchase.',
    category: 'Habits',
    id: 'habits-sale-alerts',
    summary:
      'Sales alerts create urgency even when the product was never part of your plan.',
    title: 'Quiet the spending cues',
    why: 'Seeing fewer prompts makes thoughtful choices easier.',
  },
  {
    action: 'Before buying, name one other thing the same money could support.',
    category: 'Habits',
    id: 'habits-tradeoff',
    summary:
      'Compare the purchase with a goal, bill, experience, or future need that matters to you.',
    title: 'Give every yes a comparison',
    why: 'A clear tradeoff turns an abstract price into a real choice.',
  },
];

const kidsTips = [
  {
    action:
      'Move one small part of the next money you receive into a savings quest.',
    category: 'Saving',
    id: 'kids-saving-first',
    summary:
      'Saving gets easier when a little money moves toward a goal before anything is spent.',
    title: 'Save a little first',
    why: 'Small amounts can grow into something exciting over time.',
  },
  {
    action: 'Give your savings goal a name and draw or find a picture of it.',
    category: 'Saving',
    id: 'kids-saving-picture',
    summary:
      'A clear goal makes it easier to remember why you are choosing to wait.',
    title: 'Make the goal easy to see',
    why: 'Seeing the goal turns saving into progress instead of missing out.',
  },
  {
    action: 'Ask: Do I need it, will I use it, and would I choose it tomorrow?',
    category: 'Spending',
    id: 'kids-spending-three-questions',
    summary:
      'Three quick questions can slow down a purchase without making every choice feel difficult.',
    title: 'Use the three-question pause',
    why: 'A short pause helps separate a real choice from a passing want.',
  },
  {
    action: 'Compare two choices and write down what you like about each one.',
    category: 'Spending',
    id: 'kids-spending-compare',
    summary:
      'Price is important, but how long something lasts and how often it gets used matter too.',
    title: 'Compare more than the price',
    why: 'The cheapest choice is not always the one that gives the most value.',
  },
  {
    action:
      'Choose one helpful job, agree on the reward, and decide when it will be finished.',
    category: 'Earning',
    id: 'kids-earning-plan',
    summary:
      'A clear chore plan connects effort, responsibility, and earning money.',
    title: 'Make an earning plan',
    why: 'Knowing the job and reward ahead of time keeps the agreement fair.',
  },
  {
    action: 'Split the next reward into a save part and a spend part.',
    category: 'Earning',
    id: 'kids-earning-split',
    summary: 'Money can do more than one job, even when the amount is small.',
    title: 'Give each reward two jobs',
    why: 'You can enjoy some now while still moving closer to a goal.',
  },
  {
    action: 'Pick one person, place, or cause you would feel happy helping.',
    category: 'Giving',
    id: 'kids-giving-purpose',
    summary:
      'Giving is most meaningful when it connects to something you care about.',
    title: 'Choose what matters to you',
    why: 'A personal reason makes generosity feel like a real choice.',
  },
  {
    action: 'Check your money box and savings quest on the same day each week.',
    category: 'Habits',
    id: 'kids-habits-check-in',
    summary:
      'A quick weekly look helps you notice progress and decide what to do next.',
    title: 'Have a weekly money minute',
    why: 'Regular check-ins keep goals from being forgotten.',
  },
  {
    action:
      'Mark each small milestone instead of waiting until the whole goal is complete.',
    category: 'Habits',
    id: 'kids-habits-celebrate',
    summary:
      'Saving takes patience, so the steps along the way deserve attention too.',
    title: 'Celebrate progress',
    why: 'Noticing small wins makes it easier to keep going.',
  },
];

const tipGuides = {
  kids: {
    categories: ['All', 'Saving', 'Spending', 'Earning', 'Giving', 'Habits'],
    dailyCopy:
      'Choose one thing you want and one thing you need. Explain what makes them different.',
    dailyTitle: 'Practice spotting wants and needs',
    description:
      'Friendly ideas for saving, spending, earning, and making thoughtful money choices.',
    eyebrow: 'Kid-friendly money guidance',
    tips: kidsTips,
  },
  main: {
    categories: mainTipCategories,
    dailyCopy:
      'Remove one saved card from a shopping app. The extra checkout step gives you a moment to reconsider.',
    dailyTitle: 'Add a little friction before an impulse purchase',
    description:
      'Practical ideas for household spending, saving, and everyday money decisions.',
    eyebrow: 'Household money guidance',
    tips: mainTips,
  },
};

const tipsTourSteps = [
  {
    body: 'Choose household or kids tips for the next money choice.',
    eyebrow: '01 · Choose your lens',
    icon: Home,
    label: 'Choose an audience',
    outcome: 'Start with advice that matches who is making the next money choice.',
    pointer: 'Switch between Main and Kids tips',
    preview: {
      balance: { detail: 'Household habits', title: 'Main' },
      cards: [
        { detail: 'Everyday spending', title: 'Main tips' },
        { detail: 'Simple money choices', title: 'Kids tips' },
        { detail: 'A fresh starting point', title: 'All topics' },
      ],
      hero: { detail: 'Choose who the idea is for', title: 'Tips for' },
      meter: { detail: 'Main · Kids', title: 'Two perspectives' },
      nav: 'BudgetHQ / Tips',
    },
    title: 'Start with the right perspective',
    visual: 'audience',
  },
  {
    body: 'Use the daily tip for one focused idea this week.',
    eyebrow: '02 · Find one idea',
    icon: Sparkles,
    label: "Today's tip",
    outcome: 'One useful idea is enough to make a small change today.',
    pointer: 'Use the daily tip as your quick start',
    preview: {
      balance: { detail: 'One idea at a time', title: 'Daily tip' },
      cards: [
        { detail: 'A practical move', title: 'Try this' },
        { detail: 'Why it helps', title: 'The reason' },
        { detail: 'Keep it realistic', title: 'Your week' },
      ],
      hero: { detail: 'A small action for today', title: 'Tip for today' },
      meter: { detail: 'Read · Decide · Try', title: 'Simple rhythm' },
      nav: 'BudgetHQ / Tips',
    },
    title: 'Make today’s tip your starting point',
    visual: 'today',
  },
  {
    body: 'Use topics to find ideas for the decision in front of you.',
    eyebrow: '03 · Browse with purpose',
    icon: BookOpen,
    label: 'Browse topics',
    outcome: 'Filters help you find the next idea without losing the bigger library.',
    pointer: 'Use topics to narrow the library',
    preview: {
      balance: { detail: 'Basics · Food · Home', title: 'Topic tabs' },
      cards: [
        { detail: 'Compare useful ideas', title: 'Topic list' },
        { detail: 'See the result count', title: 'Filtered view' },
        { detail: 'Return to All anytime', title: 'Full library' },
      ],
      hero: { detail: 'Find the idea that fits', title: 'Browse by topic' },
      meter: { detail: 'Basics · Shopping · Habits', title: 'Categories' },
      nav: 'BudgetHQ / Tips',
    },
    title: 'Browse by the decision in front of you',
    visual: 'topics',
  },
  {
    body: 'Each card turns a useful idea into one clear action.',
    eyebrow: '04 · Turn reading into action',
    icon: CircleCheck,
    label: 'Try this actions',
    outcome: 'Leave each card with one action you could actually try.',
    pointer: 'Look for the action inside each card',
    preview: {
      balance: { detail: 'A practical next move', title: 'Try this' },
      cards: [
        { detail: 'The action to test', title: 'Do one thing' },
        { detail: 'The reason behind it', title: 'Why it works' },
        { detail: 'Adjust for real life', title: 'Make it yours' },
      ],
      hero: { detail: 'Ideas become useful here', title: 'Tip card' },
      meter: { detail: 'Read → choose → act', title: 'A simple loop' },
      nav: 'BudgetHQ / Tips',
    },
    title: 'Turn a tip into one small action',
    visual: 'cards',
  },
  {
    body: 'Keep the next step small and repeat what helps.',
    eyebrow: '05 · Build a rhythm',
    icon: PiggyBank,
    label: 'Make it repeatable',
    outcome: 'A small repeatable habit beats a perfect plan you never use.',
    pointer: 'Return whenever the next decision changes',
    preview: {
      balance: { detail: 'Come back as life changes', title: 'Your rhythm' },
      cards: [
        { detail: 'One idea this week', title: 'Weekly check-in' },
        { detail: 'Keep what helps', title: 'Repeat wins' },
        { detail: 'Change the lens', title: 'Switch audience' },
      ],
      hero: { detail: 'Practical guidance over time', title: 'Keep learning' },
      meter: { detail: 'Small · useful · repeatable', title: 'A steady habit' },
      nav: 'BudgetHQ / Tips',
    },
    title: 'Build a tip habit that fits real life',
    visual: 'routine',
  },
];

function TipsPortal({ onBack }) {
  const [activeAudience, setActiveAudience] = useState('main');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showTour, setShowTour] = useState(false);
  const activeGuide = tipGuides[activeAudience];

  const visibleTips = useMemo(
    () =>
      activeCategory === 'All'
        ? activeGuide.tips
        : activeGuide.tips.filter((tip) => tip.category === activeCategory),
    [activeAudience, activeCategory, activeGuide.tips],
  );

  const selectAudience = (audience) => {
    setActiveAudience(audience);
    setActiveCategory('All');
  };

  return (
    <main className={`tips-shell tips-${activeAudience}`}>
      <div className="tips-workspace">
        <nav className="tips-nav" aria-label="Tips workspace controls">
          <button className="tips-back-button" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" size={18} />
            Switch Portal
          </button>
          <div className="tips-nav-actions">
            <span className="tips-brand">
              <Lightbulb aria-hidden="true" size={18} />
              BudgetHQ Tips
            </span>
            <button
              aria-label="Open Tips tutorial"
              className="tips-tour-button"
              onClick={() => setShowTour(true)}
              title="Open Tips tutorial"
              type="button"
            >
              <BookOpen aria-hidden="true" size={17} />
              Tour
            </button>
          </div>
        </nav>

        <header className="tips-hero">
          <p className="tips-eyebrow">{activeGuide.eyebrow}</p>
          <h1>Budgeting tips</h1>
          <p>{activeGuide.description}</p>
        </header>

        <section
          className="tips-audience-switch"
          aria-label="Choose who the tips are for"
        >
          <span>Tips for</span>
          <div role="group" aria-label="Tips audience">
            <button
              aria-pressed={activeAudience === 'main'}
              className={activeAudience === 'main' ? 'selected' : ''}
              onClick={() => selectAudience('main')}
              type="button"
            >
              <Home aria-hidden="true" size={18} />
              Main
            </button>
            <button
              aria-pressed={activeAudience === 'kids'}
              className={activeAudience === 'kids' ? 'selected' : ''}
              onClick={() => selectAudience('kids')}
              type="button"
            >
              <PiggyBank aria-hidden="true" size={18} />
              Kids
            </button>
          </div>
        </section>

        <section className="today-tip" aria-labelledby="today-tip-title">
          <span className="today-tip-icon">
            <Sparkles aria-hidden="true" size={22} />
          </span>
          <div>
            <p className="tips-eyebrow">Tip for today</p>
            <h2 id="today-tip-title">{activeGuide.dailyTitle}</h2>
            <p>{activeGuide.dailyCopy}</p>
          </div>
        </section>

        <section
          className="tips-library-panel"
          aria-labelledby="tips-library-title"
        >
          <div className="tips-section-heading">
            <div>
              <p className="tips-eyebrow">Browse by topic</p>
              <h2 id="tips-library-title">Ideas you can use</h2>
            </div>
            <span className="tips-result-count">
              {visibleTips.length} {visibleTips.length === 1 ? 'tip' : 'tips'}
            </span>
          </div>

          <div className="tips-category-tabs" aria-label="Tip categories">
            {activeGuide.categories.map((category) => (
              <button
                aria-pressed={activeCategory === category}
                className={activeCategory === category ? 'selected' : ''}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="tips-card-grid">
            {visibleTips.map((tip) => {
              const Icon = categoryIcons[tip.category];

              return (
                <article
                  className={`tip-card tip-${tip.category.toLowerCase()}`}
                  key={tip.id}
                >
                  <div className="tip-card-topline">
                    <span className="tip-category-icon">
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <span>{tip.category}</span>
                  </div>
                  <h3>{tip.title}</h3>
                  <p>{tip.summary}</p>
                  <div className="tip-action">
                    <strong>Try this</strong>
                    <span>{tip.action}</span>
                  </div>
                  <small>{tip.why}</small>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      {showTour ? (
        <PortalTour
          onClose={() => setShowTour(false)}
          steps={tipsTourSteps}
          theme="tips"
          workspaceName="Tips Library"
        />
      ) : null}
    </main>
  );
}

export default TipsPortal;
