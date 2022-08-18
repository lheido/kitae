import { GitlabIcon } from "../assets/GitlabIcon";
import { GitHubIcon } from "../assets/GithubIcon";
import { LoginButton } from "../components/LoginButton";
import { KitaeBox } from "../components/KitaeBox";
import { DecoLeft } from "../assets/DecoLeft";
import { DecoRight } from "../assets/DecoRight";

export const Login = () => (
  <>
    <div className="absolute top-[25%] left-[50%] translate-x-[-100%] -z-[0]">
      <DecoLeft />
    </div>
    <div className="absolute top-[42%] right-[50%] translate-x-[100%] -z-[0]">
      <DecoRight />
    </div>
    <KitaeBox>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-extralight">Log in to Kitae</h1>
        <p>いらっしゃいませ</p>
      </div>
      <ul className="flex flex-col gap-3">
        <li>
          <LoginButton icon={<GitlabIcon />} label="Continue with Gitlab" />
        </li>
        <li>
          <LoginButton icon={<GitHubIcon />} label="Continue with GitHub" />
        </li>
      </ul>
    </KitaeBox>
  </>
);
