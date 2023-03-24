import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MyApp from './Components/MyApp';

function App() {
  const [data, setData] = useState([
    {
      id: 1,
      title: 'Tanmay bhat',
      items: [],
    },
    {
      id: 2,
      title: 'Dhruv rathee',
      items: [],
    },
  ]);

  useEffect(() => {
    async function fetchYouTubeData() {
      const apiKey = 'AIzaSyDoQyaognXGAV_jvpmWhokghPto6lN0N5A';
      const baseUrl = 'https://www.googleapis.com/youtube/v3/';

      // fetch video data for each category
      for (const category of data) {
        const { title } = category;

        try {
          const response = await axios.get(`${baseUrl}search`, {
            params: {
              part: 'snippet',
              maxResults: 9, // fetch 2 videos per category
              q: title,
              key: apiKey,
              type: 'video',
            },
          });

          // extract relevant video data from the response and update the items array
          const items = response.data.items.map((item) => ({
            id: item.id.videoId,
            imageUrl: item.snippet.thumbnails.medium.url,
            title: item.snippet.title,
            description: item.snippet.description,
          }));

          category.items = items;
        } catch (error) {
          console.error(error);
        }
      }

      setData([...data]); // update state to trigger re-render and pass data to child components
    }

    fetchYouTubeData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <MyApp data={data} />
      </header>
    </div>
  );
}

export default App;
