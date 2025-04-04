import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntryPage from './component/entry';
import ChessArea from './component/play';

function App() {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<EntryPage />} />
        <Route path="/play" element={<ChessArea/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
