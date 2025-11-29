import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Toast({ show, onClose, message }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Transition
        show={show}
        as={Fragment}
        enter="transform transition duration-300"
        enterFrom="opacity-0 translate-y-2 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transform transition duration-200"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-2 scale-95"
      >
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
          <CheckCircleIcon className="w-6 h-6 text-green-500" />

          <span className="text-gray-700 font-medium">{message}</span>

          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </Transition>
    </div>
  );
}
