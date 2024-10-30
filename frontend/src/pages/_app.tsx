import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import '@/styles/globals.css';
import PermitWrapper from "@/components/providers/permit-wrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <PermitWrapper>
        <Component {...pageProps} />
      </PermitWrapper>
    </ClerkProvider>
  );
}