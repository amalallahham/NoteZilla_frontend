import { useState } from "react";
import "../../assets/styles/summery.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type TranscriptSection = {
  heading: string;
  points: string[];
};

type TranscriptSummaryObject = {
  title?: string;
  sections?: TranscriptSection[];
};

type SummeryProps = {
  data: {
    message?: string;
    id?: number;
    title?: string;
    videoUrl?: string;
    transcript?: string;
    transcriptLength?: number;
    apiCalls?: number;
    remainingCalls?: number;
    transcriptSummary?: string | TranscriptSummaryObject;
  };
};

const Summery = ({ data }: SummeryProps) => {
  const navigate = useNavigate();

  const [openTranscript, setOpenTranscript] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(data.title || "");
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { token } = useAuth();

  const summaryObject =
    typeof data.transcriptSummary === "object" &&
    data.transcriptSummary !== null
      ? (data.transcriptSummary as TranscriptSummaryObject)
      : null;

  const handleSaveTitle = async () => {
    if (!data.id) {
      return;
    }

    try {
      setIsSavingTitle(true);
      setSaveError(null);

      const response = await fetch(`/api/summaries/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editableTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to update title");
      }


      setIsEditingTitle(false);
    } catch (err: any) {
      console.error(err);
      setSaveError("Could not save title. Please try again.");
    } finally {
      setIsSavingTitle(false);
    }
  };

  console.log("Summary data:", data.transcriptSummary);

  return (
    <>
      <div className="dashed p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="mb-4">
            <h3 className="extraBold mb-3">Upload Successful!</h3>

            {data?.title && (
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="w-100">
                    {isEditingTitle ? (
                      <input
                        type="text"
                        className="form-control d-inline-block"
                        value={editableTitle}
                        onChange={(e) => setEditableTitle(e.target.value)}
                      />
                    ) : (
                      <span className="bold">{editableTitle}</span>
                    )}
                  </div>

                  {!isEditingTitle ? (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn border-0 btn-sm d-flex text-white align-items-center gap-1"
                        onClick={() => setIsEditingTitle(true)}
                      >
                        <i className="bi bi-pencil"></i>
                        <span>Edit</span>
                      </button>

                      {/* 🔗 Button to go to /summery/:id */}
                      {data.id && (
                        <button
                          type="button"
                          className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                          onClick={() => navigate(`/summery/${data.id}`)}
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                          <span>Open Page</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-success btn-sm d-flex align-items-center gap-1"
                        onClick={handleSaveTitle}
                        disabled={isSavingTitle}
                      >
                        {isSavingTitle ? (
                          <>
                            <i className="bi bi-arrow-repeat spin"></i>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-lg"></i>
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                        onClick={() => {
                          setEditableTitle(data.title || "");
                          setIsEditingTitle(false);
                          setSaveError(null);
                        }}
                        disabled={isSavingTitle}
                      >
                        <i className="bi bi-x-lg"></i>
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {saveError && (
                  <p className="text-danger small mt-1 mb-0">{saveError}</p>
                )}
              </div>
            )}

            <hr className="mt-3 mb-0" />
          </div>

          {summaryObject && (
            <div className="mb-3">
              <button
                id="summery-btn"
                className="btn d-flex align-items-center justify-content-between gap-2 w-100"
                onClick={() => setOpenSummary((prev) => !prev)}
                data-bs-toggle="collapse"
                data-bs-target="#summaryCollapse"
                aria-expanded={openSummary}
              >
                <span>View Summary</span>
                <i
                  className={`bi bi-chevron-${
                    openSummary ? "up" : "down"
                  } transition-arrow`}
                ></i>
              </button>

              <div
                className={`collapse mt-2 ${openSummary ? "show" : ""}`}
                id="summaryCollapse"
              >
                <div className="card card-body transcript-box">
                  {summaryObject.title && (
                    <pre className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
                      {summaryObject.title}
                    </pre>
                  )}

                  <div>
                    {summaryObject.sections?.map((ele, i) => (
                      <div key={i} className="mb-3">
                        <h5 className="extraBold">{ele.heading}</h5>
                        {ele.points.map((point: string, index: number) => (
                          <p key={index} className="mb-1">
                            - {point}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              id="transcript-btn"
              className="btn  d-flex align-items-center justify-content-between gap-2 w-100"
              onClick={() => setOpenTranscript((prev) => !prev)}
              data-bs-toggle="collapse"
              data-bs-target="#transcriptCollapse"
              aria-expanded={openTranscript}
            >
              <span>View Transcript</span>
              <i
                className={`bi bi-chevron-${
                  openTranscript ? "up" : "down"
                } transition-arrow`}
              ></i>
            </button>

            <div
              className={`collapse mt-2 ${openTranscript ? "show" : ""}`}
              id="transcriptCollapse"
            >
              <div className="card card-body transcript-box">
                {data?.transcript}
              </div>
            </div>
          </div>
        </div>

        {data?.id && (
          <div className="d-flex align-items-center justify-content-center mt-4">
            <button
              className="btn choose-file-btn py-2 px-3 m-3 bold min-width"
              onClick={() => navigate(`/summery/${data.id}`)}
            >
              View Full Summary Page
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 d-flex align-items-end justify-content-center">
        <button
          type="submit"
          className="btn primary-button min-width extraBold mt-3"
        >
          Upload Another Video
        </button>
      </div>
    </>
  );
};

export default Summery;
