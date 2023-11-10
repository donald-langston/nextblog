"use client";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import BlogCard from "@/components/blogs/BlogCard";
import Link from "next/link";
import BlogLike from '@/components/blogs/BlogLike';
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


dayjs.extend(relativeTime);



export default function BlogViewPage({params}) {
    const {data: session} = useSession();
    const [blog, setBlog] = useState(null);

    
    useEffect(() => {
        getBlog(params.slug);
    },[]);

    const getBlog = async (slug) => {
        try {
            const response = await fetch(`${process.env.API}/blog/${slug}`, {
                method: "GET",
                next: {revalidate: 1},
            });
    
            if(!response.ok) {
                toast.error(response);
            }
            
            const data = await response.json();
            setBlog(data);
        } catch(err) {
            toast.error(err);
        }
        
    }


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
                        <Link href={`/blog/${blog?.slug}`}>{blog?.title}</Link>
                    </h5>
                    <div className="card-text">
                        <div dangerouslySetInnerHTML={{
                            __html: blog?.content
                        }}>  
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                    <small className="text-muted">Category: {blog?.category}</small>
                    <small className="text-muted">Author: {blog?.postedBy?.name || "Admin"}</small>
                </div>
                <div className="card-footer d-flex justify-content-between">
                    {/* <small className="text-muted">❤️ {blog?.likes?.length} likes</small> */}
                    <BlogLike blog={blog} />
                    <small className="text-muted">Posted: {dayjs(blog?.createdAt).fromNow()}</small>      
                </div>
                {session?.user?.role === "user" && session?.user?.name === blog?.postedBy?.name ? 
                    <div>
                        <Link href={`/dashboard/user/blog/update/${params.slug}`} className="nav-link">Update Blog</Link>
                    </div> : null}
            </div>
        </div>
    )
}