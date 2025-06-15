import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/userModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const admin = body.admin;
  // if (!session || !session.data?.user?.email) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    await connectDB();
    // const newUser = await Data.create(body);
    const updatedUser = await User.findOneAndUpdate(
      { email: admin.email },
      { $push: { data: body.data } },
      { new: true }
    );
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add user" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  console.log("Request came at get")

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    console.log(email)

    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    const admin = await User.findOne({ email });

    if (!admin) {
      return new Response("Admin not found", { status: 404 });
    }

    return new Response(JSON.stringify(admin), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { admin, updatedUser } = body;

    if (!admin?.email || !updatedUser?.id) {
      return new Response("Missing admin email or user ID", { status: 400 });
    }

    await connectDB();

    const result = await User.findOneAndUpdate(
      { email: admin.email, "data.id": updatedUser.id },
      { $set: { "data.$": updatedUser } },
      { new: true }
    );

    if (!result) {
      return new Response("User not found or update failed", { status: 404 });
    }

    return NextResponse.json({ success: true, user: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}


