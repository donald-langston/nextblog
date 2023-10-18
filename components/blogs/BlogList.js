import BlogCard from "@/components/blogs/BlogCard";

export default function BlogList({blogs}) {
    
    return (
        <div className="container mb-5">
            <div className="row">
                {blogs?.map(blog => (
                    <div key={blog._id} className="col-lg-4">
                        <BlogCard blog={blog}/>
                    </div>
                ))}
            </div>
        </div>
    );
}