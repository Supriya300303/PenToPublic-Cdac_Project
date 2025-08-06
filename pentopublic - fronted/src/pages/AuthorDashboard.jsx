import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Alert,
  Badge,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { fetchAuthorBooks, uploadBook } from "../services/authorService";
import AuthorHeader from "@/components/Header/AuthorHeader";
import Footer from "@/layout/Footer";

// Custom CSS for the new color scheme
const customStyles = `
  .bg-off-white {
    background-color: #f5f5dc; /* Off-white */
  }

  .text-brown {
    color: #4b2c20; /* Dark brown */
  }

  .card-brown-border {
    border-color: #4b2c20 !important;
  }

  .btn-brown {
    background-color: #a0522d; /* Sienna brown */
    border-color: #a0522d;
    color: white;
  }

  .btn-brown:hover {
    background-color: #8b4513; /* Saddle brown */
    border-color: #8b4513;
  }

  .table-brown thead th {
    background-color: #d2b48c; /* Tan */
    color: #4b2c20;
    border-color: #4b2c20;
  }

  .table-brown tbody tr {
    color: #4b2c20;
  }

  .table-brown tbody tr:nth-of-type(odd) {
    background-color: rgba(210, 180, 140, 0.2);
  }

  .form-control-brown {
    border-color: #a0522d;
  }

  .form-control-brown:focus {
    border-color: #8b4513;
    box-shadow: 0 0 0 0.25rem rgba(160, 82, 45, 0.25);
  }
`;

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pdfPath: "",
    frontPageLink: "",
    isFree: true,
    isAudioBook: false,
    audioPath: "",
    categoryIds: [1],
  });

  useEffect(() => {
    if (user?.userId) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const data = await fetchAuthorBooks(user.userId);
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      authorId: user.userId,
    };

    try {
      await uploadBook(payload);
      setUploadSuccess("Book uploaded successfully!");
      setForm({
        title: "",
        description: "",
        pdfPath: "",
        frontPageLink: "",
        isFree: true,
        isAudioBook: false,
        audioPath: "",
        categoryIds: [1],
      });
      fetchBooks();
    } catch (err) {
      setUploadSuccess("Upload failed.");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "warning"; // Pending
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <AuthorHeader />

      <Container fluid className="py-5 bg-off-white">
        <h2 className="mb-4 text-center text-brown">✍️ Author Dashboard</h2>

        {/* Upload Book Section */}
        <Card className="p-4 mb-5 shadow-sm card-brown-border mx-auto" style={{ maxWidth: '800px' }}>
          <h4 className="mb-3 text-brown">📤 Upload New Book</h4>

          {uploadSuccess && (
            <Alert
              variant={
                uploadSuccess.includes("successfully") ? "success" : "danger"
              }
            >
              {uploadSuccess}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-brown">Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="form-control-brown"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-brown">Cover Image URL</Form.Label>
                  <Form.Control
                    name="frontPageLink"
                    value={form.frontPageLink}
                    onChange={handleChange}
                    required
                    className="form-control-brown"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="text-brown">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control-brown"
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-brown">PDF Link</Form.Label>
                  <Form.Control
                    name="pdfPath"
                    value={form.pdfPath}
                    onChange={handleChange}
                    required
                    className="form-control-brown"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {form.isAudioBook && (
                  <Form.Group>
                    <Form.Label className="text-brown">Audio Link</Form.Label>
                    <Form.Control
                      name="audioPath"
                      value={form.audioPath}
                      onChange={handleChange}
                      className="form-control-brown"
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Form.Check
              inline
              type="checkbox"
              name="isFree"
              label="Free Book"
              checked={form.isFree}
              onChange={handleChange}
              className="text-brown"
            />
            <Form.Check
              inline
              type="checkbox"
              name="isAudioBook"
              label="Audio Book"
              checked={form.isAudioBook}
              onChange={handleChange}
              className="text-brown"
            />

            <div className="mt-4">
              <Button type="submit" variant="primary" className="btn-brown">
                🚀 Upload Book
              </Button>
            </div>
          </Form>
        </Card>

        {/* Book List Section */}
        <Card className="p-4 shadow-sm card-brown-border mx-auto" style={{ maxWidth: '800px' }}>
          <h4 className="mb-3 text-brown">📚 Your Uploaded Books</h4>

          {books.length === 0 ? (
            <p className="text-brown">No books uploaded yet.</p>
          ) : (
            <Table striped bordered hover responsive className="table-brown">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.bookId}>
                    <td>{index + 1}</td>
                    <td>{book.title}</td>
                    <td>
                      <Badge bg={getStatusColor(book.status)}>
                        {book.status || "Pending"}
                      </Badge>
                    </td>
                    <td>
                      {book.uploadDate
                        ? new Date(book.uploadDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default AuthorDashboard;