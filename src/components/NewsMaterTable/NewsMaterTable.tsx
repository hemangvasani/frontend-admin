import React, { useEffect, useMemo, useState } from "react";
import { get } from "lodash";
import moment from "moment";
import { Spin, Table, Button } from "antd";
import { useDisclosure } from "@chakra-ui/react";
import { FiEdit, FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNewsMaster } from "../../store/news/reducer";
import NewsEditDrawer from "../drawer/NewsEditDrawer";
import NewsDeleteConfirmation from "../modals/NewsDeleteConfirmation";
interface props {
  query: string;
}

const NewsMaterTable: React.FC<props> = ({ query }) => {
  const { masterNews, busy: eventBusy } = useNewsMaster();
  const [targetevent, setTargetEvent] = useState<any>();
  const searchColumns = useMemo(() => ["title", "description"], []);

  const search = (event: Record<string, any>) => {
    return searchColumns.some((column) => {
      return (
        get(event, column, "")
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      );
    });
  };

  const [data, setData] = useState([]);
  const [loading, setloading] = useState(true);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const deleteEvent = (eventMaster: any) => {
    setTargetEvent(eventMaster);
    onDeleteOpen();
  };

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const updateEvent = (eventMaster: any) => {
    setTargetEvent(eventMaster);
    onUpdateOpen();
  };

  useEffect(() => {
    setData(
      masterNews.filter(search).map((value: any, index: number) => ({
        _id: value._id,
        key: index + 1,
        Index: index + 1,
        title: value.title,
        // subTitle: value.subTitle,
        imageId: value.imageId
          ? `https://clinet-test.sgp1.digitaloceanspaces.com/${value.imageId.url}`
          : "/logo512.png",
        description:
          value.description.slice(0, 30) +
          (`${value.description}`.length > 30 ? "..." : ""),
        createdAt: value.createdAt
          ? moment(value.createdAt).format("MMMM Do, YYYY, h:mm:ss a")
          : "none",
        value: value,
      }))
    );

    setloading(false);
  }, [masterNews, query]);

  const columns = [
    {
      title: "Sr.",
      dataIndex: "Index",
      width: 60,
    },
    {
      title: "IMAGE",
      dataIndex: "imageId",
      width: 130,
      render: (r: any) => (
        <img
          style={{ width: "70px", height: "70px" }}
          src={`${r}`}
          alt="News"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      // width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      // width: 100,
    },

    {
      title: "Created Date",
      dataIndex: "createdAt",
      //   sorter: {
      //     compare: (a: any, b: any) =>
      //       m (a.date, "DD/MM/YYYY HH:mm").unix() -
      //       moment(b.date, "DD/MM/YYYY HH:mm").unix(),
      //   },
      // width: 100,
    },
    {
      title: "ACTION",
      dataIndex: "value",
      render: (value: any) => (
        <>
          <button
            className="editbtn"
            onClick={() => {
              updateEvent(value);
            }}
          >
            <FiEdit className="icon" />
          </button>
          <button
            className="deletebtn"
            onClick={() => {
              deleteEvent(value);
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
          width: "97vw",
          maxWidth: "97vw",
          top: "5vh ",
          left: "2vw",
          position: "relative",
        }}
      >
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            loading={eventBusy && data.length === 0 ? true : false}
            // pagination={{ pageSize: 50 }}
            scroll={{ y: "calc(71vh - 1em)" }}
            // rowClassName={(record: any) => record.color}
          />
        )}
      </div>
      {isDeleteOpen && targetevent && (
        <NewsDeleteConfirmation
          news={targetevent}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}

      {isUpdateOpen && (
        <NewsEditDrawer
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          news={targetevent}
        />
      )}
    </>
  );
};

export default NewsMaterTable;
