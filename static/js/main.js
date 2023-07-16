// Create a Socket.IO instance to connect to the server
var socket = io();
// Connect to the specified address of the server
socket.connect('http://127.0.0.1:5000');
// Get Song Container Element
var songsContainer = document.getElementById('songs-container');
socket.on('update_songs', (songs) => {
    // Empty the song container
    songsContainer.innerHTML = '';

  // Sorted in descending order
    songs.sort((a, b) => b.votes - a.votes);

  // Render each song
    songs.forEach((song) => {
        // Create song item container
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');

        // Create the song title element
        const songTitle = document.createElement('span');
        songTitle.classList.add('song-title');
        songTitle.textContent = song.title;

        // Create song poll count element
        const songVotes = document.createElement('span');
        songVotes.classList.add('song-votes');
        songVotes.textContent = `Votes: ${song.votes}`;

        // Create a voting button
        const voteBtn = document.createElement('button');
        voteBtn.classList.add('vote-btn');
        voteBtn.textContent = 'Vote';

        // Create a downvoting button
        const cancelVoteBtn = document.createElement('button');
        cancelVoteBtn.classList.add('cancel-vote-btn');
        cancelVoteBtn.textContent = 'Downvote';

        // Vote button click event handler
        voteBtn.addEventListener('click', () => {
        // Send 'vote' event and song ID to server
        socket.emit('vote', song.id);
        });

        // Unvote button click event handler
        cancelVoteBtn.addEventListener('click', () => {
        // same
        socket.emit('cancel_vote', song.id);
        });

        // Add these to the song item container
        songItem.appendChild(songTitle);
        songItem.appendChild(songVotes);
        songItem.appendChild(voteBtn);
        songItem.appendChild(cancelVoteBtn);
        // Add the song item container to the song container
        songsContainer.appendChild(songItem);
    });
});
