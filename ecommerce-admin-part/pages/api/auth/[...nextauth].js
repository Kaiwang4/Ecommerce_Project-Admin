import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const adminEmails = ['kaiwang2027@gmail.com']
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session, token, user}) => {
      console.log({session, token, user});
      if (adminEmails.includes(session?.user?.email)) {
        session.isAdmin = true
      } else {
        session.isAdmin = false
      }
      return session
    }
  }
}

export default NextAuth(authOptions)

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req, res, authOptions)
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw 'not an admin'
  }
}

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "../../../lib/mongodb";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   callbacks: {
//     session: ({session, token, user}) => {
//       console.log({session, token, user});
//       // Just return the session as there's no need to check the user's email
//       return session;
//     }
//   }
// });

