import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image"; // Import Image from Next.js
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SimpleBlogCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: SanityImageSource;
}

async function getData(): Promise<SimpleBlogCard[]> {
  const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
      title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage
    }
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const data: SimpleBlogCard[] = await getData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10 mt-5">
      {data.map((post, idx) => (
        <Card key={idx} className="p-4">
          <Image
            src={urlFor(post.titleImage).url()}
            alt={post.title}
            width={500}
            height={500}
            className="rounded-t-lg h-[200px] object-cover"
          />
          <CardContent className="mt-5">
          <h3 className="text-lg line-clamp-2 font-bold">{post.title}</h3>
          <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300">{post.smallDescription}</p>
          <Button asChild className="w-full mt-7">
            <Link href={`/blog/${post.currentSlug}`}>Read More</Link>
          </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
