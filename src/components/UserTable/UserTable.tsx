// import { Box, Image, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useUsers } from "../../store/user/reducer";
import { IUser } from "../../types/user";
import { Spin, Table } from "antd";
import { useDisclosure, Button } from "@chakra-ui/react";
import UserEditDrawer from "../drawer/UserEditDrawer";
import InvoiceDrawer from "../drawer/InvoiceDrawer";

interface props {
  query: any;
}

const UserTable: React.FC<props> = ({ query }) => {
  const { users } = useUsers();
  // console.log(users);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(1);
  const [data, setData] = useState([]);

  const searchColumns = useMemo(
    () => ["firstName", "lastName", "middleName", "email"],
    []
  );

  const search = (user: Record<string, any>) => {
    return searchColumns.some((column) => {
      return (
        get(user, column, "")
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      );
    });
  };

  const [loading, setloading] = useState(true);
  const [targetuser, setTargetUser] = useState<IUser>();

  useEffect(() => {
    setData(
      users.filter(search).map((value: any, index: number) => ({
        key: index + 1,
        name: `${value.firstName} ${value.middleName} ${value.lastName}`,
        lastName: value.lastName,
        email: value.email,
        value: value,
      }))
    );
    setloading(false);
  }, [users, query]);

  // console.log(data);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const blockUser = (userMaster: IUser) => {
    setTargetUser(userMaster);
    onDeleteOpen();
  };

  const {
    isOpen: isInvoiceOpen,
    onOpen: onInvoiceOpen,
    onClose: onInvoiceClose,
  } = useDisclosure();

  const invoiceget = (userMaster: IUser) => {
    setTargetUser(userMaster);
    onInvoiceOpen();
  };

  const columns = [
    {
      title: "Sr No.",
      key: "key",
      width: 80,
      render: (text: string, record: any, index: number) =>
        (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      // sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Email",
      dataIndex: "email",
      // sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Block",
      dataIndex: "value",
      render: (value: any) => {
        return (
          <>
            <Button
              colorScheme="telegram"
              onClick={() => {
                blockUser(value);
              }}
            >
              Membership
            </Button>
            <Button
              colorScheme="telegram"
              marginLeft={2}
              onClick={() => {
                invoiceget(value);
              }}
            >
              Invoice
            </Button>
          </>
        );
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
            loading={users.length === 0 ? true : false}
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
      {/* <UserEditDrawer /> */}
      {isDeleteOpen && targetuser && (
        <UserEditDrawer
          user={targetuser}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
      {isInvoiceOpen && targetuser && (
        <InvoiceDrawer
          user={targetuser}
          isOpen={isInvoiceOpen}
          onClose={onInvoiceClose}
        />
      )}
    </>
  );
};

export default UserTable;
