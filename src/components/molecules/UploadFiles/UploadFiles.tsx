/* eslint-disable react/jsx-props-no-spreading */
import axios, { AxiosRequestConfig } from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { FileError, useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { SpinnerDotted } from 'spinners-react';
import { webchatProps } from '../../WebChat/webchat.interface';

export interface UploadableFile {
  name?: string | undefined;
  id?: number;
  file: File;
  errors: FileError[];
}

export const UploadFiles: FC<webchatProps> = function ({
  fromId,
  setUploadActive,
  svgBack,
}) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file.file, file.name);
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedAcc = acceptedFiles.map((file, index) => ({
      file,
      errors: [],
      id: index + Date.now(),
    }));
    setFiles((curr) => [...curr, ...mappedAcc]);
  }, []);

  const onDelete = (file: File) => {
    setFiles((currentList) => currentList.filter((fw) => fw.file !== file));
  };

  const acceptedFiles = 'image/jpeg, image/png, application/pdf';

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: acceptedFiles,
    noKeyboard: true,
    noClick: true,
    onDrop,
  });

  const handleAdjuntarClick = async () => {
    try {
      if (sessionStorage?.getItem('chatId')) {
        const chatId = sessionStorage?.getItem('chatId');
        setUploading(true);
        const axiosConfig: AxiosRequestConfig = {
          url: `${processEnv.restUrl}/webchat/sendFiles/${chatId}?from=${fromId}&companyId=${processEnv.companyId}`,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        await axios(axiosConfig);
        setUploading(false);
        setUploadActive(false);
      }
    } catch (error) {
      Swal.fire({
        title:
          'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
        confirmButtonText: 'OK',
        confirmButtonColor: processEnv.mainColor,
        customClass: {
          popup: 'animated animate__fadeInDown',
        },
      });
    }
  };

  const dropZonetotalSize = files.reduce(
    (acc, curr) => acc + curr.file.size,
    0,
  );

  return (
    <div {...getRootProps()}>
      {!isDragActive ? (
        <div className="drop-here-container__ewc-class">
          <div className="drop-here__ewc-class">
            <div>Arrastra tus archivos y suéltalos AQUÍ!</div>
            <img
              src={svgBack.FileUpload}
              alt="Arrastre aquí sus archivos..."
              width="70px"
              height="70px"
            />
          </div>
          {files.length > 0 && (
            <div className="files-uploaded-container__ewc-class">
              <div className="files-uploaded-header__ewc-class">
                <span>
                  {files.length > 0 ? files.length : 0} archivo
                  {files.length > 1 && 's'} con un peso total de{' '}
                  {(dropZonetotalSize / 1024 / 1024).toFixed(2)}
                  MB
                </span>
              </div>
              <div className="file-uploaded-wrapper__ewc-class">
                {files.map((file) => (
                  <div key={file.id} className="file-uploaded__ewc-class">
                    {file.file.type === 'application/pdf' ? (
                      <img
                        className="file-icon-uploaded__ewc-class"
                        src={svgBack.PdfIcon}
                        alt="file"
                      />
                    ) : (
                      <img
                        className="file-icon-uploaded__ewc-class"
                        src={svgBack.ImageIcon}
                        alt="file"
                      />
                    )}
                    <div className="file-uploaded-name__ewc-class">
                      {file.file.name.length > 20
                        ? `${file.file.name.substring(
                            0,
                            20,
                          )}... ${file.file.name
                            .substring(file.file.name.length - 4)
                            .replace('.', '[')
                            .toLocaleUpperCase()}${']'}`
                        : file.file.name}
                    </div>
                    <div className="file-uploaded-size__ewc-class">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="file-uploaded-delete__ewc-class">
                      <button
                        type="button"
                        className="file-uploaded-delete-button__ewc-class"
                        onClick={() => onDelete(file.file)}>
                        x
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="drop-zone-container__ewc-class drop-zone__ewc-class">
          <div className="drop-zone-icon-container__ewc-class">
            <img
              className="drop-zone-image__ewc-class"
              src={svgBack.FileUpload}
              alt="file"
            />
          </div>
          <div className="drop-zone__ewc-class" />
        </div>
      )}
      <button
        onClick={open}
        type="button"
        className="click-to-upload-button__ewc-class">
        <input type="button" {...getInputProps()} />
        <div>
          <span>Click aquí para adjuntar un archivo</span>
          <img
            className="upload-icon__ewc-class"
            src={svgBack.UploadClick}
            alt="file"
          />
        </div>
      </button>
      {uploading && sessionStorage.getItem('chatId') ? (
        <button
          type="button"
          className="send-button-upload__ewc-class"
          disabled>
          <SpinnerDotted
            size={30}
            thickness={120}
            speed={104}
            color="#f5f5f5"
          />
        </button>
      ) : (
        <button
          type="button"
          className={
            files.length > 0
              ? 'send-button-upload__ewc-class prepared-to-send__ewc-class'
              : 'send-button-upload__ewc-class'
          }
          onClick={handleAdjuntarClick}>
          <img
            className="send-image-upload__ewc-class"
            src={svgBack.SendButton}
            alt="send-uploaded-files"
          />
        </button>
      )}
    </div>
  );
};
