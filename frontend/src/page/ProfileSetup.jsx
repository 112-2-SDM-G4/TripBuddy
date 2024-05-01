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

const avatars = ['../../1.png', '../../2.png', '../../3.png', '../../4.png', '../../5.png'];

const AvatarSelector = ({ onSelect, avatars, selectedAvatar }) => {
  return (
    <div className={style.avatarSelector}>
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          onClick={() => onSelect(index)}
          className={index === selectedAvatar ? style.selectedAvatar : style.avatar}
        />
      ))}

    </div>
  );
};

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const totalSteps = 3;

  const [userInfo, setUserInfo] = useState({
    user_name: '',
    language: '',
    avatar: null,
    tags: []
  });
  const [tags, setTags] = useState([]);

  const nextStep = () => {
    if (currentStep === 1) {
      if (!userInfo.avatar) {
        setError("Please choose an avatar.");
        return;
      }
      if (!userInfo.user_name || !userInfo.language) {
        setError("Please enter a username and select a language.");
        return;
      }
    }
    setError(''); // Clear errors if all validations are passed
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  // useEffect(() => {
  //   const fetchTags = async () => {
  //     try {
  //       const response = await fetchWithJwt('/api/v1/tag/get_tags', 'GET', { source: "UserProfile" });
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

  //   fetchTags();
  // }, [fetchWithJwt]);

  const handleSubmit = async () => {

    try {
      const response = await fetchWithJwt('/api/v1/user/set_info', 'POST', { userInfo });
      const data = await response.json();
      console.log(data);
      if (!data.valid) {
        throw new Error(data.message || "Submission failed, please try again.");
      }
      const currentSessionData = JSON.parse(sessionStorage.getItem("user") || '{}');
      const updatedUserData = {
        ...currentSessionData,
        user_name: data.user_name,  
      };
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
      localStorage.setItem('language', data.language);

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
          ? [...(prev[name] || []), parseInt(value)]
          : prev[name].filter(tagId => tagId !== parseInt(value))
      }));
    } else {
      setUserInfo(prev => ({ ...prev, [name]: value }));
      console.log(userInfo);
    }
  };

  const handleAvatarSelect = (index) => {
    setSelectedAvatar(index);
    setUserInfo(prev => ({ ...prev, avatar: index + 1 }));
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
                  avatars={avatars}
                  selectedAvatar={selectedAvatar}
                />
                <InputText
                  propmt={"Username"}
                  name={"username"}
                  setting={{ require: true, type: 'text', defaultValue: userInfo.user_name ? userInfo.user_name : '' }}
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
            {/* {tags.map((tagType) => (
              <div key={tagType.type_name_en}>
                <h3>{userInfo.language === 'zh' ? tagType.type_name_zh : tagType.type_name_en}</h3>
                {tagType.option.map((option) => (
                  <label key={option.tag_id}>
                    <input
                      type="checkbox"
                      name="tags"
                      value={option.tag_id}
                      checked={userInfo.tags.includes(option.tag_id)}
                      onChange={handleChange}
                    />
                    {userInfo.language === 'zh' ? option.tag_name_zh : option.tag_name_en}
                  </label>
                ))}
              </div>
            ))} */}
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
