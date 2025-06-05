import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Ensure this is installed
import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/UserModel";

export const authOptions = {
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        await dbConnect();
        try {
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) throw new Error("No user found with this email");

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) throw new Error("Invalid credentials");

          return user;
        } catch (error) {
          throw new Error(error.message || "Internal server error");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      // console.log("user", user);
      // console.log("acoount", account);

      if (account?.provider !== "credentials") {
        try {
          await dbConnect();

          const { provider, providerAccountId } = account;
          const { email, name, image } = user;

          const existingUser = await UserModel.findOne({
            $or: [{ providerAccountId, provider }, { email }],
          });

          if (existingUser) {
            user._id = existingUser._id;
            user.isAdmin = existingUser?.isAdmin

            let updated = false;

            if (!existingUser.providerAccountId) {
              existingUser.providerAccountId = providerAccountId;
              updated = true;
            }

            if (!existingUser.provider) {
              existingUser.provider = provider;
              updated = true;
            }

            if (!existingUser.image && image) {
              existingUser.image = image;
              updated = true;
            }

            if (!existingUser.email && email) {
              existingUser.email = email;
              updated = true;
            }

            if (!existingUser.name && name) {
              existingUser.name = name;
              updated = true;
            }

            if (updated) {
              await existingUser.save();
              console.log("Updated existing user with OAuth data.");
            }
          } else {
            const newUser = new UserModel({
              provider,
              providerAccountId,
              email,
              name,
              image,
            });

            await newUser.save();

            user._id = newUser._id;
            user.isAdmin = newUser?.isAdmin
            console.log("Created new OAuth user.");
          }
        } catch (error) {
          console.error("OAuth signIn error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id.toString();
        token.isAdmin=user?.isAdmin
      }
      // console.log("next-auth-token user",user)
      // console.log("next-auth token  ", token);
      return token;
    },

    async session({ session, token }) {
      await dbConnect();

      const dbUser = await UserModel.findOne({ email: session.user.email });
      session.user._id = dbUser?._id.toString();
      session.user.isAdmin = dbUser?.isAdmin;
      //  console.log("token into session",token)
      // console.log("session",session.user)
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
