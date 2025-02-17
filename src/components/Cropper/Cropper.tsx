import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Center, Flex, HStack, VStack } from "@chakra-ui/react";
import { Buffer } from "buffer";
import axios from "axios";

interface ImageProps {
  file: any;
  fromChild: any;
}

interface respons {
  type: any;
  data: any;
}

export const Crop: React.FC<ImageProps> = ({ file, fromChild }) => {
  const [preview, setPreview] = useState<any | null>(null);

  const [cropper, setCropper] = useState<any>(null);

  const cropperRef = useRef<HTMLImageElement>(null);

  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  useEffect(() => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  }, [file]);

  if (!file || file === "") {
    return <p>Loading....</p>;
  }
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    fromChild({
      img: "",
      show: false,
      file: "",
    });
  }

  const getCropData = async () => {
    if (cropper) {
      let matches = await cropper
        .getCroppedCanvas()
        .toDataURL()
        .match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let response: respons = {
        type: "",
        data: "",
      };

      if (matches.length !== 3) {
        return new Error("Invalid input string");
      }
      response.type = matches[1];
      response.data = Buffer.from(matches[2], "base64");
      let decodedImg = response;
      let imageBuffer = decodedImg.data;
      // let type = decodedImg.type;
      let arr = cropper.getCroppedCanvas().toDataURL().split(",");
      let extension = arr[0].match(/:(.*?);/)[1];
      let fileName = `undefined_` + new Date().getTime() + "demo." + extension;

      const fil = await new File([imageBuffer], fileName, {
        type: "image/png",
      });

      try {
        let formdata = new FormData();
        formdata.append("image", fil);
        await axios({
          url: `${process.env.REACT_APP_BASE_URL}/image`,
          method: "POST",
          data: formdata,
          withCredentials: true,
        })
          .then((res) => {
            fromChild({
              img: res.data.url,
              _id: res.data._id,
              show: false,
              file: file.name,
            });
          })
          .catch((error) => {});
      } catch (error: any) {}
    }
  };

  if (!preview) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <Center>
        <Flex>
          <VStack>
            <Cropper
              src={preview}
              style={{ height: "400px", width: "400px" }}
              ref={cropperRef}
              preview=".img-preview"
              viewMode={1}
              initialAspectRatio={1}
              aspectRatio={1}
              // minCropBoxHeight={250}
              // minCropBoxWidth={202}
              background={false}
              dragMode="move"
              // responsive={true}
              // checkOrientation={false}
              cropBoxResizable={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
            <HStack>
              <Button
                style={{ float: "right" }}
                onClick={() => {
                  getCropData();
                }}
                whiteSpace="pre"
              >
                Crop Image
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Center>
    </>
  );
};
