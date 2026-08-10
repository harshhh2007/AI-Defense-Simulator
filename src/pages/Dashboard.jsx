import {
  ArrowRight,
  BrainCircuit,
  FileUp,
  MessageCircle,
  Trophy,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Viva",
    text: "Practice realistic technical questions generated from your project.",
    path: "/viva",
  },
  {
    icon: MessageCircle,
    title: "Project AI",
    text: "Discuss your project with an education-focused AI assistant.",
    path: "/project-chat",
  },
  {
    icon: Trophy,
    title: "Performance",
    text: "Understand your technical accuracy, communication and confidence.",
    path: "/results",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const hasProject =
    !!localStorage.getItem("projectData");

  return (
    <Layout>
      <div className="
      dashboard content
      w-full
      space-y-6
      
      relative
      -top-[450px]
      
      max-lg:top-0
      ">
        {/* HERO */}

        <section
          className="
            glass-floating
            glass-reflection
            rounded-[34px]
            p-6
            sm:p-10
            lg:p-14
            overflow-hidden
          "
        >
          <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]" />

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="ai-orb !w-10 !h-10 !rounded-[14px]">
                <Sparkles size={18} />
              </div>

              <span className="text-xs font-bold text-white/50">
                AI-POWERED PROJECT DEFENSE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              Prepare smarter.
              <br />

              <span className="gradient-text">
                Defend confidently.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm sm:text-lg leading-7 text-white/45">
              Upload your project, practice an
              AI-generated viva, discuss your
              project with AI, and understand
              exactly where you need to improve.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() =>
                  navigate(
                    hasProject
                      ? "/viva"
                      : "/upload"
                  )
                }
                className="ai-button"
              >
                <BrainCircuit size={18} />

                {hasProject
                  ? "Start Viva"
                  : "Upload Project"}

                <ArrowRight size={17} />
              </button>

              <button
                onClick={() =>
                  navigate("/upload")
                }
                className="glass-button"
              >
                <FileUp size={18} />
                Upload Project
              </button>
            </div>
          </div>
        </section>

        {/* STATUS */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat
            icon={ShieldCheck}
            label="Defense Mode"
            value="Active"
          />

          <Stat
            icon={Zap}
            label="AI Engine"
            value="VivaAI"
          />

          <Stat
            icon={Trophy}
            label="Project Status"
            value={
              hasProject
                ? "Ready"
                : "Not Uploaded"
            }
          />
        </section>

        {/* FEATURES */}

        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25 font-bold">
                Your Workspace
              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Everything you need.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map(
              (feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.button
                    key={feature.title}
                    onClick={() =>
                      navigate(
                        feature.path
                      )
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.08,
                    }}
                    className="
                      glass-card
                      glass-reflection
                      text-left
                      p-6
                      group
                      cursor-pointer
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div className="ai-orb !w-12 !h-12 !rounded-[16px]">
                        <Icon size={21} />
                      </div>

                      <ArrowRight
                        size={18}
                        className="
                          text-white/20
                          group-hover:text-white
                          group-hover:translate-x-1
                          transition
                        "
                      />
                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {feature.text}
                    </p>
                  </motion.button>
                );
              }
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-[15px] bg-white/[0.055] border border-white/[0.07] flex items-center justify-center">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs text-white/30">
          {label}
        </p>

        <p className="mt-1 font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}