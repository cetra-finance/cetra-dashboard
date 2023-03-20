import { FC, useCallback } from "react";
import { Select } from "@chakra-ui/react";
import { useNetwork } from "wagmi";
import { DEFAULT_CHAINS } from "../../utils";

interface CetraNetworkSwitchProps {
    fontWeight?: string;
    fontSize?: string;
    w?: string;
    bgColor?: string;
    isDisabled?: boolean;
    onChange?: (index: number) => void;
}

// TODO: Support more networks
const CHAIN_STYLES = [
    {
        value: "polygon",
        color: "#8247E5",
        border: "1px solid #8247E5",
    },
    {
        value: "optimism",
        color: "#FF4545",
        border: "1px solid #FF4545",
    },
    {
        value: "arbitrum",
        color: "#16273E",
        border: "1px solid #16273E",
    },
];

const CetraNetworkSwitch: FC<CetraNetworkSwitchProps> = ({
    fontWeight,
    fontSize,
    w,
    bgColor,
    isDisabled,
    onChange,
}) => {
    const { chain } = useNetwork();

    let id = 0;
    if (chain) {
        if (DEFAULT_CHAINS.map((chain) => chain.id).includes(chain.id)) {
            const resultId = DEFAULT_CHAINS.findIndex(
                ({ id }) => id === chain.id
            );
            if (resultId !== -1) {
                id = resultId;
            }
        }
    }

    const handleOnChange = useCallback(
        (e: any) => {
            const index = e.target.selectedIndex;
            onChange?.(index);
        },
        [onChange]
    );

    // TODO: Support more networks
    return (
        <Select
            bg={bgColor ?? "transparent"}
            color={CHAIN_STYLES[id].color}
            fontFamily="Chakra Petch"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            w={w ?? "200px"}
            onChange={handleOnChange}
            border={CHAIN_STYLES[id].border}
            _hover={{}}
            isDisabled={isDisabled}
            value={CHAIN_STYLES[id].value}
        >
            <option value="polygon">Polygon</option>
            <option value="optimism">Optimism</option>
            <option value="arbitrum">Arbitrum</option>
        </Select>
    );
};

export { CetraNetworkSwitch, type CetraNetworkSwitchProps };
