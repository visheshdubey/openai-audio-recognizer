import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.start();
        setRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      saveAudio();
    }
  };

  const saveAudio = () => {
    // const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    // // Now you can use the audioBlob for further processing or sending to the API.
    // console.log("Recorded audio blob:", audioBlob);
    // const audioUrl = URL.createObjectURL(audioBlob);
    // setAudioUrl(audioUrl);

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);

    // Clear the recorded audio chunks for the next recording
    audioChunksRef.current = [];
  };

  return (
    <div>
      <button onClick={recording ? handleStopRecording : handleStartRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
