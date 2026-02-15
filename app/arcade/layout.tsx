import TopBar from "@/components/ui/TopBar";

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#fff7fb 0%,#f3f9ff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />

      <div
        style={{
          flex: 1,
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
