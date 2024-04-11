import React, { useState } from 'react';
import Button from '../component/Button'; // Assuming you have a Button component
import InputText from "../component/InputText";
import style from "./ProfileSetup.module.css";


const ProgressBar = ({ progress, currentStep }) => {


  return (
    <div className={style.ProgressBarStyle}>
      <div className={style.FillerStyle} style={{ width: `${progress}%` }}>
        <span className={style.LabelStyle}>{`Page ${currentStep}`}</span>
      </div>
    </div>
  );
};

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  // Additional states for form inputs
  const [userInfo, setUserInfo] = useState({
    username: '',
    language: '',
    photo: null,
    travelStyle: '',
    activities: [],
    travelGroup: '',
    destinationType: ''
  });
  const [preferences, setPreferences] = useState({
    travelStyle: '',
    preferredActivities: []
  });

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, totalSteps));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
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
    }
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
            <InputText
              propmt={"Username"}
              name={"username"}
              setting={{ require: true, type: 'text' }}
              value={userInfo.username}
              onChange={handleUserInfoChange}
            />

            <div>
              <label>Language Preference:</label>
              <button
                type="button"
                className={userInfo.language === 'Chinese' ? style.activeButton : style.button}
                onClick={() => setUserInfo(prev => ({ ...prev, language: 'Chinese' }))}
              >
                繁體中文
              </button>
              <button
                type="button"
                className={userInfo.language === 'English' ? style.activeButton : style.button}
                onClick={() => setUserInfo(prev => ({ ...prev, language: 'English' }))}
              >
                English
              </button>
            </div>
            {/* Handle photo upload accordingly */}
            <Button txt="Next" func={nextStep} />
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
            <div>
              <label>What's your travel style?</label>
              <select name="travelStyle" value={userInfo.travelStyle} onChange={handleChange}>
                <option value="Adventurous">Adventurous</option>
                <option value="Relaxed">Relaxed</option>
                <option value="Cultural">Cultural</option>
                <option value="Gastronomic">Gastronomic</option>
                <option value="Luxurious">Luxurious</option>
              </select>
            </div>

            <div>
              <label>What activities do you enjoy?</label>
              {['Hiking', 'Swimming', 'Museum Visits', 'Dining Out', 'Shopping', 'Sightseeing'].map((activity) => (
                <label key={activity}>
                  <input
                    type="checkbox"
                    name="activities"
                    value={activity}
                    checked={userInfo.activities.includes(activity)}
                    onChange={handleChange}
                  />
                  {activity}
                </label>
              ))}
            </div>

            <div>
              <label>Who do you usually travel with?</label>
              <select name="travelGroup" value={userInfo.travelGroup} onChange={handleChange}>
                <option value="Alone">Alone</option>
                <option value="Partner">Partner</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>

            <div>
              <label>What type of destinations do you prefer?</label>
              <select name="destinationType" value={userInfo.destinationType} onChange={handleChange}>
                <option value="Cities">Cities</option>
                <option value="Countryside">Countryside</option>
                <option value="Mountains">Mountains</option>
                <option value="Beaches">Beaches</option>
                <option value="Historical Sites">Historical Sites</option>
              </select>
            </div>

            <Button txt="Back" func={prevStep} />
            <Button txt="Next" func={nextStep} />
          </div>
        </>
      );
      break;

    case 3:
      content = (
        <>
          <div>
            <h2>Welcome to TripBuddy!</h2>
            <p>Your profile is all set up. Start exploring now!</p>
            <Button txt="Back" func={prevStep} />
            <Button txt="Submit" func={nextStep} />
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
