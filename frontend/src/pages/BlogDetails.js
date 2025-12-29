"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlogById, deleteBlog, likeBlog } from "../services/api"; // update import
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import Spinner from "../components/ui/Spinner";
import "./BlogDetails.css";
import jsPDF from "jspdf";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(null);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const response = await fetchBlogById(id);
        setBlog(response.data);
      } catch (err) {
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      comments: [...prevBlog.comments, newComment],
    }));
  };

  const handleCommentDeleted = (commentId) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      comments: prevBlog.comments.filter(
        (comment) => comment._id !== commentId
      ),
    }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        navigate("/dashboard");
      } catch (err) {
        alert("Failed to delete blog");
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a blog.");
      return;
    }
    try {
      setLikeLoading(true);
      setLikeError(null);
      const res = await likeBlog(blog._id);
      setBlog((prev) => ({
        ...prev,
        likes: res.data.likes,
      }));
    } catch (err) {
      setLikeError(err.message || "Failed to like blog");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!blog) return;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text(blog.title, 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(`By: ${blog.author.name}`, 10, y);

    y += 8;
    doc.text(`Date: ${formatDate(blog.createdAt)}`, 10, y);

    if (blog.tags && blog.tags.length > 0) {
      y += 8;
      doc.text(`Tags: ${blog.tags.join(", ")}`, 10, y);
    }

    // Add summary if exists
    if (blog.summary) {
      y += 8;
      doc.setFont(undefined, "italic");
      doc.text(blog.summary, 10, y);
      doc.setFont(undefined, "normal");
    }

    // Add image if exists
    if (blog.image) {
      try {
        // Load image and convert to base64
        const imageUrl = `${API_URL}${blog.image}`;
        const imgData = await toDataURL(imageUrl);
        y += 10;
        doc.addImage(imgData, "JPEG", 10, y, 60, 40); // x, y, width, height
        y += 45;
      } catch (e) {
        // If image fails to load, skip it
        y += 0;
      }
    }

    // Add content (plain text, strip HTML tags)
    y += 10;
    const plainContent = blog.content.replace(/<[^>]+>/g, "");
    doc.text(plainContent, 10, y, { maxWidth: 190 });

    doc.save(`${blog.title}.pdf`);
  };

  function toDataURL(url) {
    return fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="blog-details-loading">
        <Spinner />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-details-error">
        <h2>Error</h2>
        <p>{error || "Blog not found"}</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-details">
      <article className="blog-content">
        <header className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>

          <div className="blog-meta">
            <span className="blog-date">{formatDate(blog.createdAt)}</span>
            <span className="blog-author">
              By{" "}
              <Link
                to={`/profile/${blog.author._id}`}
                className="blog-author-link"
              >
                {blog.author.name}
              </Link>
            </span>
          </div>

          <div className="blog-like">
            <button
              className="btn btn-like"
              onClick={handleLike}
              disabled={likeLoading}
            >
              👍 {blog.likes ? blog.likes : 0} {likeLoading ? "..." : ""}
            </button>
            {likeError && <span className="like-error">{likeError}</span>}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="blog-actions">
            <button className="btn btn-secondary" onClick={handleExportPDF}>
              Export to PDF
            </button>

            {user && user.id === blog.author._id && (
              <>
                <Link
                  to={`/blogs/edit/${blog._id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </>
            )}
          </div>
        </header>

        {blog.image && (
          <div className="blog-featured-image">
            <img src={`${API_URL}${blog.image}`} alt={blog.title} />
          </div>
        )}

        <div
          className="blog-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </article>

      <section className="blog-comments">
        <CommentForm blogId={blog._id} onCommentAdded={handleCommentAdded} />
        <CommentList
          comments={blog.comments}
          onCommentDeleted={handleCommentDeleted}
        />
      </section>
    </div>
  );
};

export default BlogDetails;
