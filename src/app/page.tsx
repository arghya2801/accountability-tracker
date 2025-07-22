import AddGoalForm from "@/components/AddGoalForm";
import GoalsTable from "@/components/GoalsTable";

const USER_A = { id: 'a8f426c8-29e8-4855-9d9f-e9ef398fc26a', name: 'Arghya' }
const USER_B = { id: 'UUID_FOR_USER_B', name: 'Bob' }

export default function Home() {
  return (
    <>
      <div className="text-lg font-semibold mb-6">Accountability App v3</div>
      <div className="flex flex-col md:flex-row gap-0 mb-6 width-full">
        <div className="flex-1 min-w-[50%]">
          <div className="font-bold mb-2">{USER_A.name}'s goals</div>
          <GoalsTable userId={USER_A.id} userName={USER_A.name} />
        </div>
        <div className="flex-1 min-w-[50%]">
          <div className="font-bold mb-2">{USER_B.name}'s goals</div>
          <GoalsTable userId={USER_B.id} userName={USER_B.name} />
        </div>
      </div>
      <AddGoalForm />
    </>
  );
}
