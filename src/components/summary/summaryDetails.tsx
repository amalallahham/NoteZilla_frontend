import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Section {
  heading: string;
  points: string[];
}

interface ParsedSummary {
  title: string;
  sections: Section[];
}

interface SummaryData {
  id: number;
  title: string;
  transcript: string;
  videoUrl: string;
  summary: ParsedSummary;
  createdAt: string;
}

const SummaryDetails: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  useEffect(() => {
    if (!token || !id) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/videos/summary/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch summary");
        return res.json();
      })
      .then((data) => {
        const video = data.data.video;
        console.log("Fetched summary data:", video);
        setSummary({
          ...video,
          summary: JSON.parse(video.summary),
        });

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  if (loading)
    return <div className="text-center mt-5 text-muted">Loading summary…</div>;

  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  if (!summary)
    return (
      <div className="alert alert-warning text-center mt-5">
        Summary not found
      </div>
    );

  const sections = summary.summary?.sections || [];

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
        <div>
          <h2 className="mb-2 bold">{summary.title}</h2>

          <small className="">
            Uploaded: {new Date(summary.createdAt).toLocaleString()}
          </small>
        </div>
      </div>

      <hr />

      <div className="row mt-3">
        <div className="mb-4">
          <h4 className="mb-0 color-primary bold mb-2">Summary</h4>
        </div>

        <h3>{summary.summary.title}</h3>

        <div className="col-lg-7 mb-4">
          <div className=" shadow-sm h-100">
            <div
              className="card-body"
              style={{ maxHeight: "700px", overflowY: "auto" }}
            >
              {sections.length === 0 ? (
                <p className=" mb-0">No structured summary available.</p>
              ) : (
                sections.map((section, i) => (
                  <div key={i} className="mb-3 p-3 border rounded ">
                    <h5 className="extraBold mb-2">{section.heading}</h5>
                    {section.points.map((point, idx) => (
                      <p key={idx} className="mb-1">
                        • {point}
                      </p>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5 mb-4">
          <div className="card mb-3 shadow-sm">
            <div className="card-header  d-flex justify-content-between align-items-center">
              <span className="bold">Video</span>
            </div>
            <div className="card-body">
              {summary.videoUrl ? (
                <video
                  src={summary.videoUrl}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "420px",
                    borderRadius: "8px",
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="">No video available.</div>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="bold">Transcript</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={() => setShowTranscript((prev) => !prev)}
              >
                <span>{showTranscript ? "Hide" : "Show"}</span>
                <i
                  className={`bi bi-chevron-${showTranscript ? "up" : "down"}`}
                ></i>
              </button>
            </div>
            {showTranscript && (
              <div
                className="card-body"
                style={{ maxHeight: "380px", overflowY: "auto" }}
              >
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                  }}
                  className="mb-0"
                >
                  {summary.transcript}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetails;
