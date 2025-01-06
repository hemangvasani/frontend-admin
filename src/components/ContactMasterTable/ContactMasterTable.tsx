import {
  background,
  Button,
  calc,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { Spin, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaDownload, FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useContactMaster } from "../../store/contactus/reducer";
import ContactusEditDrawer from "../drawer/ContactusEditDrawer/ContactusEditDrawer";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from "axios";
import AboutUsEditDrawer from "../drawer/AboutUsEditDrawer";

const ContactMasterTable: React.FC = () => {
  const { masterContact, conbusy } = useContactMaster();
  const [targetData, setTargetData] = useState<any>();
  const [activeTab, setActiveTab] = useState("users");
  const [aboutData, setAboutData] = useState<any>("");

  // console.log("targettt", targetData);

  const updates = (value: any) => {
    const formattedData = {
      _id: value._id,
      name: value.name,
      email: value.email,
      phone: value.phone,
      company: value.company,
      message: value.message,
      file: `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value?.media?.url}`,
    };
    setTargetData(formattedData);
    onViewOpen();
  };

  const viewDetails = (value: any) => {
    const formattedData = {
      _id: value._id,
      name: value.name,
      email: value.email,
      phone: value.phone,
      company: value.company,
      message: value.message,

      file: `https://rabbitvpn.sgp1.digitaloceanspaces.com/${value?.media?.url}`,
    };
    setTargetData(formattedData);
    onViewDetailsOpen();
  };

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: isAboutOpen,
    onOpen: onAboutOpen,
    onClose: onAboutClose,
  } = useDisclosure();

  const openAbout = (data: any) => {
    setTargetData(data);
    onAboutOpen();
  };

  const {
    isOpen: isViewDetailsOpen,
    onOpen: onViewDetailsOpen,
    onClose: onViewDetailsClose,
  } = useDisclosure();

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(
        `https://rabbitvpn.sgp1.digitaloceanspaces.com/${url}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();

      const url1 = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url1;
      a.download = url; // Specify the file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  useEffect(() => {
    setData(
      masterContact.map((value: any, index: number) => ({
        Index: index + 1,
        key: index + 1,
        _id: value._id,
        name: value.name,
        email: value.email,
        phone: value.phone,
        company: value.company,
        message: value.message,
        file: value?.media?.url,
        value: value,
      }))
    );
    setLoading(false);
  }, [masterContact]);

  const columns = [
    {
      title: "SR.NOS",
      dataIndex: "Index",
      width: 100,
    },

    {
      title: "FIRST NAME",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      width: 100,
    },
    {
      title: "COMPANY",
      dataIndex: "company",
      width: 100,
    },
    {
      title: "HOW CAN WE HELP YOU?",
      dataIndex: "message",
      width: 150,
    },
    {
      title: "ATTACH FILE",
      dataIndex: "file",
      width: 100,
      render: (value: any) => (
        <>
          {value ? (
            <button onClick={() => handleDownload(value)} className="editbtn">
              <MdOutlineFileDownload className="icon" color="#cb30ff" />
            </button>
          ) : (
            <span>-</span>
          )}
        </>
      ),
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
            <BiEditAlt className="icon" color="#cb30ff" />
          </button>
          <button
            className="editbtn"
            onClick={() => {
              viewDetails(value);
            }}
          >
            <FaEye className="icon" color="#cb30ff" />
          </button>
        </>
      ),
    },
  ];

  const getData = async () => {
    await axios({
      url: `${process.env.REACT_APP_BASE_URL}/about-us`,
      method: "get",
    })
      .then((res) => {
        // console.log("resss", res.data.data);
        setAboutData(res.data.data[0]);
      })
      .catch((error) => {
        console.log("errrrr", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div
        style={{
          width: "92vw",
          maxWidth: "92vw",
          maxHeight: "86vh",
          top: "8vh",
          left: "4vw",
          position: "relative",
          background: "#FAFAFA",
          padding: "24px",
        }}
      >
        <Flex gap={5} pb={5} borderBottom="1px solid #F0F0F1" mb={5}>
          <Button
            onClick={() => setActiveTab("users")}
            variant={activeTab === "users" ? "secondary" : "secondary"}
            style={{
              border: activeTab === "users" ? "2px solid #CB30FF" : "none",
              color: activeTab === "users" ? "#CB30FF" : "",
            }}
          >
            Users
          </Button>
          <Button
            onClick={() => setActiveTab("aboutUs")}
            variant={activeTab === "aboutUs" ? "primary" : "secondary"}
            style={{
              border: activeTab === "aboutUs" ? "2px solid #CB30FF" : "none",
              color: activeTab === "aboutUs" ? "#CB30FF" : "",
            }}
          >
            About Us
          </Button>
        </Flex>

        {activeTab === "users" && (
          <>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                columns={columns}
                dataSource={data}
                loading={conbusy && masterContact.length === 0 ? true : false}
                scroll={{ y: "calc(68vh - 4em)", x: true }}
              />
            )}
          </>
        )}
        {activeTab === "aboutUs" && (
          <div>
            <div className="about-section">
              <Flex
                gap={0}
                alignItems="center"
                justifyContent="flex-start"
                mb={5}
              >
                <h3
                  style={{
                    color: "#585863",
                    width: "7%",
                  }}
                >
                  Address:
                </h3>
                <p style={{ width: "90%" }}>
                  {/* "Racho Dimchev" Str, 1st floor, ap.1 Sofia, 1000, Bulgaria */}
                  {aboutData?.address}
                </p>
                <button
                  className="editbtn"
                  onClick={() => {
                    openAbout(aboutData);
                  }}
                >
                  <BiEditAlt className="icon" color="#cb30ff" />
                </button>
              </Flex>
              <Flex gap={0} justifyContent="flex-start" mb={5}>
                <h3
                  style={{
                    color: "#585863",
                    width: "7%",
                  }}
                >
                  Phone:
                </h3>
                <p style={{ width: "90%" }}>{aboutData?.phone}</p>
              </Flex>
              <Flex justifyContent="flex-start" mb={5}>
                <h3
                  style={{
                    color: "#585863",
                    width: "7%",
                  }}
                >
                  About:
                </h3>
                <p
                  style={{ width: "90%" }}
                  dangerouslySetInnerHTML={{ __html: aboutData?.aboutus }}
                />
              </Flex>
            </div>
          </div>
        )}
      </div>

      {isViewOpen && (
        <ContactusEditDrawer
          isOpen={isViewOpen}
          onClose={onViewClose}
          category={targetData}
          isViewMode={false}
        />
      )}
      {isAboutOpen && (
        <AboutUsEditDrawer
          isOpen={isAboutOpen}
          onClose={onAboutClose}
          about={targetData}
          getData={getData}
        />
      )}

      {isViewDetailsOpen && (
        <ContactusEditDrawer
          isOpen={isViewDetailsOpen}
          onClose={onViewDetailsClose}
          category={targetData}
          isViewMode={true}
        />
      )}
    </>
  );
};

export default ContactMasterTable;
