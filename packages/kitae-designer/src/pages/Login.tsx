import { GitlabIcon } from "../assets/GitlabIcon";
import { GitHubIcon } from "../assets/GithubIcon";
import { LoginButton } from "../components/LoginButton";
import { DecoLineBottomLeft } from "../assets/DecoLineBottomLeft";
import { DecoLineMiddleLeft } from "../assets/DecoLineMiddleLeft";
import { DecoLineTopLeft } from "../assets/DecoLineTopLeft";
import { KitaeBox } from "../components/KitaeBox";

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
