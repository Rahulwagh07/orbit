import { Desktop } from "../../components/Desktop";

export default function AppPage() {
  return (
    <main 
      className="w-screen h-screen overflow-hidden text-white relative"
      style={{
        background: 'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3") no-repeat center center fixed',
        backgroundSize: 'cover'
      }}
    >
      <Desktop />
    </main>
  );
}
