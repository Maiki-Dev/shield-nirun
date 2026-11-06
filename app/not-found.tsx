/** Fallback for requests that never reach a locale (middleware normally rewrites everything into /mn or /en). */
export default function GlobalNotFound() {
  return (
    <html lang="mn">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1>404</h1>
        <p>
          Хуудас олдсонгүй · Page not found — <a href="/">shieldnirun.mn</a>
        </p>
      </body>
    </html>
  );
}
