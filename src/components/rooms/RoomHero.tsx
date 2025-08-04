interface RoomHeroProps {
  roomId: string;
}

const RoomHero: React.FC<RoomHeroProps> = ({ roomId }) => {
  // Fetch room data based on roomId
  const roomData = {
    name: `Focus Room #${roomId}`,
    purpose: 'To collaborate on an exciting new project for the community.',
    memberCount: 12,
    activeActions: 3,
  };

  return (
    <header className="bg-white shadow-md p-6 border-b-4 border-kamunity-indigo">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-kamunity-charcoal">{roomData.name}</h1>
        <p className="text-xl text-gray-700 mt-2">{roomData.purpose}</p>
        <div className="flex items-center gap-6 mt-4 text-md text-gray-600">
          <span>{roomData.memberCount} Members</span>
          <span>{roomData.activeActions} Active Actions</span>
          {/* Placeholder for member avatars */}
          <div className="flex -space-x-2 overflow-hidden">
            {/* Example avatars */}
            <div className="h-10 w-10 rounded-full ring-2 ring-white bg-kamunity-indigo text-white flex items-center justify-center font-bold">A</div>
            <div className="h-10 w-10 rounded-full ring-2 ring-white bg-kamunity-gold text-kamunity-charcoal flex items-center justify-center font-bold">B</div>
            <div className="h-10 w-10 rounded-full ring-2 ring-white bg-kamunity-lavender text-kamunity-charcoal flex items-center justify-center font-bold">C</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoomHero;
