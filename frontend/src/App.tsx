import React from 'react';
import Table from './components/Table';
import { mockData } from './data/MockData';
import './index.css';

function App() {
  return (
    <div className="App">
      <Table initialData={mockData} />
    </div>
  );
}

export default App;