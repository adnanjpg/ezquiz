import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { store } from "../app/store"
import { withTRPC } from "@trpc/next"
import { AppRouter } from "./api/trpc/[trpc]"
import Sandwich from "../app/comps/sandwich"

function AppWrapper(props: { children: JSX.Element }): JSX.Element {
  return (
    <div className="flex flex-row h-screen overflow-x-hidden">
      <Sandwich bun={<div className="w-3 sm:w-10 md:w-36 lg:w-96"></div>}>
        <div className="grow">{props.children}</div>
      </Sandwich>
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </Provider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc"
    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp)
