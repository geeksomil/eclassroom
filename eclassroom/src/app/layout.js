import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Provider from "./store/Provider.js";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {/* <header>
          <span> E</span> Classroom
        </header> */}
          {children}
        </Provider>
      </body>
    </html>
  );
}
