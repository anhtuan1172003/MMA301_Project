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
                setError("Email không tồn tại trong hệ thống");
                return;
            }

            setUserId(user.id);
            const code = generateResetCode();
            setGeneratedCode(code);

            await sendResetCodeEmail(email, code);

            setSuccess("Mã xác nhận đã được gửi đến email của bạn");
            setShowCodeInput(true);
        } catch (error) {
            console.error("Lỗi trong handleSubmit:", error);
            setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const sendResetCodeEmail = async (email, resetCode) => {
        try {
            console.log("Đang gửi email với thông tin:", { email, resetCode });
            const verifyMessage = `Mã xác nhận của bạn là ${resetCode}\nVui lòng nhập mã này để đặt lại mật khẩu.`;
            const response = await emailjs.send(
                "service_c7gfj15", // Service ID từ Register
                "template_kiwvwgw", // Template ID từ Register
                {
                    to_email: email,
                    code: verifyMessage,
                },
                "b1-fjcU3V1tkyr56I" // Public Key từ Register
            );
            console.log("Gửi email thành công:", response);
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            throw new Error("Không thể gửi email mã xác nhận");
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

                setSuccess(`Đặt lại mật khẩu thành công. Mật khẩu mới của bạn là: ${newPassword}`);
                // Bỏ dòng setTimeout để không tự nhảy về trang login
            } catch (error) {
                console.error("Lỗi khi cập nhật mật khẩu:", error);
                setError("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.");
            }
        } else {
            setError("Mã xác nhận không đúng. Vui lòng thử lại.");
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh", paddingTop: "20px" , paddingBottom: "20px"}}>
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <h2 style={{ color: "#007bff" }} className="text-center mt-3">Quên mật khẩu</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    {!showCodeInput ? (
                        <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Gửi mã xác nhận
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleCodeSubmit} className="mt-3 bg-light p-4 rounded shadow-sm">
                            <Form.Group className="mb-3">
                                <Form.Label>Nhập mã xác nhận từ email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập mã xác nhận"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Xác nhận và đặt lại mật khẩu
                            </Button>
                        </Form>
                    )}
                    <div className="text-center mt-3">
                        <p>
                            <Link to="/auth/login">Quay lại đăng nhập</Link>
                        </p>
                        <Link to="/">Về trang chủ</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
