import React from 'react';
import "./css/HomePage.css"
import ContentContainer from '../components/ContentContainer';

const HomePage = () => {
  return (
    <div>
        <ContentContainer>
            <h1>Welcome to Silly Dog Wiki!</h1>
            <p>This is the place for all your sillyness and inquaries about doggies.</p>
            <p>Feel free to look for some silly dogs and have fun.</p>
        </ContentContainer>
    </div>
  );
};

export default HomePage;
