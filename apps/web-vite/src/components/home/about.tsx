import { Button, CassetteTape } from "@tape.xyz/winder";

export const About = () => {
  return (
    <div className="flex flex-col justify-between gap-10 rounded-card bg-theme p-5 lg:h-[666px]">
      <div>
        <div className="inline-flex space-x-1.5 align-top">
          <span className="-mt-1.5 align-sub font-serif text-[42px] leading-5">
            ∗
          </span>
          <span className="font-sans">About Tape</span>
        </div>

        <span className="font-serif text-2xl lg:text-[58px] lg:leading-[58px]">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tape
          is more than just a platform; it's a dynamic and evolving space where
          creativity, connection, and community truly thrive. Designed with a
          fresh and innovative approach to digital interaction, Tape empowers
          creators and users from all around the world to connect, create, and
          share their stories in a new and meaningful way.
        </span>
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-1.5">
          <Button>Create an account</Button>
          <Button variant="secondary">Sign in</Button>
        </div>
        <CassetteTape className="size-10" weight="thin" />
      </div>
    </div>
  );
};
