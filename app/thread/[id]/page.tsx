import { Chat } from '@/components/chat';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thread',
};

export default function Thread({ params }: { params: { id: string } }) {
  return <Chat />;
}
