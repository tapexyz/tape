import { Button } from "@components/ui/Button";
import { Form, useZodForm } from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import { TextArea } from "@components/ui/TextArea";
import React, { useState } from "react";
import { object, string } from "zod";

import StreamDetails from "./StreamDetails";

const videoDetailsSchema = object({
  title: string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title should be maximum 100 characters" }),
  description: string().max(5000, {
    message: "Description should be maximum 5000 characters",
  }),
});

const Details = () => {
  const [buttonText, setButtonText] = useState("Create");
  const [playback, setPlayback] = useState("");

  const form = useZodForm({
    schema: videoDetailsSchema,
  });

  return (
    <Form
      formClassName="h-full"
      className="h-full"
      form={form}
      onSubmit={() => {
        setButtonText("Creating...");
        setPlayback("");
      }}
    >
      <div className="flex flex-wrap md:space-x-3">
        <div className="flex flex-col md:w-96">
          <div className="relative overflow-hidden rounded">
            <video
              disablePictureInPicture
              className="w-full"
              controlsList="nodownload noplaybackrate nofullscreen"
              controls
              autoPlay={true}
              muted
            >
              <source src={playback} type="video/mp4" />
            </video>
            <span className="absolute px-3 py-0.5 mt-2 text-xs text-white bg-black rounded-full top-1 right-4">
              Idle
            </span>
          </div>
          <div className="flex flex-col flex-1 mt-4">
            <div>
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
        <StreamDetails />
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
          <Button type="submit">{buttonText}</Button>
        </span>
      </div>
    </Form>
  );
};

export default Details;
