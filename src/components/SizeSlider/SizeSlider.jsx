const sizeOptions = [
  { value: 10, label: '10 KB' },
  { value: 50, label: '50 KB' },
  { value: 100, label: '100 KB' },
  { value: 500, label: '500 KB' },
  { value: 1024, label: '1 MB' },
  { value: 2048, label: '2 MB' },
  { value: 5120, label: '5 MB' },
  { value: 10240, label: '10 MB' },
  { value: 20480, label: '20 MB' },
];

const SizeSlider = ({ size, onSizeChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="sizeSelect" className="block text-sm font-medium text-gray-700 mb-2">
        File Size
      </label>
      <select
        id="sizeSelect"
        value={size}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        {sizeOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeSlider;
