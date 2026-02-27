import { useEffect, useState } from "react";

import { ToolFilled,HomeFilled,SettingFilled ,ProductFilled, ContactsFilled, CarFilled} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const Footer=({activeTab, setActiveTab,isAdmin})=> {
    
const navigate = useNavigate();
  const tabs = [
    { id: "home", label: "Home",path:"/home", icon: <HomeFilled  />,visible:true },
    { id: "inventory", label: "Inventory",path:"/inventory", icon: <ProductFilled  />,visible:true },
    { id: "equipment", label: "Equipment",path:"/equipment", icon: <CarFilled  />,visible:true },
    { id: "repair", label: "Repair",path:"/repair", icon: <ToolFilled  />,visible:true },
    { id: "users", label: "Users",path:"/users", icon: <ContactsFilled  />,visible:isAdmin },
    { id: "settings", label: "Settings",path:"/settings", icon: <SettingFilled  />,visible:true },
  ];

  useEffect(() => {
    const moveto = tabs.find(item => item.id === activeTab)
    navigate(moveto.path)
  },[activeTab])

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 shadow-inner border-t ">
      <div className="flex justify-around">
        {tabs.filter((item) => item.visible).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-3 w-full transition ${
              activeTab === tab.id ? "text-white" : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span className={`text-xs mt-1 ${
              activeTab === tab.id && "font-bold"
            }`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Footer
