const { v4: uuidv4 } = require('uuid');

// Function to generate hospital ID with custom pattern
function generateUserId() {
    const prefix = 'USER-'; // Custom prefix for the hospital ID
    const uuid = uuidv4(); // Generate a UUID
    const suffix = uuid.split('-').join('').substr(0, 6).toUpperCase(); // Extract part of the UUID as a suffix
    return prefix + suffix; // Combine prefix and suffix
}

module.exports = { generateUserId };