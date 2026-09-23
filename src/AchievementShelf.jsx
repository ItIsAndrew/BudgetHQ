import {
  CalendarClock,
  CheckCircle2,
  Flame,
  PiggyBank,
  Trophy,
} from 'lucide-react';

const achievementIcons = {
  bill: CalendarClock,
  budget: Flame,
  chore: CheckCircle2,
  goal: Trophy,
  savings: PiggyBank,
};

function AchievementShelf({ badges, id, tone = 'main' }) {
  const earnedCount = badges.filter((badge) => badge.earned).length;

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`achievement-shelf achievement-shelf-${tone}`}
    >
      <header className="achievement-shelf-header">
        <div>
          <p>Achievements</p>
          <h2 id={`${id}-title`}>Achievement Shelf</h2>
        </div>
        <span>
          {earnedCount}/{badges.length} earned
        </span>
      </header>

      <div className="achievement-badge-row">
        {badges.map((badge) => {
          const Icon = achievementIcons[badge.icon] ?? Trophy;

          return (
            <article
              aria-label={`${badge.title}: ${badge.earned ? 'earned' : 'locked'}`}
              className={`achievement-badge ${badge.earned ? 'earned' : 'locked'}`}
              key={badge.id}
            >
              <span className="achievement-badge-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <span className="achievement-badge-copy">
                <strong>{badge.title}</strong>
                <small>{badge.detail}</small>
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AchievementShelf;
