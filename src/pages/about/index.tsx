import { useState } from 'react';
import { MailOutline, Phone, Language } from '@mui/icons-material';
import { TextField, Button, Grid, Typography, Avatar, Box } from '@mui/material';

const AboutPage = () => {
  const [name] = useState('Heedyomy');
  const [occupation] = useState('학생');
  const [introduction, setIntroduction] = useState(
    '내 소개를 할게 나는 히정이야 내 별명은 히됴미고 나는 ... 음... 노래 듣는 걸 좋아해 ... 😀',
  );
  const [email, setEmail] = useState('info@yourdomain.com');
  const [phoneNumber, setPhoneNumber] = useState('+1 (378) 400-1234');
  const [website, setWebsite] = useState('www.yourdomain.com');
  const [profilePicture, setProfilePicture] = useState('/Profile.jpg');
  const [isEditing, setIsEditing] = useState(false);

  const handleProfilePictureChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleIntroductionChange = event => {
    setIntroduction(event.target.value);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = event => {
    setPhoneNumber(event.target.value);
  };

  const handleWebsiteChange = event => {
    setWebsite(event.target.value);
  };

  const handleEditButtonClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveButtonClick = () => {
    setIsEditing(false);
  };

  return (
    <Grid container justifyContent="center" height="100vh">
      <Grid item>
        <Grid sx={{ display: 'flex', alignItems: 'center', mt: 8 }}>
          <Avatar
            src={profilePicture}
            alt="프로필 사진"
            sx={{
              width: 300,
              height: 300,
              mr: 4,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Box>
            <Typography component="h1" variant="h5">
              {name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {occupation}
            </Typography>
            {isEditing ? (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={3}
                  value={introduction}
                  onChange={handleIntroductionChange}
                />
                <TextField margin="normal" fullWidth value={email} onChange={handleEmailChange} />
                <TextField margin="normal" fullWidth value={phoneNumber} onChange={handlePhoneNumberChange} />
                <TextField margin="normal" fullWidth value={website} onChange={handleWebsiteChange} />
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                <Button variant="contained" onClick={handleSaveButtonClick} sx={{ mt: 2 }}>
                  저장
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1">{introduction}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <MailOutline sx={{ mr: 1 }} />
                  <Typography variant="body2">{email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Phone sx={{ mr: 1 }} />
                  <Typography variant="body2">{phoneNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Language sx={{ mr: 1 }} />
                  <Typography variant="body2">{website}</Typography>
                </Box>
              </>
            )}
            {!isEditing && (
              <Button variant="contained" onClick={handleEditButtonClick} sx={{ mt: 2 }}>
                프로필 편집
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AboutPage;
