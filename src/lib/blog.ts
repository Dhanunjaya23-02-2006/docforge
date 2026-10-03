import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const blogDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  content: string;
  readingTime: string;
}

export interface BlogMetadata extends Omit<BlogPost, 'content'> {}

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(blogDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    const htmlContent = await marked(content);

    return {
      slug: realSlug,
      title: data.title,
      date: data.date,
      description: data.description,
      author: data.author || 'DocForge Team',
      category: data.category || 'General',
      tags: data.tags || [],
      content: htmlContent,
      readingTime: calculateReadingTime(content),
    };
  } catch (e) {
    return null;
  }
}

export function getAllPosts(): BlogMetadata[] {
  if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory, { recursive: true });
    return [];
  }

  const slugs = fs.readdirSync(blogDirectory);
  const posts = slugs
    .filter((slug) => slug.endsWith('.md'))
    .map((slug) => {
      const realSlug = slug.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, slug);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: realSlug,
        title: data.title,
        date: data.date,
        description: data.description,
        author: data.author || 'DocForge Team',
        category: data.category || 'General',
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  
  return posts;
}
