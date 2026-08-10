import {
  Upload,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Layout from "../components/Layout";

export default function UploadProject() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [dragging, setDragging] =
    useState(false);

  const handleFile = (selected) => {
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem(
        "projectData",
        reader.result
      );

      localStorage.setItem(
        "projectFileName",
        selected.name
      );
    };

    reader.readAsText(selected);
  };

  return (
    <Layout>
      <div className="
      upload-project content
      w-full
      space-y-6
      relative
      -top-[450px]
      max-lg:top-0">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/25 font-bold">
            Project Setup
          </p>

          <h1 className="text-4xl sm:text-5xl font-black mt-2">
            Upload your project.
          </h1>

          <p className="mt-3 text-white/40">
            Give VivaAI the project context it
            needs to create your defense.
          </p>
        </div>

        <motion.label
          animate={{
            scale: dragging ? 1.015 : 1,
          }}
          onDragEnter={() =>
            setDragging(true)
          }
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={() =>
            setDragging(false)
          }
          className="
            glass-floating
            glass-reflection
            rounded-[32px]
            min-h-[360px]
            flex
            flex-col
            items-center
            justify-center
            p-8
            text-center
            cursor-pointer
          "
        >
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) =>
              handleFile(
                e.target.files?.[0]
              )
            }
          />

          <div className="ai-orb ai-pulse">
            <Upload size={25} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            {file
              ? file.name
              : "Drop your project here"}
          </h2>

          <p className="mt-2 text-sm text-white/35">
            PDF, DOC, DOCX or TXT
          </p>

          {file && (
            <div className="mt-6 flex items-center gap-2 text-green-400 text-sm font-semibold">
              <CheckCircle2 size={17} />
              Project selected
            </div>
          )}
        </motion.label>

        {file && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() =>
              navigate("/viva")
            }
            className="ai-button mt-5 w-full"
          >
            Continue to Viva
            <ArrowRight size={18} />
          </motion.button>
        )}

        <div className="glass-card mt-5 p-5 flex gap-4">
          <FileText
            size={20}
            className="text-blue-400 shrink-0"
          />

          <div>
            <p className="font-semibold text-sm">
              Your project powers the AI.
            </p>

            <p className="mt-1 text-xs text-white/35 leading-5">
              Viva questions and project
              discussions are generated around
              the information you provide.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}