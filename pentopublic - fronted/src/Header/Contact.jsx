import React, { useState } from "react";
import { CheckCircle } from "lucide-react"; // For success message icon

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend.
    // For now, we'll simulate a successful submission.
    console.log("Form submitted:", formData);
    setSubmissionStatus('success');
    setFormData({ name: "", email: "", message: "" });

    // Optionally, clear the status after a few seconds
    setTimeout(() => {
      setSubmissionStatus(null);
    }, 3000);
  };

  return (
    <div className="bg-off-white-light dark:bg-brown-dark text-brown-dark dark:text-off-white py-12 px-6 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        
        {submissionStatus === 'success' && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">Thanks for reaching out! We'll get back to you soon.</span>
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">Failed to send message. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg 
              border-brown-300 dark:border-brown-500 focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-200 dark:focus:ring-brown-600
              bg-off-white dark:bg-brown-800 text-brown-dark dark:text-off-white focus:outline-none focus:ring-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg 
              border-brown-300 dark:border-brown-500 focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-200 dark:focus:ring-brown-600
              bg-off-white dark:bg-brown-800 text-brown-dark dark:text-off-white focus:outline-none focus:ring-2"
          />
          <textarea
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg h-32 resize-none
              border-brown-300 dark:border-brown-500 focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-200 dark:focus:ring-brown-600
              bg-off-white dark:bg-brown-800 text-brown-dark dark:text-off-white focus:outline-none focus:ring-2"
          />
          <button
            type="submit"
            className="w-full bg-brown-600 text-white py-2 rounded-xl hover:bg-brown-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
