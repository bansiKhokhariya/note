// utils/dateUtils.js

/**
 * Formats a Date object to "DD/MM/YYYY, HH:MM:SS AM/PM" format.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date and time string.
 */
export const getFormattedDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${day}/${month}/${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };
  