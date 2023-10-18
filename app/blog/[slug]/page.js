import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import BlogCard from "@/components/blogs/BlogCard";
import Link from "next/link";
import BlogLike from '@/components/blogs/BlogLike';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

dayjs.extend(relativeTime);

async function getBlog(slug) {
    
    const response = await fetch(`${process.env.API}/blog/${slug}`, {
        method: "GET",
        next: {revalidate: 1},
    });
    
    const data = await response.json();
    return data;
}

export default async function BlogViewPage({params}) {
    const blog = await getBlog(params.slug);
    const {user} = await getServerSession(authOptions);
    

    return (
        <div className="container mb-5">
            <div className="card">
                <div style={{height: "300px", overflow: "hidden"}}>
                    <img 
                        src={blog?.image || "/images/pexels-michael-kucharski-5372613.jpg"}
                        className="card-image-top"
                        style={{objectFit: "cover", height: "100%", width: "100%"}} 
                        alt={BlogCard.image}/>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h5>
                    <div className="card-text">
                        <div dangerouslySetInnerHTML={{
                            __html: blog.content
                        }}>  
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                    <small className="text-muted">Category: {blog.category}</small>
                    <small className="text-muted">Author: {blog?.postedBy?.name || "Admin"}</small>
                </div>
                <div className="card-footer d-flex justify-content-between">
                    {/* <small className="text-muted">❤️ {blog?.likes?.length} likes</small> */}
                    <BlogLike blog={blog} />
                    <small className="text-muted">Posted: {dayjs(blog.createdAt).fromNow()}</small>      
                </div>
                {user?.role === "user" ? 
                    <div>
                        <Link href={`/dashboard/user/blog/update/${params.slug}`} className="nav-link">Update Blog</Link>
                    </div> : null}
            </div>
        </div>
    )
}