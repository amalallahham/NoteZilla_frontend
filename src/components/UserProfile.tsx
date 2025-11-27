// User Profile Component
// AI Assistant: Component structure generated with assistance from GitHub Copilot

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    apiCalls: number;
    apiCallsRemaining: number;
    createdAt: string;
}

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [token, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const result = await response.json();
            setProfile(result.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    No profile data available
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const apiUsagePercentage = (profile.apiCalls / 20) * 100;
    const isNearLimit = apiUsagePercentage >= 80;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mb-4 text-white">My Profile</h2>

                    {/* Profile Card */}
                    <div className="card primary-bck text-white shadow-sm rounded-5 mb-4">
                        <div className="card-header">
                            <h5 className="mb-0 text-white">Account Information</h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <strong>Name:</strong>
                                </div>
                                <div className="col-md-8">
                                    {profile.firstName} {profile.lastName}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <strong>Email:</strong>
                                </div>
                                <div className="col-md-8">
                                    {profile.email}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <strong>Role:</strong>
                                </div>
                                <div className="col-md-8">
                                    <span className={`badge ${profile.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                        {profile.role}
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <strong>Member Since:</strong>
                                </div>
                                <div className="col-md-8">
                                    {formatDate(profile.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Usage Card */}
                    <div className="card primary-bck text-white shadow-sm rounded-5">
                        <div className="card-header">
                            <h5 className="mb-0 text-white">API Usage</h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="text-center p-3 bg-dark rounded">
                                        <h3 className="mb-0">{profile.apiCalls}</h3>
                                        <small className="text-muted">API Calls Used</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="text-center p-3 bg-dark rounded">
                                        <h3 className="mb-0">{profile.apiCallsRemaining}</h3>
                                        <small className="text-muted">API Calls Remaining</small>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Usage</span>
                                    <span>{apiUsagePercentage.toFixed(0)}%</span>
                                </div>
                                <div className="progress" style={{ height: '25px' }}>
                                    <div
                                        className={`progress-bar ${isNearLimit ? 'bg-warning' : 'bg-success'}`}
                                        role="progressbar"
                                        style={{ width: `${apiUsagePercentage}%` }}
                                        aria-valuenow={apiUsagePercentage}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        {profile.apiCalls} / 20
                                    </div>
                                </div>
                            </div>

                            {isNearLimit && (
                                <div className="alert alert-warning" role="alert">
                                    <strong>Warning:</strong> You are approaching your API call limit.
                                    {profile.apiCallsRemaining === 0 && ' You have reached your limit.'}
                                </div>
                            )}

                            <div className="text-muted small">
                                <p className="mb-0">
                                    <strong>Note:</strong> Each user has a limit of 20 API calls.
                                    This includes video transcription and summarization requests.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
