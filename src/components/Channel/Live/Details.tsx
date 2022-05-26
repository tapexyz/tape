import "plyr-react/dist/plyr.css";

import { Button } from "@components/ui/Button";
import { Form, useZodForm } from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import { TextArea } from "@components/ui/TextArea";
import clsx from "clsx";
import Plyr from "plyr-react";
import React, { useState } from "react";
import { object, string } from "zod";

const videoDetailsSchema = object({
  title: string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title should be maximum 100 characters" }),
  description: string().max(5000, {
    message: "Description should be maximum 5000 characters",
  }),
});
const Player = React.memo(({ playbackUrl }: { playbackUrl: string }) => {
  return (
    <Plyr
      muted
      source={{
        sources: [
          {
            src: playbackUrl,
            provider: "html5",
          },
        ],
        type: "video",
      }}
      options={{
        controls: ["mute", "volume"],
      }}
    />
  );
});
Player.displayName = "LivePlayer";

const Details = () => {
  const [buttonText, setButtonText] = useState("Start");

  const form = useZodForm({
    schema: videoDetailsSchema,
  });

  return (
    <Form
      formClassName="h-full"
      className="h-full"
      form={form}
      onSubmit={() => {}}
    >
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col items-start">
          <div className={clsx("overflow-hidden disabled rounded")}>
            <Player
              playbackUrl={"http://media.w3.org/2010/05/sintel/trailer.mp4"}
            />
          </div>
          <span className="mt-2 text-sm font-light opacity-50">
            Waiting to start...
          </span>
        </div>
        <div>
          <div className="mt-4">
            <Input
              label="Title"
              type="text"
              placeholder="Title that describes your stream"
              autoComplete="off"
              {...form.register("title")}
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Description"
              placeholder="More about your stream"
              autoComplete="off"
              rows={5}
              {...form.register("description")}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span>
          {/* {data?.createProfile?.reason && (
                <ErrorMessage
                  error={{
                    name: "Create profile failed!",
                    message: data?.createProfile?.reason,
                  }}
                />
              )} */}
        </span>
        <span className="mt-4">
          <Button
            variant="secondary"
            onClick={() => close()}
            className="hover:opacity-100 opacity-60"
          >
            Cancel
          </Button>
          <Button type="submit">{buttonText}</Button>
        </span>
      </div>
    </Form>
  );
};

export default Details;
