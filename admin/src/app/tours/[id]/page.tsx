'use client';

import { useParams } from 'next/navigation';
import TourForm from '../TourForm';

export default function EditTourPage() {
  const params = useParams();
  const id = params.id as string;
  return <TourForm tourId={id} />;
}
