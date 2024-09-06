import "../styles/globals.css";
import React, {useContext, useEffect} from "react";
import { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import WalletContextProvider from "../contexts/WalletContextProvider";
import TransitionContextProvider from "../contexts/TransitionContextProvider";
import Head from "next/head";
import HouseContextProvider, {
  HouseContext,
} from "../components/Apartment/HouseContext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletContextProvider>
        <HouseContextProvider>
          <TransitionContextProvider>
            <Component {...pageProps} />
          </TransitionContextProvider>
        </HouseContextProvider>
      </WalletContextProvider>
    </>
  );
}

export default MyApp;
