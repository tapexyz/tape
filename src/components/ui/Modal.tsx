import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { FC, Fragment } from "react";

type Props = {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
};

const Modal: FC<Props> = ({
  show,
  onClose,
  children,
  title,
  panelClassName,
}) => {
  function closeModal() {
    onClose();
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={clsx(
              "fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
            )}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "w-full p-6 py-5 overflow-x-hidden text-left align-middle transition-all transform shadow-xl bg-secondary rounded-2xl",
                  panelClassName
                )}
              >
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
