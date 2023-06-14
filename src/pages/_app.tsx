import "~/styles/globals.css"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { store } from "~/app/store"
import Sandwich from "~/app/comps/sandwich"
import { api } from "~/utils/api"

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

export default api.withTRPC(MyApp)
