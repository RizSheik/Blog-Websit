import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";

interface FullBlog {
  currentSlug: string;
  title: string;
  content: any; // You may want to refine this to be more specific if you know the content structure
  titleImage: { asset: { _ref: string } }; // Assuming titleImage is an object with an asset reference
}

async function getData(slug: string): Promise<FullBlog[]> {
  const query = `
    *[_type == "blog" && slug.current == '${slug}'] {
      "currentSlug": slug.current,
      title,
      content,
      titleImage
    }`;
  
  const data = await client.fetch(query);
  return data;
}

export default async function BlogArticle({ params }: { params: { slug: string } }) {
  const data: FullBlog[] = await getData(params.slug);

  if (data.length === 0) {
    return <div>Blog not found</div>;
  }

  const blog = data[0]; // Assuming only one blog will be returned since slugs are unique
  
  return (
    <div className="mt-8 items-center justify-center ">
      <h1>
        <span className="block text-base text-center text-primary font-semibold tracking-wide uppercase">
          Rizwan - Blog
        </span>
        <span className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
          {blog.title}
        </span>
      </h1>
      
      {blog.titleImage && (
        <Image
          src={urlFor(blog.titleImage).url()} // Assuming you have a utility like urlFor to get image URL
          width={600}
          height={600}
          alt="Title Image"
          priority
          className="rounded-lg mt-8 border"
        />
      )}

      <div className="mt-16 prose-text-center prose prose-blue prose-xl dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
        <PortableText value={blog.content} />
      </div>
    </div>
  );
}
