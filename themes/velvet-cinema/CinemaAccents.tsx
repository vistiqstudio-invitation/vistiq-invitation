export function MarqueeStars({ className }: { className?: string }) {
  return <div className={className} aria-hidden="true">{Array.from({ length: 22 },(_,i)=><i key={i}/>)}</div>;
}

export function Clapperboard({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 180 145" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path className="clapTop" d="M10 22L164 4L170 39L16 57Z"/><path className="clapStripe" d="M27 20L45 18L27 53L10 55ZM68 15L88 13L69 48L50 51ZM112 10L132 8L113 43L94 46ZM153 5L165 4L170 27L157 38L137 41Z"/><rect className="clapBody" x="16" y="52" width="154" height="84" rx="3"/><path className="clapLines" d="M16 78H170M70 78V136M122 78V136"/><text x="42" y="68">TAKE</text><text x="91" y="68">LOVE</text><text x="140" y="68">2026</text><text className="clapHeart" x="93" y="120" textAnchor="middle">♥</text></svg>;
}

export function FilmReel({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="65" cy="65" r="58"/><circle cx="65" cy="65" r="13"/><circle cx="65" cy="31" r="15"/><circle cx="94" cy="50" r="15"/><circle cx="83" cy="86" r="15"/><circle cx="46" cy="86" r="15"/><circle cx="36" cy="50" r="15"/></svg>;
}
