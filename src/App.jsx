import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({ log: true });


function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {

    console.log("Creating Gif");

    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    
    // Run the FFMpeg command to resize
    await ffmpeg.run('-i', 'test.mp4', '-vf', 'scale=320:240', 'scaled.avi');
    // Run the FFMpeg command to convert to Gif
    await ffmpeg.run('-i', 'scaled.avi',  '-f', 'gif', 'out.gif');
    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer]), { type: 'image/gif' });
    setGif(url);

    console.log("Done creating Gif");
  }
  
  
  return ready ? (
    <div className="App">
      
  
      { video && <video 
        controls
        width="250"
        src={URL.createObjectURL(video)}> </video>}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      
      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>
      { gif && <img src={gif} width="250" />}
    </div>
  ) :
    (
      <p>loading...</p>
    );
}

export default App;
