import { Colors } from "@/helpers/colors";
import normalizeFont from "@/helpers/normalize-font";
import {
  COMMON_REGEX,
  LEGACY_LENS_HANDLE_SUFFIX,
  LENS_NAMESPACE_PREFIX
} from "@tape.xyz/constants";
import { Text, type TextStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Markdown, {
  MarkdownIt,
  type RenderRules
} from "react-native-markdown-display";
import { ExternalLink } from "../shared/external-link";

type Token = {
  content: string;
  meta: { username: string };
  markup: "mention";
  type: "mention";
};

type MarkdownState = {
  pos: number;
  src: string;
  push: (type: string, tag: string, nesting: number) => Token;
};

const createMentionPlugin = (md: MarkdownIt) => {
  const mentionRegex = COMMON_REGEX.MENTION_MATCHER_REGEX;
  md.inline.ruler.push("mention", (state: MarkdownState, silent: boolean) => {
    mentionRegex.lastIndex = 0;
    const start = state.pos;
    const match = mentionRegex.exec(state.src.slice(start));
    if (!match || match.index !== 0) return false;
    if (!silent) {
      const token = state.push("mention", "", 0);
      token.content = match[0];
      token.markup = "mention";
      token.meta = {
        username: match[1]
      };
    }
    state.pos += match[0].length;
    return true;
  });
};

const markdownItInstance = MarkdownIt({
  typographer: true,
  linkify: true,
  html: false
}).use(createMentionPlugin);

const style: Record<string, TextStyle> = {
  text: { fontFamily: "Sans", fontSize: normalizeFont(14) },
  heading1: { fontFamily: "SansB" },
  heading2: { fontFamily: "SansB" },
  heading3: { fontFamily: "SansB" },
  heading4: { fontFamily: "SansB" },
  heading5: { fontFamily: "SansB" },
  heading6: { fontFamily: "SansB" },
  strong: { fontFamily: "SansB" },
  s: { textDecorationLine: "line-through" },
  link: { textDecorationLine: "underline" },
  ordered_list: { color: Colors.text, paddingBottom: 10, fontFamily: "Sans" },
  bullet_list: { color: Colors.text, paddingBottom: 10, fontFamily: "Sans" },
  list_item: { color: Colors.text, paddingBottom: 10, fontFamily: "Sans" }
};

const rules: RenderRules = {
  paragraph: (node, children, _parent, styles) => {
    return (
      <Text key={node.key} style={styles._VIEW_SAFE_paragraph}>
        {children}
      </Text>
    );
  },
  link: ({ attributes, key }, children) => {
    return (
      <ExternalLink href={attributes.href} key={key}>
        <TouchableOpacity activeOpacity={0.6}>
          <Text style={{ textDecorationStyle: "dotted" }}>{children}</Text>
        </TouchableOpacity>
      </ExternalLink>
    );
  },
  mention: ({ key, content }) => {
    const handle = content
      .replace(LENS_NAMESPACE_PREFIX, "")
      .replace(LEGACY_LENS_HANDLE_SUFFIX, "");
    return (
      <Text
        key={key}
        style={{
          fontFamily: "Sans",
          fontSize: normalizeFont(14),
          color: Colors.link
        }}
        suppressHighlighting
      >
        {handle}
      </Text>
    );
  }
};

export const RenderMarkdown = ({ content }: { content: string }) => {
  return (
    <Markdown style={style} rules={rules} markdownit={markdownItInstance}>
      {content}
    </Markdown>
  );
};
