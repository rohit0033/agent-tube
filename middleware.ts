import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/video(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for home page
  if (req.nextUrl.pathname === '/') {
    return;
  }

  const {userId, redirectToSignIn} = await auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/',
  ],
};
