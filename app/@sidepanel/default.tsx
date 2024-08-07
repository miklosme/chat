import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { SidePanel } from './side-panel'
import { getThreads } from './actions'

export default async function SidePanelDefault() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['threads'],
    queryFn: getThreads,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidePanel />
    </HydrationBoundary>
  )
}
