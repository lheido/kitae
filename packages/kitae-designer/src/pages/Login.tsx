import { GitlabIcon } from "../assets/GitlabIcon";
import { GitHubIcon } from "../assets/GithubIcon";
import { LoginButton } from "../components/LoginButton";
import { DecoLineBottomLeft } from "../assets/DecoLineBottomLeft";
import { DecoLineMiddleLeft } from "../assets/DecoLineMiddleLeft";
import { DecoLineTopLeft } from "../assets/DecoLineTopLeft";

export const Login = () => (
  <>
    {/* <div className="absolute">
      <DecoLineBottomLeft />
    </div>
    <div className="absolute">
      <DecoLineMiddleLeft />
    </div>
    <div className="absolute">
      <DecoLineTopLeft />
    </div> */}
    <div className="flex flex-col justify-center items-center gap-11 bg-neutral-900 w-[339px] h-[399px] rounded-2xl">
      <div className="relative flex flex-col items-center gap-2">
        <h1 className="text-4xl font-extralight">Log in to Kitae</h1>
        <p>いらっしゃいませ</p>
      </div>
      <ul className="relative flex flex-col gap-3">
        <li>
          <LoginButton icon={<GitlabIcon />} label="Continue with Gitlab" />
        </li>
        <li>
          <LoginButton icon={<GitHubIcon />} label="Continue with GitHub" />
        </li>
      </ul>
    </div>
  </>
);
