import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xác minh tài khoản...");
  const code = searchParams.get("code");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get("http://localhost:8081/users/verify", {
          params: { code }, // Gửi mã xác minh qua query params
        });
        setMessage(res.data);
        toast.success("Tài khoản đã được xác minh thành công!");
      } catch (err) {
        const msg = err.response?.data || "Mã xác minh không hợp lệ hoặc đã hết hạn.";
        setMessage(msg);
        toast.error(msg);
      }
    };

    if (code) verify();
    else setMessage("Thiếu mã xác minh trong liên kết.");
  }, [code]);

  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h2>{message}</h2>
      <a href="/login">Quay lại đăng nhập</a>
    </div>
  );
};

export default VerifyPage;
