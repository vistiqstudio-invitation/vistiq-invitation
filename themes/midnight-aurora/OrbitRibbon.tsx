type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function OrbitRibbon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 52 126" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="26" cy="63" rx="17" ry="45" stroke="currentColor" strokeOpacity=".42" />
      <ellipse cx="26" cy="63" rx="8" ry="56" transform="rotate(28 26 63)" stroke="currentColor" strokeOpacity=".7" />
      <circle cx="26" cy="63" r="4" fill="currentColor" />
      <circle cx="39" cy="31" r="2" fill="currentColor" fillOpacity=".8" />
      <path d="M18 8C28 20 35 34 38 52" stroke="currentColor" strokeLinecap="round" strokeDasharray="1 6" />
    </svg>
  );
}
