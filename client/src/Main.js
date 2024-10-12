import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlaygroundArea from './components/PlaygroundArea';
import './App.css';

const Main = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <PlaygroundArea />
      </main>
    </div>
  );
}

export default Main;