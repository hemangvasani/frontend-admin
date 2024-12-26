import React, { useEffect, useMemo, useState } from "react";
import { get } from "lodash";
import moment from "moment";
import { Spin, Table, Button } from "antd";
import { useDisclosure } from "@chakra-ui/react";
import { FiEdit, FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import { useEventMaster } from "../../store/event/reducer";
import EventDeleteConfirmation from "../modals/EventDeleteConfirmation";
import EventMasterEditDrawer from "../drawer/EventMasterEditDrawer";
interface props {
  query: string;
}

const EventMasterTable: React.FC<props> = ({ query }) => {
  const { masterEvent, busy: eventBusy } = useEventMaster();

  const [targetevent, setTargetEvent] = useState<any>();

  const searchColumns = useMemo(
    () => [
      "title",
      "price",
      "isInside",
      "recommendedAge",
      "bookedSeat",
      "totalCapacity",
      "startTime",
      "endTime",
    ],
    []
  );

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
  // useEffect(() => {
  //   console.log(data);

  // })

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const deleteEvent = (eventMaster: any) => {
    setTargetEvent(eventMaster);
    onDeleteOpen();
    // console.log(eventMaster);
  };
  //   const {
  //     isOpen: isViewOpen,
  //     onOpen: onViewOpen,
  //     onClose: onViewClose,
  //   } = useDisclosure();

  //   const viewEvent = (eventMaster: any) => {
  //     setTargetEvent(eventMaster);
  //     onViewOpen();
  //   };

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const updateEvent = (eventMaster: any) => {
    setTargetEvent(eventMaster);
    onUpdateOpen();
  };

  //   const {
  //     isOpen: isCancelOpen,
  //     onOpen: onCancelOpen,
  //     onClose: onCancelClose,
  //   } = useDisclosure();

  //   const cancelEvent = (eventMaster: any) => {
  //     setTargetEvent(eventMaster);
  //     onCancelOpen();
  //   };

  //   const {
  //     isOpen: isCloseOpen,
  //     onOpen: onCloseOpen,
  //     onClose: onCloseClose,
  //   } = useDisclosure();

  //   const closeEvent = (eventMaster: any) => {
  //     setTargetEvent(eventMaster);
  //     onCloseOpen();
  //   };

  // const {
  //   isOpen: isPastOpen,
  //   onOpen: onPastOpen,
  //   onClose: onPastClose,
  // } = useDisclosure();

  // const updatePastEvent = (eventMaster: IEvent) => {
  //   setTargetEvent(eventMaster);
  //   onPastOpen();
  // };

  useEffect(() => {
    setData(
      masterEvent.filter(search).map((value: any, index: number) => ({
        _id: value._id,
        key: index + 1,
        Index: index + 1,
        title: value.title,
        // subTitle: value.subTitle,
        description:
          value.description.slice(0, 30) +
          (`${value.description}`.length > 30 ? "..." : ""),
        mobileNo: value.mobileNo,
        eventAdd:
          value.eventAdd.slice(0, 30) +
          (`${value.eventAdd}`.length > 30 ? "..." : ""),
        date: value.date ? moment(value.date).format("DD/MM/YYYY") : "none",

        google_directionLink:
          value.google_directionLink.slice(0, 20) +
          (`${value.google_directionLink}`.length > 20 ? "..." : ""),
        apple_directionLink:
          value.apple_directionLink.slice(0, 20) +
          (`${value.apple_directionLink}`.length > 20 ? "..." : ""),
        time: value.time,
        eventCategoryId: value.eventCategoryId.title,
        createdAt: value.createdAt
          ? moment(value.createdAt).format("MMMM Do, YYYY, h:mm:ss a")
          : "none",
        value: value,
      }))
    );

    setloading(false);
  }, [masterEvent, query]);

  const columns = [
    {
      title: "Sr.",
      dataIndex: "Index",
      width: 60,
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
      title: "Mobile No.",
      dataIndex: "mobileNo",
      // width: 100,
    },
    {
      title: "Address",
      dataIndex: "eventAdd",
      //   sorter: (a: any, b: any) => a.eventAdd - b.eventAdd,
      // width: 100,
    },
    {
      title: "Google Map Link",
      dataIndex: "google_directionLink",
      //   sorter: (a: any, b: any) => a.eventAdd - b.eventAdd,
      // width: 100,
    },
    {
      title: "Apple Map Link",
      dataIndex: "apple_directionLink",
      //   sorter: (a: any, b: any) => a.eventAdd - b.eventAdd,
      // width: 100,
    },
    {
      title: "Date",
      dataIndex: "date",
      //   sorter: {
      //     compare: (a: any, b: any) =>
      //       m (a.date, "DD/MM/YYYY HH:mm").unix() -
      //       moment(b.date, "DD/MM/YYYY HH:mm").unix(),
      //   },
      // width: 100,
    },
    {
      title: "Time",
      dataIndex: "time",
      // width: 100,
    },
    {
      title: "Category",
      dataIndex: "eventCategoryId",
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
        <EventDeleteConfirmation
          event={targetevent}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}

      {isUpdateOpen && (
        <EventMasterEditDrawer
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          event={targetevent}
        />
      )}
    </>
  );
};

export default EventMasterTable;
