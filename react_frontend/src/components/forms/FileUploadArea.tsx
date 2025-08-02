import { Upload, X, Check } from 'lucide-react';

interface FileUploadAreaProps {
  label: string;
  type: 'photo' | 'documents';
  accept: string;
  multiple?: boolean;
  files: {
    photo: File | null;
    documents: File[];
  };
  onUpload: (type: 'photo' | 'documents', e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (type: 'photo' | 'documents', index?: number) => void;
}

const FileUploadArea = ({
  label,
  type,
  accept,
  multiple = false,
  files,
  onUpload,
  onRemove
}: FileUploadAreaProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onUpload(type, e)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 text-center">
          <Upload className="mx-auto h-12 w-12 text-purple-400 mb-3" />
          <p className="text-purple-600 font-medium">Click to upload {label.toLowerCase()}</p>
          <p className="text-gray-500 text-sm mt-1">
            {multiple ? 'Multiple files supported' : 'Single file only'} • {accept}
          </p>
        </div>
      </div>

      {type === 'photo' && files.photo && (
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-900">{files.photo.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onRemove('photo')}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {type === 'documents' && files.documents.length > 0 && (
        <div className="space-y-2">
          {files.documents.map((file, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-900">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove('documents', index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
