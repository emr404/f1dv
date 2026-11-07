export default function Loader() {
  return (
    <div
      style={{ marginTop: "20vh" }}
      className="Loader"
      role="status"
      aria-label="Loading"
    >
      {[null, "0.1s", "0.3s", "0.4s", "0.5s"].map((delay, index) => (
        <span
          className="LoaderSpan"
          style={delay ? { "--delay": delay } : undefined}
          key={index}
        >
          |
        </span>
      ))}
    </div>
  );
}
