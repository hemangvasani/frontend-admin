import { useDisclosure } from "@chakra-ui/react";
import { Spin, Table } from "antd";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useCategoriesMaster } from "../../store/category/reducer";
import CategoryMasterEditDrawer from "../drawer/CategoryMasterEditDrawer";
import CategoryDeleteConfirmation from "../modals/CategoryDeleteConfirmation";

interface Props {
  query: string;
}

const CategoryMasterTable: React.FC<Props> = ({ query }) => {
  const dispatch = useDispatch();
  const { masterCategory, busy } = useCategoriesMaster();
  // const { masterTags, busy: tagbusy } = useTagMaster();

  // useEffect(() => {
  //   if (!tagbusy && !(masterTags || []).length) {
  //     dispatch({ type: REQUEST_MASTER_TAG });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // console.log(masterTags);

  const searchColumns = useMemo(() => ["title", "value.tagId"], []);

  const search = (account: Record<string, any>) => {
    return searchColumns.some((column) => {
      return (
        get(account, column, "")
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      );
    });
  };
  const [targetData, setTargetData] = useState<any>();

  const updates = (value: any) => {
    setTargetData(value);
    onViewOpen();
  };

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const deletes = (value: any) => {
    setTargetData(value);
    onDeleteOpen();
    // console.log(eventMaster);
  };

  // const getTagId = (categoryId: any) => {
  //   let titles: string[] = [];
  //   (masterTags || []).forEach((category: any) => {
  //     if (categoryId.includes(category._id)) {
  //       titles.push(category.title);
  //     }
  //   });
  //   return titles && titles.length ? titles.join(", ") : "Nan";
  // };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(
      masterCategory.filter(search).map((value: any, index: number) => ({
        _id: value._id,
        key: index + 1,
        Index: index + 1,
        title: value.title,
        // tagId:
        //   value.tagId.length !== 0
        //     ? `${get(value, "tagId").map((item: any) => {
        //         return item.title;
        //       })},`
        //     : "Nan",
        // originalSizeImage: value.smallSizeImage
        //   ? `https://onesec.sgp1.digitaloceanspaces.com/${value.smallSizeImage.url}`
        //   : "/logo512.png",
        // tagId: getTagId(value.tagId),
        // categoryId: value.categoryId?.map((item: any) => {
        //   return item.title;
        // }),
        value: value,
      }))
    );
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterCategory, query]);

  const columns = [
    {
      title: "SR N0.",
      dataIndex: "Index",
      width: 80,
    },
    // {
    //   title: "IMAGE",
    //   dataIndex: "originalSizeImage",
    //   width: 130,
    //   render: (r: any) => (
    //     <img
    //       style={{ width: "70px", height: "70px" }}
    //       src={`${r}`}
    //       alt="Blog"
    //     />
    //   ),
    // },
    {
      title: "TITLE",
      dataIndex: "title",
    },
    // {
    //   title: "TAG ID",
    //   dataIndex: "tagId",
    // },
    {
      title: "ACTION",
      dataIndex: "value",
      render: (value: any) => (
        <>
          <button
            className="editbtn"
            onClick={() => {
              updates(value);
            }}
          >
            <FiEdit className="icon" />
          </button>
          <button
            className="deletebtn"
            onClick={() => {
              deletes(value);
            }}
          >
            <RiDeleteBin6Line className="icon" />
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          width: "92vw",
          maxWidth: "92vw",
          height: "86vh",
          top: "8vh ",
          left: "4vw",
          position: "relative",
        }}
      >
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            loading={busy && masterCategory.length === 0 ? true : false}
            scroll={{ y: "calc(68vh - 4em)", x: true }}
          />
        )}
      </div>

      {isDeleteOpen && targetData && (
        <CategoryDeleteConfirmation
          tag={targetData}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
      {isViewOpen && (
        <CategoryMasterEditDrawer
          isOpen={isViewOpen}
          onClose={onViewClose}
          category={targetData}
        />
      )}
    </>
  );
};

export default CategoryMasterTable;
