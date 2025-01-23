import React from 'react';

const InputArea = ({ prompt, setPrompt, fetchImage, loading, errorMessage }) => (
  <div className="input-group">
    <input
      type="text"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Enter your prompt here..."
      className="input-field"
    />
    {errorMessage && <div className="error-message">{errorMessage}</div>}
    <button onClick={fetchImage} className="submit-btn" disabled={loading}>
      {loading ? 'Generating...' : 'Generate Image'}
    </button>
  </div>
);

export default InputArea;
