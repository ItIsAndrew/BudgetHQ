import {
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  Minus,
  PiggyBank,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const startingState = {
  balance: 0,
  allowance: null,
  quests: [],
  chores: [],
  activity: [],
};

const allowanceScheduleOptions = ['Daily', 'Weekly', 'Every 2 weeks', 'Monthly'];

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount);
}

function createKidsId(label) {
  const slug = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'item';
  return `${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ensureKidsItemId(item, labelKey) {
  if (!item || typeof item !== 'object') {
    return item;
  }

  if (item.id) {
    return item;
  }

  const label = String(item[labelKey] ?? item.label ?? item.name ?? item.task ?? 'item');
  return { ...item, id: createKidsId(label) };
}

function normalizeKidsData(data, fallback) {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  return {
    ...fallback,
    ...data,
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

function ProgressBar({ color, value }) {
  return (
    <span className="kids-progress" aria-hidden="true">
      <span style={{ background: color, width: `${Math.min(value, 100)}%` }} />
    </span>
  );
}

function getQuestLesson(quest) {
  if (quest.target <= 0) {
    return 'Pick a target amount to see how each move changes progress.';
  }

  const nextFive = Math.min(5, quest.target - quest.saved);
  const currentProgress = Math.round((quest.saved / quest.target) * 100);
  const nextProgress = Math.round(((quest.saved + nextFive) / quest.target) * 100);

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
  const visualClass = step.visual ? ` ${step.visual}` : '';

  return (
    <div className={`tour-visual kids-tour-visual${visualClass}`} aria-label="Kids portal preview">
      <div className="tour-pointer">
        <span />
        <strong>{step.pointer}</strong>
      </div>
      <div className="tour-preview-shell">
        <span className="tour-preview-nav" />
        <span className="tour-preview-hero" />
        <span className="tour-preview-balance" />
        <span className="tour-preview-meter" />
        <span className="tour-preview-card card-one" />
        <span className="tour-preview-card card-two" />
        <span className="tour-preview-card card-three" />
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

  return (
    <div className="tour-backdrop kids-tour-backdrop" role="presentation">
      <section aria-label="Kids tour" aria-modal="true" className="tour-card kids-tour-card" role="dialog">
        <div className="tour-progress" aria-hidden="true">
          {steps.map((step, index) => (
            <span className={index <= stepIndex ? 'active' : ''} key={step.title} />
          ))}
        </div>
        <KidsTourVisual step={currentStep} />
        <p className="eyebrow">Kids Tour</p>
        <h2>{currentStep.title}</h2>
        <p>{currentStep.body}</p>
        <div className="tour-actions">
          <button className="tour-secondary" onClick={closeTour} type="button">
            Skip
          </button>
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
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  );
}

function KidsPortal({ onBack, onStartTour, onTourComplete, showTour, tourSteps }) {
  const [kidsData, setKidsData] = useStoredKidsState('budgethq-kids-data', startingState);
  const [moneyAmount, setMoneyAmount] = useState('');
  const [questName, setQuestName] = useState('');
  const [questTarget, setQuestTarget] = useState('');
  const [questIcon, setQuestIcon] = useState('');
  const [choreName, setChoreName] = useState('');
  const [choreReward, setChoreReward] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState('');
  const [allowanceCadence, setAllowanceCadence] = useState('Weekly');
  const [formMessages, setFormMessages] = useState({});

  const hasPositiveAmount = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0;
  };

  const canAddMoney = hasPositiveAmount(moneyAmount);
  const canAddQuest = questName.trim() && hasPositiveAmount(questTarget);
  const canAddChore = choreName.trim() && hasPositiveAmount(choreReward);
  const canSetAllowance = hasPositiveAmount(allowanceAmount);

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

  const addChore = () => {
    const reward = Number(choreReward);

    if (!choreName.trim() || !hasPositiveAmount(choreReward)) {
      setFormMessage('chore', 'Enter a chore and positive reward.');
      return;
    }

    clearFormMessage('chore');
    setKidsData((current) => ({
      ...current,
      chores: [
        {
          done: false,
          icon: '✓',
          id: createKidsId(choreName),
          reward,
          task: choreName.trim(),
        },
        ...current.chores,
      ],
    }));
    setChoreName('');
    setChoreReward('');
  };

  const setAllowance = () => {
    const amount = Number(allowanceAmount);

    if (!hasPositiveAmount(allowanceAmount)) {
      setFormMessage('allowance', 'Enter a positive allowance amount.');
      return;
    }

    clearFormMessage('allowance');
    setKidsData((current) => ({
      ...current,
      allowance: {
        amount,
        cadence: allowanceCadence,
        claimed: false,
        next: 'Next allowance day',
      },
    }));
    setAllowanceAmount('');
    setAllowanceCadence('Weekly');
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
        balance: direction === 'in' ? current.balance - amount : current.balance + amount,
        quests: current.quests.map((item) =>
          item.id === questId
            ? { ...item, saved: item.saved + (direction === 'in' ? amount : -amount) }
            : item,
        ),
        activity: [
          addActivity({
            amount,
            label: direction === 'in' ? `Moved to ${quest.name}` : `Moved back from ${quest.name}`,
            type: direction === 'in' ? 'out' : 'in',
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
        <div className="kids-nav-actions">
          <button className="back-button tour-launch-button" onClick={onStartTour} type="button">
            <Sparkles size={17} />
            Tour
          </button>
          <span className="kids-brand">BudgetHQ Kids</span>
        </div>
      </nav>

      <section className="money-box" aria-labelledby="kids-title">
        <div>
          <p className="eyebrow">Your Money Box</p>
          <h1 id="kids-title">Hi, money saver.</h1>
          <p>Keep some cash ready, and send a little toward your quests.</p>
        </div>
        <div className="piggy-balance" aria-label={`Available balance ${formatMoney(kidsData.balance)}`}>
          <PiggyBank size={44} strokeWidth={2.1} />
          <span>{formatMoney(kidsData.balance)}</span>
          <small>ready to use</small>
        </div>
      </section>

      <section className="lesson-banner" aria-label="Money lesson">
        <strong>Money lesson</strong>
        <span>
          Keep some money ready for now, and move some toward later. BudgetHQ shows both choices.
        </span>
      </section>

      <section className="kids-setup-panel" aria-label="Kids setup">
        <div className="setup-heading">
          <p className="eyebrow">Setup</p>
          <h2>Add the kid's real items</h2>
        </div>
        <div className="setup-grid kids-setup-grid">
          <div className="setup-action">
            <label htmlFor="kids-money">Money box amount</label>
            <input
              id="kids-money"
              min="1"
              onChange={(event) => setMoneyAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={moneyAmount}
            />
            <button disabled={!canAddMoney} onClick={addMoney} type="button">Add Money</button>
            <FormMessage id="kids-money-message" tone={formMessages.money ? 'error' : 'hint'}>
              {formMessages.money ||
                (moneyAmount && !canAddMoney ? 'Amount must be greater than zero.' : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="quest-name">Quest name</label>
            <input
              id="quest-name"
              onChange={(event) => setQuestName(event.target.value)}
              placeholder="What are they saving for?"
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
            <button disabled={!canAddQuest} onClick={addQuest} type="button">Add Quest</button>
            <FormMessage id="quest-message" tone={formMessages.quest ? 'error' : 'hint'}>
              {formMessages.quest ||
                ((questName || questTarget) && !canAddQuest
                  ? 'Add a quest name and positive target.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="chore-name">Chore</label>
            <input
              id="chore-name"
              onChange={(event) => setChoreName(event.target.value)}
              placeholder="Task name"
              type="text"
              value={choreName}
            />
            <label htmlFor="chore-reward">Reward</label>
            <input
              id="chore-reward"
              min="1"
              onChange={(event) => setChoreReward(event.target.value)}
              placeholder="0"
              type="number"
              value={choreReward}
            />
            <button disabled={!canAddChore} onClick={addChore} type="button">Add Chore</button>
            <FormMessage id="chore-message" tone={formMessages.chore ? 'error' : 'hint'}>
              {formMessages.chore ||
                ((choreName || choreReward) && !canAddChore
                  ? 'Add a chore and positive reward.'
                  : '')}
            </FormMessage>
          </div>

          <div className="setup-action">
            <label htmlFor="allowance-amount">Allowance</label>
            <input
              id="allowance-amount"
              min="1"
              onChange={(event) => setAllowanceAmount(event.target.value)}
              placeholder="0"
              type="number"
              value={allowanceAmount}
            />
            <label htmlFor="allowance-cadence">Schedule</label>
            <select
              id="allowance-cadence"
              onChange={(event) => setAllowanceCadence(event.target.value)}
              value={allowanceCadence}
            >
              {allowanceScheduleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button disabled={!canSetAllowance} onClick={setAllowance} type="button">Set Allowance</button>
            <FormMessage id="allowance-message" tone={formMessages.allowance ? 'error' : 'hint'}>
              {formMessages.allowance ||
                (allowanceAmount && !canSetAllowance
                  ? 'Allowance must be greater than zero.'
                  : '')}
            </FormMessage>
          </div>
        </div>
      </section>

      <section className="kids-grid">
        <div className="kids-panel quests-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Savings Quests</p>
              <h2>Pick what you are saving for</h2>
            </div>
            <span>{formatMoney(totalSaved)} saved</span>
          </div>

          <div className="quest-list">
            {kidsData.quests.length > 0 ? (
              kidsData.quests.map((quest) => {
                const progress = quest.target > 0 ? (quest.saved / quest.target) * 100 : 0;

                return (
                  <article className="quest-card" key={quest.id}>
                    <div className="quest-topline">
                      <span className="quest-icon">{quest.icon}</span>
                      <div>
                        <h3>{quest.name}</h3>
                        <p>
                          {formatMoney(quest.saved)} of {formatMoney(quest.target)} saved
                        </p>
                      </div>
                    </div>
                    <ProgressBar color={quest.color} value={progress} />
                    <p className="quest-lesson">{getQuestLesson(quest)}</p>
                    <div className="quest-actions">
                      <button
                        aria-label={`Add $5 to ${quest.name}`}
                        onClick={() => moveQuestMoney(quest.id, 'in')}
                        type="button"
                      >
                        <Plus size={16} />
                        Add $5
                      </button>
                      <button
                        aria-label={`Take $5 from ${quest.name}`}
                        onClick={() => moveQuestMoney(quest.id, 'out')}
                        type="button"
                      >
                        <Minus size={16} />
                        Take $5
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <KidsEmptyState title="No quests yet">
                Create the first savings quest when the kid chooses something to save for.
              </KidsEmptyState>
            )}
          </div>
        </div>

        <aside className="kids-side">
          <section className="kids-panel allowance-card">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Allowance Autopilot</p>
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
                  Next allowance is set for {kidsData.allowance.next}. This prototype lets you claim it once.
                </p>
                <button disabled={kidsData.allowance.claimed} onClick={claimAllowance} type="button">
                  {kidsData.allowance.claimed ? 'Allowance Claimed' : 'Claim Allowance'}
                </button>
              </>
            ) : (
              <KidsEmptyState title="No allowance yet">Set an allowance schedule to turn this on.</KidsEmptyState>
            )}
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
                  <article className={chore.done ? 'chore-row done' : 'chore-row'} key={chore.id}>
                    <span className="chore-icon">{chore.icon}</span>
                    <div>
                      <h3>{chore.task}</h3>
                      <p>+{formatMoney(chore.reward)}</p>
                    </div>
                    <button
                      aria-label={chore.done ? `${chore.task} completed` : `Complete ${chore.task}`}
                      disabled={chore.done}
                      onClick={() => completeChore(chore.id)}
                      type="button"
                    >
                      {chore.done ? <CheckCircle2 size={17} /> : 'I Did This!'}
                    </button>
                  </article>
                ))
              ) : (
                <KidsEmptyState title="No chores yet">Add a chore to let rewards show up here.</KidsEmptyState>
              )}
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
                    <strong className={item.type === 'in' ? 'positive' : 'negative'}>
                      {item.type === 'in' ? '+' : '-'}
                      {formatMoney(item.amount)}
                    </strong>
                  </div>
                ))
              ) : (
                <KidsEmptyState title="No activity yet">Money movement will appear after something happens.</KidsEmptyState>
              )}
            </div>
          </section>
        </aside>
      </section>
      {showTour ? <KidsTourOverlay onClose={onTourComplete} steps={tourSteps} /> : null}
    </main>
  );
}

export default KidsPortal;
