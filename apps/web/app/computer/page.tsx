import { Desktop } from '../../components/Desktop'

export default function AppPage() {
  return (
    <main
      className="w-screen h-screen overflow-hidden text-white relative"
      style={{
        background:
          'url("https://images.unsplash.com/photo-1542810242-fdbf6379237b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NzV8MjIwMzg4fHxlbnwwfHx8fHw%3D") no-repeat center center fixed',
        backgroundSize: 'cover',
      }}
    >
      <Desktop />
    </main>
  )
}
