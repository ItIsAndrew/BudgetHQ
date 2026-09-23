const allocationProfiles = {
  household: {
    eyebrow: 'Money Flow',
    title: 'Give every income dollar a job',
    sourceLabel: 'Income',
    fallbackAmount: 3200,
    emptyHint: 'Add income or a budget amount to make this flow personal.',
    buckets: [
      {
        id: 'bills',
        label: 'Bills',
        percent: 50,
        detail: 'Rent, utilities, phone, insurance, and subscriptions',
      },
      {
        id: 'spending',
        label: 'Spending',
        percent: 25,
        detail: 'Groceries, gas, household needs, and everyday choices',
      },
      {
        id: 'savings',
        label: 'Savings',
        percent: 15,
        detail: 'Emergency fund, goals, repairs, and future plans',
      },
      {
        id: 'debt',
        label: 'Debt',
        percent: 10,
        detail: 'Cards, loans, and extra payoff above minimums',
      },
    ],
  },
  kids: {
    eyebrow: 'Allowance Flow',
    title: 'Split allowance into simple choices',
    sourceLabel: 'Allowance',
    fallbackAmount: 20,
    emptyHint: 'Add money or set allowance to make this flow personal.',
    buckets: [
      {
        id: 'ready',
        label: 'Ready',
        percent: 20,
        detail: 'Money kept available for small near-term needs',
      },
      {
        id: 'save',
        label: 'Save',
        percent: 40,
        detail: 'Money moving toward a chosen goal',
      },
      {
        id: 'spend',
        label: 'Spend',
        percent: 25,
        detail: 'Fun purchases with a clear limit',
      },
      {
        id: 'share',
        label: 'Share',
        percent: 15,
        detail: 'Giving, helping, or community choices',
      },
    ],
  },
};

function formatAllocationMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount);
}

function getDisplayAmount(amount, fallbackAmount) {
  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount) && numericAmount > 0
    ? Math.round(numericAmount)
    : Math.round(fallbackAmount);
}

function getBucketAllocations(totalAmount, buckets) {
  const rawAllocations = buckets.map((bucket, index) => {
    const rawAmount = (totalAmount * bucket.percent) / 100;

    return {
      id: bucket.id,
      index,
      amount: Math.floor(rawAmount),
      remainder: rawAmount % 1,
    };
  });

  const flooredTotal = rawAllocations.reduce(
    (sum, allocation) => sum + allocation.amount,
    0,
  );
  let dollarsLeft = totalAmount - flooredTotal;

  [...rawAllocations]
    .sort((first, second) => {
      if (second.remainder !== first.remainder) {
        return second.remainder - first.remainder;
      }

      return first.index - second.index;
    })
    .forEach((allocation) => {
      if (dollarsLeft <= 0) {
        return;
      }

      allocation.amount += 1;
      dollarsLeft -= 1;
    });

  return rawAllocations.reduce(
    (allocations, allocation) => ({
      ...allocations,
      [allocation.id]: allocation.amount,
    }),
    {},
  );
}

function IncomeAllocationFlow({ amount, variant = 'household' }) {
  const profile = allocationProfiles[variant] ?? allocationProfiles.household;
  const displayAmount = getDisplayAmount(amount, profile.fallbackAmount);
  const hasRealAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;
  const bucketAllocations = getBucketAllocations(
    displayAmount,
    profile.buckets,
  );

  return (
    <section
      aria-labelledby={`${variant}-allocation-title`}
      className={`income-allocation-flow ${variant}-allocation-flow`}
    >
      <div className="allocation-flow-header">
        <div>
          <p className="eyebrow">{profile.eyebrow}</p>
          <h2 id={`${variant}-allocation-title`}>{profile.title}</h2>
        </div>
        <strong>{formatAllocationMoney(displayAmount)}</strong>
      </div>

      <div className="allocation-flow-body">
        <div className="allocation-source">
          <span>{profile.sourceLabel}</span>
          <strong>{formatAllocationMoney(displayAmount)}</strong>
          <small>
            {hasRealAmount ? 'Based on your current setup.' : profile.emptyHint}
          </small>
        </div>

        <div className="allocation-branches" aria-hidden="true">
          {profile.buckets.map((bucket) => (
            <i className={`allocation-branch ${bucket.id}`} key={bucket.id} />
          ))}
        </div>

        <div className="allocation-buckets">
          {profile.buckets.map((bucket) => {
            const bucketAmount = bucketAllocations[bucket.id];

            return (
              <article
                className={`allocation-bucket ${bucket.id}`}
                key={bucket.id}
              >
                <div>
                  <span>{bucket.label}</span>
                  <strong>{formatAllocationMoney(bucketAmount)}</strong>
                </div>
                <i aria-hidden="true">
                  <b style={{ width: `${bucket.percent}%` }} />
                </i>
                <small>
                  {bucket.percent}% - {bucket.detail}
                </small>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default IncomeAllocationFlow;
