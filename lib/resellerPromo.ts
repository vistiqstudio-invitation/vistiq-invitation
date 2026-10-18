// A transparent daily display cycle. Never use this clock to select a price or
// claim that the promotion expires; the owner controls RESELLER_PROMO_ACTIVE.
export function secondsUntilNextWibMidnight(now = Date.now()) {
  const day = 86_400_000;
  const elapsed = ((now + 7 * 3_600_000) % day + day) % day;
  return Math.ceil((day - elapsed) / 1000);
}
