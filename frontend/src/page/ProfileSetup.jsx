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

  const words = {
    en: {
      error_for_avatar: "Please choose an avatar.",
      error_for_language: "Please enter a username and select a language.",
      title: "Let's Get to Know You!",
      title_info: "Your answers to the following questions will help us tailor your experience and recommendations. It'll only take a minute!",
      username: 'Username',
      language: 'Language',
      next: 'Next',
      back: 'Back',

      title2: 'Travel Preferences',
      title2_info: 'Please choose some preferences when you decside to travel.',

      title3: 'Welcome to TripBuddy!',
      title3_info: 'Your profile is all set up. Start exploring now!',
      submit: 'Explore'
    },
    zh: {
      error_for_avatar: "請選擇一個頭像",
      error_for_language: '請輸入您的使用者名稱以及選擇您的偏好語言',
      title: "現在讓我們更了解你吧!",
      title_info: "你的回答會幫助我們打造更適合你的推薦旅程，這只需要花一分鐘的時間完成!",
      username: '使用者名稱',
      language: '語言偏好',
      next: '下一步',
      back: '上一步',

      title2: '旅遊偏好',
      title2_info: '請選擇當你旅行時通常喜歡那些風格',

      title3: '歡迎來到TripBuddy!',
      title3_info: '你的個人檔案設定即將完成，現在開始探索旅程吧!',
      submit: "開始探索"

    }
  }


  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep === 1) {
      if (!avatar) {
        setError(words[language]['error_for_avatar']);
        return;
      }
      if (!userName || !language) {
        setError(words[language]['error_for_language']);
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
              <h2 className={style.introTitle}>{words[language]['title']}</h2>
              <p className={style.introText}>
                {words[language]['title_info']}
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
                  propmt={words[language]['username']}
                  name={"username"}
                  setting={{ require: true, type: 'text', defaultValue: userName ? userName : '' }}
                  onChange={setUserName}
                />
              </div>

              <div className={style.languagePreference}>
                <p className={style.introText}>{words[language]['language']}</p>
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
              <Button txt={words[language]['next']} func={nextStep} />
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
            <h2>{words[language]['title2']}</h2>
            <div className={style.sharedropdown}>
              <p className={style.introText}>
                {words[language]['title2_info']}
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
                  height: "min-content",
                  marginTop: "1rem",
                  position: "relative",
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0 0'
                }}
              />
            </div>
            <div className={style.pageButtons}>
              <Button
                txt={words[language]['back']}
                func={prevStep}
              />
              <Button
                txt={words[language]['next']}
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
            <h2>{words[language]['title3']}</h2>
            <p className={style.introText}>{words[language]['title3_info']}</p>
            <div className={style.logoContainer}>
              <img className={style.logo} src="../../logo.png" alt="TourBuddy" />
            </div>
            <div className={style.pageButtons}>
              <Button
                txt={words[language]['back']}
                func={prevStep}
              />
              <Button
                txt={words[language]['submit']}
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
