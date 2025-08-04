import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
