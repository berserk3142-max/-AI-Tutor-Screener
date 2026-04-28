export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "40px 20px",
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "40%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(188,255,95,0.08), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          right: "20%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,81,250,0.06), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Logo */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <a
          href="/"
          style={{
            textDecoration: "none",
            fontSize: "28px",
            fontWeight: 900,
            color: "#bcff5f",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
          }}
        >
          NovaAI
        </a>
        <div
          style={{
            fontSize: "11px",
            color: "#757575",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginTop: "4px",
          }}
        >
          AUTHENTICATION_PROTOCOL
        </div>
      </div>

      {children}
    </div>
  );
}
