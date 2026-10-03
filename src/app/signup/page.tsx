import Link from 'next/link';

export default function Page() {
  return (
    <div className="container max-w-md py-24 text-center">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-4 capitalize">signup</h1>
        <p className="text-text-muted mb-8">Authentication is currently disabled for maintenance. Please check back later.</p>
        <Link href="/" className="btn btn-primary w-full">Return to Tools</Link>
      </div>
    </div>
  );
}
