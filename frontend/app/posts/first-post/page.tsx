import Link from 'next/link';
import Image from 'next/image';
function FirstPost() {
  return (
    <main>
      <h1>First Post</h1>
      <p>This is your first post page!</p>
      <Image
        src="/first-post.jpg"
        alt="First Post"
        width={600}
        height={400}
      />
      <a href="https://example.com" >External Link </a><br /> 
      <Link href="/">Go back to home</Link>
    </main>
  );
}

export default FirstPost;