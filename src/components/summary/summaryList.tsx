import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  name?: string;
}

interface Summary {
  id: number;
  title: string;
  summary: string;
  createdAt: string;
  user?: User;
}

const SummaryList: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/videos/summary/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete");
        }

        setSummaries(summaries.filter((summary) => summary.id !== id));

        Swal.fire("Deleted!", "Your summary has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete the summary.", "error");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/videos/summaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data: any) => {
          setSummaries(data?.data.videos);

          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading)
    return (
      <div className="text-center text-muted mt-5">Loading summaries...</div>
    );

  if (error)
    return <div className="alert alert-danger text-center">Error: {error}</div>;

  return (
    <div className="container mt-2">
      <h2 className="mb-4 color-primary">Lecture Summaries</h2>

      {summaries.length === 0 ? (
        <div className="alert alert-info">No summaries found.</div>
      ) : (
        <div className="row">
          {summaries.map((summary) => (
            <div key={summary.id} className="col-md-4 mb-4">
              <div
                className="card shadow-sm h-100 summary-card"
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => navigate(`/summery/${summary.id}`)}
              >
                <button
                  className="btn btn-danger btn-sm"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 10,
                  }}
                  onClick={(e) => handleDelete(summary.id, e)}
                  title="Delete summary"
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
                <div className="card-body">
                  <p className="bold font-size-16px">{summary.title}</p>
                  <small className="text-muted">
                    {new Date(summary.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryList;
