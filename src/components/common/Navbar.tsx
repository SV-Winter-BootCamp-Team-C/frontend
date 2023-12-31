import all from '@/assets/navAll.svg';
import myform from '@/assets/navForm.svg';
import myresponses from '@/assets/navRes.svg';
import analysis from '@/assets/navAnalysis.svg';
import profile from '@/assets/profile.svg';
import logout from '@/assets/logout.svg';
import { useState } from 'react';

interface NavbarProps {
  children: React.ReactNode;
}

type NavItem = {
  id: string;
  icon: string;
  text: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'all', icon: all, text: 'All' },
  { id: 'myforms', icon: myform, text: 'My Forms' },
  { id: 'myresponses', icon: myresponses, text: 'My Responses' },
  { id: 'analysis', icon: analysis, text: 'Analysis' },
];

function Navbar({ children }: NavbarProps) {
  const [activeItem, setActiveItem] = useState<string>('all');

  const handleClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="relative flex justify-end w-[82rem] h-[56rem] m-16 shadow-lg rounded-[2.5rem] bg-neutral-100">
      {/* Navbar */}
      <div className="flex flex-col justify-between w-60 py-[3.75rem]">
        <div>
          <div className="flex justify-center mb-11">
            <span className="text-2xl font-semibold text-black">Form:Flex</span>
          </div>

          {/* nav item */}
          <div className="flex flex-col pl-6 space-y-9">
            {NAV_ITEMS.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`flex items-center cursor-pointer gap-5
                ${activeItem === item.id ? 'bg-purple-600 text-white' : 'text-darkGray'}`}
                  onClick={() => handleClick(item.id)}
                >
                  <img src={item.icon} alt={item.text} className="w-6 h-6" />
                  <span className="text-base font-semibold text-center text-darkGary">{item.text}</span>

                  {activeItem === item.id && (
                    <div className="absolute left-0 w-2 h-[3rem] bg-darkPurple ">
                      <div className="w-52 h-[3rem] bg-purple opacity-40 rounded-tr-xl rounded-br-xl" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* profile */}
        <div className="pl-6">
          <div className="flex items-center gap-5 pb-9">
            <img src={profile} alt="profile" className="w-6 h-6" />
            <p className="text-base font-semibold text-center text-darkGary">Profile</p>
          </div>
          <div className="flex items-center gap-5">
            <img src={logout} alt="logout" className="w-6 h-6" />
            <p className="font-semibold text-center ftext-base text-darkGary">Logout</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-[67.5rem] h-[56rem] rounded-[2.5rem] shadow-xl bg-white">{children}</div>
    </div>
  );
}

export default Navbar;
