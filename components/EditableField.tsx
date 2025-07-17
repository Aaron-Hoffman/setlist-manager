'use client';

import { useState, useRef, useEffect } from 'react';
import { updateSetListField } from '@/utils/serverActions';

interface EditableFieldProps {
    field: string;
    value: string;
    setListId: number;
    type: 'text' | 'textarea' | 'datetime-local';
    placeholder?: string;
    onSave?: (newValue: string) => void;
}

const EditableField = ({ field, value, setListId, type, placeholder, onSave }: EditableFieldProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (editValue === value) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            await updateSetListField(setListId, field, editValue);
            setIsEditing(false);
            if (onSave) onSave(editValue);
        } catch (error) {
            console.error('Failed to update field:', error);
            setEditValue(value); // Reset to original value on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type !== 'textarea') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="inline-block relative">
                {type === 'textarea' ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        placeholder={placeholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={2}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type={type}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        placeholder={placeholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={isLoading}
                    />
                )}
                {isLoading && (
                    <div className="mt-1 text-xs text-gray-500 flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.584-3.584"></path>
                        </svg>
                        Saving...
                    </div>
                )}
            </div>
        );
    }

    const displayValue = value || <span className="text-gray-400 italic">Click to add</span>;

    return (
        <div className="group inline-flex items-center gap-1">
            <span
                onClick={() => setIsEditing(true)}
                className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-all duration-200 border-transparent hover:border-indigo-200 group-hover:border-indigo-300"
                title="Click to edit"
            >
                {displayValue}
            </span>
            <span 
                className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Edit"
            >
                ✏️
            </span>
        </div>
    );
};

export default EditableField; 