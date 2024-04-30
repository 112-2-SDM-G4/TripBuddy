import { IoLanguage } from 'react-icons/io5';
import { FiLogOut } from "react-icons/fi";
import { LuUser2 } from "react-icons/lu";

export const SettingOptionsData = [
    {
        en: "Set language to Chinese",
        zh: "中英切換",
        icon: <IoLanguage size={20}/>
    },
    {
        en: "Profile setting",
        zh: "基本資訊設定",
        icon: <LuUser2 size={20} />
    },
    {
        en: "logout",
        zh: "登出",
        icon: <FiLogOut size={20}/>,
    }

]