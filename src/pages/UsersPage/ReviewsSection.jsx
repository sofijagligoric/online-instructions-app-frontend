import React, { useState, useEffect } from "react";
import reviewService from "../../services/review.service";
import "./ReviewsSection.css";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const ReviewsSection = ({ currentUser, role, instructorId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const hasReviewed = reviews.some(
    (r) => r.studentId === currentUser && r.instructorId === instructorId
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewService.getReviewsForInstructor(instructorId);
        const mapped = res.data.map((r) => ({
          id: r.id,
          studentId: r.studentId,
          instructorId: r.instructorId,
          rating: r.rating,
          description: r.description,
          date: new Date(r.timestamp).toISOString().split("T")[0],
        }));
        setReviews(mapped);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [instructorId]);

  const handleSubmit = async () => {
    if (newReview.rating === 0) return;

    try {
      const payload = {
        studentId: currentUser,
        instructorId,
        rating: newReview.rating,
        description: newReview.description,
        timestamp: new Date().toISOString(),
      };

      const res = await reviewService.addReview(payload);

      setReviews((prev) => [
        ...prev,
        {
          id: `${instructorId}-${currentUser}`, 
          studentId: currentUser,
          instructorId,
          rating: newReview.rating,
          description: newReview.description,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewReview({ rating: 0, description: "" });
      setCurrentPage(totalPages);
    } catch (err) {
      console.error("Failed to add review:", err);
    }
  };

const handleDelete = async (review) => {
  try {

    await reviewService.deleteReview(review.instructorId, review.studentId);
    setReviews((prev) =>
      prev.filter(
        (r) =>
          !(
            r.studentId === review.studentId &&
            r.instructorId === review.instructorId
          )
      )
    );
  } catch (err) {
    console.error("Failed to delete review:", err);
  }
};

  return (
    <div className="reviews-section">
      <h3>
        Reviews{" "}
        {avgRating && (
          <span>
            ⭐ {avgRating} ({reviews.length})
          </span>
        )}
      </h3>

      {role === "student" && !hasReviewed && (
        <div className="add-review">
          <h4>Add Review</h4>
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: Number(e.target.value) })
            }
          >
            <option value="0">Select rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Optional description"
            value={newReview.description}
            onChange={(e) =>
              setNewReview({ ...newReview, description: e.target.value })
            }
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      <div className="reviews-list">
        {currentReviews.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-delete-div">
              <p>
                <strong>Rating:</strong> {rev.rating} ⭐
              </p>
              {currentUser === rev.studentId && (
                <Popconfirm
                  title="Are you sure to delete this review?"
                  onConfirm={() => handleDelete(rev)}
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                >
                  <DeleteOutlined
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                  />
                </Popconfirm>
              )}
            </div>
            {rev.description && <p>{rev.description}</p>}
            <small>{rev.date}</small>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="reviews-pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Back
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
