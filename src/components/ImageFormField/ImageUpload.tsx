import React, { useEffect, useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { IImage } from '../../types/image';

interface Props {
  onSuccess: any;
  disabled?: boolean;
  // image: string;
  // disabled: boolean;
}

const ImageUpload: React.FC<Props> = ({onSuccess,disabled }) => {
// const ImageUpload: React.FC = () => {

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [file, setFile] = useState<IImage[]>([]);

  
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const token = localStorage.getItem("token")

  useEffect(() => {
    // console.log(fileList);
    onSuccess(fileList)
  }, [fileList])

  return (
    <>
      {/* <ImgCrop rotate>
          
        </ImgCrop> */}
      <Upload
        action="http://65.0.77.129:3600/image"
        listType="picture-card"
        withCredentials={true}
        fileList={fileList}
        name={'image'}
        disabled={!!disabled}
        headers={{ authorization: `${token}` }}
        
        // onSuccess={(fileList: any) => {
        //   onSuccess(fileList);
        // }}
        onChange={onChange}
        onPreview={onPreview} capture={undefined}
      >
        {/* {fileList.length  && '+ Upload'} */}
        {fileList.length >= 8 ? null : '+ Upload'}
        {/* {'+ Upload'} */}

      </Upload>
    </>
  );
}

export default ImageUpload;