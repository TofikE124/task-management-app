import { PropsWithChildren } from "react";
import Skeleton, {
  SkeletonProps,
  SkeletonStyleProps,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadingSkeleton = ({
  children,
  ...props
}: SkeletonProps & SkeletonStyleProps & PropsWithChildren) => {
  return <Skeleton {...props}>{children}</Skeleton>;
};

export default LoadingSkeleton;
