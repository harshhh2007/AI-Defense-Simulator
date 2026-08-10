export function generateAnalytics(
  history
) {
  const totalQuestions =
    history.length;

  const totalScore =
    history.reduce(
      (sum, item) =>
        sum + (item.score || 0),
      0
    );

  const averageScore =
    totalQuestions > 0
      ? (
          totalScore /
          totalQuestions
        ).toFixed(1)
      : 0;

  const skippedQuestions =
    history.filter(
      (q) =>
        q.status === "skipped"
    ).length;

  const weakTopics = [];
  const strongTopics = [];

  history.forEach((item) => {
    if (
      item.score <= 4
    ) {
      weakTopics.push(
        ...(item.topics || [])
      );
    }

    if (
      item.score >= 8
    ) {
      strongTopics.push(
        ...(item.topics || [])
      );
    }
  });

  return {
    totalQuestions,
    totalScore,
    averageScore,
    skippedQuestions,

    weakTopics: [
      ...new Set(weakTopics),
    ],

    strongTopics: [
      ...new Set(
        strongTopics
      ),
    ],
  };
}