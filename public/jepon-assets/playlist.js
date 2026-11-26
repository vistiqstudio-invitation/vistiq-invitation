const playlist = document.querySelector('.songs');
let selectedSong = null;

playlist.addEventListener('click', event => {
  const button = event.target.closest('.song-choice');
  if (!button) return;

  const closing = selectedSong === button;
  if (selectedSong) {
    selectedSong.nextElementSibling?.remove();
    selectedSong.setAttribute('aria-expanded', 'false');
    selectedSong.querySelector('em').textContent = '▶';
    selectedSong = null;
  }
  if (closing) return;

  const player = document.createElement('iframe');
  player.className = 'song-player';
  player.title = 'Putar ' + button.querySelector('b').textContent;
  player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  player.allowFullscreen = true;
  player.src = 'https://www.youtube-nocookie.com/embed/' + button.dataset.video + '?autoplay=1&playsinline=1';
  button.after(player);
  button.setAttribute('aria-expanded', 'true');
  button.querySelector('em').textContent = '×';
  selectedSong = button;
});
