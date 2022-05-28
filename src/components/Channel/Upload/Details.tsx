import "plyr-react/dist/plyr.css";

import { WebBundlr } from "@bundlr-network/client";
import { Button } from "@components/ui/Button";
import ChooseImage from "@components/ui/ChooseImage";
import { Form, useZodForm } from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import { TextArea } from "@components/ui/TextArea";
import Tooltip from "@components/ui/Tooltip";
import useAppStore from "@lib/store";
import { BUNDLR_CURRENCY, BUNDLR_WEBSITE_URL } from "@utils/constants";
import { parseToAtomicUnits } from "@utils/functions/parseToAtomicUnits";
import clsx from "clsx";
import { utils } from "ethers";
import Link from "next/link";
import Plyr from "plyr-react";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import {
  BundlrDataState,
  IPFSUploadResult,
  VideoUpload,
} from "src/types/local";
import { Readable } from "stream";
import { useAccount, useSigner } from "wagmi";
import { object, string } from "zod";

type Props = {
  video: VideoUpload;
  close: () => void;
};

const videoSchema = object({
  title: string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title should be maximum 100 characters" }),
  description: string().max(5000, {
    message: "Description should be maximum 5000 characters",
  }),
});

const Player = React.memo(({ preview }: { preview: string }) => {
  return (
    <Plyr
      source={{
        type: "video",
        sources: [
          {
            src: preview,
            provider: "html5",
          },
        ],
      }}
      options={{
        controls: ["progress", "current-time", "mute", "volume", "fullscreen"],
      }}
    />
  );
});
Player.displayName = "PreviewPlayer";

