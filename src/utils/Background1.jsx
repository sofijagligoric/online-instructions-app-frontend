import React from 'react';
import './Background1.css';
import bgImage from '../assets/background1.jpg';

const Background1 = () => {
  return <div className="school-background" style={{ backgroundImage: `url(${bgImage})` }}></div>;
};

export default Background1;