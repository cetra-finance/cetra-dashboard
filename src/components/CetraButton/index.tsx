import { FC, useCallback } from "react";
import { Button } from "@chakra-ui/react";

interface CetraButtonProps {
    children: JSX.Element | string;
    fontWeight?: string;
    fontSize?: string;
    w?: string;
    h?: string;
    onClick?: () => void;
}

const CetraButton: FC<CetraButtonProps> = ({
    children,
    fontWeight,
    fontSize,
    w,
    h,
    onClick,
}) => {
    const handleOnClick = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);

    return (
        <Button
            bg="#7173FC"
            color="#FFFFFF"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            onClick={handleOnClick}
            w={w ?? "full"}
            h={h ?? "full"}
            _hover={{
                bg: "#FFFFFF",
                color: "#7173FC",
                border: "1px",
                borderColor: "#7173FC",
            }}
            _active={{
                bg: "#FFFFFF",
                color: "#7173FC",
                border: "1px",
                borderColor: "#7173FC",
            }}
        >
            {children}
        </Button>
    );
};

export { CetraButton, type CetraButtonProps };
