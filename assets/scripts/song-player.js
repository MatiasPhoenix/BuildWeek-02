document.addEventListener("DOMContentLoaded", function () {
  let playButton = document.getElementById("play-button");
  let pauseButton = document.getElementById("pause-button");
  let audio = document.getElementById("audio");
  let progressBar = document.getElementById("song-progress");
  let volumeBar = document.getElementById("volume-bar");
  let shuffleButton = document.getElementById("shuffle-button");
  let repeatButton = document.getElementById("repeat-button");
  let playlist = [
    "https://cdns-preview-b.dzcdn.net/stream/c-bcf686b9b7b146a3ce3d160cbfa2d1b5-7.mp3",
    "https://cdns-preview-7.dzcdn.net/stream/c-7dcc9a004604ea2039cc484def2b27f5-9.mp3",
    "https://cdns-preview-1.dzcdn.net/stream/c-1807e30955bf78b8c62c6f8bcf72a986-7.mp3",
    "https://cdns-preview-9.dzcdn.net/stream/c-9e208326d4114be07cbadc20ee8394c8-8.mp3",
  ];
  let currentSongIndex = 0;
  let isPlaying = false;
  let resumePlayback = false; // Track whether we need to resume playback
  let isShuffle = false;
  let repeatMode = 0; // 0: No repeat, 1: Repeat playlist, 2: Repeat current song

  function playCurrentSong() {
    let currentSongUrl = playlist[currentSongIndex];
    audio.src = currentSongUrl;

    if (resumePlayback) {
      audio.currentTime = resumePlayback; // Set the saved playback position
      resumePlayback = false; // Reset the flag
    } else {
      audio.currentTime = 0; // Start from the beginning if not resuming
    }

    audio.play();
    isPlaying = true;
  }

  function pauseSong() {
    audio.pause();
    isPlaying = false;
    resumePlayback = audio.currentTime; // Save the current playback position
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseSong();
    } else {
      playCurrentSong();
    }
    updatePlayPauseButtons();
  }

  function updatePlayPauseButtons() {
    playButton.style.display = isPlaying ? "none" : "block";
    pauseButton.style.display = isPlaying ? "block" : "none";
  }

  function playNextSong() {
    pauseSong(); // Pause the current song before moving to the next one

    if (isShuffle) {
      // Shuffle the playlist and pick a random song
      currentSongIndex = getRandomIndex(currentSongIndex);
    } else {
      currentSongIndex++;
      if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
      }
    }
    // Reset the resumePlayback to start from the beginning of the next song
    resumePlayback = false;
    playCurrentSong();
    updatePlayPauseButtons();
  }

  function playPreviousSong() {
    pauseSong(); // Pause the current song before moving to the previous one

    if (isShuffle) {
      // Shuffle the playlist and pick a random song
      currentSongIndex = getRandomIndex(currentSongIndex);
    } else {
      currentSongIndex--;
      if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
      }
    }
    // Reset the resumePlayback to start from the beginning of the previous song
    resumePlayback = false;
    playCurrentSong();
    updatePlayPauseButtons();
  }

  function getRandomIndex(currentIndex) {
    let randomIndex = currentIndex;
    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * playlist.length);
    }
    return randomIndex;
  }

  function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
      // Shuffle the playlist
      playlist = shuffleArray(playlist);
      // Update current song index to the first song in the shuffled playlist
      currentSongIndex = 0;
    }
    updateShuffleButton();
  }

  function updateShuffleButton() {
    shuffleButton.style.color = isShuffle ? "#1ED760" : "white";
  }

  function shuffleArray(array) {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3; // Cycle through 0, 1, 2
    updateRepeatButton();
  }

  function updateRepeatButton() {
    switch (repeatMode) {
      case 0:
        // No repeat
        repeatButton.style.color = "white";
        break;
      case 1:
        // Repeat playlist
        repeatButton.style.color = "#1ED760";
        break;
      case 2:
        // Repeat current song
        repeatButton.style.color = "#1ED760";
        break;
    }
  }

  function handleSongEnded() {
    if (repeatMode === 2) {
      // Repeat current song
      playCurrentSong();
    } else {
      // Move to the next song
      playNextSong();
    }
  }

  audio.addEventListener("timeupdate", function () {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
  });

  progressBar.addEventListener("input", function () {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  });

  volumeBar.addEventListener("input", function () {
    const volume = volumeBar.value / 100;
    audio.volume = volume;
  });

  shuffleButton.addEventListener("click", toggleShuffle);
  repeatButton.addEventListener("click", toggleRepeat);
  playButton.addEventListener("click", togglePlayPause);
  pauseButton.addEventListener("click", togglePlayPause);
  document
    .getElementById("next-button")
    .addEventListener("click", playNextSong);
  document
    .getElementById("previous-button")
    .addEventListener("click", playPreviousSong);
  audio.addEventListener("ended", handleSongEnded);
});
