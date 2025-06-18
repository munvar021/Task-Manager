import EditTask from "../../../pages/EditTask/editTask";

export default function EditTaskPage({ params }) {
  return <EditTask taskId={params.taskId} />;
}
