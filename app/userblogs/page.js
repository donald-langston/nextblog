"use client"
import {useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import BlogList from "@/components/blogs/BlogList";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UserBlogs(searchParams) {
    const {data: userData} = useSession();

    

    const [userBlogs, setUserBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(null);
    const [totalPages, setTotalPages] = useState(null);

    const urlParams = {page: searchParams.page || 1};
    const searchQuery = new URLSearchParams(urlParams).toString();

    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    useEffect(() => {
        fetchBlogs();
    },[]);


    const fetchBlogs = async () => {
        try {
            const response = await fetch(`${process.env.API}/blog/user/${userData?.user?._id}?${searchQuery}`, {
                method: "GET",
            });
            
            if(!response.ok) {
                toast.error("Failed to fetch liked blogs");
                throw new Error("Failed to fetch liked blogs");
            } else {
                const data = await response.json();
                setUserBlogs(data?.blogs);
                setCurrentPage(data?.currentPage);
                setTotalPages(data?.totalPages);
            }
        } catch(err) {
            console.log(err);
        }
    };

    const increasePage = () => {
        setCurrentPage(currentPage + 1);
    }

    const decreasePage = () => {
        setCurrentPage(currentPage - 1);
    }
    

    return (
        <div className='container'>
            <nav className="nav justify-content-center">
                <Link href="/dashboard/user/blog/create" className="nav-link">Create Blog</Link>
            </nav>

            <br />

            <p className="lead text-primary text-center">My Blogs</p>

            <BlogList blogs={userBlogs} />

            <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation">
                <ul className="pagination">

                {hasPreviousPage && (
                    <li className="page-item">
                    <Link onClick={decreasePage} className="page-link px-3" href={`?page=${currentPage - 1}`}>Previous</Link> 
                    </li>
                )}

                {Array.from({length: totalPages}, (_, i) => {
                    const page = i + 1;
                    return (
                    <li onClick={() => {setCurrentPage(page)}} key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                        <Link className="page-link" href={`?page=${page}`}>{page}</Link>
                    </li>
                    )
                })}

                {hasNextPage && (
                    <li className="page-item">
                    <Link onClick={increasePage} className="page-link px-3" href={`?page=${currentPage + 1}`}>Next</Link>
                    </li>
                )}

                </ul>
            </nav>
            </div>
        </div>
    );
}