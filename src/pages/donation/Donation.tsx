import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { useDonation } from "../../store/donation/reducer";
import { REQUEST_DONATION } from "../../store/donation/donationActionTypes";
import DonationTable from "../../components/donationTable/DonationTable";

const Donation = () => {
  const { masterDonation, busy } = useDonation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!busy && !(masterDonation || []).length) {
      dispatch({ type: REQUEST_DONATION });
    }
  }, []);
  // console.log(masterDonation);

  const [searchQuery, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tempCat, setTempCat] = useState<any[]>([]);
  const [subCat, setsubCat] = useState("");
  const options1 = [
    { value: "Sadaqa", label: "Sadaqa" },
    { value: "Khums", label: "Khums" },
    { value: "Masjid-E-Ali building fund", label: "Masjid-E-Ali" },
    { value: "Musalla Fund", label: "Musalla Fund" },
    { value: "Moharram Fund", label: "Moharram Fund" },
    { value: "Ramzan Fund - Spousor an Iftar", label: "Ramzan Fund" },
    { value: "General Donation", label: "General Donation" },
  ];
  const options2: any = {
    Sadaqa: [
      { value: "SYED", label: "SYED" },
      { value: "Non-SYED", label: "Non-SYED" },
    ],
    Khums: [
      { value: "Sahme-imam", label: "Sahme-imam" },
      { value: "Sahme Sadaat", label: "Sahme Sadaat" },
    ],
    MasjidEAlibuildingfund: [
      { value: "Sahme-Imam", label: "Sahme-Imam" },
      { value: "Sahme Sadaat", label: "Sahme Sadaat" },
    ],
    RamzanFundSpousoranIftar: [
      { value: "Full TFTAR", label: "Full TFTAR" },
      { value: "Partial TFTAR", label: "Partial TFTAR" },
    ],
  };
  return (
    <>
      <Box position={"fixed"} w="100%" zIndex={200}>
        <VStack py={3} key={"vStack"}>
          <Flex w="92%" alignItems="center">
            <Heading ml="8" size="lg" fontWeight="semibold">
              Donation
            </Heading>
            <Spacer></Spacer>
            {/* <Button mr={5}>
            {!busy && !(accounts || []).length ? null : <CSVLink data={csvData} filename="user">Excel</CSVLink>}
          </Button> */}
            <Heading size="md" fontWeight="semibold">
              <Center>
                <Select
                  // width="100px"
                  mr="5"
                  backgroundColor="white"
                  placeholder="All Categories"
                  key={"All"}
                  onChange={(event: any) => {
                    setCategory(event.target.value);
                    let temp = event.target.value;
                    let temp2 = temp.replace(/[^a-zA-Z0-9]/g, "");
                    setTempCat(options2[temp2] ? options2[temp2] : []);
                    setsubCat("");
                  }}
                >
                  {options1.map((val) => {
                    return (
                      <option value={val.value} key={val.value}>
                        {val.label}
                      </option>
                    );
                  })}
                </Select>
                {tempCat.length !== 0 ? (
                  <Select
                    // width="100px"
                    mr="5"
                    backgroundColor="white"
                    placeholder="All"
                    key={"Alls"}
                    onChange={(event: any) => {
                      setsubCat(event.target.value);
                    }}
                  >
                    {tempCat.map((val) => {
                      return (
                        <option value={val.value} key={val.value}>
                          {val.label}
                        </option>
                      );
                    })}
                  </Select>
                ) : (
                  ""
                )}
                <Input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  backgroundColor="white"
                ></Input>
              </Center>
            </Heading>
          </Flex>
        </VStack>
      </Box>
      <DonationTable query={searchQuery} category={category} subCat={subCat} />
    </>
  );
};

export default Donation;
