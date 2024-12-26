import { background, calc, useDisclosure } from "@chakra-ui/react";
import { Spin, Table } from "antd";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { SET_MASTER_HOME } from "../../store/home/homeActionTypes";
import { useHomeMaster } from "../../store/home/reducer";
import HomeMasterEditDrawer from "../drawer/HomeMasterEditDrawer";
import HomeDeleteConfirmation from "../modals/HomeDeleteConfirmation";

interface Props {
  query: string;
}

const HomeMasterTable: React.FC<Props> = ({ query }) => {
  const dispatch = useDispatch();
  const { masterHome, busy } = useHomeMaster();
  console.log(masterHome, "hshshsshsh");
  const searchColumns = useMemo(() => ["product_name"], []);

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
  console.log(targetData, "targetData");

  const updates = (value: any) => {
    const formattedData = {
      _id: value._id,
      // name: value.category.name,
      name: value.product_name,
      category: value.category,
      description: value.heading_sub,
      tstatement: value.transformation_statement,
      url: value.image
        ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
        : "/logo512.png",
      icon_image: value.icon_image
        ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.icon_image.url}`
        : "/logo512.png",
      description2: value.heading_main,
      // Add tags
      tags: value.tags?.join(" ") || "",
      // Add key features
      keyFeatures:
        value.key_features?.map((feature: any) => ({
          title: feature.heading,
          keydesc: feature.paragraph,
        })) || [],
      productDetails: value.details,
    };
    setTargetData(formattedData);
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

  console.log(masterHome, "masterrrrrrr");

  useEffect(() => {
    setData(
      masterHome.filter(search).map((value: any, index: number) => ({
        _id: value._id,
        key: index + 1,
        Index: index + 1,
        title: value.category.name,
        description: value.heading_sub,
        tstatement: value.transformation_statement.substring(0, 100),
        title2: value.product_name,

        // tagId:
        //   value.tags.length !== 0
        //     ? `${get(value, "tags").map((item: any) => {
        //         return item;
        //       })},`
        //     : "Nan",

        tagId: value.tags
          ?.map((item: any) => {
            return item;
          })
          .join(","),
        originalSizeImage: !value.smallSizeImage
          ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
          : "/logo512.png",

        description2: value.heading_main,
        features: value.key_features
          ?.map((item: any) => {
            return item.heading;
          })
          .join(", "),
        value: value,
      }))
    );
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterHome, query]);

  const columns = [
    {
      title: "SR.NO",
      dataIndex: "Index",
      width: 120,
    },
    {
      title: "IMAGE",
      dataIndex: "originalSizeImage",
      width: 150,
      render: (r: any) => (
        <img
          style={{ width: "70px", height: "70px" }}
          src={`${r}`}
          alt="Blog"
        />
      ),
    },
    {
      title: "NAME",
      dataIndex: "title2",
      // width: 100,
    },
    {
      title: "HEADING SUB",
      dataIndex: "description",
      // width: 350,
    },
    {
      title: "STATEMENT",
      dataIndex: "tstatement",
      // width: 350,
    },
    {
      title: "TAGS",
      dataIndex: "tagId",
      width: 200,
    },
    {
      title: "HEADING Main",
      dataIndex: "description2",
      // width: 200,
    },
    {
      title: "KEY FEATURES",
      dataIndex: "features",
      // width: 350,
    },
    {
      title: "ACTIONS",
      dataIndex: "value",
      width: 150,
      render: (value: any) => (
        <>
          <button
            className="editbtn"
            onClick={() => {
              updates(value);
            }}
          >
            <BiEditAlt
              className="icon"
              color="#cb30ff"
              // style={{ marginRight: "10px" }}
            />
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
            loading={busy && masterHome.length === 0 ? true : false}
            scroll={{ y: "calc(68vh - 4em)", x: true }}
            // scroll={{ x: "calc(100vw - 0em)" }}
          />
        )}
      </div>

      {isDeleteOpen && targetData && (
        <HomeDeleteConfirmation
          tag={targetData}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
      {isViewOpen && (
        <HomeMasterEditDrawer
          isOpen={isViewOpen}
          onClose={onViewClose}
          category={targetData}
        />
      )}
    </>
  );
};

export default HomeMasterTable;
