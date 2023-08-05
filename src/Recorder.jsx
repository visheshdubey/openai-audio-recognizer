import { useState, useRef } from "react";
import CSVTable from "./Table";
const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [csvText, setcsvText] = useState("");
  const mimeType = "audio/webm";

  const convertRecording = async (text) => {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const messages = [
      {
        role: "system",
        content: `${text}.\nExtract CSV Output with Particulars, Amount, (Credit/Debit).\nParticulars
           is something for which the money is transacted. Include Second Party name in brackets also if provided.\nExample –\nInput
            - I earned 100 Rs from a freelance project.\nOutput - Freelance Earnings,Revenue,Rs 100,Credit\nInput - I spent 50 Rs on
             a weekend getaway trip.\nOutput - Weekend Getaway Expense,Expenses,Rs 50,Debit`,
      },
    ];
    const body = {
      model: "gpt-3.5-turbo",
      messages,
    };
    const accessToken = process.env.REACT_APP_OPENAI;

    await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        // Any other headers you need to include can be added here
        "Content-Type": "application/json", // Example of another header
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response
        console.log("Completion API Response:", data);
        setcsvText(data.choices[0].message.content);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  };
  const sendRecording = async (audioBlob) => {
    const formData = new FormData();
    const apiUrl = "https://api.openai.com/v1/audio/transcriptions";
    formData.append("model", "whisper-1");
    formData.append("file", audioBlob, "recorded_audio.webm");
    const accessToken = process.env.REACT_APP_OPENAI;
    // Send the POST request using fetch
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        // Any other headers you need to include can be added here
        //    "Content-Type": "application/multipart", // Example of another header
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response
        console.log("API Response:", data);
        convertRecording(data.text);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };
  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };
  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
      sendRecording(audioBlob);
    };
  };
  return (
    <div>
      <h2>Audio Recorder</h2>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button">
              Stop Recording
            </button>
          ) : null}
        </div>
        {audio ? (
          <div className="audio-container">
            <audio src={audio} controls></audio>
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        ) : null}
        {/* {csvText ? <CSVTable csvText={csvText} /> : null} */}
        {csvText ? csvText : null}
      </main>
    </div>
  );
};
export default AudioRecorder;
