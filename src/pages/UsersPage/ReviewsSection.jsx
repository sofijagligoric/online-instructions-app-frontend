import React, { useState } from "react";
import "./ReviewsSection.css";

const ReviewsSection = ({
  reviews,
  currentUser,
  instructorId,
  onAddReview,
}) => {
  const [newReview, setNewReview] = useState({ rating: 0, description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const handleSubmit = () => {
    if (newReview.rating === 0) return;

    const review = {
      id: Date.now(),
      studentId: currentUser.id,
      instructorId: instructorId,
      rating: newReview.rating,
      description: newReview.description,
      date: new Date().toISOString().split("T")[0],
    };

    onAddReview(review);
    setNewReview({ rating: 0, description: "" });
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

      {currentUser.role === "student" && (
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
            <p>
              <strong>Rating:</strong> {rev.rating} ⭐
            </p>
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
