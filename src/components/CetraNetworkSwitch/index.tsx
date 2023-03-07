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

const CetraNetworkSwitch: FC<CetraNetworkSwitchProps> = ({
    fontWeight,
    fontSize,
    w,
    bgColor,
    isDisabled,
    onChange,
}) => {
    const { chain } = useNetwork();
    // TODO: Possible error if default network changed
    const id: number = chain ? (DEFAULT_CHAINS[0].id === chain.id ? 0 : 1) : 0;

    const handleOnChange = useCallback(
        (e: any) => {
            const index = e.target.selectedIndex;
            onChange?.(index);
        },
        [onChange]
    );

    return (
        <Select
            bg={bgColor ?? "transparent"}
            color={id === 1 ? "#8247E5" : "#FF4545"}
            fontFamily="Chakra Petch"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            w={w ?? "200px"}
            onChange={handleOnChange}
            border={id === 1 ? "1px solid #8247E5" : "1px solid #FF4545"}
            _hover={{}}
            isDisabled={isDisabled}
            // TODO: Possible error if default network changed
            value={id === 1 ? "polygon" : "optimism"}
        >
            <option value="optimism">Optimism</option>
            <option value="polygon">Polygon</option>
        </Select>
    );
};

export { CetraNetworkSwitch, type CetraNetworkSwitchProps };
