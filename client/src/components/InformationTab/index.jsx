import { Box, Grid, GridItem } from "@chakra-ui/react";
import { BiBuildings, BiTime } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import {
  MdLanguage,
  MdOutlineDescription,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { CgWebsite, CgTimelapse } from "react-icons/cg";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsListCheck } from "react-icons/bs";
import OtherInformation from "./OtherInformation";
import When from "../When";
import { useMemo } from "react";
import InformationRow from "../InformationRow";
import InformationModels from "./OtherInformation/InformationModels";

export default function InformationTab({ isStudyCheck, information, portal }) {
  const properties = useMemo(
    () => [
      {
        title: "Standorte",
        content: information.city,
        icon: BiBuildings,
      },
      {
        title: "Universität/Hochschule",
        content: information.university,
        icon: FaUniversity,
      },
      {
        title: "Unterrichtssprachen",
        content: information.languages,
        icon: MdLanguage,
      },
      {
        title: "Abschluss",
        content: information.degree,
        icon: IoSchoolOutline,
      },
      {
        title: "Link zur Website",
        content: information.website_link,
        icon: CgWebsite,
      },
      {
        title: "Beschreibung",
        content: information.description,
        icon: MdOutlineDescription,
      },
      {
        title: "Leistungspunkte",
        content: information.credit_points,
        icon: AiOutlinePlusCircle,
      },
      {
        title: "Kosten",
        content: information.costs,
        icon: MdOutlineAttachMoney,
      },
      {
        title: "Regelstudienzeit",
        content: information.study_periode,
        icon: BiTime,
      },
      {
        title: "Studienbeginn",
        content: information.study_start,
        icon: BiTime,
      },
      {
        title: "Studienform",
        content: information.study_form,
        icon: CgTimelapse,
      },
      {
        title: "Inhalt",
        content: information.contents,
        icon: MdOutlineDescription,
      },
      {
        title: "Voraussetzungen",
        content: information.requirements,
        icon: BsListCheck,
      },
    ],
    [information]
  );
  //   if (isStudyCheck) {
  //     return <h1>isStudyCheck</h1>;
  //   }
  return (
    <Box bg="light" rounded="xl" p="4" mt="4">
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr" }} gap="2">
        {properties.map((property) => (
          <When key={property.title} condition={property.content}>
            <GridItem>
              <InformationRow
                title={property.title}
                content={property.content}
                icon={property.icon}
              />
            </GridItem>
          </When>
        ))}
        <When condition={information.other_information}>
          <GridItem>
            <OtherInformation
              portal={portal}
              other_information={information.other_information}
            />
          </GridItem>
        </When>
        <When condition={information.models}>
          <GridItem>
            <InformationModels models={information.models} />
          </GridItem>
        </When>
      </Grid>
    </Box>
  );
}
