import Channel from "@components/Channel";
import { GetServerSidePropsContext } from "next";

export default Channel;

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { params: context.params },
  };
}
