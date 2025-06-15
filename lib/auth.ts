import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { connectDB } from "./mongodb"
import { User } from "./userModel"
import bcrypt from "bcrypt"

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials?.email })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        )

        if (!passwordMatch) return null

        // return {
        //   id: user._id.toString(),
        //   name: user.name,
        //   email: user.email,
        // }
        return user
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
