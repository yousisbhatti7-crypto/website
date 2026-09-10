"use client";
import { useState } from "react";
import ThreeBackground from "@/components/ThreeBackground";
import { Search, Sparkles, BookOpen, Clock, ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setArticle(null);

    try {
      const res = await fetch("/api/wiki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (res.ok) {
        setArticle(data);
      } else {
        alert(data.error || "Failed to fetch article.");
      }
    } catch (err) {
      alert("An error occurred while fetching the article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-100 relative font-sans">
      <ThreeBackground />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center my-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> Next-Gen AI Encyclopedia
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Explore Anything in 3D
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Search any topic to generate real-time dynamic Wikipedia pages powered by Gemini AI.
          </p>

          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-2 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search topic (e.g. Black Holes, Quantum Computing)..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500 backdrop-blur-md text-slate-100 placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Generate"}
            </button>
          </form>
        </header>

        {article && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-lg">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white">{article.title}</h2>
                <p className="text-lg text-blue-400 mt-1">{article.subtitle}</p>
              </div>

              {article.sections?.map((sec, idx) => (
                <section key={idx} className="space-y-2">
                  <h3 className="text-2xl font-semibold text-slate-200 border-b border-slate-800 pb-2">
                    {sec.heading}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{sec.content}</p>
                </section>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" /> Quick Facts
                </h4>
                <dl className="space-y-3 text-sm">
                  {article.quick_facts?.map((fact, idx) => (
                    <div key={idx} className="border-b border-slate-700/40 pb-2">
                      <dt className="text-slate-400">{fact.label}</dt>
                      <dd className="font-semibold text-slate-200">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {article.related_topics?.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" /> Related Topics
                  </h4>
                  <ul className="space-y-2">
                    {article.related_topics.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setTopic(item);
                          handleSearch({ preventDefault: () => {} });
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer flex items-center justify-between hover:underline"
                      >
                        {item} <ArrowRight className="w-4 h-4" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}