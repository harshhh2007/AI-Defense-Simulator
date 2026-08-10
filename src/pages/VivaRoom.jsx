import {
  BrainCircuit,
  Send,
  Mic,
  RefreshCw,
  Trophy,
  ArrowRight,
  SkipForward,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";

const difficulties = [
  {
    name: "Easy",
    description:
      "Basic concepts and project fundamentals",
  },
  {
    name: "Medium",
    description:
      "Implementation and technical understanding",
  },
  {
    name: "Hard",
    description:
      "Deep reasoning, architecture and optimization",
  },
];

export default function VivaRoom() {
  const navigate = useNavigate();

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [difficulty, setDifficulty] =
    useState(
      localStorage.getItem(
        "vivaDifficulty"
      ) || "Easy"
    );

  const [currentQuestion, setCurrentQuestion] =
    useState(1);

  const totalQuestions = 10;

  const [history, setHistory] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "vivaHistory"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  const projectData =
    localStorage.getItem(
      "projectData"
    ) || "";

  const loadQuestion = async (
    selectedDifficulty = difficulty
  ) => {
    try {
      setLoading(true);
      setResult(null);
      setAnswer("");

      const response =
        await api.post(
          "/viva/question",
          {
            projectData,
            difficulty:
              selectedDifficulty,
          }
        );

      setQuestion(
        response.data.question
      );
    } catch (error) {
      console.error(
        "Question generation error:",
        error
      );

      setQuestion(
        "Unable to generate a question. Please check your AI service and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectData) {
      loadQuestion(difficulty);
    }
  }, []);

  const changeDifficulty = async (
    level
  ) => {
    setDifficulty(level);

    localStorage.setItem(
      "vivaDifficulty",
      level
    );

    await loadQuestion(level);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert(
        "Please write your answer first."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/viva/evaluate",
          {
            projectData,
            question,
            answer,
          }
        );

      const evaluation =
        response.data.result;

      setResult(evaluation);

      const entry = {
        question,
        answer,
        result: evaluation,
        difficulty,
        questionNumber:
          currentQuestion,
      };

      const updatedHistory = [
        ...history,
        entry,
      ];

      setHistory(updatedHistory);

      localStorage.setItem(
        "vivaHistory",
        JSON.stringify(
          updatedHistory
        )
      );
    } catch (error) {
      console.error(
        "Evaluation error:",
        error
      );

      setResult({
        overall_score: 0,
        technical_accuracy: 0,
        communication: 0,
        confidence: 0,
        status: "error",
        feedback:
          "Evaluation failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const skipQuestion = async () => {
    setAnswer(
      "I don't know the answer."
    );

    try {
      setLoading(true);

      const response =
        await api.post(
          "/viva/evaluate",
          {
            projectData,
            question,
            answer:
              "I don't know the answer.",
          }
        );

      const evaluation =
        response.data.result;

      setResult(evaluation);

      const entry = {
        question,
        answer:
          "I don't know the answer.",
        result: evaluation,
        difficulty,
        questionNumber:
          currentQuestion,
      };

      const updatedHistory = [
        ...history,
        entry,
      ];

      setHistory(updatedHistory);

      localStorage.setItem(
        "vivaHistory",
        JSON.stringify(
          updatedHistory
        )
      );
    } catch (error) {
      console.error(error);

      setResult({
        overall_score: 0,
        technical_accuracy: 0,
        communication: 0,
        confidence: 0,
        status: "skipped",
        feedback:
          "Question skipped. Review the correct answer before continuing.",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (
      currentQuestion >=
      totalQuestions
    ) {
      navigate("/results");
      return;
    }

    setCurrentQuestion(
      (previous) =>
        previous + 1
    );

    await loadQuestion(difficulty);
  };

  const progress =
    (currentQuestion /
      totalQuestions) *
    100;

  return (
    <Layout>
      <div className="
      viva-room content
      w-full
      space-y-6
      relative
      -top-[450px]
      max-lg:top-0">
        {/* HEADER */}

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/25 font-bold">
            Examination Mode
          </p>

          <h1 className="text-4xl sm:text-5xl font-black mt-2">
            AI Viva Examination
          </h1>

          <p className="mt-3 text-white/40">
            Your AI examiner will generate
            questions from your project.
          </p>
        </div>

        {/* DIFFICULTY */}

        <section className="glass-floating rounded-[30px] p-5 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
                Question Difficulty
              </p>

              <p className="text-sm text-white/45 mt-1">
                Choose how challenging VivaAI's
                should make your viva.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
              {difficulties.map(
                (item) => {
                  const active =
                    difficulty ===
                    item.name;

                  return (
                    <button
                      key={item.name}
                      onClick={() =>
                        changeDifficulty(
                          item.name
                        )
                      }
                      className={`
                        rounded-2xl
                        px-5
                        py-4
                        text-left
                        border
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-purple-400/30"
                            : "bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.05]"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {item.name}
                        </span>

                        {active && (
                          <CheckCircle2
                            size={16}
                            className="text-purple-400"
                          />
                        )}
                      </div>

                      <p className="mt-1 text-[11px] leading-4 text-white/30">
                        {item.description}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* PROGRESS */}

        <section className="glass-card p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold">
              Question{" "}
              {currentQuestion}{" "}
              <span className="text-white/30">
                / {totalQuestions}
              </span>
            </span>

            <span className="text-xs text-white/40">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="glass-progress">
            <motion.div
              className="glass-progress-bar"
              animate={{
                width: `${progress}%`,
              }}
            />
          </div>
        </section>

        {/* QUESTION */}

        <motion.section
          layout
          className="
            glass-floating
            glass-reflection
            rounded-[34px]
            p-6
            sm:p-9
          "
        >
          <div className="flex items-center gap-4">
            <div className="ai-orb ai-pulse">
              <BrainCircuit size={25} />
            </div>

            <div>
              <h2 className="text-xl font-black">
                AI Examiner
              </h2>

              <p className="text-xs text-white/35">
                Senior Project Reviewer
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles
                size={15}
                className="text-blue-400"
              />

              <span className="text-xs uppercase tracking-widest text-white/30 font-bold">
                Current Question
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={question}
                initial={{
                  opacity: 0,
                  y: 12,
                  filter: "blur(6px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                className="
                  glass-card
                  rounded-[25px]
                  p-6
                  sm:p-8
                  text-lg
                  sm:text-xl
                  font-semibold
                  leading-8
                "
              >
                {loading
                  ? "VivaAI is preparing your question..."
                  : question}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ANSWER */}

        <section className="glass-floating rounded-[34px] p-6 sm:p-9 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">
              Your Answer
            </h2>

            <span className="text-xs text-white/25">
              Explain in your own words
            </span>
          </div>

          <textarea
            rows={8}
            value={answer}
            onChange={(event) =>
              setAnswer(
                event.target.value
              )
            }
            disabled={loading}
            placeholder="Explain your answer here..."
            className="glass-input resize-none min-h-[200px]"
          />

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              className="glass-button"
            >
              <Mic size={17} />
              Voice
            </button>

            <button
              onClick={submitAnswer}
              disabled={loading}
              className="ai-button"
            >
              <Send size={17} />

              {loading
                ? "Evaluating..."
                : "Submit Answer"}
            </button>

            <button
              onClick={skipQuestion}
              disabled={loading}
              className="
                glass-button
                !border-red-500/20
                !text-red-300
              "
            >
              <SkipForward size={17} />
              I Don't Know
            </button>

            <button
              onClick={() =>
                loadQuestion(
                  difficulty
                )
              }
              disabled={loading}
              className="glass-button"
            >
              <RefreshCw size={17} />
              New Question
            </button>
          </div>
        </section>

        {/* RESULT */}

        <AnimatePresence>
          {result && (
            <motion.section
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="
                glass-floating
                rounded-[34px]
                p-6
                sm:p-9
                mt-5
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[15px] bg-yellow-500/10 border border-yellow-400/10 flex items-center justify-center">
                  <Trophy
                    size={21}
                    className="text-yellow-400"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    AI Evaluation
                  </h2>

                  <p className="text-xs text-white/30">
                    Performance analysis
                  </p>
                </div>
              </div>

              {/* SCORE */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
                <ScoreCard
                  label="Overall"
                  value={
                    result.overall_score ??
                    result.score ??
                    0
                  }
                  highlight
                />

                <ScoreCard
                  label="Technical"
                  value={
                    result.technical_accuracy ??
                    0
                  }
                />

                <ScoreCard
                  label="Communication"
                  value={
                    result.communication ??
                    0
                  }
                />

                <ScoreCard
                  label="Confidence"
                  value={
                    result.confidence ??
                    0
                  }
                />
              </div>

              {/* FEEDBACK */}

              <ResultBlock
                title="Feedback"
                icon={Sparkles}
                content={
                  result.feedback ||
                  "No feedback available."
                }
              />

              {/* CORRECT ANSWER */}

              {result.correct_answer && (
                <ResultBlock
                  title="Correct Answer"
                  icon={CheckCircle2}
                  content={
                    result.correct_answer
                  }
                />
              )}

              {/* EXAMPLE */}

              {result.example && (
                <ResultBlock
                  title="Example"
                  icon={BookOpen}
                  content={result.example}
                />
              )}

              {/* REVISION */}

              {result.revision_notes && (
                <ResultBlock
                  title="Revision Notes"
                  icon={BookOpen}
                  content={
                    result.revision_notes
                  }
                />
              )}

              {Array.isArray(
                result.related_topics
              ) &&
                result.related_topics
                  .length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-bold mb-3">
                      Related Topics
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {result.related_topics.map(
                        (topic, index) => (
                          <span
                            key={index}
                            className="
                              px-3
                              py-2
                              rounded-full
                              bg-white/[0.045]
                              border
                              border-white/[0.07]
                              text-xs
                              text-white/50
                            "
                          >
                            {topic}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              <button
                onClick={nextQuestion}
                className="ai-button mt-7"
              >
                {currentQuestion ===
                totalQuestions
                  ? "Finish Viva"
                  : "Next Question"}

                <ArrowRight size={17} />
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

function ScoreCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`
        rounded-2xl
        p-5
        border
        ${
          highlight
            ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-purple-400/15"
            : "bg-white/[0.025] border-white/[0.055]"
        }
      `}
    >
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p
        className={`
          mt-2
          text-3xl
          font-black
          ${
            highlight
              ? "gradient-text"
              : "text-white"
          }
        `}
      >
        {value}
        <span className="text-sm text-white/25">
          /10
        </span>
      </p>
    </div>
  );
}

function ResultBlock({
  title,
  icon: Icon,
  content,
}) {
  return (
    <div className="mt-5 glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon
          size={16}
          className="text-blue-400"
        />

        <p className="text-sm font-bold">
          {title}
        </p>
      </div>

      <p className="text-sm leading-7 text-white/55 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}