import Link from 'next/link';
import Image from 'next/image';
import { MockClub } from '@/lib/mock-data';

interface ClubCardProps {
  club: MockClub;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <Link href={`/clubs/${club.id}`} passHref>
        <div className="cursor-pointer">
          <div className="relative h-48 w-full">
            <Image
              src={club.imageUrl || '/images/placeholder.jpg'}
              alt={`Image for ${club.name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{club.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{club.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{club.rooms.length} Rooms</span>
              <span>{club.members.length} Members</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
