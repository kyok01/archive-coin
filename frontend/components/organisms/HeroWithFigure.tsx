import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import Link from "next/link";

/* eslint jsx-a11y/alt-text:0, @next/next/no-img-element:0 */
export const HeroWithFigure = () => {
  return (
    <div className="hero  bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="https://placeimg.com/260/400/arch"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">Anonymous Blog Service On A Blockchain</h1>
          <p className="py-6">
            DockHack Diary enables you to tell whatever you want to tell.<br /> Your posts are recorded on a blockchain,so they cannot be tampered with.<br /> Also, you can discuss and chat with others.
          </p>
          <PrimaryBtn><Link href="/write">Get Started</Link></PrimaryBtn>
        </div>
      </div>
    </div>
  );
};
