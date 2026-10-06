export default function Stars({ value, onChange }: { value: number | null; onChange?: (n: number) => void }) {
  return (
    <div className="stars" role="group" aria-label="คะแนน">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)}
          className={n <= (value ?? 0) ? "on" : ""} aria-label={`${n} ดาว`}>★</button>
      ))}
    </div>
  );
}
