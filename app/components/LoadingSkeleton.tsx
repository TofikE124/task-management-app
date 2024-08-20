import Skeleton, {
  SkeletonProps,
  SkeletonStyleProps,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { twMerge } from "tailwind-merge";

interface LoadingSkeletonProps {
  themeProps?: {
    lightBaseColor?: string;
    darkBaseColor?: string;
    lightHighlightColor?: string;
    darkHighlightColor?: string;
  };
}

const LoadingSkeleton = ({
  themeProps,
  ...props
}: SkeletonProps & SkeletonStyleProps & LoadingSkeletonProps) => {
  if (themeProps) {
    const { baseColor, highlightColor, containerClassName, ...otherProps } =
      props;

    return (
      <>
        <Skeleton
          containerClassName={twMerge(containerClassName, "dark:hidden")}
          baseColor={themeProps.lightBaseColor}
          highlightColor={themeProps.lightHighlightColor}
          {...otherProps}
        ></Skeleton>
        <Skeleton
          containerClassName={twMerge(containerClassName, "hidden dark:block")}
          baseColor={themeProps.darkBaseColor}
          highlightColor={themeProps.darkHighlightColor}
          {...otherProps}
        ></Skeleton>
      </>
    );
  }

  return <Skeleton {...props}></Skeleton>;
};

export default LoadingSkeleton;
