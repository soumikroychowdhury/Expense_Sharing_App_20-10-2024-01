import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate(); // Use useNavigate hook
  const token = localStorage.getItem('token'); // Get token from localStorage

  useEffect(() => {
    console.log("In private route");

    // Function to check token validity
    const checkToken = () => {
      // Check if token exists
      if (!token) {
        navigate('/login'); // Programmatically navigate to login
        return; // Exit the function
      }

      try {
        const decoded = jwtDecode(token); // Decode the JWT
        const currentTime = Date.now() / 1000; // Get current time in seconds

        // Check if the token is expired
        if (decoded.exp < currentTime) {
          navigate('/login'); // Navigate to login if token is expired
          return; // Exit the function
        }
      } catch (error) {
        console.error("Token is invalid:", error);
        navigate('/login'); // Navigate to login for invalid tokens
        return; // Exit the function
      }
    };

    checkToken(); // Call the function to check token validity
  }, [navigate, token]); // Dependency array includes navigate and token

  return children; // Return the protected component if token is valid
};

export default PrivateRoute;
