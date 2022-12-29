import { GridItem } from "@chakra-ui/react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import InformationRow from "../../InformationRow";
import When from "../../When";

export default function Studiengaenge({ otherInformation }) {
  const { applicationModus, coreAreas, feeNote, note, periods } =
    otherInformation;

  return (
    <>
      <When condition={applicationModus}>
        <GridItem>
          <InformationRow
            title={"Application Modus"}
            content={applicationModus}
            icon={HiOutlineInformationCircle}
          />
        </GridItem>
      </When>
      <When condition={coreAreas.length !== 0}>
        <GridItem>
          <InformationRow
            title={"Core Areas"}
            content={coreAreas}
            isArray
            icon={HiOutlineInformationCircle}
          />
        </GridItem>
      </When>
      <When condition={feeNote}>
        <GridItem>
          <InformationRow
            title={"Fee Note"}
            content={feeNote}
            icon={HiOutlineInformationCircle}
          />
        </GridItem>
      </When>
      <When condition={note}>
        <GridItem>
          <InformationRow
            title={"Note"}
            content={note}
            icon={HiOutlineInformationCircle}
          />
        </GridItem>
      </When>
      <When condition={periods.sommersemester}>
        <GridItem>
          <InformationRow
            title={"Sommer Semester"}
            content={periods.sommersemester}
            icon={HiOutlineInformationCircle}
          />
        </GridItem>
      </When>
      <When condition={periods.wintersemester}>
        <GridItem>
          <InformationRow
            title={"Winter Semester"}
            content={periods.wintersemester}
            icon={HiOutlineInformationCircle}
          />
        </GridItem>
      </When>
    </>
  );
}
