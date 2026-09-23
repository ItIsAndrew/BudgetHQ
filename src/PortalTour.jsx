import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  MousePointer2,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

function PortalTourVisual({ step, theme, workspaceName }) {
  const visualClass = step.visual ? ` tour-step-${step.visual}` : '';
  const StepIcon = step.icon ?? Sparkles;
  const preview = step.preview ?? {};
  const cards = preview.cards ?? [];

  return (
    <div
      aria-label={`${workspaceName} preview`}
      className={`tour-visual portal-tour-visual portal-tour-${theme}${visualClass}`}
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
          <MousePointer2 size={14} aria-hidden="true" />
          Preview
        </span>
      </div>

      <div className="tour-preview-shell">
        <span className="tour-preview-nav">
          {preview.nav ?? `BudgetHQ / ${workspaceName}`}
        </span>
        <span className="tour-preview-hero">
          <strong>{preview.hero?.title ?? workspaceName}</strong>
          <small>{preview.hero?.detail ?? 'A clearer view of your money'}</small>
        </span>
        <span className="tour-preview-balance">
          <strong>{preview.balance?.title ?? 'Your snapshot'}</strong>
          <small>{preview.balance?.detail ?? 'The numbers that matter now'}</small>
        </span>
        <span className="tour-preview-meter">
          <strong>{preview.meter?.title ?? 'Progress'}</strong>
          <small>{preview.meter?.detail ?? 'A useful signal at a glance'}</small>
        </span>
        {cards.slice(0, 3).map((card, index) => (
          <span className={`tour-preview-card card-${['one', 'two', 'three'][index]}`} key={card.title}>
            <strong>{card.title}</strong>
            <small>{card.detail}</small>
          </span>
        ))}
      </div>

      <div className="tour-visual-note">
        <CircleCheck size={17} aria-hidden="true" />
        <span>
          <strong>What to notice</strong>
          {step.outcome}
        </span>
      </div>
    </div>
  );
}

export default function PortalTour({ onClose, steps, theme, workspaceName }) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const titleId = `${theme}-portal-tour-title`;
  const descriptionId = `${theme}-portal-tour-description`;

  useEffect(() => {
    const handleTourKeys = (event) => {
      if (event.key === 'Escape') {
        onClose();
        setStepIndex(0);
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

  const exitTour = () => {
    onClose();
    setStepIndex(0);
  };

  return (
    <div className={`tour-backdrop ${theme}-tour-backdrop`} role="presentation">
      <section
        aria-describedby={descriptionId}
        aria-label={`${workspaceName} tutorial`}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`tour-card ${theme}-tour-card portal-tour-card`}
        role="dialog"
      >
        <header className="tour-card-header">
          <div className="tour-brand">
            <span className="tour-brand-icon">
              <BookOpen size={18} aria-hidden="true" />
            </span>
            <span>
              <small>Guided walkthrough</small>
              <strong>{workspaceName}</strong>
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
              onClick={exitTour}
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
                      <CircleCheck size={15} aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                  <span>{step.label}</span>
                </button>
              ))}
            </nav>
            <div className="tour-rail-tip">
              <Sparkles size={17} aria-hidden="true" />
              <span>
                <strong>Keep it practical</strong>
                Learn one useful move, then try it in the portal.
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
            <PortalTourVisual
              step={currentStep}
              theme={theme}
              workspaceName={workspaceName}
            />
            <div className="tour-card-copy" key={currentStep.title}>
              <p className="eyebrow">{currentStep.eyebrow}</p>
              <h2 id={titleId}>{currentStep.title}</h2>
              <p id={descriptionId}>{currentStep.body}</p>
            </div>
          </div>
        </div>

        <footer className="tour-actions">
          <button className="tour-secondary" onClick={exitTour} type="button">
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
                  exitTour();
                  return;
                }

                setStepIndex((current) => current + 1);
              }}
              type="button"
            >
              {isLastStep ? <CircleCheck size={16} aria-hidden="true" /> : null}
              {isLastStep ? 'Complete tour' : 'Continue'}
              {!isLastStep ? <ArrowRight size={16} aria-hidden="true" /> : null}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
