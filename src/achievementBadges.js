function countMatching(items, predicate) {
  return (Array.isArray(items) ? items : []).filter(predicate).length;
}

export function getMainAchievementBadges({
  activity = [],
  budgetStreak = {},
  goals = [],
} = {}) {
  const contributionCount = goals.reduce(
    (total, goal) =>
      total + (Array.isArray(goal.contributors) ? goal.contributors.length : 0),
    0,
  );
  const paidBillCount = countMatching(activity, (entry) =>
    String(entry.merchant ?? entry.label ?? '')
      .toLowerCase()
      .endsWith(' paid'),
  );

  return [
    {
      detail:
        contributionCount >= 3
          ? 'Three goal contributions made.'
          : `${Math.min(contributionCount, 3)}/3 goal contributions`,
      earned: contributionCount >= 3,
      icon: 'savings',
      id: 'main-saving-streak',
      title: 'Saving Streak',
    },
    {
      detail:
        Number(budgetStreak.best ?? 0) >= 3
          ? 'Three days stayed under pace.'
          : `${Math.min(Number(budgetStreak.best ?? 0), 3)}/3 days under budget`,
      earned: Number(budgetStreak.best ?? 0) >= 3,
      icon: 'budget',
      id: 'main-budget-keeper',
      title: 'Budget Keeper',
    },
    {
      detail:
        paidBillCount > 0
          ? 'A scheduled bill was paid.'
          : 'Pay a scheduled bill',
      earned: paidBillCount > 0,
      icon: 'bill',
      id: 'main-bill-keeper',
      title: 'Bill Keeper',
    },
  ];
}

export function getKidsAchievementBadges({
  activity = [],
  chores = [],
  quests = [],
} = {}) {
  const savingMoveCount = countMatching(activity, (entry) =>
    String(entry.label ?? '')
      .toLowerCase()
      .startsWith('moved to '),
  );
  const completedChores = countMatching(chores, (chore) => Boolean(chore.done));
  const completedQuests = countMatching(
    quests,
    (quest) =>
      Number(quest.target) > 0 && Number(quest.saved) >= Number(quest.target),
  );

  return [
    {
      detail:
        savingMoveCount >= 3
          ? 'Saved toward a quest three times.'
          : `${Math.min(savingMoveCount, 3)}/3 quest deposits`,
      earned: savingMoveCount >= 3,
      icon: 'savings',
      id: 'kids-saving-streak',
      title: 'Saving Streak',
    },
    {
      detail:
        completedChores > 0
          ? 'Completed a chore and earned a reward.'
          : 'Complete a chore',
      earned: completedChores > 0,
      icon: 'chore',
      id: 'kids-chore-champion',
      title: 'Chore Champion',
    },
    {
      detail:
        completedQuests > 0
          ? 'Completed a savings quest.'
          : 'Complete a savings quest',
      earned: completedQuests > 0,
      icon: 'goal',
      id: 'kids-goal-getter',
      title: 'Goal Getter',
    },
  ];
}
