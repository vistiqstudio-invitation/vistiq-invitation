const countdown = document.querySelector('#countdown');
const start = Date.parse('2026-12-05T11:30:00+07:00');
function updateCountdown() {
  const seconds = Math.max(0, Math.floor((start - Date.now()) / 1000));
  if (seconds === 0) {
    countdown.textContent = 'Waktu persiapan peserta telah tiba.';
    return;
  }
  const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  countdown.querySelectorAll('b').forEach((element, index) => {
    element.textContent = String(parts[index]).padStart(2, '0');
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('arrive');
        observer.unobserve(entry.target);
      }
    }
  });
  document.querySelectorAll('section h2, blockquote').forEach(element => observer.observe(element));
}
