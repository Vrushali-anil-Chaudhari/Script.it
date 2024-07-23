import { useState } from "react";
import { useModalContext } from "../context/context";
import { Button } from "./ui/Button";
import Modal from "./Modal";

const UploadStatus = () => {
    const { files, openModal, status , modal} = useModalContext();
    const files_length = files.length;

    console.log('statusstatusstatus',status);

    const STATUS_CLASSES = {
        SUCCESS: {
            border: "border-green-600",
            bg: "bg-green-400",
            text: "text-green-400",
        },
        IN_PROGRESS: {
            border: "border-orange-600",
            bg: "bg-orange-400",
            text: "text-orange-400",
        },
        FAILED: {
            border: "border-red-600",
            bg: "bg-red-400",
            text: "text-red-400",
        },
        IDLE: {
            border: "border border-[#bbb]",
            bg: "bg-blue-400",
            text: "text-blue-500",
        },
    };

    const currentClasses = STATUS_CLASSES[status.state] || STATUS_CLASSES.IDLE;

    return (
        <div className={`border rounded-md py-1 w-[330px] px-2 ${currentClasses.border}`}>
            <div className="w-full h-full flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <div
                            className={`size-2 rounded-full ${currentClasses.bg} ${currentClasses.text} flex items-center justify-center`}
                        >
                            <div
                                className={`size-2 rounded-full border ${currentClasses.bg} ${currentClasses.text} animate-ping`}
                            />
                        </div>
                        <p className={`text-xs ${currentClasses.text}`}>{status.state}</p>
                    </div>
                    <p className={currentClasses.text}>
                        {status.state === "FAILED" && status.message}
                        {status.state === "SUCCESS" && "File Upload Successful"}
                        {status.state === "IN_PROGRESS" && `Uploading ${files_length} files`}
                        {status.state === "IDLE" && "Nothing to Upload"}
                    </p>
                </div>
                <Button
                    variant="primary"
                    className="relative overflow-hidden z-20"
                    onClick={openModal}
                >
                    <div className="absolute bg-gradient-to-r from-[#262626] to-[#525252] h-[100px] w-[20px] rotate-[15deg] animate-shine -top-1 bottom-0 left-0 blur z-[-1]" />
                    <p>View Files</p>
                </Button>
            </div>
            {
                modal ? <Modal /> : null
            }
        </div>
    );
};

export default UploadStatus;
