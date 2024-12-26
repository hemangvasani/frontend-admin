import { Tag, useDisclosure } from "@chakra-ui/react";
import { Spin, Table } from "antd";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useOurClientsMaster } from "../../store/ourclients/reducer";
import EditClientDrawer from "../drawer/EditClientDrawer";
import ClientDeleteConfirmationModal from "../modals/ClientDeeleteConfirmationModal";
import ServiceMainDeleteConfirmation from "../modals/ServiceMainDeleteConfirmation";

interface Props {
  query: string;
  selectedService: string;
}

interface ClientData {
  _id: string;
  clientname: string;
  projectTitle: string;
  industry: string;
  tags?: string[];
  image?: {
    url: string;
  };
}
const OurClientsMasterTable: React.FC<Props> = ({ query, selectedService }) => {
  const { masterOurClients, busy } = useOurClientsMaster();
  // console.log("master client data", masterOurClients);
  const [targetData, setTargetData] = useState<any>();
  // const searchColumns = useMemo(() => ["title", "value.tagId"], []);
  // const searchColumns = useMemo(
  //   () => ["value.title", "value.tagId", "value.name"],
  //   []
  // );
  const searchColumns = useMemo(() => ["projectTitle", "industry"], []); // Changed this line
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
      client: value.clientname,
      projecttitle: value.projectTitle,
      industry: value.industry,
      tags: value.tags,
      url: value.image
        ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
        : "/logo512.png",
      clientstory: value.story,
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

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Array.isArray(masterOurClients)) {
      setData([]);
      setLoading(false);
      return;
    }
    const filteredData = masterOurClients
      .filter(search)
      .map((value: ClientData, index: number) => ({
        _id: value._id,
        key: index + 1,
        Index: index + 1,
        client: value.clientname,
        projecttitle: value.projectTitle,
        industry: value.industry,
        tags: value.tags || [],
        originalSizeImage: value.image
          ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value.image.url}`
          : "/logo512.png",
        // value: value,
        value: {
          ...value,
          tags: value.tags || [],
        },
      }));

    setData(filteredData);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterOurClients, query]);

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
      title: "CLIENT NAME",
      dataIndex: "client",
      color: "#9E9E9E",
      width: 200,
    },
    {
      title: "PROJECT TITLE",
      dataIndex: "projecttitle",
      // color: "#9E9E9E",
    },
    {
      title: "CLIENT/ INDUSTRY FIELD",
      dataIndex: "industry",
      color: "#9E9E9E",
      // width: 100,
    },
    {
      title: "TAGS",
      dataIndex: "tags",
      // width: 150,
      render: (tags: string[]) => (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {tags.map((tag: string) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "value",
      width: 150,
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
            loading={busy && masterOurClients.length === 0 ? true : false}
            scroll={{ y: "calc(68vh - 4em)", x: true }}
          />
        )}
      </div>

      {isDeleteOpen && targetData && (
        <ClientDeleteConfirmationModal
          clientmain={targetData}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
      {isUpdateOpen && (
        <EditClientDrawer
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          clientmain={targetData}
        />
      )}
    </>
  );
};

export default OurClientsMasterTable;
