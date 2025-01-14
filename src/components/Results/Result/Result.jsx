import React from "react";

import "./Result.css";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

export default function Result(props) {
  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
  }

  async function downloadBlob() {
    const sasurl = import.meta.env.VITE_STORAGE_SAS_URL;
    const blobService = new BlobServiceClient(sasurl);

    const containerClient = blobService.getContainerClient(
      import.meta.env.VITE_STORAGE_CONTAINER_NAME
    );

    const fileName = props?.blobUrl.split("/").pop();
    const blobClient = containerClient.getBlobClient(fileName);
    console.log("BlobClient", blobClient);

    const downloadBlockBlobResponse = await blobClient.download();
    const url = window.URL.createObjectURL(
      await downloadBlockBlobResponse.blobBody
    );

    downloadURI(
      url,
      fileName.match(
        /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}(.*)/
      )[1]
    );
    console.log("Downloaded blob to string content", url);
  }

  return (
    <a
      onClick={downloadBlob}
      className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      style={{ wordWrap: "break-word" }}
    >
      <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {props.document.blobFileName}
      </h6>
    </a>
  );
}
