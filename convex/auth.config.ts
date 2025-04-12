if (!process.env.CLERK_ISSUE_URL) {
  throw new Error("Please define the CLERK_ISSUE_URL environment variable inside .env.local");
}

const authConfig= {
    providers: [
      {
        domain: process.env.CLERK_ISSUE_URL,
        applicationID: "convex",
      },
    ]
  };

export default authConfig;