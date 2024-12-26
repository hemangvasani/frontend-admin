import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  onSuccess: any;
  disabled?: boolean;
  image: any;
}

const SingleImageUpload: React.FC<Props> = ({ onSuccess, disabled, image }) => {
  const [mainData, setMainData] = useState<any>(image);
  const [loader, setLoader] = useState(false);

  function uploadSingleFile(e: any) {
    setLoader(true);
    let payload = new FormData();
    payload.append("image", e.target.files[0]);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/image`,
      data: payload,
    })
      .then(function (response) {
        // console.log(response.data);
        setMainData(response.data);
        setLoader(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function removeImage(item: any) {
    setMainData("");
  }
  // console.log(mainData);

  useEffect(() => {
    onSuccess(mainData._id);
  }, [mainData]);
  return (
    <div style={{ width: "100%" }}>
      <div className="form-group preview">
        {mainData.url ? (
          <>
            <div className="singleImage">
              <img
                src={`https://clinet-test.sgp1.digitaloceanspaces.com/${mainData.url}`}
                alt=""
                className="img-preview"
              />
              {/* {!disabled ? ( */}
              <button
                type="button"
                onClick={() => removeImage(mainData)}
                className="delete-btn"
              >
                <AiOutlineClose />
              </button>
              {/* ) : (
                ""
              )} */}
            </div>
          </>
        ) : (
          <>
            {!loader ? (
              <input
                accept="image/*"
                type="file"
                // disabled={true}
                className="form-control customImageInput"
                onChange={uploadSingleFile}
              />
            ) : (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
                mb={6}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default SingleImageUpload;
