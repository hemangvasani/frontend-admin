import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";

interface Props {
  user?: any;
  isOpen: any;
  onClose: any;
}

const InvoiceDrawer: React.FC<Props> = ({ user, isOpen, onClose }) => {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BASE_URL}/invoice/get/${user._id}`,
      // data: payload,
    })
      .then(function (response) {
        console.log(response.data);
        setData(response.data.invoices);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [user._id]);
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        size={"xl"}
        onClose={onClose}
        closeOnOverlayClick={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Invoice Detail</DrawerHeader>
          <DrawerBody>
            <div className="invoiceMain">
              {data.length !== 0
                ? data.map((e: any, i: number) => {
                    return (
                      <div key={i} style={{ display: "flex" }}>
                        <div className="invoiceImg">
                          <img
                            src={`https://clinet-test.sgp1.digitaloceanspaces.com/${e.url}`}
                            alt="invoice"
                          />
                        </div>
                        <a
                          href={`https://clinet-test.sgp1.digitaloceanspaces.com/${e.url}`}
                          download
                        >
                          <FaDownload className="inDown" />
                        </a>
                      </div>
                    );
                  })
                : "No Invoice Available."}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InvoiceDrawer;
