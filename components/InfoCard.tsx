import React from "react";
import { FaUserFriends } from "react-icons/fa"; // Assumes you've installed react-icons

type InfoCardProps = {
  header: string;
  data: number | string;
  IconComponent: React.ComponentType<{ className?: string }>;
  color?: string;
};

const InfoCard: React.FC<InfoCardProps> = ({
  header,
  data,
  IconComponent,
  color = "text-blue",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center my-5">
      <div>
        <h3 className="text-gray-600 text-sm font-normal mb-2">{header}</h3>
        <p className={`${color} text-4xl font-bold m-0`}>{data}</p>
      </div>
      <div className="bg-sky-50 rounded-lg p-3 flex items-center justify-center">
        <IconComponent className={`${color} text-xl`} />
      </div>
    </div>
  );
};

export default InfoCard;
