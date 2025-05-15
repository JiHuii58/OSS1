import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  padding: 40px 20px;
  max-width: 600px;
  margin: 60px auto;
  background: radial-gradient(circle at top, #c9d6ff, #e2e2e2);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -100px;
    left: -100px;
    width: 250%;
    height: 250%;
    background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%);
    animation: moveBg 20s linear infinite;
    z-index: 0;
  }

  @keyframes moveBg {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #2d87f0;
  margin-bottom: 25px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 1s ease;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  display: block;
  margin: 15px 0 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  background: rgba(255, 255, 255, 0.6);
  &:focus {
    border-color: #2d87f0;
    box-shadow: 0 0 10px rgba(45, 135, 240, 0.3);
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background: linear-gradient(135deg, #2d87f0, #1b6ed1);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 17px;
  margin-top: 25px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #1b6ed1, #4a90e2);
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 130px;
  height: 130px;
  object-fit: cover;
  border: 5px solid #2d87f0;
  box-shadow: 0 0 18px rgba(45, 135, 240, 0.4);
  transition: 0.4s;
  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
  }
`;

const UploadButton = styled.label`
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: #2d87f0;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  box-shadow: 0 3px 8px rgba(0,0,0,0.3);

  &:hover {
    background: #1b6ed1;
  }
`;

const FileInput = styled.input`
  display: none;
`;
function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      setName(storedUser.name);
      setEmail(storedUser.email);
    }
  }, [navigate]);

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("/uploads/") ? `http://localhost:8081${path}` : path;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      await axios.post(`http://localhost:8081/users/${user.id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Thông tin cá nhân đã được cập nhật!");

      const newProfileImage = imageFile ? `/uploads/${imageFile.name}` : user.profileImage;

      const updatedUser = { ...user, name, email, profileImage: newProfileImage };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreviewImage(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Container>
      <Title>Trang Cá Nhân</Title>
      {user && (
        <InfoBox>
          <AvatarWrapper>
            <Avatar
              src={previewImage || getFullImageUrl(user.profileImage) || "https://via.placeholder.com/120"}
              alt="User Avatar"
            />
            <UploadButton htmlFor="file-input">
              <FaCamera color="#fff" size={16} />
            </UploadButton>
            <FileInput id="file-input" type="file" accept="image/*" onChange={handleImageChange} />
          </AvatarWrapper>

          <div>
            <Label>Tên:</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email:</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile}>Lưu Thay Đổi</Button>
        </InfoBox>
      )}
    </Container>
  );
}

export default Profile;