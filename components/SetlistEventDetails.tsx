'use client';

import { useState } from 'react';
import EditableField from './EditableField';

interface SetlistEventDetailsProps {
  setListId: number;
  initialTime: string | null;
  initialEndTime: string | null;
  initialLocation: string | null;
  initialDetails: string | null;
  initialPersonel: any;
}

const SetlistEventDetails = ({
  setListId,
  initialTime,
  initialEndTime,
  initialLocation,
  initialDetails,
  initialPersonel,
}: SetlistEventDetailsProps) => {
  const [time, setTime] = useState(initialTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [location, setLocation] = useState(initialLocation);
  const [details, setDetails] = useState(initialDetails);
  const [personel, setPersonel] = useState(
    initialPersonel ? (typeof initialPersonel === 'string' ? initialPersonel : JSON.stringify(initialPersonel, null, 2)) : ''
  );

  return (
    <div className="mb-8 bg-white shadow rounded-lg p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-medium text-gray-700">Start Time:</span>{' '}
          <EditableField
            field="time"
            value={time ? new Date(time).toISOString().slice(0, 16) : ''}
            setListId={setListId}
            type="datetime-local"
            placeholder="Set start time"
            onSave={setTime}
          />
        </div>
        <div>
          <span className="font-medium text-gray-700">End Time:</span>{' '}
          <EditableField
            field="endTime"
            value={endTime ? new Date(endTime).toISOString().slice(0, 16) : ''}
            setListId={setListId}
            type="datetime-local"
            placeholder="Set end time"
            onSave={setEndTime}
          />
        </div>
        <div>
          <span className="font-medium text-gray-700">Location:</span>{' '}
          <EditableField
            field="location"
            value={location || ''}
            setListId={setListId}
            type="text"
            placeholder="Enter location"
            onSave={setLocation}
          />
        </div>
        <div>
          <span className="font-medium text-gray-700">Details:</span>{' '}
          <EditableField
            field="details"
            value={details || ''}
            setListId={setListId}
            type="textarea"
            placeholder="Enter details"
            onSave={setDetails}
          />
        </div>
        <div className="md:col-span-2">
          <span className="font-medium text-gray-700">Personnel:</span>{' '}
          <EditableField
            field="personel"
            value={personel}
            setListId={setListId}
            type="textarea"
            placeholder="Enter personnel (JSON or array)"
            onSave={setPersonel}
          />
        </div>
      </div>
    </div>
  );
};

export default SetlistEventDetails; 