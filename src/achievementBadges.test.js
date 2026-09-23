import { describe, expect, it } from 'vitest';
import {
  getKidsAchievementBadges,
  getMainAchievementBadges,
} from './achievementBadges.js';

describe('achievement badges', () => {
  it('unlocks Main badges from household activity and streak data', () => {
    const badges = getMainAchievementBadges({
      activity: [{ merchant: 'Electric paid' }],
      budgetStreak: { best: 3 },
      goals: [{ contributors: [{}, {}, {}] }],
    });

    expect(badges.every((badge) => badge.earned)).toBe(true);
  });

  it('unlocks Kids badges from quest deposits, chores, and completed goals', () => {
    const badges = getKidsAchievementBadges({
      activity: [
        { label: 'Moved to Bike' },
        { label: 'Moved to Bike' },
        { label: 'Moved to Bike' },
      ],
      chores: [{ done: true }],
      quests: [{ saved: 25, target: 25 }],
    });

    expect(badges.every((badge) => badge.earned)).toBe(true);
  });
});
