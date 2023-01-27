import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import { FC } from "react";

const DEFAULT_TABS: string[] = ["Pool", "APY", "TVL", "Yield(APR)", "Strategy"];

const P_SM: number = 0;
const P_MD: number = 0;
const P_LG: number = 20;

const FONT_SIZE_SM: number = 12;
const FONT_SIZE_MD: number = 12;
const FONT_SIZE_LG: number = 14;

interface CetraListProps {
    tabs?: string[];
    children: JSX.Element[] | JSX.Element;
}

const CetraList: FC<CetraListProps> = ({ children, tabs }) => {
    return (
        <Box
            w="full"
            h="full"
            shadow="lg"
            rounded="lg"
            p={[`${P_SM}px`, `${P_MD}px`, `${P_LG}px`]}
        >
            <SimpleGrid columns={6}>
                {(tabs ?? DEFAULT_TABS).map((tab: string, index: number) => (
                    <Box key={index}>
                        <Text
                            align="center"
                            color="#1F2040"
                            fontSize={[
                                `${FONT_SIZE_SM}px`,
                                `${FONT_SIZE_MD}px`,
                                `${FONT_SIZE_LG}px`,
                            ]}
                            fontWeight="medium"
                        >
                            {tab}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
            <SimpleGrid>{children}</SimpleGrid>
        </Box>
    );
};

export { CetraList, type CetraListProps };
