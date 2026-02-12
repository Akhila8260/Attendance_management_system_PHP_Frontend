const Pagination = ({ current, total, onChange }) => {
  return (
    <div className="flex justify-end mt-4 space-x-2">
      {[...Array(total)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-3 py-1 rounded ${
            current === i + 1
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
