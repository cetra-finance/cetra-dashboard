import { FC, useState, useCallback } from "react";
import {
    List,
    ListItem,
    Link as ChakraLink,
    Center,
    SimpleGrid,
    Box,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

enum SidebarLinkType {
    Main,
    Sub,
    Divider,
}

interface SidebarLink {
    linkText: string;
    href?: string;
    linkType: SidebarLinkType;
}

interface SidebarProps {
    links: SidebarLink[];
}

const Sidebar: FC<SidebarProps> = ({ links }) => {
    const location = useLocation();

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

    const actualIndex =
        linksConverted.findIndex((value) => value.href === location.pathname) ??
        0;
    const [activeIdx, setActiveIdx] = useState<number>(actualIndex);

    const handleOnClick = useCallback((index: number) => {
        setActiveIdx(index);
    }, []);

    return (
        <Center>
            <List fontSize="1.4rem" w="100%" spacing="43px">
                {linksConverted.map(({ linkText, linkType, href }, index) => {
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
                                    {href?.includes("https://") ? (
                                        <ChakraLink
                                            color="#1F2040"
                                            fontWeight={
                                                isLinkMain ? "bold" : "medium"
                                            }
                                            fontSize="22px"
                                            href={href}
                                            isExternal
                                        >
                                            {linkText}
                                        </ChakraLink>
                                    ) : (
                                        <ChakraLink
                                            as={RouterLink}
                                            color="#1F2040"
                                            fontWeight={
                                                isLinkMain ? "bold" : "medium"
                                            }
                                            fontSize="22px"
                                            to={href ?? ""}
                                            onClick={() => handleOnClick(index)}
                                        >
                                            {linkText}
                                        </ChakraLink>
                                    )}
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
