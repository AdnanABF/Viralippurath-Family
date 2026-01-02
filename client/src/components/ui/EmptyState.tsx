interface Props {
  title: string;
  description?: string;
}

const EmptyState: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center">
      <p className="text-lg font-medium text-stone-700">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-stone-500">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
