import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { collection, query, where, getDocs, orderBy, startAt } from 'firebase/firestore';
import { db } from './firebase'; // Ensure you have initialized and exported your Firestore db instance
import './Root.css'; // Make sure your CSS file path is correct

const Root = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null); // State to hold any error messages

    const handleSearch = async () => {
        try {
            // Convert searchTerm to lowercase for case-insensitive search
            const searchTermLower = searchTerm.toLowerCase();

            // Query Firestore
            const q = query(
                collection(db, 'students'),
                orderBy('name'), // Order results by name
                where('name', '>=', searchTermLower), // Filter where name is greater than or equal to searchTermLower
                where('name', '<=', searchTermLower + '\uf8ff') // Filter where name is less than or equal to searchTermLower + 'x' (unicode character)
            );

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching for students:', error);
            setError('Error searching for students. Please try again.'); // Set error state
        }
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="home-container">
            <Navbar />
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
            {error && <p className='alert alert-danger'>{error}</p>} {/* Display error message if there's an error */}
            <div className="results-container">
                <ul className="results-list">
                    {searchResults.length === 0 && <p className='alert alert-danger'>No results found.</p>} {/* Display message if no results */}
                    {searchResults.map(student => (
                        <li key={student.id}>
                            <Link to={`/student/${student.id}`} className="student-link">{student.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="button-container">
                <Link to="/add-student" className="btn">Add Student</Link>
            </div>
        </div>
    );
};

export default Root;
