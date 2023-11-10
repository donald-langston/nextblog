import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import queryString from "query-string";
import mongoose from "mongoose";


export async function GET(req, context) {
    await dbConnect();
    const searchParams = queryString.parseUrl(req.url).query;

    const {page} = searchParams || {};
    const id = context.params.id;
    const pageSize = 3;

    try {
        const currentPage = Number(page) || 1;
        const skip = (currentPage - 1) * pageSize;
        const blogs = await Blog.find()
        .where('postedBy')
        .equals(new mongoose.Types.ObjectId("" + id))
        .populate("postedBy", "name")
        .limit(pageSize)
        .skip(skip)
        .sort({createdAt: -1});
        const totalBlogs = blogs.length;

        return NextResponse.json({blogs, currentPage, totalPages: Math.ceil(totalBlogs / pageSize)}, {status: 200});
    } catch(err) {
        console.log(err);
        NextResponse.json({err: err.message}, {status: 500});
    }
}

export async function PUT(req, context) {
    await dbConnect();
    const _req = await req.json();
    
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            context.params.id, 
            {..._req},
            {new: true},
            );
            return NextResponse.json(updatedBlog, {status: 200});
    } catch(err) {
        console.log(err);
        NextResponse.json({err: "An error occurred. Try again."}, {status: 500});
    }
} 

export async function DELETE(_, context) {
    await dbConnect();

    try {
        const deletedBlog = await Blog.findByIdAndDelete(context.params.id);
        return NextResponse.json(deletedBlog, {status: 200});
    } catch(err) {
        console.log(err);
        return NextResponse.json({err: "An error occurred. Try again."}, {status: 500});
    }
}