'use client';

import { useState } from 'react';

interface BandMember {
  id: number;
  name: string | null;
  email: string | null;
}

interface EditablePersonelListProps {
  value: string[];
  onChange: (newList: string[]) => void;
  setListId: number;
  bandMembers: BandMember[];
}

function isValidEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

const EditablePersonelList = ({ value, onChange, setListId, bandMembers }: EditablePersonelListProps) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<BandMember[]>([]);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setError('');
    if (val.length > 0) {
      setSuggestions(
        bandMembers.filter(
          m => m.email && m.email.toLowerCase().includes(val.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleAdd = (person: string) => {
    if (!person.trim() || value.includes(person.trim())) return;
    if (!isValidEmail(person.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const newList = [...value, person.trim()];
    onChange(newList);
    setInput('');
    setSuggestions([]);
    setError('');
  };

  const handleRemove = (person: string) => {
    const newList = value.filter(p => p !== person);
    onChange(newList);
  };

  return (
    <div>
      <ul className="mb-2">
        {value.map((person, idx) => (
          <li key={idx} className="inline-flex items-center bg-gray-100 rounded px-2 py-1 mr-2 mb-2">
            <span>{person}</span>
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleRemove(person)}
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
          placeholder="Add person (email)"
          className="border rounded px-2 py-1 w-full"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAdd(input);
            }
          }}
        />
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow">
            {suggestions.map((m, i) => (
              <li
                key={m.id + '-' + i}
                className="px-2 py-1 hover:bg-indigo-100 cursor-pointer"
                onClick={() => handleAdd(m.email || '')}
              >
                {m.name} {m.email && <span className="text-xs text-gray-500">({m.email})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditablePersonelList; 