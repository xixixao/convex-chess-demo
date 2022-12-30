import { SkeletonText } from '@chakra-ui/react'

export function Shimmer(props: {
  width: string
  isLoaded?: boolean
  children?: React.ReactNode
}) {
  return (
    <SkeletonText
      fadeDuration={0.4}
      speed={0.8}
      width={props.width}
      isLoaded={props.isLoaded}
      children={props.children}
      noOfLines={1}
      skeletonHeight="4"
      my={1}
    />
  )
}
