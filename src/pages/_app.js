import { ToastProvider } from "@/custom-hooks/toast/ToastProvider";
import { storeWrapper } from "@/redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import { Provider } from "react-redux";

export default function App({ Component, pageProps, ...rest }) {
  const { store } = storeWrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </Provider>
  );
}
