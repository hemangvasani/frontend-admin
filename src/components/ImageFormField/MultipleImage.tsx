import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  onSuccess: any;
  disabled?: boolean;
  image: any;
}

const MultipleImage: React.FC<Props> = ({ onSuccess, disabled, image }) => {
  const [mainData, setMainData] = useState<any>(image);
  const [loader, setLoader] = useState(false);

  function uploadSingleFile(e: any) {
    let ImagesArray = Object.entries(e.target.files).map((e: any) => e[1]);
    setLoader(true);
    var makeArr: any = [];
    for (let i = 0; i < ImagesArray.length; i++) {
      let payload = new FormData();
      payload.append("image", ImagesArray[i]);
      axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/image`,
        data: payload,
      })
        .then(function (response) {
          // console.log(response.data);
          makeArr.push(response.data);
          if (makeArr.length === ImagesArray.length) {
            setMainData([...mainData, ...makeArr]);
            setLoader(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          setLoader(false);
        });
    }
    // let payload = new FormData();
    // payload.append("image", e.target.files[0]);
    // axios({
    //   method: "post",
    //   url: `${process.env.REACT_APP_BASE_URL}/image`,
    //   data: payload,
    // })
    //   .then(function (response) {
    //     // console.log(response.data);
    //     setMainData([...mainData, response.data]);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }

  function removeImage(item: any) {
    const newList = mainData.filter((val: any) => val !== item);
    setMainData(newList);
  }
  useEffect(() => {
    onSuccess(mainData);
  }, [mainData]);

  return (
    <div style={{ width: "100%", marginBottom: "20px" }}>
      <div className="form-group preview">
        {mainData.length > 0 &&
          mainData?.map((item: any, index: any) => {
            return (
              <div key={index} className="singleImage">
                <img src={item.url} alt="event image" className="img-preview" />
                {!disabled ? (
                  <button
                    type="button"
                    onClick={() => removeImage(item)}
                    className="delete-btn"
                  >
                    <AiOutlineClose />
                  </button>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        {loader ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
            mb={4}
            ml={4}
          />
        ) : !disabled ? (
          <input
            accept="image/*"
            type="file"
            multiple={true}
            disabled={mainData.length > 14}
            className="form-control customImageInput"
            onChange={uploadSingleFile}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default MultipleImage;
