import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import styles from "../style";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import Loader from "./Loader";
import axios from "axios";

const Upload = ({ setIsLoading }) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
      toast.success("Files added Successfully. Please click on upload", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    maxSize: 1024 * 3000,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    toast.success(`File - "${name}" removed Successfully !!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = (isFromAPI = false) => {
    if (files.length > 0 && !isFromAPI) {
      toast.success("All Files removed Successfully !!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
    toast.success(`File - "${name}" removed Successfully !!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!files?.length) return;

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      axios
        .post(`${import.meta.env.VITE_UploadURL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          removeAll(true);
          setIsLoading(false);
          toast.success("Files Uploaded Successfully !!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        });
      /*   const sasurl = import.meta.env.VITE_STORAGE_SAS_URL;
      const blobService = new BlobServiceClient(sasurl);

      const containerClient = blobService.getContainerClient(
        import.meta.env.VITE_STORAGE_CONTAINER_NAME
      );

      for (const file of files) {
        const blobName = uuidv4() + file.name;
        const blobClient = containerClient.getBlockBlobClient(blobName);
        const options = { blobHTTPHeaders: { blobContentType: file.type } };
        await blobClient.uploadData(file, options);
      } */
    } catch (err) {
      removeAll(true);
      //setIsLoading(false);
      toast.error(err?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <section
        id="upload"
        className={`flex md:flex-row flex-col ${styles.paddingY} h-[100%]`}
      >
        <div className={`flex-1 flex-col xl:px-0 sm:px-16 px-6`}>
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="flex-1 font-poppins font-semibold ss:text-[40px] text-[32px] text-white ss:leading-[100.8px] leading-[75px]">
              Upload Files
            </h1>
          </div>

          <div className={`flex flex-row justify-between items-center w-full`}>
            <div
              {...getRootProps({
                className: "w-[100%] h-[65%] relative z-[5]",
              })}
            >
              <input {...getInputProps()} />
              <div
                className={`flex items-center font-poppins font-semibold  text-white text-[18px] leading-[30.8px] max-w-[95%] h-[200px] mt-5 border-[5px] border-[#3F3E45]`}
                style={{ flexWrap: "wrap", justifyContent: "center" }}
              >
                <div className="flex flex-column">
                  <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
                </div>
                <div
                  className="flex flex-column"
                  style={{ marginLeft: "10px" }}
                >
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>Drag & drop files here, or click to select files</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={`flex flex-row justify-between items-center w-[95%]`}>
            <button
              type="button"
              onClick={removeAll}
              className="h-8 mt-10 text-[12px] uppercase tracking-wider font-bold text-white border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
            >
              Remove all files
            </button>
            <button
              type="submit"
              className="h-8 ml-auto mt-10 text-[12px] uppercase tracking-wider font-bold text-white border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>
          <div className={`flex flex-row justify-between items-start w-full`}>
            <div
              className={`flex flex-row justify-between items-center w-[50%]`}
              style={{ flexWrap: "wrap" }}
            >
              <div className="flex flex-column justify-between items-center w-full">
                <h1 className="flex-1 font-poppins font-nold ss:text-[25px] text-[20px] text-white ss:leading-[100.8px] leading-[75px]">
                  Accepted Files
                </h1>
              </div>

              <div
                className={`flex flex-column justify-between w-[95%]  h-[250px]`}
                style={{
                  wordBreak: "break-all",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <ul className="w-[96%] h-[65%] relative z-[5]">
                  {files.map((file) => (
                    <li
                      key={file.name + uuidv4()}
                      className="relative h-12 rounded-md shadow-lg"
                    >
                      <button
                        type="button"
                        className="mt-3 w-[5%] h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                        onClick={() => removeFile(file.name)}
                      >
                        <XMarkIcon className="w-3 h-3 fill-white hover:fill-secondary-400 transition-colors" />
                      </button>
                      <p className="w-[90%] mt-2 text-white text-[18px] font-medium">
                        {file.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={`flex flex-row justify-between items-start w-[50%]`}
              style={{ flexWrap: "wrap" }}
            >
              <div className="flex flex-column justify-between w-full">
                <h1 className="flex-1 font-poppins font-nold ss:text-[25px] text-[20px] text-white ss:leading-[100.8px] leading-[75px]">
                  Rejected Files
                </h1>
              </div>

              <div
                className={`flex flex-column justify-between w-[95%]  h-[250px]`}
                style={{
                  wordBreak: "break-all",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <ul className="w-[96%] h-[65%] relative z-[5]">
                  {rejected.map(({ file, errors }) => (
                    <li
                      key={file.name}
                      className="flex items-start justify-between"
                    >
                      <div className="w-[95%]">
                        <p className="mt-2 text-white text-sm font-large">
                          {file.name}
                        </p>
                        <ul className="text-[14px] text-red-400">
                          {errors.map((error) => (
                            <li key={error.code}>
                              {error.message.includes("pdf")
                                ? "Only Pdf, Doc(x) and Images are supported."
                                : error.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        className="mt-4 w-[5%] h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center -top-3 -right-3 hover:bg-white transition-colors"
                        style={{ borderRadius: "9999px" }}
                        onClick={() => removeRejected(file.name)}
                      >
                        <XMarkIcon className="w-3 h-3 fill-white hover:fill-secondary-400 transition-colors" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Upload;
