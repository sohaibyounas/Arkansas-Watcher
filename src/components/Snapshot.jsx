import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BASEURL } from "../Constant/API";
import { fadeInLeft, fadeInRight } from "../utils/animations";

function Snapshot() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    comments: "",
    agreeTnC: false,
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: "",
  });

  // Check if all mandatory fields are valid
  const isFormValid = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      emailRegex.test(formData.email) &&
      formData.location.trim() !== "" &&
      formData.agreeTnC &&
      file !== null
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const inputRef = React.useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleLabelClick = (e) => {
    if (!file || e.target.closest(".remove-btn") === null) {
      inputRef.current.click();
    }
  };

  // Validate form (simplified, no error messages)
  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      emailRegex.test(formData.email) &&
      formData.location.trim() !== "" &&
      formData.agreeTnC &&
      file !== null
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("comment", formData.comments);
      formDataToSend.append("snapshot_file_path", file);

      const response = await fetch(`${BASEURL}/main/snapshot/create`, {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        const result = await response.json();

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          location: "",
          comments: "",
          agreeTnC: false,
        });
        setFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }

        setSubmitResult({
          success: true,
          message: result.action || "Snapshot Created Successfully",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitResult({
          success: false,
          message: errorData.message || `Error: ${response.status} ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitResult({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display file name
  const getFileName = () => {
    if (file) return file.name;
    return "Upload a file";
  };

  return (
    <div
      className="min-vh-100 bg-dark bg-cover bg-center text-white overflow-hidden"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-5sjmPiQdV1CPKKM59WeWmC2VKZl7Ln.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container py-5 px-3 px-md-4">
        <div className="row gy-5 align-items-center justify-content-between">
          {/* Left Side Content */}
          <motion.div
            className="col-12 col-lg-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInLeft}
          >
            <h1 className="display-5 fw-bold mb-4">Arkansas Snapshots</h1>
            <p className="mb-4 fs-6 fs-md-5" style={{ color: "#D0CED0" }}>
              Welcome to Arkansas Snapshots, where weather enthusiasts and nature
              lovers alike capture the beauty and drama of Arkansas's skies. Share
              your best photos of sunrises, sunsets, storms, and everything in
              between that showcases the diverse and ever-changing weather of our
              state. Whether it's a serene landscape under a golden sunset or the
              power of a thunderstorm rolling in, Arkansas Snapshots invites you
              to share your perspective and contribute to our community's
              collective weather story. Join us in celebrating Arkansas's natural
              beauty through your lens.
            </p>

            <h2 className="h4 albertbold text-warning mb-3">Accepted</h2>
            <ol className="ps-3 mb-4">
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Weather Focus:</strong>{" "}
                Photos should prominently feature weather phenomena such as
                clouds, rainbows, lightning, fog, snow, or any other significant
                atmospheric conditions.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Location:</strong>{" "}
                Images should clearly indicate they were taken within Arkansas.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Quality:</strong>{" "}
                High-resolution, clear, and engaging images.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Originality:</strong>{" "}
                Submit your own original photographs only.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Safety:</strong>{" "}
                Avoid risky or dangerous situations when capturing images.
              </li>
            </ol>

            <h2 className="h4 fw-semibold text-danger mb-3">Not Accepted</h2>
            <ol className="ps-3 mb-0">
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Inappropriate Content:</strong>{" "}
                No offensive, obscene, or inappropriate images.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Non-Weather Focus:</strong>{" "}
                No unrelated landscapes or subjects.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Poor Quality:</strong>{" "}
                Avoid blurry or overly edited images.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Copyright Violations:</strong>{" "}
                No copyrighted or third-party content.
              </li>
              <li className="mb-2 fs-6 fs-md-5" style={{ color: "#D0CECF" }}>
                <strong className="albertsemibold text-white">Safety Concerns:</strong>{" "}
                No unsafe behavior shown in images.
              </li>
            </ol>
          </motion.div>

          {/* Right Side Form */}
          <motion.div
            className="col-12 col-lg-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInRight}
          >
            <div className="bg-white bg-opacity-25 backdrop-blur rounded-4 p-3 p-sm-4 text-white shadow">
              <h2 className="h4 fw-semibold mb-2">Arkansas Snapshots</h2>
              <p className="mb-4">Please upload photos in a decent manner</p>

              {submitResult.message && (
                <div
                  className={`alert ${
                    submitResult.success ? "alert-success" : "alert-danger"
                  }`}
                >
                  {submitResult.message}
                </div>
              )}

              <form id="snapshotForm">
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      className="form-control bg-transparent text-white border-light"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Cook"
                      className="form-control bg-transparent text-white border-light"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="johncook@gmail.com"
                    className="form-control bg-transparent text-white border-light"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="City, AR"
                    className="form-control bg-transparent text-white border-light"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload Photo</label>
                  <input
                    type="file"
                    id="snapshot_file"
                    className="d-none"
                    ref={inputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div
                    className="border-2 border-light rounded-3 p-2 mt-2 position-relative"
                    style={{
                      height: "160px",
                      borderStyle: "dashed",
                      cursor: file ? "default" : "pointer",
                    }}
                    onClick={file ? null : handleLabelClick}
                  >
                    {file ? (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center position-relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Selected preview"
                          className="img-fluid w-100 h-100 object-fit-cover rounded-3"
                          style={{ animation: "fadeIn 0.3s ease-in-out" }}
                        />
                        <button
                          type="button"
                          className="btn btn-lg d-flex align-items-center justify-content-center btn-danger rounded-circle position-absolute top-0 end-0 remove-btn"
                          onClick={handleRemoveFile}
                          style={{
                            width: "30px",
                            height: "30px",
                            padding: "0 0 2px 0",
                            zIndex: 10,
                          }}
                        >
                          ×
                        </button>
                        <style>
                          {`
                            @keyframes fadeIn {
                              from { opacity: 0; transform: scale(0.9); }
                              to { opacity: 1; transform: scale(1); }
                            }
                          `}
                        </style>
                      </div>
                    ) : (
                      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                        <IoCloudUploadOutline
                          style={{ fontSize: "40px", color: "#B6B6B6" }}
                        />
                        <p
                          className="text-center albertsemibold mb-0 fs-5"
                          style={{ color: "#B9B9B9" }}
                        >
                          Upload a file
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="comments" className="form-label">
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows="4"
                    placeholder="Write your comments..."
                    className="form-control bg-transparent text-white border-light"
                    value={formData.comments}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="agreeTnC"
                    name="agreeTnC"
                    checked={formData.agreeTnC}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label albertmedium"
                    htmlFor="agreeTnC"
                  >
                    I agree with the{" "}
                    <a
                      href="#"
                      className="text-decoration-none albertbold"
                      style={{ color: "#ff5b63" }}
                    >
                      Terms & Conditions
                    </a>
                  </label>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="snapshot-form-btn-submit"
                  className="btn w-100 text-white py-2"
                  style={{ background: "#ff5b63" }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Snapshot;