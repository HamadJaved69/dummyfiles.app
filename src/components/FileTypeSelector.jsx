const fileTypes = [
  { type: 'pdf', icon: '📄', label: 'PDF' },
  { type: 'docx', icon: '📝', label: 'DOCX' },
  { type: 'csv', icon: '📊', label: 'CSV' },
  { type: 'json', icon: '🔧', label: 'JSON' },
  { type: 'txt', icon: '📃', label: 'TXT' },
  { type: 'jpg', icon: '🖼️', label: 'JPG' },
];

const FileTypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        File Type
      </label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {fileTypes.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`flex flex-col items-center gap-1 p-3 rounded-md border transition-all ${
              selectedType === type
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileTypeSelector;
