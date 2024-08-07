import React from 'react';
import NewsList from '../organisms/NewsList';

const MainTemplate: React.FC = () => {
  return (
    <div className="main-template">
      <header className="header">
        <h1>HN Feed</h1>
        <h2>We &lt;3 hacker news!</h2>
      </header>
      <main>
        <NewsList />
      </main>
    </div>
  );
};

export default MainTemplate;
