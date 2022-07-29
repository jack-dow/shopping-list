import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="h-full">
      <Head />
      <body className="flex min-h-full flex-col font-sans text-gray-600 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
