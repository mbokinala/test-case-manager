import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async signIn(user, account, profile) {
      if (account.provider === 'google' &&
          profile.verified_email === true &&
          profile.email.endsWith(process.env.ALLOWED_LOGIN_DOMAIN)) {
        return true
      } else {
        return false
      }
    },
  }
})