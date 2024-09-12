import { Matcher } from "interweave";
import Link from "next/link";
import { createElement } from "react";

const Hashtag = ({ ...props }: any) => {
  return (
    <Link href={`/explore/hashtag/${props.display?.slice(1)}`}>
      {props.display}
    </Link>
  );
};

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Hashtag, props, match);
  }

  asTag(): string {
    return "a";
  }

  match(value: string) {
    return this.doMatch(value, /\B#[\w&-i̇]+/, (matches) => {
      return {
        display: matches[0],
      };
    });
  }
}
