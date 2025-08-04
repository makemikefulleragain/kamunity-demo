interface FastActionsProps {
  roomId: string;
}

const FastActions: React.FC<FastActionsProps> = ({ roomId }) => {
  return (
    <div className="bg-gray-50 p-3 border-b-2 border-gray-200">
      <div className="container mx-auto flex items-center gap-2">
        <button className="px-4 py-2 text-sm font-semibold text-white bg-kamunity-indigo rounded-md hover:bg-indigo-800 transition-colors shadow-sm">Add Task</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm">Start Poll</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm">Upload File</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm">Schedule Event</button>
      </div>
    </div>
  );
};

export default FastActions;
