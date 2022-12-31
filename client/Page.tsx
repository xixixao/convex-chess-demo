import { Button, CloseButton, Container, Heading, Text } from '@chakra-ui/react'
import type { SpaceProps } from '@chakra-ui/react'
import { ErrorBoundary } from 'react-error-boundary'
import { CodedError } from '../server/CodedError'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useNavigate } from './useNavigate'

export function Page(props: {
  my: SpaceProps['my']
  title: string
  errorMessage: string
  children: React.ReactNode
}) {
  const navigateHome = useNavigateHome()
  return (
    <ErrorBoundary
      fallbackRender={({ error }: { error: Error }) => (
        <PageSkeleton my={props.my} role="alert" title="An error occured">
          <div>{props.errorMessage}</div>
          <Text color="grey">{CodedError.decode(error.message)}</Text>
          <Button onClick={navigateHome}>Go back</Button>
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
  const router = useRouter()
  const isHome = router.asPath === '/'
  const navigateHome = useNavigateHome()
  return (
    <Container display="flex" flexDirection="column" my={2} alignItems="end">
      {isHome ? null : <CloseButton onClick={navigateHome} />}
      <Container centerContent gap={4} role={props.role} my={props.my}>
        <Heading as="h1" size={['lg', 'xl']}>
          {props.title}
        </Heading>
        {props.children}
      </Container>
    </Container>
  )
}

function useNavigateHome() {
  const navigate = useNavigate()
  return useCallback(() => {
    navigate('/')
  }, [navigate])
}
