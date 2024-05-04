import React, { useState, useEffect } from 'react';
import Button from '../component/Button'; // Assuming you have a Button component
import { useNavigate } from 'react-router-dom';
import InputText from "../component/InputText";
import Tag from "../component/Tag";
import TripSearchDropdown from "../component/TripSearchDropdown";
import style from "./ProfileSetup.module.css";
import { fetchWithJwt } from '../hooks/fetchWithJwt';
import { useLanguage } from "../hooks/useLanguage";


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
  const [userName, setUserName] = useState('');
  const { language, toggleLanguage } = useLanguage();
  const [avatar, setAvatar] = useState(0);
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep === 1) {
      if (!avatar) {
        setError("Please choose an avatar.");
        return;
      }
      if (!userName || !language) {
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

  useEffect(() => {
    getTag();
    return () => { };
  }, []);

  const getTag = () => {
    fetchWithJwt(`/api/v1/tag/get_tags?source=UserProfile`, "GET")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTags(data);

          setAllTags(
            data
              .map((cat) => {
                return cat["options"];
              })
              .flat()
          );
        }
      })
      .catch((error) => {
        setError(error);
        if (error.response) {
          error.response.json().then((errorMessage) => {
            alert(errorMessage.message);
            console.log("Error message:", errorMessage.message);
          });
        } else {
          console.log("Network error:", error.message);
        }
      });
  };

  const handleSubmit = async () => {

    try {
      console.log({
        user_name: userName,
        tags: selectedTag,
        avatar: avatar,
        language: language
      });
      const response = await fetchWithJwt('/api/v1/user/set_info', 'POST', {
        user_name: userName,
        tags: selectedTag,
        avatar: avatar,
        language: language
      });
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


  const handleAvatarSelect = (index) => {
    setSelectedAvatar(index);
    setAvatar(index + 1);
  };

  const handleLanguageChange = (e) => {
    toggleLanguage();
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
                  setting={{ require: true, type: 'text', defaultValue: userName ? userName : '' }}
                  onChange={setUserName}
                />
              </div>

              <div className={style.languagePreference}>
                <p className={style.introText}>Language</p>
                <div className={style.options}>
                  <button
                    name='language'
                    value='zh'
                    onClick={handleLanguageChange}
                    className={`${style.btn} ${language === 'zh' ? style.activeButton : ""}`}>
                    繁體中文
                  </button>
                  <button
                    name='language'
                    value='en'
                    onClick={handleLanguageChange}
                    className={`${style.btn} ${language === 'en' ? style.activeButton : ""}`}>
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
            <div className={style.sharedropdown}>
              <p className={style.introText}>
                Please choose some preferences when you decside to travel. 
              </p>
              <div style={{ marginTop: "1rem" }}>
                {Array.isArray(selectedTag) &&
                  selectedTag.map((tagId) => (
                    <Tag
                      key={tagId}
                      tagId={tagId}
                      text={
                        allTags.find(
                          (tag) => tag["tag_id"] === tagId
                        )[`tag_name_${language}`]
                      }
                      inSearchbox={true}
                      removeFromSearch={() =>
                        setSelectedTag((prev) =>
                          prev.filter((t) => t !== tagId)
                        )
                      }
                    />
                  ))}
              </div>
              <TripSearchDropdown
                allTags={tags ? tags : []}
                addSelectedTagsId={(value) => {
                  setSelectedTag((prev) => {
                    if (prev.includes(value)) {
                      return [...prev];
                    }
                    return [...prev, value];
                  });
                }}
                stylesetting={{
                  height: "fit-content",
                  marginTop: "1rem",
                  position: "relative",
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0 0'
                }}
              />
            </div>
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
