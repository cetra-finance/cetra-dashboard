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

const FONT_SIZE_SM: number = 18;
const FONT_SIZE_MD: number = 18;
const FONT_SIZE_LG: number = 22;

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
    onClickLink?: (linkText: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ links, onClickLink }) => {
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

    let actualIndex = linksConverted.findIndex(
        (value) => value.href === location.pathname
    );
    if (actualIndex === -1) actualIndex = 0;

    const [activeIdx, setActiveIdx] = useState<number>(actualIndex);

    const handleOnClick = useCallback((linkText: string, index: number) => {
        setActiveIdx(index);
        if (onClickLink) onClickLink(linkText);
    }, []);

    return (
        <Center>
            <List w="100%" spacing={["20px", "20px", "32px"]}>
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
                                            fontFamily="Chakra Petch"
                                            fontWeight={
                                                isLinkMain ? "bold" : "medium"
                                            }
                                            fontSize={[
                                                `${FONT_SIZE_SM}px`,
                                                `${FONT_SIZE_MD}px`,
                                                `${FONT_SIZE_LG}px`,
                                            ]}
                                            href={href}
                                            isExternal
                                        >
                                            {linkText}
                                        </ChakraLink>
                                    ) : (
                                        <ChakraLink
                                            as={RouterLink}
                                            color="#1F2040"
                                            fontFamily="Chakra Petch"
                                            fontWeight={
                                                isLinkMain ? "bold" : "medium"
                                            }
                                            fontSize={[
                                                `${FONT_SIZE_SM}px`,
                                                `${FONT_SIZE_MD}px`,
                                                `${FONT_SIZE_LG}px`,
                                            ]}
                                            to={href ?? ""}
                                            onClick={() =>
                                                handleOnClick(linkText, index)
                                            }
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
