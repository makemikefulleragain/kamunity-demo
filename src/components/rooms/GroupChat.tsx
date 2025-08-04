'use client';

interface GroupChatProps {
  roomId: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ roomId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex-grow flex flex-col p-4">
      <h3 className="text-xl font-bold text-kamunity-charcoal mb-3 border-b-2 pb-2">Group Chat</h3>
      <div className="bg-kamunity-gold bg-opacity-20 border-l-4 border-kamunity-gold text-gray-800 p-3 text-sm mb-4 rounded-r-lg">
        <p><span className="font-bold">Here's what you missed:</span> A new task was created and 3 new files were uploaded.</p>
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {/* Chat messages will be rendered here */}
        <p className="text-gray-500">Chat message area...</p>
      </div>
      <div className="mt-auto">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kamunity-indigo"
        />
      </div>
    </div>
  );
};

export default GroupChat;
