import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "emailjs-com";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [resetCode, setResetCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const generateResetCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.get("http://localhost:9999/users");
            const users = response.data;
            const user = users.find((u) => u.account.email === email);

            if (!user) {
                setError("Email does not exist in the system");
                return;
            }

            setUserId(user.id);
            const code = generateResetCode();
            setGeneratedCode(code);

            await sendResetCodeEmail(email, code);

            setSuccess("Verification code has been sent to your email");
            setShowCodeInput(true);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError("An error occurred. Please try again later.");
        }
    };

    const sendResetCodeEmail = async (email, resetCode) => {
        try {
            console.log("Sending email with information:", { email, resetCode });
            const verifyMessage = `Your verification code is ${resetCode}\nPlease enter this code to reset your password.`;
            const response = await emailjs.send(
                "service_c7gfj15", // Service ID from Register
                "template_kiwvwgw", // Template ID from Register
                {
                    to_email: email,
                    code: verifyMessage,
                },
                "b1-fjcU3V1tkyr56I" // Public Key from Register
            );
            console.log("Email sent successfully:", response);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Unable to send verification code email");
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (resetCode === generatedCode) {
            try {
                const newPassword = generateResetCode();
                const response = await axios.get(`http://localhost:9999/users/${userId}`);
                const user = response.data;

                user.account.password = newPassword;
                await axios.put(`http://localhost:9999/users/${userId}`, user);

                setSuccess(`Password reset successful. Your new password is: ${newPassword}`);
            } catch (error) {
                console.error("Error updating password:", error);
                setError("An error occurred while resetting the password. Please try again.");
            }
        } else {
            setError("The verification code is incorrect. Please try again.");
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh", paddingTop: "20px", paddingBottom: "20px" }}>
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <h2 style={{ color: "#007bff" }} className="text-center mt-3">Forgot Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    {!showCodeInput ? (
                        <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Send Verification Code
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleCodeSubmit} className="mt-3 bg-light p-4 rounded shadow-sm">
                            <Form.Group className="mb-3">
                                <Form.Label>Enter Verification Code from Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Confirm and Reset Password
                            </Button>
                        </Form>
                    )}
                    <div className="text-center mt-3">
                        <p>
                            <Link to="/auth/login">Back to Login</Link>
                        </p>
                        <Link to="/">Back to Home</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
