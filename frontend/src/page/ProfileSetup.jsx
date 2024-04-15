import React, { useState, useEffect } from 'react';
import Button from '../component/Button'; // Assuming you have a Button component
import { useNavigate } from 'react-router-dom';
import InputText from "../component/InputText";
import style from "./ProfileSetup.module.css";
import { fetchWithJwt } from '../hooks/fetchWithJwt';


const ProgressBar = ({ progress, currentStep }) => {
  return (
    <div className={style.ProgressBarStyle}>
      <div className={style.FillerStyle} style={{ width: `${progress}%` }}>
        <span className={style.LabelStyle}>{`Page ${currentStep}`}</span>
      </div>
    </div>
  );
};

const AvatarSelector = ({ onSelect, avatars, onUpload, selectedAvatar }) => {
  return (
    <div className={style.avatarSelector}>
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          onClick={() => onSelect(avatar)}
          className={avatar === selectedAvatar ? style.selectedAvatar : style.avatar}
        />
      ))}
      <button
        className={style.avatarAddButton}
        onClick={onUpload}
      >
        +
      </button>
    </div>
  );
};

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const totalSteps = 3;
  // Additional states for form inputs
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    language: '',
    // photo: null,
    tags: []
  });
  const [tags, setTags] = useState([]);

  const nextStep = () => {
    if (currentStep === 1 && (!userInfo.user_name || !userInfo.language)) {
      setError("Please enter a username and select a language.");
      return;
    }
    setError(''); // Clear errors if all validations are passed
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const prevStep = () => {
    setError(''); // Clear errors on going back
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  // useEffect(() => {
  //   const fetchPreferences = async () => {
  //     try {
  //       const response = await fetchWithJwt('/api/v1/user/getPreference', 'GET');
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setTags(data);
  //     } catch (error) {
  //       console.error("Fetching preferences failed:", error);
  //       setError(error.message);
  //     }
  //   };

  //   fetchPreferences();
  // }, [fetchWithJwt]); 

  const handleSubmit = async () => {

    try {
      const response = await fetchWithJwt('/api/v1/user/set_info', 'POST', { userInfo });
      const data = await response.json();
      console.log(data.message);
      if (!data.valid) {
        throw new Error(data.message || "Submission failed, please try again.");
      }
      sessionStorage.setItem('user_name', data.user_name);
      sessionStorage.setItem('language', data.language);
      // Redirect or show success message
      navigate('/explore');
    } catch (error) {
      console.error("Profile setup failed:", error);
      setError(error.message);
    }
  };

  const handleUserInfoChange = (value) => {
    setUserInfo(prev => ({ ...prev, user_name: value }));
    console.log(userInfo);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUserInfo(prev => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value] // Use prev[name] if it exists, otherwise use an empty array
          : prev[name].filter(pref => pref !== value)
      }));
    } else {
      setUserInfo(prev => ({ ...prev, [name]: value }));
      console.log(userInfo);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setUserInfo(prev => ({ ...prev, photo: avatar }));
  };

  // Function to handle avatar upload
  const handleAvatarUpload = () => {
    // Trigger file input to upload an avatar
  };

  let content;
  switch (currentStep) {

    // UserInfoForm

    case 1:
      content = (
        <>
          <div>
            <div className={style.questionnaireIntro}>
              <h2 className={style.introTitle}>Let's Get to Know You!</h2>
              <p className={style.introText}>
                Your answers to the following questions will help us tailor your experience and recommendations. It'll only take a minute!
              </p>
            </div>
            <div className={style.field}>
              <div className={style.questionnaire}>
                <AvatarSelector
                  onSelect={handleAvatarSelect}
                  avatars={['../../boy.png', '../../panda.png', '../../gamer.png', '../../woman.png']}
                  onUpload={handleAvatarUpload}
                  selectedAvatar={selectedAvatar}
                />
                <InputText
                  propmt={"Username"}
                  name={"username"}
                  setting={{ require: true, type: 'text', defaultValue: userInfo.user_name ? userInfo.user_name : ''  }}
                  onChange={handleUserInfoChange}
                />
              </div>

              <div className={style.languagePreference}>
                <p className={style.introText}>Language</p>
                <div className={style.options}>
                  <button
                    name='language'
                    value='zh'
                    onClick={handleChange}
                    className={`${style.btn} ${userInfo.language === 'zh' ? style.activeButton : ""}`}>
                    繁體中文
                  </button>
                  <button
                    name='language'
                    value='en'
                    onClick={handleChange}
                    className={`${style.btn} ${userInfo.language === 'en' ? style.activeButton : ""}`}>
                    English
                  </button>
                </div>
              </div>
              {error && <p className={style.errorMessage}>{error}</p>}
              <Button txt="Next" func={nextStep} />
            </div>
          </div>
        </>
      );
      break;

    // UserPreferencesForm
    case 2:
      content = (
        <>
          <div>
            <h2>Travel Preferences</h2>

            <div className={style.pageButtons}>
              <Button
                txt="Back"
                func={prevStep}
              />
              <Button
                txt="Next"
                func={nextStep}
              />
            </div>
          </div>
        </>
      );
      break;

    case 3:
      content = (
        <>
          <div>
            <h2>Welcome to TripBuddy!</h2>
            <p className={style.introText}>Your profile is all set up. Start exploring now!</p>
            <div className={style.logoContainer}>
                <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
            </div>
            <div className={style.pageButtons}>
              <Button
                txt="Back"
                func={prevStep}
              />
              <Button
                txt="Submit"
                func={handleSubmit}
              />
            </div>
          </div>
        </>
      );
      break;
    default:
      content = null;
  }

  return (
    <div className={style.main}>
      <div className={style.container}>
        <ProgressBar progress={(currentStep / totalSteps) * 100} currentStep={currentStep}></ProgressBar>
        {content}
      </div>
    </div>
  );
};

export default ProfileSetup;
