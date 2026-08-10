import {
  Trophy,
  BrainCircuit,
  MessageCircle,
  Target,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import Layout from "../components/Layout";

export default function Results() {
  const navigate = useNavigate();

  let history = [];

  try {
    history = JSON.parse(
      localStorage.getItem(
        "vivaHistory"
      ) || "[]"
    );
  } catch {
    history = [];
  }

  const scores = history.map(
    (item) =>
      Number(
        item.result?.overall_score ??
          item.result?.score ??
          0
      )
  );

  const average =
    scores.length > 0
      ? scores.reduce(
          (a, b) => a + b,
          0
        ) / scores.length
      : 0;

  const best =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const attempted =
    history.length;

  return (
    <Layout>
      <div className="
      results content
      w-full
      space-y-6
      relative
      -top-[450px]
      max-lg:top-0">
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.2em] text-white/25 font-bold">
            Examination Report
          </p>

          <h1 className="text-4xl sm:text-5xl font-black mt-2">
            Your performance.
          </h1>

          <p className="mt-3 text-white/40">
            Review your viva performance and
            identify the concepts that need
            more preparation.
          </p>
        </div>

        {/* HERO SCORE */}

        <section className="glass-floating glass-reflection rounded-[34px] p-7 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <div className="ai-orb ai-pulse">
                <Trophy size={26} />
              </div>

              <h2 className="text-2xl font-black mt-6">
                Viva Performance
              </h2>

              <p className="text-sm text-white/35 mt-2">
                Based on {attempted} answered
                question
                {attempted === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-xs uppercase tracking-widest text-white/30">
                Average Score
              </p>

              <p className="text-7xl font-black gradient-text score-glow mt-2">
                {average.toFixed(1)}
              </p>

              <p className="text-white/25">
                out of 10
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="grid sm:grid-cols-3 gap-4 mt-5">
          <ResultStat
            icon={Target}
            title="Average"
            value={`${average.toFixed(
              1
            )}/10`}
          />

          <ResultStat
            icon={Trophy}
            title="Best Score"
            value={`${best}/10`}
          />

          <ResultStat
            icon={BrainCircuit}
            title="Questions"
            value={attempted}
          />
        </section>

        {/* HISTORY */}

        <section className="glass-floating rounded-[32px] p-6 sm:p-8 mt-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black">
                Question Review
              </h2>

              <p className="text-xs text-white/30 mt-1">
                Review your answers and AI
                feedback.
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16">
              <BrainCircuit
                size={32}
                className="mx-auto text-white/20"
              />

              <p className="mt-4 text-white/40">
                No viva results yet.
              </p>

              <button
                onClick={() =>
                  navigate("/viva")
                }
                className="ai-button mt-5"
              >
                Start Viva
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(
                (item, index) => {
                  const score =
                    item.result
                      ?.overall_score ??
                    item.result
                      ?.score ??
                    0;

                  return (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.04,
                      }}
                      className="
                        glass-card
                        rounded-2xl
                        p-5
                      "
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold">
                            Question{" "}
                            {index + 1}
                          </p>

                          <h3 className="font-semibold mt-2 leading-6">
                            {item.question}
                          </h3>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-2xl font-black gradient-text">
                            {score}
                          </p>

                          <p className="text-[10px] text-white/25">
                            /10
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/[0.05]">
                        <p className="text-xs text-white/25 mb-1">
                          Your answer
                        </p>

                        <p className="text-sm text-white/45 leading-6">
                          {item.answer ||
                            "No answer provided."}
                        </p>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={() =>
              navigate("/viva")
            }
            className="ai-button"
          >
            <RotateCcw size={17} />
            Practice Again
          </button>

          <button
            onClick={() =>
              navigate(
                "/project-chat"
              )
            }
            className="glass-button"
          >
            <MessageCircle size={17} />
            Discuss Project
          </button>
        </div>
      </div>
    </Layout>
  );
}

function ResultStat({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="glass-card p-6">
      <div className="w-11 h-11 rounded-[15px] bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
        <Icon size={19} />
      </div>

      <p className="text-xs text-white/30 mt-5">
        {title}
      </p>

      <p className="text-2xl font-black mt-1">
        {value}
      </p>
    </div>
  );
}