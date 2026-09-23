import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Flag,
  Gift,
  HeartHandshake,
  Minus,
  PiggyBank,
  Plus,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AchievementShelf from './AchievementShelf.jsx';
import IncomeAllocationFlow from './IncomeAllocationFlow.jsx';
import { getKidsAchievementBadges } from './achievementBadges.js';

const startingState = {
  balance: 0,
  allowance: null,
  quests: [],
  chores: [],
  activity: [],
};

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount);
}

function createKidsId(label) {
  const slug =
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') || 'item';
  return `${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ensureKidsItemId(item, labelKey) {
  if (!item || typeof item !== 'object') {
    return item;
  }

  if (item.id) {
    return item;
  }

  const label = String(
    item[labelKey] ?? item.label ?? item.name ?? item.task ?? 'item',
  );
  return { ...item, id: createKidsId(label) };
}

function normalizeKidsData(data, fallback) {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const normalizedData = { ...data };
  delete normalizedData.goalRequests;

  return {
    ...fallback,
    ...normalizedData,
    activity: Array.isArray(data.activity)
      ? data.activity.map((item) => ensureKidsItemId(item, 'label'))
      : fallback.activity,
    chores: Array.isArray(data.chores)
      ? data.chores.map((item) => ensureKidsItemId(item, 'task'))
      : fallback.chores,
    quests: Array.isArray(data.quests)
      ? data.quests.map((item) => ensureKidsItemId(item, 'name'))
      : fallback.quests,
  };
}

function readStoredKidsState(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : fallback;
    return normalizeKidsData(parsedValue, fallback);
  } catch {
    return fallback;
  }
}

function useStoredKidsState(key, fallback) {
  const [value, setValue] = useState(() => readStoredKidsState(key, fallback));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const questJourneyMilestones = [
  { icon: Flag, label: 'Start', value: 0 },
  { icon: Star, label: 'First stop', value: 25 },
  { icon: PiggyBank, label: 'Halfway', value: 50 },
  { icon: Sparkles, label: 'Almost there', value: 75 },
  { icon: Trophy, label: 'Prize', value: 100 },
];

function QuestJourneyMap({ quest, value }) {
  const progress = Math.min(Math.max(Math.round(value), 0), 100);
  const nextMilestone = questJourneyMilestones.find(
    (milestone) => milestone.value > progress,
  );

  return (
    <div
      aria-label={`${quest.name} quest journey, ${progress}% complete`}
      className={`quest-journey${progress >= 100 ? ' complete' : ''}`}
      style={{ '--quest-color': quest.color || '#06b6d4' }}
    >
      <div className="quest-map" aria-hidden="true">
        {questJourneyMilestones.map((milestone, index) => {
          const Icon = milestone.icon;
          const nextStop = questJourneyMilestones[index + 1];
          const legProgress = nextStop
            ? Math.min(
                Math.max(
                  ((progress - milestone.value) /
                    (nextStop.value - milestone.value)) *
                    100,
                  0,
                ),
                100,
              )
            : 0;

          return (
            <span
              className={`quest-map-stage${index % 2 ? ' low' : ' high'}${
                progress >= milestone.value ? ' reached' : ''
              }`}
              key={milestone.value}
            >
              {nextStop ? (
                <span className="quest-map-leg">
                  <span style={{ width: `${legProgress}%` }} />
                </span>
              ) : null}
              <span className="quest-map-node">
                <Icon size={15} strokeWidth={2.6} />
              </span>
              <small>{milestone.label}</small>
            </span>
          );
        })}
      </div>
      <div className="quest-journey-status">
        {nextMilestone ? (
          <>
            <strong>{progress}% complete</strong>
            <span>Next stop: {nextMilestone.label}</span>
          </>
        ) : (
          <>
            <span className="quest-celebration" aria-hidden="true">
              <Sparkles size={15} />
              <Trophy size={18} />
              <Sparkles size={15} />
            </span>
            <strong>Quest complete!</strong>
            <span>You reached the prize.</span>
          </>
        )}
      </div>
    </div>
  );
}

function getQuestLesson(quest) {
  if (quest.target <= 0) {
    return 'Pick a target amount to see how each move changes progress.';
  }

  const nextFive = Math.min(5, quest.target - quest.saved);
  const currentProgress = Math.round((quest.saved / quest.target) * 100);
  const nextProgress = Math.round(
    ((quest.saved + nextFive) / quest.target) * 100,
  );

  if (quest.saved >= quest.target) {
    return 'Quest complete. That is what saving on purpose looks like.';
  }

  return `Adding ${formatMoney(nextFive)} moves this from ${currentProgress}% to ${nextProgress}%.`;
}

function KidsEmptyState({ children, title }) {
  return (
    <div className="empty-state kids-empty-state">
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

function KidsTourVisual({ step }) {
  const visualClass = step.visual ? ` tour-step-${step.visual}` : '';
  const StepIcon = step.icon ?? Sparkles;

  return (
    <div
      className={`tour-visual kids-tour-visual${visualClass}`}
      aria-label="Kids portal preview"
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
          <Star size={14} aria-hidden="true" />
          Preview
        </span>
      </div>
      <div className="tour-preview-shell">
        <span className="tour-preview-nav">BudgetHQ / Kids</span>
        <span className="tour-preview-hero">
          <strong>Money Box</strong>
          <small>Your balance at a glance</small>
        </span>
        <span className="tour-preview-balance">
          <strong>$25</strong>
          <small>Ready to choose</small>
        </span>
        <span className="tour-preview-meter">
          <strong>Savings progress</strong>
          <small>Flags show each milestone</small>
        </span>
        <span className="tour-preview-card card-one">
          <strong>Quests</strong>
          <small>Save toward a want</small>
        </span>
        <span className="tour-preview-card card-two">
          <strong>Chores</strong>
          <small>Earn rewards</small>
        </span>
        <span className="tour-preview-card card-three">
          <strong>Chore Store</strong>
          <small>Save, spend, donate</small>
        </span>
      </div>
      <div className="tour-visual-note">
        <CheckCircle2 size={17} aria-hidden="true" />
        <span>
          <strong>What to notice</strong>
          {step.outcome}
        </span>
      </div>
    </div>
  );
}

function KidsTourOverlay({ onClose, steps }) {
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
    <div className="tour-backdrop kids-tour-backdrop" role="presentation">
      <section
        aria-describedby="kids-tour-description"
        aria-label="Kids tour"
        aria-labelledby="kids-tour-title"
        aria-modal="true"
        className="tour-card kids-tour-card"
        role="dialog"
      >
        <header className="tour-card-header">
          <div className="tour-brand">
            <span className="tour-brand-icon">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <span>
              <small>Guided walkthrough</small>
              <strong>Your money choices</strong>
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
                      <CheckCircle2 size={15} aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                  <span>{step.label}</span>
                </button>
              ))}
            </nav>
            <div className="tour-rail-tip">
              <Star size={17} aria-hidden="true" />
              <span>
                <strong>Your choices matter</strong>
                There is more than one good way to use your money.
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
            <KidsTourVisual step={currentStep} />
            <div className="tour-card-copy" key={currentStep.title}>
              <p className="eyebrow">{currentStep.eyebrow}</p>
              <h2 id="kids-tour-title">{currentStep.title}</h2>
              <p id="kids-tour-description">{currentStep.body}</p>
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
              {isLastStep ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : null}
              {isLastStep ? 'Complete tour' : 'Continue'}
              {!isLastStep ? <ArrowRight size={16} aria-hidden="true" /> : null}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function KidsPortal({
  onBack,
  onStartTour,
  onTourComplete,
  showTour,
  tourSteps,
}) {
  const [kidsData, setKidsData] = useStoredKidsState(
    'budgethq-kids-data-v2',
    startingState,
  );
  const [moneyAmount, setMoneyAmount] = useState('');
  const [questName, setQuestName] = useState('');
  const [questTarget, setQuestTarget] = useState('');
  const [questIcon, setQuestIcon] = useState('');
  const [formMessages, setFormMessages] = useState({});

  const hasPositiveAmount = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0;
  };

  const canAddMoney = hasPositiveAmount(moneyAmount);
  const canAddQuest = questName.trim() && hasPositiveAmount(questTarget);

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

  const totalSaved = useMemo(
    () => kidsData.quests.reduce((sum, quest) => sum + quest.saved, 0),
    [kidsData.quests],
  );
  const firstOpenQuest = useMemo(
    () => kidsData.quests.find((quest) => quest.saved < quest.target) ?? null,
    [kidsData.quests],
  );
  const moneyChoiceChart = useMemo(() => {
    const spent = kidsData.activity
      .filter((item) => String(item.label).includes('spending choice'))
      .reduce((sum, item) => sum + item.amount, 0);
    const shared = kidsData.activity
      .filter((item) => String(item.label).includes('donation'))
      .reduce((sum, item) => sum + item.amount, 0);
    const items = [
      { id: 'ready', label: 'Ready', value: kidsData.balance },
      { id: 'saved', label: 'Saved', value: totalSaved },
      { id: 'spent', label: 'Spent', value: spent },
      { id: 'shared', label: 'Shared', value: shared },
    ];

    return {
      items,
      maxValue: Math.max(...items.map((item) => item.value), 1),
    };
  }, [kidsData.activity, kidsData.balance, totalSaved]);
  const kidsAchievementBadges = useMemo(
    () =>
      getKidsAchievementBadges({
        activity: kidsData.activity,
        chores: kidsData.chores,
        quests: kidsData.quests,
      }),
    [kidsData.activity, kidsData.chores, kidsData.quests],
  );

  const addActivity = (entry) => ({
    ...entry,
    id: createKidsId(entry.label),
  });

  const addMoney = () => {
    const amount = Number(moneyAmount);

    if (!hasPositiveAmount(moneyAmount)) {
      setFormMessage('money', 'Enter a positive amount for the money box.');
      return;
    }

    clearFormMessage('money');
    setKidsData((current) => ({
      ...current,
      balance: current.balance + amount,
      activity: [
        addActivity({
          amount,
          label: 'Money added',
          type: 'in',
        }),
        ...current.activity,
      ],
    }));
    setMoneyAmount('');
  };

  const addQuest = () => {
    const target = Number(questTarget);

    if (!questName.trim() || !hasPositiveAmount(questTarget)) {
      setFormMessage('quest', 'Enter a quest name and positive target.');
      return;
    }

    clearFormMessage('quest');
    setKidsData((current) => ({
      ...current,
      quests: [
        {
          color: '#06b6d4',
          icon: questIcon.trim() || '★',
          id: createKidsId(questName),
          name: questName.trim(),
          saved: 0,
          target,
        },
        ...current.quests,
      ],
      activity: [
        addActivity({
          amount: 0,
          label: `${questName.trim()} quest created`,
          type: 'in',
        }),
        ...current.activity,
      ],
    }));
    setQuestName('');
    setQuestTarget('');
    setQuestIcon('');
  };

  const deleteQuest = (questId) => {
    const quest = kidsData.quests.find((item) => item.id === questId);

    if (!quest) {
      return;
    }

    if (quest.saved > 0) {
      setFormMessage(
        `quest-${questId}`,
        'Move saved money back before deleting this quest.',
      );
      return;
    }

    clearFormMessage(`quest-${questId}`);
    setKidsData((current) => ({
      ...current,
      quests: current.quests.filter((item) => item.id !== questId),
      activity: [
        addActivity({
          amount: 0,
          label: `${quest.name} quest deleted`,
          type: 'out',
        }),
        ...current.activity,
      ],
    }));
  };

  const claimAllowance = () => {
    setKidsData((current) => {
      if (!current.allowance || current.allowance.claimed) {
        return current;
      }

      return {
        ...current,
        allowance: {
          ...current.allowance,
          claimed: true,
        },
        balance: current.balance + current.allowance.amount,
        activity: [
          addActivity({
            amount: current.allowance.amount,
            label: 'Allowance Autopilot',
            type: 'in',
          }),
          ...current.activity,
        ],
      };
    });
  };

  const completeChore = (choreId) => {
    setKidsData((current) => {
      const chore = current.chores.find((item) => item.id === choreId);

      if (!chore || chore.done) {
        return current;
      }

      return {
        ...current,
        balance: current.balance + chore.reward,
        chores: current.chores.map((item) =>
          item.id === choreId ? { ...item, done: true } : item,
        ),
        activity: [
          addActivity({
            amount: chore.reward,
            label: `${chore.task} reward`,
            type: 'in',
          }),
          ...current.activity,
        ],
      };
    });
  };

  const moveQuestMoney = (questId, direction) => {
    setKidsData((current) => {
      const quest = current.quests.find((item) => item.id === questId);

      if (!quest) {
        return current;
      }

      const amount =
        direction === 'in'
          ? Math.min(5, current.balance, quest.target - quest.saved)
          : Math.min(5, quest.saved);

      if (amount <= 0) {
        return current;
      }

      return {
        ...current,
        balance:
          direction === 'in'
            ? current.balance - amount
            : current.balance + amount,
        quests: current.quests.map((item) =>
          item.id === questId
            ? {
                ...item,
                saved: item.saved + (direction === 'in' ? amount : -amount),
              }
            : item,
        ),
        activity: [
          addActivity({
            amount,
            label:
              direction === 'in'
                ? `Moved to ${quest.name}`
                : `Moved back from ${quest.name}`,
            type: direction === 'in' ? 'out' : 'in',
          }),
          ...current.activity,
        ],
      };
    });
  };

  const chooseStoreMove = (choice) => {
    setKidsData((current) => {
      const amount = Math.min(5, current.balance);

      if (amount <= 0) {
        return current;
      }

      if (choice === 'save') {
        const quest = current.quests.find((item) => item.saved < item.target);

        if (!quest) {
          return current;
        }

        const saveAmount = Math.min(amount, quest.target - quest.saved);

        if (saveAmount <= 0) {
          return current;
        }

        return {
          ...current,
          balance: current.balance - saveAmount,
          quests: current.quests.map((item) =>
            item.id === quest.id
              ? { ...item, saved: item.saved + saveAmount }
              : item,
          ),
          activity: [
            addActivity({
              amount: saveAmount,
              label: `Chore Store saved for ${quest.name}`,
              type: 'out',
            }),
            ...current.activity,
          ],
        };
      }

      const labels = {
        donate: 'Chore Store donation',
        spend: 'Chore Store spending choice',
      };

      return {
        ...current,
        balance: current.balance - amount,
        activity: [
          addActivity({
            amount,
            label: labels[choice],
            type: 'out',
          }),
          ...current.activity,
        ],
      };
    });
  };

  return (
    <main className="kids-shell">
      <nav className="kids-nav" aria-label="Kids portal navigation">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft size={18} />
          Switch Portal
        </button>
        <span className="kids-brand">BudgetHQ Kids</span>
        <button
          className="back-button tour-launch-button"
          onClick={onStartTour}
          type="button"
        >
          <Sparkles size={17} />
          Tour
        </button>
      </nav>

      <section className="money-box" aria-labelledby="kids-title">
        <div>
          <p className="eyebrow">Your Money Box</p>
          <h1 id="kids-title">Hi, money saver.</h1>
          <p>Keep some cash ready, and send a little toward your quests.</p>
        </div>
        <div
          className="piggy-balance"
          aria-label={`Available balance ${formatMoney(kidsData.balance)}`}
        >
          <PiggyBank size={44} strokeWidth={2.1} />
          <span>{formatMoney(kidsData.balance)}</span>
          <small>ready to use</small>
        </div>
      </section>

      <section className="lesson-banner" aria-label="Money lesson">
        <strong>Money lesson</strong>
        <span>
          Keep some money ready for now, and move some toward later. BudgetHQ
          shows both choices.
        </span>
      </section>

      <section className="kids-starter-strip" aria-label="Kids starter steps">
        <article>
          <span className="module-icon">
            <BadgeDollarSign size={18} aria-hidden="true" />
          </span>
          <div>
            <strong>1. Add money</strong>
            <small>Start with the real amount in the money box.</small>
          </div>
        </article>
        <article>
          <span className="module-icon">
            <PiggyBank size={18} aria-hidden="true" />
          </span>
          <div>
            <strong>2. Make a quest</strong>
            <small>Pick one thing you want to save for.</small>
          </div>
        </article>
        <article>
          <span className="module-icon">
            <Gift size={18} aria-hidden="true" />
          </span>
          <div>
            <strong>3. Earn rewards</strong>
            <small>
              Complete chores or claim allowance when they are ready.
            </small>
          </div>
        </article>
      </section>

      <AchievementShelf
        badges={kidsAchievementBadges}
        id="kids-achievements"
        tone="kids"
      />

      <section
        className="kids-setup-panel kids-action-panel"
        aria-label="Your money choices"
      >
        <div className="setup-heading">
          <div>
            <p className="eyebrow">Your Choices</p>
            <h2>Choose what to do with your money</h2>
          </div>
          <span>Record money you receive and pick something to save for.</span>
        </div>
        <div className="setup-grid kids-setup-grid">
          <div className="setup-action">
            <strong>Money I received</strong>
            <label htmlFor="kids-money">Amount</label>
            <input
              id="kids-money"
              min="1"
              onChange={(event) => setMoneyAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={moneyAmount}
            />
            <button disabled={!canAddMoney} onClick={addMoney} type="button">
              Add to My Money Box
            </button>
            <FormMessage
              id="kids-money-message"
              tone={formMessages.money ? 'error' : 'hint'}
            >
              {formMessages.money ||
                (moneyAmount && !canAddMoney
                  ? 'Amount must be greater than zero.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <strong>New savings quest</strong>
            <label htmlFor="quest-name">Quest name</label>
            <input
              id="quest-name"
              onChange={(event) => setQuestName(event.target.value)}
              placeholder="What do you want to save for?"
              type="text"
              value={questName}
            />
            <label htmlFor="quest-target">Target</label>
            <input
              id="quest-target"
              min="1"
              onChange={(event) => setQuestTarget(event.target.value)}
              placeholder="0"
              type="number"
              value={questTarget}
            />
            <label htmlFor="quest-icon">Icon</label>
            <input
              id="quest-icon"
              maxLength="2"
              onChange={(event) => setQuestIcon(event.target.value)}
              placeholder="★"
              type="text"
              value={questIcon}
            />
            <button disabled={!canAddQuest} onClick={addQuest} type="button">
              Add Quest
            </button>
            <FormMessage
              id="quest-message"
              tone={formMessages.quest ? 'error' : 'hint'}
            >
              {formMessages.quest ||
                ((questName || questTarget) && !canAddQuest
                  ? 'Add a quest name and positive target.'
                  : '')}
            </FormMessage>
          </div>
        </div>

        <IncomeAllocationFlow
          amount={moneyAmount || kidsData.allowance?.amount || kidsData.balance}
          variant="kids"
        />
      </section>

      <section className="kids-grid">
        <div className="kids-panel quests-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Savings Quests</p>
              <h2>Follow the path to each goal</h2>
            </div>
            <span>{formatMoney(totalSaved)} saved</span>
          </div>

          <div className="quest-list">
            {kidsData.quests.length > 0 ? (
              kidsData.quests.map((quest) => {
                const progress =
                  quest.target > 0 ? (quest.saved / quest.target) * 100 : 0;

                return (
                  <article className="quest-card" key={quest.id}>
                    <div className="quest-topline">
                      <span className="quest-icon">{quest.icon}</span>
                      <div>
                        <h3>{quest.name}</h3>
                        <p>
                          {formatMoney(quest.saved)} of{' '}
                          {formatMoney(quest.target)} saved
                        </p>
                      </div>
                    </div>
                    <QuestJourneyMap quest={quest} value={progress} />
                    <p className="quest-lesson">{getQuestLesson(quest)}</p>
                    <div className="quest-actions">
                      <button
                        aria-label={`Add $5 to ${quest.name}`}
                        disabled={
                          kidsData.balance <= 0 || quest.saved >= quest.target
                        }
                        onClick={() => moveQuestMoney(quest.id, 'in')}
                        type="button"
                      >
                        <Plus size={16} />
                        Add $5
                      </button>
                      <button
                        aria-label={`Take $5 from ${quest.name}`}
                        disabled={quest.saved <= 0}
                        onClick={() => moveQuestMoney(quest.id, 'out')}
                        type="button"
                      >
                        <Minus size={16} />
                        Take $5
                      </button>
                    </div>
                    <button
                      className="mini-delete-button"
                      onClick={() => deleteQuest(quest.id)}
                      type="button"
                    >
                      Delete Quest
                    </button>
                    <FormMessage id={`quest-message-${quest.id}`} tone="error">
                      {formMessages[`quest-${quest.id}`]}
                    </FormMessage>
                  </article>
                );
              })
            ) : (
              <KidsEmptyState title="No quests yet">
                Create the first savings quest when the kid chooses something to
                save for.
              </KidsEmptyState>
            )}
          </div>
        </div>

        <aside className="kids-side">
          <section className="kids-panel allowance-card">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Your Allowance</p>
                <h2>
                  {kidsData.allowance
                    ? `${formatMoney(kidsData.allowance.amount)} ${kidsData.allowance.cadence}`
                    : 'Not set yet'}
                </h2>
              </div>
              <BadgeDollarSign size={28} />
            </div>
            {kidsData.allowance ? (
              <>
                <p>
                  Next allowance: {kidsData.allowance.next}. Claim it when it is
                  time.
                </p>
                <div className="split-actions">
                  <button
                    disabled={kidsData.allowance.claimed}
                    onClick={claimAllowance}
                    type="button"
                  >
                    {kidsData.allowance.claimed
                      ? 'Allowance Claimed'
                      : 'Claim Allowance'}
                  </button>
                </div>
              </>
            ) : (
              <KidsEmptyState title="No allowance yet">
                An allowance will appear here when it is ready to claim.
              </KidsEmptyState>
            )}
          </section>

          <section
            aria-labelledby="kids-money-chart-title"
            className="kids-panel kids-money-chart-card"
          >
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Money Choices</p>
                <h2 id="kids-money-chart-title">Where your money goes</h2>
              </div>
              <PiggyBank size={28} aria-hidden="true" />
            </div>
            <div className="kids-money-chart">
              {moneyChoiceChart.items.map((item) => (
                <div className="kids-money-chart-row" key={item.id}>
                  <span>
                    <b>{item.label}</b>
                    <strong>{formatMoney(item.value)}</strong>
                  </span>
                  <i aria-hidden="true">
                    <b
                      className={item.id}
                      style={{
                        width: `${(item.value / moneyChoiceChart.maxValue) * 100}%`,
                      }}
                    />
                  </i>
                </div>
              ))}
            </div>
          </section>

          <section className="kids-panel">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Chores</p>
                <h2>Earn rewards</h2>
              </div>
              <BadgeDollarSign size={28} />
            </div>

            <div className="chore-list">
              {kidsData.chores.length > 0 ? (
                kidsData.chores.map((chore) => (
                  <article
                    className={chore.done ? 'chore-row done' : 'chore-row'}
                    key={chore.id}
                  >
                    <span className="chore-icon">{chore.icon}</span>
                    <div>
                      <h3>{chore.task}</h3>
                      <p>+{formatMoney(chore.reward)}</p>
                    </div>
                    <button
                      aria-label={
                        chore.done
                          ? `${chore.task} completed`
                          : `Complete ${chore.task}`
                      }
                      disabled={chore.done}
                      onClick={() => completeChore(chore.id)}
                      type="button"
                    >
                      {chore.done ? <CheckCircle2 size={17} /> : 'I Did This!'}
                    </button>
                  </article>
                ))
              ) : (
                <KidsEmptyState title="No chores yet">
                  Assigned chores will show up here when they are ready.
                </KidsEmptyState>
              )}
            </div>
          </section>

          <section className="kids-panel chore-store">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Chore Store</p>
                <h2>Choose what money does</h2>
              </div>
              <Gift size={28} />
            </div>
            <p>
              Chore money becomes a small choice: save it, spend it, or donate
              it.
            </p>
            <div className="store-choice-list">
              <button
                disabled={!firstOpenQuest || kidsData.balance <= 0}
                onClick={() => chooseStoreMove('save')}
                type="button"
              >
                <PiggyBank size={17} />
                <span>
                  Save $5
                  <small>
                    {firstOpenQuest
                      ? `to ${firstOpenQuest.name}`
                      : 'add a quest first'}
                  </small>
                </span>
              </button>
              <button
                disabled={kidsData.balance <= 0}
                onClick={() => chooseStoreMove('spend')}
                type="button"
              >
                <BadgeDollarSign size={17} />
                <span>
                  Spend $5
                  <small>practice a fun choice</small>
                </span>
              </button>
              <button
                disabled={kidsData.balance <= 0}
                onClick={() => chooseStoreMove('donate')}
                type="button"
              >
                <HeartHandshake size={17} />
                <span>
                  Donate $5
                  <small>share part of a reward</small>
                </span>
              </button>
            </div>
          </section>

          <section className="kids-panel">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Activity</p>
                <h2>Money moves</h2>
              </div>
            </div>

            <div className="kids-activity">
              {kidsData.activity.length > 0 ? (
                kidsData.activity.slice(0, 5).map((item) => (
                  <div className="activity-row" key={item.id}>
                    <span>{item.type === 'in' ? '✨' : '🎯'}</span>
                    <p>{item.label}</p>
                    <strong
                      className={item.type === 'in' ? 'positive' : 'negative'}
                    >
                      {item.type === 'in' ? '+' : '-'}
                      {formatMoney(item.amount)}
                    </strong>
                  </div>
                ))
              ) : (
                <KidsEmptyState title="No activity yet">
                  Money movement will appear after something happens.
                </KidsEmptyState>
              )}
            </div>
          </section>
        </aside>
      </section>
      {showTour ? (
        <KidsTourOverlay onClose={onTourComplete} steps={tourSteps} />
      ) : null}
    </main>
  );
}

export default KidsPortal;
