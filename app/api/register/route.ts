import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/userModel"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  console.log("Request came")
  try {
    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ name, email, password: hashedPassword })
    await newUser.save()

  } catch (error) {
    console.log("Some problem")
    return NextResponse.error()
  }

  return NextResponse.json({ success: true })
}
