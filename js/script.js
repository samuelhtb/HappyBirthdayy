document.addEventListener("DOMContentLoaded", () => {
    const flame = document.getElementById("flame");
  
    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.lang = 'en-US';
  
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(new MediaStream());
  
      microphone.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;
  
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase();
  
        // Blow to extinguish the flame
        if (command.includes("blow")) {
          flame.style.animation = 'none';
        }
      };
  
      // Start listening
      recognition.start();
  
      // Analyze microphone input for amplitude changes
      function analyzeMicrophoneInput() {
        analyser.getByteFrequencyData(dataArray);
        const amplitude = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
  
        // Adjust the threshold as needed
        const threshold = 50;
  
        // If amplitude exceeds the threshold, extinguish the flame
        if (amplitude > threshold) {
          flame.style.animation = 'none';
        }
  
        requestAnimationFrame(analyzeMicrophoneInput);
      }
  
      analyzeMicrophoneInput();
    } else {
      alert("Web Speech API is not supported in this browser. The blow feature won't work.");
    }
  });
  