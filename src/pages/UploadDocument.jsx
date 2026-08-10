import {
  FileUp,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../services/api";

export default function UploadDocument() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  const upload = async (selected) => {
    if (!selected) return;

    setFile(selected);
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selected
      );

      const response =
        await api.post(
          "/upload/pdf",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      if (response.data?.text) {
        localStorage.setItem(
          "projectData",
          response.data.text
        );

        localStorage.setItem(
          "projectFileName",
          selected.name
        );
      }

      setLoading(false);
    } catch (err) {
      console.error(err);

      setLoading(false);

      setError(
        err.response?.data?.message ||
          "Unable to process the document."
      );
    }
  };

  return (
    <Layout>
      <div className="
      upload-document content
      w-full
      space-y-6
      relative
      -top-[450px]
      max-lg:top-0">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/25 font-bold">
            Document Intelligence
          </p>

          <h1 className="text-4xl sm:text-5xl font-black mt-2">
            Scan your report.
          </h1>

          <p className="mt-3 text-white/40">
            VivaAI will extract your project
            content and use it during your
            examination.
          </p>
        </div>

        <label
          className="
            glass-floating
            glass-reflection
            rounded-[32px]
            min-h-[380px]
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
            accept=".pdf"
            className="hidden"
            onChange={(e) =>
              upload(
                e.target.files?.[0]
              )
            }
          />

          <div className="ai-orb ai-pulse">
            <FileUp size={26} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            {loading
              ? "Scanning document..."
              : file
              ? file.name
              : "Select your project report"}
          </h2>

          <p className="mt-2 text-sm text-white/35">
            PDF files only
          </p>

          {file && !loading && (
            <div className="mt-6 flex items-center gap-2 text-green-400 text-sm font-semibold">
              <CheckCircle2 size={17} />
              Document processed
            </div>
          )}
        </label>

        {error && (
          <div className="glass-card mt-5 p-5 border-red-500/20">
            <p className="text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}

        {file && !loading && !error && (
          <button
            onClick={() =>
              navigate("/viva")
            }
            className="ai-button mt-5 w-full"
          >
            Continue to Viva
            <ArrowRight size={18} />
          </button>
        )}

        <div className="glass-card mt-5 p-6">
          <div className="flex gap-4">
            <FileText
              size={21}
              className="text-blue-400"
            />

            <div>
              <h3 className="font-bold">
                What AI will analyze
              </h3>

              <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-white/40">
                <span>• Project objectives</span>
                <span>• Technologies used</span>
                <span>• Architecture</span>
                <span>• Database design</span>
                <span>• APIs & integrations</span>
                <span>• Technical concepts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}