import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import queryString from "query-string";


export async function GET(req) {
    await dbConnect();
    const searchParams = queryString.parseUrl(req.url).query;

    const {page} = searchParams || {};
    const pageSize = 3;

    try {
        const currentPage = Number(page) || 1;
        const skip = (currentPage - 1) * pageSize;
        const totalBlogs = await Blog.countDocuments({});
        const blogs = await Blog.find({})
        .populate("postedBy", "name")
        .limit(pageSize)
        .skip(skip)
        .sort({createdAt: -1});

        return NextResponse.json({blogs, currentPage, totalPages: Math.ceil(totalBlogs / pageSize)}, {status: 200});
    } catch(err) {
        console.log(err);
        NextResponse.json({err: err.message}, {status: 500});
    }
}