import { NextResponse } from "next/server";
import Blog from "@/models/blog";
import dbConnect from "@/utils/dbConnect";
import queryString from "query-string";
import blog from "@/models/blog";


export async function GET(req) {
    await dbConnect();
    const {searchQuery} = queryString.parseUrl(req.url).query;

    try {
        const blogs = await blog.find({
            $or: [
                {title: {$regex: searchQuery, $options: "i"}},
                {content: {$regex: searchQuery, $options: "i"}},
                {category: {$regex: searchQuery, $options: "i"}},
            ]
        }).sort({createdAt: -1});
        return NextResponse.json(blogs, {status: 200});
    } catch(err) {
        console.log(err);
        return NextResponse.json(err, {status: 500});
    }
}