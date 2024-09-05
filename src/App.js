import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [web_name,set_name] = useState(true)

  const SubmitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post('https://gemini-eight-gamma.vercel.app/getResponse', {
      question: question
    }).then(res => {
      setAns(res.data.response);
      setLoading(false);
      set_name(false)

      const answerElement = document.querySelector('.answer');
      if (answerElement) {
        answerElement.classList.add('appear');
      }
    }).catch(() => setLoading(false)); // Handle errors
  };

  const speakHandler = () => {
    if (!isSpeaking) {
      const cleanText = ans.replace(/[^a-zA-Z0-9\s]/g, ''); // Clean the text
      const text = new SpeechSynthesisUtterance(cleanText); // Pass the cleaned text
      window.speechSynthesis.speak(text);
      setIsSpeaking(true);

      text.onend = () => setIsSpeaking(false); // Reset when speech ends
    }
  }

  const stopSpeechHandler = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false); // Reset speaking state
  }

  return (
    <div className="App">
      <div className="main-box">
        <div className="question">
          <span>{question || 'Question will be here'}</span>
        </div>

        <div className={`answer ${loading ? 'loading' : ''}` }>
          {loading ? 'Loading...' : ans || 'Answer will appear below the question'}
          <div style={{margin:'3%', fontSize:'200px', color:'lightgrey', opacity:'0.15'}}>
          {
            web_name ? 'AI Board' : ''
          }

          </div>
        </div>
      </div>
      <div className="control-box">
        <textarea 
          placeholder="Type your question here..." 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="buttons">
          <button className='with_loader' onClick={SubmitHandler} disabled={loading}>Send</button>
          <button onClick={speakHandler} disabled={isSpeaking}>Speak</button>
          <button onClick={stopSpeechHandler} disabled={!isSpeaking}>Stop</button>
        </div>
      </div>
    </div>
  );
}

export default App;
