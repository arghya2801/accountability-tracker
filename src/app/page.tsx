import AddGoalForm from "@/components/AddGoalForm";
import GoalsTable from "@/components/GoalsTable";
import Navbar from "@/components/Navbar";

const USER_A = { id: 'a8f426c8-29e8-4855-9d9f-e9ef398fc26a', name: 'Arghya' }
const USER_B = { id: '5dcf715a-e8fb-45c2-b608-d691e7bd445b', name: 'Saksham' }

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-0 mb-6 width-full py-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="flex-1 min-w-[50%]">
          <div className="font-bold mb-2 m-4 text-gray-900 dark:text-gray-100">{`${USER_A.name}'s goals`}</div>
          <GoalsTable userId={USER_A.id} />
        </div>
        <div className="flex-1 min-w-[50%]">
          <div className="font-bold mb-2 m-4 text-gray-900 dark:text-gray-100">{`${USER_B.name}'s goals`}</div>
          <GoalsTable userId={USER_B.id} />
        </div>
      </div>
      <AddGoalForm />
    </>
  );
}
