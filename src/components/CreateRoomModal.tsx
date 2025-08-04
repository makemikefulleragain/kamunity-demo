'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import KaiCharacter from './KaiCharacter';

// Define the props for the component
interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the structure for the form data
interface RoomData {
  purpose: string;
  why: string;
  members: string; // Simplified for now, will be array of users
  privacy: 'Public' | 'Private';
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<RoomData>({
    purpose: '',
    why: '',
    members: '',
    privacy: 'Public',
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // In a real app, you'd send this data to a server
    console.log('Creating room with data:', formData);

    // Show success celebration
    setShowSuccess(true);

    // After celebration, redirect to new room
    setTimeout(() => {
      const newRoomId = Math.floor(Math.random() * 1000);
      onClose();
      setShowSuccess(false);
      setCurrentStep(1); // Reset for next time
      router.push(`/rooms/${newRoomId}`);
    }, 3000);
  };

  if (!isOpen) return null;

  // Success celebration screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl text-gray-800">
          <KaiCharacter
            variant="celebration"
            expression="celebrating"
            size="xl"
            title="🎉 Room Created Successfully!"
            message={`Awesome! Your "${formData.purpose || 'Focus Room'}" is ready to go. I'm redirecting you there now so you can start building something amazing with your community!`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl text-gray-800">
        {/* Kai Character Guide */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl" role="img" aria-label="Kai guiding you">🌟</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-700 mb-1">Let&apos;s Create Your Focus Room!</h2>
              <p className="text-sm text-primary-600">Hi! I&apos;m Kai, and I&apos;ll help you build something amazing together 🚀</p>
            </div>
          </div>
        </div>

        {/* Step 1: The Basics */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary-700">Step 1: The Basics</h3>
                <p className="text-sm text-gray-600">Tell me about your vision - what&apos;s this room all about?</p>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="purpose" className="block text-sm font-medium mb-1">Purpose</label>
              <input
                type="text"
                name="purpose"
                id="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="What is the primary goal of this room?"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="why" className="block text-sm font-medium mb-1">Why</label>
              <textarea
                name="why"
                id="why"
                value={formData.why}
                onChange={handleChange}
                rows={4}
                placeholder="Why is this important?"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        )}

        {/* Step 2: The People */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary-700">Step 2: The People</h3>
                <p className="text-sm text-gray-600">Great communities start with great people - who&apos;s joining you?</p>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="members" className="block text-sm font-medium mb-1">Invite Members</label>
              <input
                type="text"
                name="members"
                id="members"
                value={formData.members}
                onChange={handleChange}
                placeholder="Search for members by name or email (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <p className="text-xs text-gray-500 mt-1">A full user search component will be implemented here.</p>
            </div>
          </div>
        )}

        {/* Step 3: The Rules */}
        {currentStep === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-success-700">Step 3: The Rules</h3>
                <p className="text-sm text-gray-600">Almost there! Let&apos;s set up how your community will work together.</p>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="privacy" className="block text-sm font-medium mb-1">Privacy</label>
              <select
                name="privacy"
                id="privacy"
                value={formData.privacy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Public">Public - Discoverable by anyone</option>
                <option value="Private">Private - Invite-only</option>
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div>
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                className="bg-primary-600 text-white font-bold px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                Next Step →
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-success-500 to-success-600 text-white font-bold px-6 py-2 rounded-md hover:from-success-600 hover:to-success-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                🎉 Create Room
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default CreateRoomModal;
