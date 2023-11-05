import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import { Admin } from '@/model/Admin'
import { mongooseConnect } from '@/lib/mongoose'

async function isAdminEmail(email) {
  await mongooseConnect()
  return !! (await Admin.findOne({email}))
}
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session, token, user}) => {
      console.log({session, token, user});
      if (await isAdminEmail(session?.user?.email)) {
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
  // if (!(await isAdminEmail(session?.user?.email))) {
  //   res.status(401)
  //   res.end()
  //   throw 'not an admin'
  // }
}

// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
// import clientPromise from "../../../lib/mongodb"

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
// }

// export default NextAuth(authOptions)







