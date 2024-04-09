import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from '../component/Button'; // Assuming you have a Button component
import style from "./ProfileSetup.module.css";

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  // Additional states for form inputs
  const [userInfo, setUserInfo] = useState({
    username: '',
    bio: '',
    photo: null, // Assuming this will be a File object
    travelStyle: '',
    activities: [], // Initialize as an empty array
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
            <h2>Setup Profile</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={userInfo.username}
              onChange={handleUserInfoChange}
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={userInfo.bio}
              onChange={handleUserInfoChange}
            />
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
            <Button txt="Next" func={nextStep} />
          </div>
        </>
      );
      break;
    default:
      content = null;
  }

  return (
    <div>
      <ProgressBar now={(currentStep / totalSteps) * 100} label={`Page ${currentStep}`} />
      {content}
    </div>
  );
};

export default ProfileSetup;
