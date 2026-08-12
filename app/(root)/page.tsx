import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/server.action";
import Link from "next/link";
import {
  FaUserFriends,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaCamera,
  FaDownload,
  FaPlus,
  FaCog,
  FaPen,
} from "react-icons/fa";

const Dashboard = async () => {
  const stats = await getDashboardStats();

  return (
    <div>
      <div>
        <InfoCard
          header="Total Students"
          data={stats.totalStudents}
          IconComponent={FaUserFriends}
        />

        <InfoCard
          header="Present Today"
          data={stats.present}
          IconComponent={FaCheckCircle}
          color="text-green"
        />

        <InfoCard
          header="Absent Today"
          data={stats.absent}
          IconComponent={FaTimesCircle}
          color="text-error"
        />

        <InfoCard
          header="Attendance Rate"
          data={stats.rate}
          IconComponent={FaChartLine}
          color="text-brand-100"
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 justify-between items-center my-5">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex sm:grid-cols-2 gap-2">
          <Link href="/face" className="w-max">
            <Button className="bg-green">
              <FaCamera className="text-blue-600" />
              <span className="text-blue-600 font-medium">Mark Attendance</span>
            </Button>
          </Link>

          <Link href="/attendance" className="w-max">
            <Button className="bg-brand">
              <FaPen className="text-white" />
              <span className="text-green-600 font-medium">Edit Records</span>
            </Button>
          </Link>

          <Link href="/addstudent" className="w-max">
            <Button className="bg-orange">
              <FaPlus className="text-white" />
              <span className="text-white font-medium">Add Student</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
