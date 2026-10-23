import { FocusFlow } from "@/app/components/FocusFlow";
import { tasks } from "@/app/data/tasks";

export default function FocusPage() {
  return <FocusFlow tasks={tasks} />;
}
