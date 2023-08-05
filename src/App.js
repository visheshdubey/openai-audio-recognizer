import logo from './logo.svg';
import './App.css';
import AudioRecorder from './Recorder';
import { useState } from 'react';

function App() {
  // let [recordOption, setRecordOption] = useState("video");
  // const toggleRecordOption = (type) => {
  //   return () => {
  //     setRecordOption(type);
  //   };
  // };
  return (
    <div>
      <AudioRecorder />
    </div>
  );
}

export default App;
