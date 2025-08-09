import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Q&A Application</h1>
      <Link href="/dashboard">
        <button>Go to Dashboard</button>
      </Link>
    </div>
  );
}