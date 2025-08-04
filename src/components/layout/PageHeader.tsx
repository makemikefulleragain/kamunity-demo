interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>}
    </div>
  );
}
