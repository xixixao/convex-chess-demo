import { Button, Container, Heading, Text } from '@chakra-ui/react'
import type { SpaceProps } from '@chakra-ui/react'
import { ErrorBoundary } from 'react-error-boundary'
import { CodedError } from '../server/CodedError'

export function Page(props: {
  my: SpaceProps['my']
  title: string
  errorMessage: string
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }: { error: Error }) => (
        <PageSkeleton my={props.my} role="alert" title="An error occured">
          <div>{props.errorMessage}</div>
          <Text color="grey">{CodedError.decode(error.message)}</Text>
          <Button onClick={() => (window.location.href = '/')}>Go back</Button>
        </PageSkeleton>
      )}
    >
      <PageSkeleton my={props.my} title={props.title}>
        {props.children}
      </PageSkeleton>
    </ErrorBoundary>
  )
}

function PageSkeleton(props: {
  my: SpaceProps['my']
  role?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Container centerContent gap={4} role={props.role} my={props.my}>
      <Heading as="h1">{props.title}</Heading>
      {props.children}
    </Container>
  )
}
