import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          background: "#f5f5f5",
          color: "black",
        }}
      >
        {children}
      </body>
    </html>
  );
}
