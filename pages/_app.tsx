import '../styles/globals.css'
import React from 'react'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
if (typeof window === 'object') {
  // const { registerMicroApps, start, loadMicroApp } = require("qiankun");
  // loadMicroApp({
  //   name: "umi-podcast",
  //   entry: "//localhost:9000",
  //   container: "#__next",
  // });
  // start();
}
export default MyApp
