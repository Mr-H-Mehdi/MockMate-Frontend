// dashboard/page.tsx

'use client'; // Make sure it's a client component to use hooks

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL; // Import apiUrl (ensure it's defined where your auth page has it, or in a shared config file)

function DashboardPage() {
    const [user, setUser] = useState<{ id: string, name: string, email: string } | null>(null); // State to hold user data
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            console.log("No user data found in localStorage");
            router.replace('/auth');
        }
    }, [router]);

    const handleStartInterview = () => {
        router.push('/resume-upload'); // Navigate to /resume-upload route
    };
    const handleLogout = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found to logout.");
            return;
        }

        fetch(`${apiUrl}/api/authenticate/logout`, { // Call backend logout endpoint
            method: "POST",
            headers: {
                "Authorization": token // Send token in Authorization header for logout
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.error("Logout failed:", response.statusText); // Log if logout request fails
                    // Handle logout error if necessary
                }
                localStorage.removeItem('authToken'); // Remove token from localStorage
                localStorage.removeItem('user'); // Remove user data from localStorage
                console.log("Logout successful.");
                router.push('/auth'); // Redirect back to auth page or homepage after logout
            })
            .catch(error => {
                console.error("Logout error:", error);
                alert("Logout failed. Please try again."); // Inform user of logout failure
            });
    };

    return (
        <div>
            <h1>Welcome to your Dashboard</h1>
            {user ? (
                <div>
                    <p>User ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    {/* You can display other user information here */}
                </div>
            ) : (
                <p>Loading user information...</p>
                // Or display a message like "User information not available" if you don't redirect
            )}
            <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Logout
            </button>

            <button onClick={handleStartInterview} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#0000FF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Start Interview
            </button>
        </div>
    );
}

export default DashboardPage;