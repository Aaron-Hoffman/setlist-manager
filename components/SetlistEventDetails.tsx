'use client';

import { useState } from 'react';
import EditableField from './EditableField';
import EditablePersonelList from './EditablePersonelList';
import { updateSetListField } from '@/utils/serverActions';

interface SetlistEventDetailsProps {
  setListId: number;
  initialTime: string | null;
  initialEndTime: string | null;
  initialLocation: string | null;
  initialDetails: string | null;
  initialPersonel: any;
  bandMembers: { id: number; name: string | null; email: string | null }[];
}

const SetlistEventDetails = ({
  setListId,
  initialTime,
  initialEndTime,
  initialLocation,
  initialDetails,
  initialPersonel,
  bandMembers,
}: SetlistEventDetailsProps) => {
  const [time, setTime] = useState(initialTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [location, setLocation] = useState(initialLocation);
  const [details, setDetails] = useState(initialDetails);
  const [personel, setPersonel] = useState(
    Array.isArray(initialPersonel)
      ? initialPersonel
      : initialPersonel
      ? (typeof initialPersonel === 'string' ? [initialPersonel] : [])
      : []
  );

  return (
    <div className="mb-8 bg-white shadow rounded-lg p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex items-center">
          <span className="w-32 md:w-40 font-semibold text-gray-800 text-right block mr-4">Start Time:</span>
          <span className="flex-1 bg-gray-50 rounded px-2 py-1 text-gray-900">
            <EditableField
              field="time"
              value={time ? new Date(time).toISOString().slice(0, 16) : ''}
              setListId={setListId}
              type="datetime-local"
              placeholder="Set start time"
              onSave={setTime}
            />
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 md:w-40 font-semibold text-gray-800 text-right block mr-4">End Time:</span>
          <span className="flex-1 bg-gray-50 rounded px-2 py-1 text-gray-900">
            <EditableField
              field="endTime"
              value={endTime ? new Date(endTime).toISOString().slice(0, 16) : ''}
              setListId={setListId}
              type="datetime-local"
              placeholder="Set end time"
              onSave={setEndTime}
            />
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 md:w-40 font-semibold text-gray-800 text-right block mr-4">Location:</span>
          <span className="flex-1 bg-gray-50 rounded px-2 py-1 text-gray-900">
            <EditableField
              field="location"
              value={location || ''}
              setListId={setListId}
              type="text"
              placeholder="Enter location"
              onSave={setLocation}
            />
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 md:w-40 font-semibold text-gray-800 text-right block mr-4">Details:</span>
          <span className="flex-1 bg-gray-50 rounded px-2 py-1 text-gray-900">
            <EditableField
              field="details"
              value={details || ''}
              setListId={setListId}
              type="textarea"
              placeholder="Enter details"
              onSave={setDetails}
            />
          </span>
        </div>
        <div className="md:col-span-2 flex items-start">
          <span className="w-32 md:w-40 font-semibold text-gray-800 text-right block mr-4 pt-2">Band Members:</span>
          <span className="flex-1 bg-gray-50 rounded px-2 py-1 text-gray-900">
            <EditablePersonelList
              value={personel}
              setListId={setListId}
              bandMembers={bandMembers}
              onChange={async (newList) => {
                setPersonel(newList);
                await updateSetListField(setListId, 'personel', JSON.stringify(newList));
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SetlistEventDetails; 