interface ToolsWidgetProps {
  roomId: string;
}

const ToolsWidget: React.FC<ToolsWidgetProps> = ({ roomId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-xl font-bold text-kamunity-charcoal mb-3 border-b-2 pb-2">Tools & Widgets</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* Placeholder for modular tools */}
        <div className="p-4 border border-gray-200 rounded-lg text-center bg-gray-50 hover:bg-gray-100 hover:shadow-md cursor-pointer transition-all">
          <p>Calendar</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg text-center bg-gray-50 hover:bg-gray-100 hover:shadow-md cursor-pointer transition-all">
          <p>Kanban Board</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg text-center bg-gray-50 hover:bg-gray-100 hover:shadow-md cursor-pointer transition-all">
          <p>Whiteboard</p>
        </div>
        <div className="p-4 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-kamunity-indigo cursor-pointer transition-all">
          <p className="font-bold text-2xl">+</p>
        </div>
      </div>
    </div>
  );
};

export default ToolsWidget;
