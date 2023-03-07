import { FC, useCallback } from "react";
import { Button, SystemStyleObject } from "@chakra-ui/react";

interface CetraButtonProps {
    children: JSX.Element | string;
    fontWeight?: string;
    fontSize?: string;
    w?: string;
    h?: string;
    border?: string;
    borderColor?: string;
    borderRadius?: string;
    bgColor?: string;
    color?: string;
    _hover?: SystemStyleObject;
    _active?: SystemStyleObject;
    isDisabled?: boolean;
    isLoading?: boolean;
    asLink?: boolean;
    href?: string;
    onClick?: () => void;
}

const CetraButton: FC<CetraButtonProps> = ({
    children,
    fontWeight,
    fontSize,
    w,
    h,
    border,
    borderColor,
    borderRadius,
    bgColor,
    color,
    _hover,
    _active,
    isDisabled,
    isLoading,
    asLink,
    href,
    onClick,
}) => {
    const handleOnClick = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);

    return (
        <Button
            bg={bgColor ?? "#7173FC"}
            as={asLink ? "a" : undefined}
            href={asLink ? href : undefined}
            target={asLink ? "_blank" : undefined}
            color={color ?? "#FFFFFF"}
            fontFamily="Chakra Petch"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            onClick={handleOnClick}
            isDisabled={isDisabled}
            isLoading={isLoading}
            w={w ?? "full"}
            h={h ?? "full"}
            border={border}
            borderColor={borderColor}
            borderRadius={borderRadius}
            _hover={
                _hover ?? {
                    bg: "transparent",
                    color: "#7173FC",
                    border: "1px",
                    borderColor: "#7173FC",
                }
            }
            _active={
                _active ?? {
                    bg: "transparent",
                    color: "#7173FC",
                    border: "1px",
                    borderColor: "#7173FC",
                }
            }
        >
            {children}
        </Button>
    );
};

export { CetraButton, type CetraButtonProps };
