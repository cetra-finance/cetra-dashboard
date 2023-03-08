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

    return (
        <Select
            bg={bgColor ?? "transparent"}
            // TODO: Index. Possible error if default network changed
            color={id === 0 ? "#8247E5" : "#FF4545"}
            fontFamily="Chakra Petch"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            w={w ?? "200px"}
            onChange={handleOnChange}
            // TODO: Index. Possible error if default network changed
            border={id === 0 ? "1px solid #8247E5" : "1px solid #FF4545"}
            _hover={{}}
            isDisabled={isDisabled}
            // TODO: Index. Possible error if default network changed
            value={id === 0 ? "polygon" : "optimism"}
        >
            <option value="polygon">Polygon</option>
            <option value="optimism">Optimism</option>
        </Select>
    );
};

export { CetraNetworkSwitch, type CetraNetworkSwitchProps };
