import Link from 'next/link';
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  link: string;
  linkText?: string;
}

const Card: React.FC<CardProps> = ({ title, description, link, linkText = 'Read More' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-xl font-bold mb-2 text-kamunity-dark">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <Link href={link} className="text-kamunity-blue hover:underline self-start">
        {linkText}
      </Link>
    </div>
  );
};

export default Card;
