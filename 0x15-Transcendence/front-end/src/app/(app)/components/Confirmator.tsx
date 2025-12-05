// ConfirmationDialog.tsx
import React from "react";
import {motion as Motion} from "framer-motion";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";


type ConfirmationDialogProps = {
    open?: boolean;
    loading?: boolean;
    title?: string;
    message?: string;
    subMsg?: string;
    confirmTitle?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function Confirmator({open = true, loading = false, title = "Confirm", message = "Are you sure ?", onConfirm, subMsg, onCancel, confirmTitle = "Confirm"}: ConfirmationDialogProps) {
    const { t } = useTranslation();
    if (!open) return null;
    return (
        <div  className="fixed backdrop-blur px-[5vw] md:px-[30vw] inset-0 z-40 p-4 flex items-center justify-center bg-black/60">
            <Motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            className='bg-dark _border  w-full  rounded-lg p-6 flex flex-col gap-4 shadow-lg min-w-[300px]'>
            <h2 className="text-2xl text-[#00F5FF] font-bold mb-2">{title}</h2>
                <p className="text-xl">{message}</p>
                <p className="mb-4 text-xl text-gray-500">{subMsg}</p>
                <div className="flex justify-between gap-2">
                    <button
                        className="px-4 py-2 flex-1 rounded hover:bg-gray-700 transition-colors duration-500"
                        onClick={onCancel}
                    >
                        {t('game.cancel')}
                    </button>
                    <button
                        className="px-4 py-2 flex justify-center flex-1 rounded  text-red-500 hover:bg-red-500/20 transition-colors duration-500"
                        onClick={onConfirm}
                    >
                        {<Loading isloading={loading} label={confirmTitle}/>}
                    </button>
                </div>
            </Motion.div>
            <div className="">

            </div>
        </div>
    );
}
