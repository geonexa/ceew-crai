import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="India Climate Resilience Atlas - Platform to enable climate risk-informed decision making and identify resilience strategies across sectors." />
        <meta name="keywords" content="India Climate Resilience Atlas" />
        <meta name="author" content="CEEW" />

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
        </link>

        <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>


      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
