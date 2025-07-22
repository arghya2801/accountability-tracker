import AddGoalForm from "@/components/AddGoalForm";
import GoalsList from "@/components/Goals";
import GoalsTable from "@/components/GoalsTable";

export default function Home() {
  return (
    <>
      <div>Accountability App</div>
      <GoalsList />
      <GoalsTable />
      <AddGoalForm />
    </>
  );
}
