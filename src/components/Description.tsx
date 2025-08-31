import React from 'react';
import './Description.css'; // Importing CSS file

const Description: React.FC = () => {
    return (
        <div className="description-container">
            <h1>Welcome 👋</h1>
            <p>
                So you have a few teams and many orders. You do not know how to distribute the orders between teams based on the address.
            </p>
            <p>
                Just open this page, type your teams' names and your order addresses.<br />
                It will generate an order list for each team based on their locations.
            </p>
        </div>
    );
};

export default Description;
