import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import { FC } from "react";

const DEFAULT_TABS: string[] = ["Pool", "APY", "TVL", "Yield(APR)", "Strategy"];

interface CetraListProps {
    tabs?: string[];
    children: JSX.Element[] | JSX.Element;
}

const CetraList: FC<CetraListProps> = ({ children, tabs }) => {
    return (
        <Box w="full" h="full" shadow="lg" rounded="lg" p="20px">
            <SimpleGrid columns={6}>
                {(tabs ?? DEFAULT_TABS).map((tab: string, index: number) => (
                    <Box key={index}>
                        <Text
                            align="center"
                            color="#1F2040"
                            fontSize="14px"
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
