import { FC, useState } from "react";
import {
    List,
    ListItem,
    Link,
    Center,
    SimpleGrid,
    Box,
} from "@chakra-ui/react";

enum SidebarLinkType {
    Main,
    Sub,
    Divider,
}

interface SidebarLink {
    linkText: string;
    linkType: SidebarLinkType;
}

interface SidebarProps {
    links: SidebarLink[];
}

const Sidebar: FC<SidebarProps> = ({ links }) => {
    const [activeIdx, setActiveIdx] = useState<number | null>();
    // TODO: Refactor this shit
    const linksConverted: SidebarLink[] = [];
    links.forEach((link, index) => {
        const isLinkDivider = Math.floor(links.length / 2) === index;

        if (isLinkDivider)
            linksConverted.push({
                linkText: "",
                linkType: SidebarLinkType.Divider,
            });

        linksConverted.push(link);
    });

    return (
        <Center>
            <List fontSize="1.4rem" w="100%" spacing="43px">
                {linksConverted.map(({ linkText, linkType }, index) => {
                    const isLinkActive = activeIdx === index;
                    const isLinkMain = linkType === SidebarLinkType.Main;
                    const isLinkDivider = linkType === SidebarLinkType.Divider;

                    return (
                        <ListItem key={index}>
                            {isLinkDivider ? (
                                <Box w="100%" h="1px" bg="#E8ECFD" />
                            ) : (
                                <SimpleGrid
                                    columns={2}
                                    gridTemplateColumns="1fr 4fr"
                                >
                                    <Box
                                        w="8px"
                                        h="100%"
                                        bg="#8F8FFC"
                                        opacity={isLinkActive ? "1.0" : "0.0"}
                                    />
                                    <Link
                                        color="#1F2040"
                                        fontWeight={
                                            isLinkMain ? "bold" : "medium"
                                        }
                                        fontSize="22px"
                                        onClick={() => setActiveIdx(index)}
                                    >
                                        {linkText}
                                    </Link>
                                </SimpleGrid>
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Center>
    );
};

export { Sidebar, type SidebarProps, type SidebarLink, SidebarLinkType };
