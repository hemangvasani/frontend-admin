import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
} from "@chakra-ui/react";

interface Props {
  user?: any;
  isOpen: any;
  onClose: any;
}

const UserEditDrawer: React.FC<Props> = ({ user, isOpen, onClose }) => {
  const contactInfo = user ? user?.applicantId?.contactInfo : "";
  const membershipLevel = user ? user?.membershipId?.membershipLevel : "";
  const kidsDetail = user ? user?.applicantId?.kidsDetail : "";

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        size={"md"}
        onClose={onClose}
        closeOnOverlayClick={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Membership detail</DrawerHeader>
          <DrawerBody>
            {user
              ? user.applicantId?.applicant?.map((e: any, index: any) => {
                  return (
                    <>
                      {e.name ? (
                        <div>
                          <p className="applicant">Applicant {index + 1} </p>

                          <div className="applicantField">
                            <label>Name:</label>
                            <p>{e.name}</p>
                          </div>
                          <div className="applicantField">
                            <label>Date Of Birth:</label>
                            <p>{e.dob}</p>
                          </div>
                          <div className="applicantField">
                            <label>Mobile No:</label>
                            <p>{e.mobileNo}</p>
                          </div>
                          <div className="applicantField">
                            <label>Current Add:</label>
                            <p>{e.address}</p>
                          </div>
                          <div className="applicantField">
                            <label>City:</label>
                            <p>{e.city}</p>
                          </div>
                          <div className="applicantField">
                            <label>Province:</label>
                            <p>{e.province}</p>
                          </div>
                          <div className="applicantField">
                            <label>PostalCode :</label>
                            <p>{e.postalCode}</p>
                          </div>
                        </div>
                      ) : null}
                    </>
                  );
                })
              : "No Data"}

            {kidsDetail &&
              kidsDetail.map((val: any, i: number) => {
                return (
                  <>
                    {val.name ? (
                      <div key={i}>
                        <p className="applicant">Kids {i + 1} </p>
                        <div className="applicantField">
                          <label>Name:</label>
                          <p>{val.name}</p>
                        </div>
                        <div className="applicantField">
                          <label>Date Of Birth:</label>
                          <p>{val.dob}</p>
                        </div>
                        <div className="applicantField">
                          <label>Age:</label>
                          <p>{val.age}</p>
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              })}

            {contactInfo && membershipLevel ? (
              <>
                <div>
                  <p className="applicant">Contact Information </p>

                  <div className="applicantField">
                    <label>Name:</label>
                    <p>{contactInfo.name}</p>
                  </div>
                  <div className="applicantField">
                    <label>Date Of Birth:</label>
                    <p>{contactInfo.dob}</p>
                  </div>
                  <div className="applicantField">
                    <label>Mobile No:</label>
                    <p>{contactInfo.mobileNo}</p>
                  </div>
                  <div className="applicantField">
                    <label>Current Add:</label>
                    <p>{contactInfo.address}</p>
                  </div>
                  <div className="applicantField">
                    <label>City:</label>
                    <p>{contactInfo.city}</p>
                  </div>
                  <div className="applicantField">
                    <label>Province:</label>
                    <p>{contactInfo.province}</p>
                  </div>
                  <div className="applicantField">
                    <label>PostalCode :</label>
                    <p>{contactInfo.postalCode}</p>
                  </div>
                </div>

                <div>
                  <p className="applicant">Membership Level </p>
                  <div className="memberShip">
                    <div className="memberShipHeading">
                      <p>{membershipLevel.membershipType}</p>
                    </div>
                    <div className="pSpan">
                      <p>
                        {membershipLevel.membershipOption}
                        <span>${membershipLevel.price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              "No Data"
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UserEditDrawer;
