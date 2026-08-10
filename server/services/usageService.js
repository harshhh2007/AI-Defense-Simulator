/*
=========================================================
VivaAI Token Usage Service
=========================================================
*/

const MONTHLY_TOKEN_LIMIT =
  Number(
    process.env.MONTHLY_TOKEN_LIMIT
  ) || 100000;


let usage = {

  inputTokens: 0,

  outputTokens: 0,

  totalTokens: 0,

};


/*
=========================================================
ADD USAGE
=========================================================
*/

export function addUsage(
  tokenUsage = {}
) {

  const inputTokens =
    Number(
      tokenUsage?.inputTokens
    ) || 0;


  const outputTokens =
    Number(
      tokenUsage?.outputTokens
    ) || 0;


  const totalTokens =
    Number(
      tokenUsage?.totalTokens
    ) ||
    inputTokens +
      outputTokens;


  usage.inputTokens +=
    inputTokens;


  usage.outputTokens +=
    outputTokens;


  usage.totalTokens +=
    totalTokens;


  return getUsageSummary();
}


/*
=========================================================
GET USAGE SUMMARY
=========================================================
*/

export function getUsageSummary() {

  const total =
    usage.totalTokens;


  const remaining =
    Math.max(
      0,
      MONTHLY_TOKEN_LIMIT -
        total
    );


  const percentage =
    MONTHLY_TOKEN_LIMIT > 0
      ? Number(
          (
            (total /
              MONTHLY_TOKEN_LIMIT) *
            100
          ).toFixed(2)
        )
      : 0;


  return {

    inputTokens:
      usage.inputTokens,

    outputTokens:
      usage.outputTokens,

    totalTokens:
      total,

    monthlyLimit:
      MONTHLY_TOKEN_LIMIT,

    remainingTokens:
      remaining,

    percentageUsed:
      percentage,

    limitReached:
      total >=
      MONTHLY_TOKEN_LIMIT,

  };
}


/*
=========================================================
CHECK WHETHER TOKENS ARE AVAILABLE
=========================================================
*/

export function canUseTokens(
  requestedTokens = 0
) {

  const requested =
    Number(
      requestedTokens
    ) || 0;


  return (
    usage.totalTokens +
      requested
  ) <=
    MONTHLY_TOKEN_LIMIT;
}


/*
=========================================================
RESET
=========================================================
*/

export function resetUsage() {

  usage = {

    inputTokens: 0,

    outputTokens: 0,

    totalTokens: 0,

  };


  return getUsageSummary();
}


/*
=========================================================
DEFAULT EXPORT
=========================================================
*/

export default {

  addUsage,

  getUsageSummary,

  canUseTokens,

  resetUsage,

};