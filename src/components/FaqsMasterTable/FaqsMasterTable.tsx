import { useDisclosure } from "@chakra-ui/react";
import { Spin, Table } from "antd";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useFaqsMaster } from "../../store/faq/reducer";
import FaqsEditDrawer from "../drawer/FaqsEditDrawer";
import FaqDeleteModal from "../modals/FaqDeleteModal";

interface Props {
  query: string;
}

const FaqsMasterTable: React.FC<Props> = ({ query }) => {
  const dispatch = useDispatch();
  const { masterFaqs, busy } = useFaqsMaster();
  //   console.log(masterFaqs, "hshshsshsh");
  const searchColumns = useMemo(() => ["answer", "question", "category"], []);

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
      masterFaqs.filter(search).map((value: any, index: number) => ({
        _id: value._id,
        key: index + 1,
        Index: index + 1,
        answer: value.answer,
        category: value.category,
        question: value.question,
        hidden: value.hidden,
        value: value,
      }))
    );
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterFaqs, query]);

  const columns = [
    {
      title: "SR.NOS",
      dataIndex: "Index",
      width: 100,
    },
    // {
    //   title: "IMAGE",
    //   dataIndex: "originalSizeImage",
    //   width: 100,
    //   render: (r: any) => (
    //     <img
    //       style={{ width: "70px", height: "70px" }}
    //       src={`${r}`}
    //       alt="Blog"
    //     />
    //   ),
    // },
    {
      title: "Category",
      dataIndex: "category",
      //   width: 100,
    },
    {
      title: "Question",
      dataIndex: "question",
      //   width: 380,
    },
    {
      title: "Answer",
      dataIndex: "answer",
      width: 370,
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
            loading={busy && masterFaqs.length === 0 ? true : false}
            scroll={{ y: "calc(68vh - 4em)", x: true }}
            // scroll={{ x: "calc(100vw - 0em)" }}
          />
        )}
      </div>

      {isDeleteOpen && targetData && (
        <FaqDeleteModal
          faq={targetData}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
      {isViewOpen && targetData && (
        <FaqsEditDrawer
          isOpen={isViewOpen}
          onClose={onViewClose}
          faqs={targetData}
        />
      )}
    </>
  );
};

export default FaqsMasterTable;
