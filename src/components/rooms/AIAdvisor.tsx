interface AIAdvisorProps {
  roomId: string;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ roomId }) => {
  return (
    <aside className="bg-white rounded-lg shadow-md h-full flex flex-col p-4 border-l-4 border-kamunity-indigo">
      <h3 className="text-xl font-bold text-kamunity-charcoal mb-4 border-b-2 pb-3 flex items-center gap-3">
        {/* Kai Mascot Placeholder */}
        <div className="w-10 h-10 rounded-full bg-kamunity-indigo text-white flex items-center justify-center font-bold text-lg">K</div>
        Kai (AI) Advisor
      </h3>
      <div className="overflow-y-auto">
        <div className="mb-4">
          <h4 className="font-bold text-md text-kamunity-indigo mb-2">Page Activity</h4>
          <p className="text-sm text-gray-600">- John Doe completed 'Draft Proposal'.</p>
          <p className="text-sm text-gray-600">- Jane Smith joined the room.</p>
        </div>
        <div className="mb-4">
          <h4 className="font-bold text-md text-kamunity-indigo mb-2">Need-to-Know Info</h4>
          <p className="text-sm text-gray-600">- Review H&S document before site visit.</p>
        </div>
        <div>
          <h4 className="font-bold text-md text-kamunity-indigo mb-2">Kamunity Connections</h4>
          <p className="text-sm text-gray-600">- Suggest connecting with 'Budgeting Experts' room.</p>
        </div>
      </div>
    </aside>
  );
};

export default AIAdvisor;
