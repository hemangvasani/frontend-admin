import { Center, useDisclosure } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import ImageUploadAndCropper from "../modals/ImageUploadAndCropper";

interface Props {
  // onSuccess: any;
  image: string;
  disabled: boolean;
}

const ImageFormField: React.FC<Props> = ({ image, disabled }) => {
  const [img, setImg] = useState<string>(image);
  const fileRef = useRef<HTMLInputElement>(null);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File>();
  return (
    <>
      <Center>
        <Center
          verticalAlign={"center"}
          height={"100px"}
          width={"100px"}
          cursor={!disabled ? "pointer" : "not-allowed"}
          backgroundColor={img ? "transparent" : "gray.100"}
          backgroundImage={img}
          backgroundSize={"cover"}
          onClick={() => {
            if (!disabled) fileRef?.current?.click();
          }}
        >
          {!disabled && <IoMdCloudUpload color={"gray.600"} size="35px" />}
          <input
            hidden
            ref={fileRef}
            name="file"
            type="file"
            accept="image/*"
            disabled={isOpen}
            onChange={(event) => {
              if (event.target.files && event.target.files.length) {
                setSelectedFile(event.target.files![0]);
                onOpen();
              }
            }}
          />
        </Center>
      </Center>
      {isOpen && (
        <ImageUploadAndCropper
          file={selectedFile}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={(data: any) => {
            setImg((data || {}).img);
            // onSuccess(data);
            onClose();
          }}
        />
      )}
    </>
  );
};
export default ImageFormField;
