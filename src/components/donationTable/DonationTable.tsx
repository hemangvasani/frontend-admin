import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Spin, Table } from "antd";
import { useDonation } from "../../store/donation/reducer";
import moment from "moment";

interface props {
  query: any;
  category: any;
  subCat: any;
}

const DonationTable: React.FC<props> = ({ query, category, subCat }) => {
  const { masterDonation, busy } = useDonation();
  // console.log(masterDonation);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(1);
  const [data, setData] = useState([]);

  const searchColumns = useMemo(
    () => ["email", "price", "donationOption", "donationType"],
    []
  );

  const search = (user: Record<string, any>) => {
    return (
      searchColumns.some((column) => {
        return (
          get(user, column, "")
            .toString()
            .toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        );
      }) &&
      (!category.trim() || category === get(user, "donationType")) &&
      (!subCat.trim() || subCat === get(user, "donationOption"))
    );
  };

  const [loading, setloading] = useState(true);
  //   const [targetuser, setTargetUser] = useState<IUser>();
  // console.log(subCat);

  useEffect(() => {
    setData(
      masterDonation.filter(search).map((value: any, index: number) => ({
        key: index + 1,
        donationOption: value.donationOption,
        donationType: value.donationType,
        price: value.price,
        email: value.userId?.email,
        value: value,
        createdAt: value.createdAt
          ? moment(value.createdAt).format("MMMM Do, YYYY, h:mm:ss a")
          : "none",
      }))
    );
    setloading(false);
  }, [masterDonation, query, category, subCat]);

  //   const {
  //     isOpen: isDeleteOpen,
  //     onOpen: onDeleteOpen,
  //     onClose: onDeleteClose,
  //   } = useDisclosure();

  //   const blockUser = (userMaster: IUser) => {
  //     setTargetUser(userMaster);
  //     onDeleteOpen();
  //   };

  const columns = [
    {
      title: "Sr No.",
      key: "key",
      width: 80,
      render: (text: string, record: any, index: number) =>
        (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      // sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Donation",
      dataIndex: "price",
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: "Category",
      dataIndex: "donationType",
      // sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Sub Category",
      dataIndex: "donationOption",
      // sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      sorter: {
        compare: (a: any, b: any) =>
          moment(a.createdAt, "MMMM Do, YYYY, h:mm:ss a").unix() -
          moment(b.createdAt, "MMMM Do, YYYY, h:mm:ss a").unix(),
      },
    },
  ];

  return (
    <>
      <div
        style={{
          width: "96vw",
          maxWidth: "96vw",
          top: "14vh ",
          left: "2vw",
          position: "relative",
        }}
      >
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={data}
            loading={busy && masterDonation.length === 0 ? true : false}
            pagination={{
              onChange(current, pageSize) {
                setPage(current);
                setPaginationSize(pageSize);
              },
              hideOnSinglePage: true,
              showSizeChanger: true,
            }}
            scroll={{ y: "calc(68vh - 1em)" }}
            rowClassName={(record: any) => record.color}
          />
        )}
      </div>
      {/* {isDeleteOpen && targetuser && (
        <UserEditDrawer
          user={targetuser}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )} */}
    </>
  );
};

export default DonationTable;
