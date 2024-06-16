import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SkillPage from './SkillPage.js';
import PlayerPage from './PlayerPage';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="api/skill/Overall" />} />
        <Route path="api/skill/:skillName" element={<SkillPage />} />
        <Route path="api/player/:username" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
};

export default App;