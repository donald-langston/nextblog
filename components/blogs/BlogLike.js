"use client"
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter, usePathname} from "next/navigation";
import {useSession} from "next-auth/react";

export default function BlogLike({blog}) {

    const {data, status} = useSession();
    const [likes, setLikes] = useState(blog?.likes);

    const router = useRouter();
    const pathName = usePathname();

    const isLiked = likes?.includes(data?.user?._id);

    const handleLike = async () => {
        if(status !== "authenticated") {
            toast.error("Please login to like this blog");
            router.push(`login?callbackUrl=${pathname}`);
            return;
        }

        try {
            if(isLiked) {
                const answer = window.confirm("Are you sure you want to unlike?");
                if(answer) {
                    handleUnlike();
                }
            } else {
                const response = await fetch(`${process.env.API}/user/blog/like`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({blogId: blog?._id}),
                });

                if(!response.ok) {
                    toast.error("Failed to like blog");
                    throw new Error("Failed to like blog");
                } else {
                    const data = await response.json();
                    setLikes(data.likes);
                    toast.success("Blog liked");
                    router.refresh();
                }
            }
        } catch(err) {
            console.log(err);
            toast.error("Error liking blog");
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await fetch(`${process.env.API}/user/blog/unlike`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({blogId: blog?._id}),
            });

            if(!response.ok) {
                toast.error("Failed to unlike blog");
                throw new Error("Failed to unlike blog");
            } else {
                const data = await response.json();
                setLikes(data.likes);
                toast.success("Blog unliked");
                router.refresh();
            }
        } catch(err) {
            console.log(err);
            toast.error("Error unliking blog");
        }
    };

    return (
        <>
            <small className="text-muted pointer">
                <span onClick={handleLike}>❤️ {likes?.length} likes</span>
            </small>
        </>
    )
}