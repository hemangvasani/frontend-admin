import { Box, useDisclosure } from "@chakra-ui/react";
import { Spin, Table } from "antd";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { REQUEST_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import { useCategoriesMaster } from "../../store/category/reducer";
import CategoryMasterEditDrawer from "../drawer/CategoryMasterEditDrawer";
import AddNewSubServiceModal from "../modals/AddNewSubServiceModal";
import CategoryDeleteConfirmation from "../modals/CategoryDeleteConfirmation";
import ServiceMainDeleteConfirmation from "../modals/ServiceMainDeleteConfirmation";
import { BiEditAlt } from "react-icons/bi";
import { useSubServicesMaster } from "../../store/subservices/reducer";
import AddSubServiceDrawer from "../drawer/AddSubServiceDrawer";

interface Props {
  query: string;
  selectedService: string;
}

const OurServicesMasterTable: React.FC<Props> = ({
  query,
  selectedService,
}) => {
  const { masterSubServices, busy } = useSubServicesMaster();
  console.log("ohvoidfhvfd", masterSubServices.data);
  const [targetData, setTargetData] = useState<any>();
  // const searchColumns = useMemo(() => ["title", "value.tagId"], []);
  // const searchColumns = useMemo(
  //   () => ["value.title", "value.tagId", "value.name"],
  //   []
  // );
  const searchColumns = useMemo(() => ["name"], []); // Changed this line
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

  const updates = (value: any) => {
    // setTargetData(value);
    const formattedData = {
      _id: value._id,
      service: value.service,
      name: value.name,
      description: value.description,
      url: value.image
        ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
        : "/logo512.png",
    };

    setTargetData(formattedData);
    onUpdateOpen();
  };

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(
      masterSubServices?.data
        .filter(search)
        .map((value: any, index: number) => ({
          _id: value._id,
          key: index + 1,
          Index: index + 1,
          title: value.name,
          description: value.description,
          headtitle: value.service?.name,
          // tagId:
          //   value.tagId.length !== 0
          //     ? `${get(value, "tagId").map((item: any) => {
          //         return item.title;
          //       })},`
          //     : "Nan",

          originalSizeImage: value.image
            ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
            : "/logo512.png",
          // tagId: getTagId(value.tagId),
          // categoryId: value.categoryId?.map((item: any) => {
          //   return item.title;
          // }),
          value: value,
          // console.log('Service object:', value.service);
        }))
    );
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterSubServices, query]);

  // useEffect(() => {
  //   if (!masterSubServices?.data) {
  //     setLoading(false);
  //     return;
  //   }

  //   const filteredData = masterSubServices.data
  //     .filter((value: any) => {
  //       const serviceMatch =
  //         !selectedService || value.service?._id === selectedService;
  //       const nameMatch =
  //         !query ||
  //         value.name?.toString().toLowerCase().includes(query.toLowerCase());

  //       return serviceMatch && nameMatch;
  //     })
  //     .map((value: any, index: number) => ({
  //       _id: value._id,
  //       key: index + 1,
  //       Index: index + 1,
  //       title: value.name,
  //       description: value.description,
  //       headtitle: value.service?.name,
  //       originalSizeImage: value.image
  //         ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
  //         : "/logo512.png",
  //       value: value,
  //     }));

  //   setData(filteredData);
  //   setLoading(false);
  // }, [masterSubServices, query, selectedService]);

  const columns = [
    {
      title: "SR.NOS",
      dataIndex: "Index",
      width: 100,
      color: "#9E9E9E",
    },
    {
      title: "IMAGE",
      dataIndex: "originalSizeImage",
      width: 130,
      render: (r: any) => (
        <img
          style={{ width: "70px", height: "70px" }}
          src={`${r}`}
          alt="Blog"
        />
      ),
    },
    {
      title: "HEADING",
      dataIndex: "title",
      color: "#9E9E9E",
      width: 350,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      color: "#9E9E9E",
    },
    {
      title: "TITLE",
      dataIndex: "headtitle",
      color: "#9E9E9E",
      width: 100,
    },
    {
      title: "ACTION",
      dataIndex: "value",
      width: 200,
      render: (value: any) => (
        <>
          <button
            className="editbtn"
            onClick={() => {
              updates(value);
            }}
            // style={{display:"flex",
            // alignItems:"center",
            // fontSize:"14px",
            // color:"#cd30ff",
            // border:"1px solid #EEE",
            // borderRadius:"6px",
            // background:"#cd30ff"}}
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
            color="#FDF5FF"
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
          top: "8vh",
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
            loading={busy && masterSubServices.length === 0 ? true : false}
            scroll={{ y: "calc(68vh - 4em)", x: true }}
          />
        )}
      </div>

      {isDeleteOpen && targetData && (
        <ServiceMainDeleteConfirmation
          servicemain={targetData}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
      {isUpdateOpen && (
        <AddSubServiceDrawer
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          servicemain={targetData}
        />
      )}
    </>
  );
};

export default OurServicesMasterTable;
