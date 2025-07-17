'use client';

import { useState } from 'react';

interface EditableListProps {
  value: string[];
  onChange: (newList: string[]) => void;
  placeholder?: string;
  validate?: (input: string) => string | null; // return error string or null
  suggestions?: string[];
  allowDuplicates?: boolean;
}

const EditableList = ({ value, onChange, placeholder, validate, suggestions = [], allowDuplicates = false }: EditableListProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setError('');
    if (val.length > 0 && suggestions.length > 0) {
      setFilteredSuggestions(
        suggestions.filter(
          s => s.toLowerCase().includes(val.toLowerCase()) && (!value.includes(s) || allowDuplicates)
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleAdd = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    if (!allowDuplicates && value.includes(trimmed)) return;
    if (validate) {
      const err = validate(trimmed);
      if (err) {
        setError(err);
        return;
      }
    }
    const newList = [...value, trimmed];
    onChange(newList);
    setInput('');
    setFilteredSuggestions([]);
    setError('');
  };

  const handleRemove = (item: string) => {
    const newList = value.filter(p => p !== item);
    onChange(newList);
  };

  return (
    <div>
      <ul className="mb-2">
        {value.map((item, idx) => (
          <li key={idx} className="inline-flex items-center bg-gray-100 rounded px-2 py-1 mr-2 mb-2">
            <span>{item}</span>
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleRemove(item)}
              aria-label="Remove"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder || 'Add item'}
          className="border rounded px-2 py-1 w-full"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd(input);
            }
          }}
        />
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        {filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow">
            {filteredSuggestions.map((s, i) => (
              <li
                key={s + '-' + i}
                className="px-2 py-1 hover:bg-indigo-100 cursor-pointer"
                onClick={() => handleAdd(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditableList; 