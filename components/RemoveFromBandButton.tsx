'use client'

import { useState } from 'react';
import { removeUserFromBand, deleteBand } from '@/utils/serverActions';
import toast from 'react-hot-toast';

type RemoveFromBandButtonProps = {
    bandId: number;
    bandName: string;
    userId: string;
    isLastUser: boolean;
}

const RemoveFromBandButton = ({ bandId, bandName, userId, isLastUser }: RemoveFromBandButtonProps) => {
    const [isRemoving, setIsRemoving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            if (isLastUser) {
                await deleteBand(bandId);
                toast.success(`Band '${bandName}' has been deleted.`);
            } else {
                await removeUserFromBand(bandId, userId);
                toast.success(`You have been removed from ${bandName}`);
            }
            setShowConfirm(false);
        } catch {
            toast.error('Failed to process your request. Please try again.');
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {isLastUser ? 'Delete Band' : 'Leave Band'}
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">{isLastUser ? 'Delete Band' : 'Leave Band'}</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    {isLastUser ? (
                                        <>
                                            You are the <strong>last member</strong> of <strong>{bandName}</strong>.<br />
                                            If you continue, <strong>the band and all its setlists and songs will be deleted</strong>.<br />
                                            This action cannot be undone.
                                        </>
                                    ) : (
                                        <>Are you sure you want to leave <strong>{bandName}</strong>?<br />You will no longer have access to this band&apos;s songs and setlists.</>
                                    )}
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleRemove}
                                    disabled={isRemoving}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRemoving ? (isLastUser ? 'Deleting...' : 'Leaving...') : (isLastUser ? 'Yes, Delete Band' : 'Yes, Leave Band')}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    disabled={isRemoving}
                                    className="mt-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RemoveFromBandButton; 