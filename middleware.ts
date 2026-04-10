import {
  convexAuthNextjsMiddleware,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const path = request.nextUrl.pathname

    if (path.startsWith("/api/")) {
      return
    }

    if (path === "/signin") {
      if (await convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/")
      }
      return
    }

    if (path === "/" && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/signin")
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } }
)

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
