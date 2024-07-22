import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as api from "../api/api.js"

const AudioUploader = () => {
  const onDrop = useCallback((acceptedFiles) => {
    api.convertAudio(acceptedFiles[0])
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default AudioUploader;
