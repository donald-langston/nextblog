"use client"
import {useState, useEffect} from "react";
import BlogList from "@/components/blogs/BlogList";
import toast from "react-hot-toast";

export default function UserDashboard() {
    const [likedBlogs, setLikedBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    },[]);

    const fetchBlogs = async () => {
        try {
            const response = await fetch(`${process.env.API}/user/liked-blogs`, {
                method: "GET",
            });
            
            if(!response.ok) {
                toast.error("Failed to fetch liked blogs");
                throw new Error("Failed to fetch liked blogs");
            } else {
                const data = await response.json();
                setLikedBlogs(data);
            }
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <p className="lead text-center">Liked Blogs</p>
                    <BlogList blogs={likedBlogs}/>
                </div>
            </div>
        </div>
    );
}