const Details: FC<Props> = ({ video, close }) => {
  const { data: signer } = useSigner();
  const { data: account } = useAccount();
  const { getBundlrInstance } = useAppStore();
  const [bundlrData, setBundlrData] = useState<BundlrDataState>({
    balance: "0",
    estimatedPrice: "0",
    deposit: null,
    instance: null,
    depositing: false,
    showDeposit: false,
    uploading: false,
  });
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [showBundlrDetails, setShowBundlrDetails] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [buttonText, setButtonText] = useState("Next");

  const form = useZodForm({
    schema: videoSchema,
  });

  const onNext = async () => {
    if (signer && account?.address) {
      setButtonText("Waiting for sign...");
      toast(
        "Please check your wallet for a signature request from bundlr.network"
      );
      const bundlr = await getBundlrInstance(signer);
      setBundlrData((bundlrData) => ({
        ...bundlrData,
        instance: bundlr,
      }));
      setButtonText("Next");
      setShowBundlrDetails(true);
      await fetchBalance(bundlr);
      await estimatePrice(bundlr);
      setButtonText("Start Upload");
      setReadyToUpload(true);
    }
  };

  const depositToBundlr = async () => {
    if (bundlrData.instance && bundlrData.deposit) {
      const value = parseToAtomicUnits(
        bundlrData.deposit,
        bundlrData.instance.currencyConfig.base[1]
      );
      if (!value) return toast.error("Invalid deposit amount");
      setBundlrData({ ...bundlrData, depositing: true });
      await bundlrData.instance
        .fund(value)
        .then((res) => {
          console.log("🚀 ~ file: Details.tsx ~ line 117 ~ .then ~ res", res);
          toast.success(
            `Deposit of ${utils.formatEther(res?.quantity)} is done!`
          );
        })
        .catch((e) => {
          console.log("🚀 ~ file: Details.tsx ~ depositToBundlr ~ e", e);
          toast.error(
            `Failed - ${
              typeof e === "string" ? e : e.data?.message || e.message
            }`
          );
        })
        .finally(async () => {
          console.log(
            "🚀 ~ file: Details.tsx ~ line 120 ~ .finally ~ bundlrData.instance && account?.address",
            bundlrData.instance && account?.address
          );
          fetchBalance();
          setBundlrData({
            ...bundlrData,
            deposit: null,
            depositing: false,
          });
        });
    }
  };

  const fetchBalance = async (bundlr?: WebBundlr) => {
    const instance = bundlr || bundlrData.instance;
    if (account?.address && instance) {
      const balance = await instance.getBalance(account.address);
      setBundlrData((bundlrData) => ({
        ...bundlrData,
        balance: utils.formatEther(balance.toString()),
      }));
    }
  };

  const estimatePrice = async (bundlr: WebBundlr) => {
    if (!video.buffer) return;
    const price = await bundlr.utils.getPrice(
      BUNDLR_CURRENCY,
      video.buffer.length
    );
    setBundlrData((bundlrData) => ({
      ...bundlrData,
      estimatedPrice: utils.formatEther(price.toString()),
    }));
  };

  const onClickUpload = async () => {
    if (!bundlrData.instance || !video.buffer) return;
    const bundlr = bundlrData.instance;

    const tags = [{ name: "Content-Type", value: "video/mp4" }];
    const tx = bundlr.createTransaction(video.buffer, {
      tags: tags,
    });
    console.log(
      "🚀 ~ file: Details.tsx ~ line 163 ~ onClickUpload ~ video.buffer",
      video.buffer,
      typeof video.buffer
    );
    const readableTx = Readable.from(tx.getRaw());

    console.log(
      "🚀 ~ file: Details.tsx ~ line 163 ~ onClickUpload ~ tx",
      readableTx,
      tx.id,
      tx.getRaw().length
    );

    let data = await bundlr.uploader.chunkedTransactionUploader(
      readableTx,
      tx.id,
      tx.getRaw().length
    );
    console.log(
      "🚀 ~ file: Details.tsx ~ line 177 ~ onClickUpload ~ data",
      data
    );
  };

  const onThumbnailUpload = (data: IPFSUploadResult | null) => {
    if (data) {
      setVideoThumbnail(data.ipfsUrl);
    } else {
      setVideoThumbnail("");
    }
  };

  return (
    <Form
      formClassName="h-full"
      className="h-full"
      form={form}
      onSubmit={() => (readyToUpload ? onClickUpload() : onNext())}
    >
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div>
          <h1 className="font-semibold">Details</h1>
          <div className="mt-4">
            <Input
              label="Title"
              type="text"
              placeholder="Title that describes your video"
              autoComplete="off"
              {...form.register("title")}
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Description"
              placeholder="More about your video"
              autoComplete="off"
              rows={5}
              {...form.register("description")}
            />
          </div>
          <div className="mt-4">
            <ChooseImage
              label="Thumbnail"
              afterUpload={(data: IPFSUploadResult | null) => {
                onThumbnailUpload(data);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div
            className={clsx("overflow-hidden", {
              "rounded-t-lg": bundlrData.uploading,
              "rounded-lg": !bundlrData.uploading,
            })}
          >
            <Player preview={video.preview} />
          </div>
          <Tooltip content={`Uploading (${80}%)`}>
            <div className="w-full overflow-hidden bg-gray-200 rounded-b-full">
              <div
                className={clsx("bg-indigo-500 bg-brand-500", {
                  "h-[8px]": bundlrData.uploading,
                  "h-0": !bundlrData.uploading,
                })}
                style={{
                  width: `${80}%`,
                }}
              />
            </div>
          </Tooltip>
          <span className="mt-2 text-sm font-light opacity-50">
            <b>Note:</b> This video and its data will be uploaded to permanent
            storage and it stays forever.
          </span>
          {showBundlrDetails && (
            <div className="flex flex-col w-full p-4 my-5 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
              <div>
                <div className="flex flex-col">
                  <div className="text-[11px] inline-flex rounded justify-between items-center font-semibold uppercase opacity-70">
                    <span className="inline-flex space-x-1.5">
                      <span>Your Balance</span>
                      <button type="button" onClick={() => fetchBalance()}>
                        <MdRefresh className="text-sm" />
                      </button>
                    </span>
                    <Link href={BUNDLR_WEBSITE_URL}>
                      <a target="_blank" rel="noreferer" className="text-[9px]">
                        bundlr.network ({BUNDLR_CURRENCY})
                      </a>
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold">
                      {bundlrData.balance}
                    </span>
                    <span>
                      <button
                        type="button"
                        onClick={() =>
                          setBundlrData({
                            ...bundlrData,
                            showDeposit: !bundlrData.showDeposit,
                          })
                        }
                        className="inline-flex items-center px-1 bg-gray-100 rounded-full dark:bg-gray-800"
                      >
                        <span className="text-[9px] pl-1">Deposit</span>
                        {bundlrData.showDeposit ? (
                          <BiChevronUp />
                        ) : (
                          <BiChevronDown />
                        )}
                      </button>
                    </span>
                  </div>
                </div>
                {bundlrData.showDeposit && (
                  <div className="flex items-end mt-2 space-x-2">
                    <Input
                      label="Amount to deposit"
                      type="number"
                      placeholder="100 MATIC"
                      autoComplete="off"
                      value={bundlrData.deposit || ""}
                      onChange={(e) =>
                        setBundlrData({
                          ...bundlrData,
                          deposit: parseInt(e.target.value),
                        })
                      }
                    />
                    <div>
                      <Button
                        type="button"
                        disabled={bundlrData.depositing}
                        onClick={() => depositToBundlr()}
                        className="mb-0.5"
                      >
                        {bundlrData.depositing ? "Loading" : "Deposit"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-[11px] inline-flex flex-col font-semibold">
                <span className="uppercase opacity-70">
                  Estimated cost to upload
                </span>
                <span className="text-xl font-semibold">
                  {bundlrData.estimatedPrice}
                </span>
              </div>
            </div>
          )}
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
