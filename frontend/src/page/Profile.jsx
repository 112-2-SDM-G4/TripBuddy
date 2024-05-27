import React, { useEffect, useState } from 'react';
import style from "./Profile.module.css";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import { useLanguage } from '../hooks/useLanguage';
import TripSearchDropdown from '../component/TripSearchDropdown';
import Button from '../component/Button';
import Tag from '../component/Tag';
import { useAuth } from '../hooks/useAuth';
import Loader from '../component/Loader';
import { useHeader } from '../component/HeaderContext'; // Import HeaderContext

function Profile() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [isEdit, setIsEdit] = useState(true);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [username, setUsername] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState(-1);
  const [selectedTagsId, setSelectedTagsId] = useState([]);
  const [isSelectedEn, setIsSelectedEn] = useState(true);
  const { updateHeader } = useHeader(); // Use HeaderContext
  const avatars = ['../../1.png', '../../2.png', '../../3.png', '../../4.png', '../../5.png'];

  const allTagsMapping = allTags?.map(cat => cat["options"]).flat();

  const words = {
    en: {
      avatar: 'Avatar',
      username: 'Username',
      tags: 'Tags',
      language: 'Language preference',
      submit: 'Submit',
    },
    zh: {
      avatar: '頭貼',
      username: '使用者名稱',
      tags: '標籤',
      language: '語言偏好',
      submit: '儲存變更',
    }
  }

  const handleUsername = (event) => {
      setUsername(event.target.value);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetchWithJwt(`/api/v1/user/get_info`, 'GET');
        if(response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setUserInfo(data);
        setSelectedTagsId(data["tags"].map(tag => tag["tag_id"]));
        setUsername(data["user_name"]);
        setIsSelectedEn(data["language"] === 'en');
        setSelectedAvatarId(data["avatar"]);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    const getAllTags = async () => {
        try {
            const response = await fetchWithJwt(`/api/v1/tag/get_tags?source=${"SearchTag"}`, 'GET');
            const data = await response.json();
            setAllTags(data);
        } catch (error) {
            console.error("Fetching preferences failed:", error);
        }
    };

    getUserInfo();
    getAllTags();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetchWithJwt('/api/v1/user/set_info', 'POST', {
        user_name: username,
        tags: selectedTagsId,
        avatar: selectedAvatarId,
        language: isSelectedEn ? 'en' : 'zh'
      });
      const data = await response.json();
      if (!data.valid) {
        throw new Error(data.message || "Submission failed, please try again.");
      }
      const currentSessionData = JSON.parse(sessionStorage.getItem("user") || '{}');
      const updatedUserData = {
        ...currentSessionData,
        user_name: data.user_name,
      };
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
      sessionStorage.setItem('avatar', selectedAvatarId);
      localStorage.setItem('language', data.language);

      // Update the Header state
      updateHeader({
        userName: data.user_name,
        avatar: selectedAvatarId,
        language: data.language,
      });

      alert(language === 'en' ? 'Successfully updated user info:)' : '成功更新使用者資料');
    } catch (error) {
      console.error("Profile setup failed:", error);
    }
  };

  return (
    <div className={style.main}>
      <Loader isLoading={isLoading} />
      <div className={style.container}>
          <div className={style.row}>
            <div className={style.title}>
              {words[language]['avatar']}
            </div>
            <div className={`${style.imgs} ${isEdit && style.clickable}`}>
              {avatars.map((avatar, index) => (
                <img 
                  key={avatar}
                  className={`${style.img} ${(selectedAvatarId === index + 1) && style.imgwithcolor}`} 
                  src={avatar}
                  alt={avatar}
                  onClick={() => setSelectedAvatarId(index + 1)}
                />
              ))}
            </div>
          </div>

          <div className={style.row}>
            <div className={style.title}>
            {words[language]['username']}
            </div>
            <div className={style.content}>
                <input 
                  type="text" 
                  value={username}
                  onChange={handleUsername}
                  className={style.input}
                />
            </div>
          </div>

          <div className={style.row}>
            <div className={style.title}>
              {words[language]['tags']}
            </div>
            <div>
              <div className={style.smallbtn} onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}>
                  {language === 'en' ? 'Add a tag' : '新增標籤'}
              </div>
              {isTagDropdownOpen &&
                <div className={style.tagsdropdown}>
                    <TripSearchDropdown 
                        setIsDropdownOpen={setIsTagDropdownOpen}
                        addSelectedTagsId={(value) => {
                          setSelectedTagsId((prev) => {
                            if (prev.includes(value)) {
                              return [...prev];
                            }
                            return [...prev, value];
                          });
                        }}
                        allTags={allTags}
                        stylesetting={{
                          width: '12rem',
                        }}
                    />
                </div>}
            </div>
          </div>

          <div className={style.content}>
              <div className={style.tags}>
                {selectedTagsId.length !== 0 && allTags.length !== 0 &&
                        selectedTagsId.map(tagId =>
                        <Tag 
                            key={tagId}
                            tagId={tagId}
                            text={allTagsMapping.find(tag => tag["tag_id"] === tagId)[`tag_name_${language}`]}
                            inSearchbox={true}
                            removeFromSearch={() => {
                              setSelectedTagsId(selectedTagsId.filter(t => t !== tagId));
                            }}
                        />)
                }
              </div>
          </div>

          <div className={style.row}>
            <div className={style.title}>
              {words[language]['language']}
            </div>
            <div className={style.content}>
              <div className={style.smallbtn} onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}>
                {isSelectedEn ? 'EN' : 'ZH'}
                <div className={style.triangle}></div>
              </div>
              {isLangDropdownOpen &&
                <div className={style.langdropdown}>
                  <div 
                    className={style.langdropdownitem} 
                    onClick={() => {
                      setIsSelectedEn(true);
                      setIsLangDropdownOpen(false);
                  }}>
                    EN
                  </div>
                  <div 
                    className={style.langdropdownitem} 
                    onClick={() => {
                      setIsSelectedEn(false);
                      setIsLangDropdownOpen(false);
                  }}>
                    ZH
                  </div>
                </div>}
            </div>
          </div>
      </div>

      <div className={style.btn}>
        <Button
            txt={words[language]["submit"]}
            func={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Profile;
